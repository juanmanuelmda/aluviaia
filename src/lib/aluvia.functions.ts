import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const askSchema = z.object({
  question: z.string().min(1).max(2000),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
    .max(12)
    .default([]),
});

export const askAluvia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => askSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { buildSnapshot, callGateway, getTone } = await import("./ai.server");
    const [snapshot, tone] = await Promise.all([buildSnapshot(context.supabase), getTone(context.supabase)]);
    const system = `Sos Aluvia AI, el asistente del negocio de alquileres temporarios del usuario.
Respondés en español rioplatense, claro y breve, con montos en pesos argentinos.
REGLA CRÍTICA: usá exclusivamente los datos JSON entregados. Está prohibido inventar propiedades, reservas, precios, demanda, ocupación o estadísticas.
Si los datos no alcanzan para responder con precisión, respondé exactamente: "No tengo suficiente información para responder con precisión." y explicá qué dato falta cargar.
FORMATO: respondé en texto plano o markdown simple (**negrita** y listas con "-"). Nunca uses tablas ni encabezados.
${tone}
Nunca ejecutás acciones: si el usuario pide cancelar, modificar o eliminar algo, identificá el registro con los datos reales y pedí confirmación explícita indicando dónde puede hacerlo.
DATOS DEL NEGOCIO:
${JSON.stringify(snapshot)}`;
    const messages = [
      { role: "system", content: system },
      ...data.history,
      { role: "user", content: data.question },
    ];
    return { answer: await callGateway(messages) };
  });

const publicationSchema = z.object({
  propertyId: z.string().uuid(),
  platform: z.enum(["instagram", "facebook", "whatsapp", "portal"]),
  objective: z.string().min(1).max(60),
  extra: z.string().max(500).default(""),
});

export const generatePublication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => publicationSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { buildSnapshot, callGateway, getTone } = await import("./ai.server");
    const [snapshot, tone] = await Promise.all([buildSnapshot(context.supabase), getTone(context.supabase)]);
    const property = snapshot.propiedades.find((p) => p.id === data.propertyId);
    if (!property) throw new Error("Propiedad no encontrada");
    const formats: Record<string, string> = {
      instagram:
        "Publicación de Instagram: título potente, descripción con emojis, llamada a la acción y 10 hashtags relevantes al destino.",
      facebook:
        "Publicación de Facebook: título, descripción, lista de características, precio, disponibilidad y llamada a la acción.",
      whatsapp: "Mensaje de WhatsApp breve, cálido y atractivo (máximo 6 líneas).",
      portal:
        "Descripción profesional y detallada para un portal de alquileres, en párrafos, sin emojis.",
    };
    const answer = await callGateway([
      {
        role: "system",
        content: `Sos el redactor de marketing de Aluvia AI. Escribís en español rioplatense.
Usá SOLO los datos reales de la propiedad. No inventes servicios, precios, ubicaciones ni disponibilidad.
Precios en pesos argentinos. Devolvé solo el texto final, listo para copiar y pegar.
${tone}`,
      },
      {
        role: "user",
        content: `${formats[data.platform]}
Objetivo de la campaña: ${data.objective}.
Notas del propietario: ${data.extra || "ninguna"}.
Datos reales de la propiedad: ${JSON.stringify(property)}`,
      },
    ]);
    return { content: answer };
  });

const messageSchema = z.object({
  kind: z.string().min(1).max(60),
  reservationId: z.string().uuid().nullable().default(null),
  propertyId: z.string().uuid().nullable().default(null),
  extra: z.string().max(500).default(""),
});

export const generateMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => messageSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { buildSnapshot, callGateway, getTone } = await import("./ai.server");
    const [snapshot, tone] = await Promise.all([buildSnapshot(context.supabase), getTone(context.supabase)]);
    const reservation = snapshot.reservas.find((r) => r.id === data.reservationId) ?? null;
    const property =
      snapshot.propiedades.find((p) => p.id === data.propertyId) ??
      snapshot.propiedades.find((p) => p.nombre === reservation?.propiedad) ??
      null;
    const answer = await callGateway([
      {
        role: "system",
        content: `Sos el asistente de comunicación de Aluvia AI. Escribís mensajes de WhatsApp en español rioplatense: cordiales, breves, sin exagerar.
Usá SOLO los datos reales entregados. No inventes horarios, direcciones, montos ni fechas: si un dato falta, omitilo.
Devolvé solo el mensaje listo para enviar.
${tone}`,
      },
      {
        role: "user",
        content: `Tipo de mensaje: ${data.kind}.
Notas: ${data.extra || "ninguna"}.
Reserva: ${JSON.stringify(reservation)}
Propiedad: ${JSON.stringify(property)}
Fecha de hoy: ${snapshot.fecha_actual}`,
      },
    ]);
    return { content: answer };
  });
