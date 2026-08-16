import type { SupabaseClient } from "@supabase/supabase-js";

const MODEL = "google/gemini-3.5-flash";

/* eslint-disable @typescript-eslint/no-explicit-any */
type DB = SupabaseClient<any, any, any>;

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

const ACTIVE = ["pendiente", "confirmada", "checkin", "finalizada"];

/**
 * Snapshot de datos REALES del usuario autenticado. La IA solo puede usar esto.
 */
export async function buildSnapshot(supabase: DB) {
  const [props, guests, reservations, payments, blocks, expenses] = await Promise.all([
    supabase.from("properties").select("*"),
    supabase.from("guests").select("*"),
    supabase.from("reservations").select("*"),
    supabase.from("payments").select("*"),
    supabase.from("calendar_blocks").select("*"),
    supabase.from("expenses").select("*"),
  ]);

  const properties = (props.data ?? []) as any[];
  const res = (reservations.data ?? []) as any[];
  const pays = (payments.data ?? []) as any[];
  const today = new Date();

  const propertySummaries = properties.map((p) => {
    const mine = res.filter((r) => r.property_id === p.id && ACTIVE.includes(r.status));
    let busy = 0;
    const freeDays: string[] = [];
    for (let i = 0; i < 30; i++) {
      const day = iso(addDays(today, i));
      const taken = mine.some((r) => day >= r.check_in && day < r.check_out);
      const blocked = (blocks.data ?? []).some(
        (b: any) => b.property_id === p.id && day >= b.start_date && day < b.end_date,
      );
      if (taken || blocked) busy++;
      else freeDays.push(day);
    }
    const income = pays
      .filter((pay) => mine.some((r) => r.id === pay.reservation_id))
      .reduce((s, pay) => s + Number(pay.amount), 0);
    return {
      id: p.id,
      nombre: p.name,
      activa: p.active,
      ciudad: p.city,
      provincia: p.province,
      capacidad: p.capacity,
      dormitorios: p.bedrooms,
      camas: p.beds,
      banios: p.bathrooms,
      precio_base: Number(p.base_price),
      servicios: p.services,
      comodidades: p.amenities,
      ocupacion_30d: `${Math.round((busy / 30) * 100)}%`,
      noches_libres_30d: freeDays.length,
      proximas_fechas_libres: freeDays.slice(0, 12),
      ingresos_cobrados: income,
    };
  });

  const reservationSummaries = res.map((r) => {
    const g = (guests.data ?? []).find((x: any) => x.id === r.guest_id);
    const paid = pays
      .filter((p) => p.reservation_id === r.id)
      .reduce((s, p) => s + Number(p.amount), 0);
    return {
      id: r.id,
      propiedad: properties.find((p) => p.id === r.property_id)?.name ?? "",
      huesped: g ? `${g.first_name} ${g.last_name}`.trim() : "sin huésped",
      telefono: g?.phone ?? "",
      check_in: r.check_in,
      check_out: r.check_out,
      estado: r.status,
      total: Number(r.total_price),
      cobrado: paid,
      pendiente: Number(r.total_price) - paid,
    };
  });

  const { desde, hasta } = monthPeriod(today);
  const fin = getFinanzas({
    desde,
    hasta,
    reservations: res as any,
    payments: pays as any,
    expenses: (expenses.data ?? []) as any,
  });

  return {
    fecha_actual: iso(today),
    moneda: "ARS",
    propiedades: propertySummaries,
    reservas: reservationSummaries,
    huespedes: (guests.data ?? []).map((g: any) => ({
      id: g.id,
      nombre: `${g.first_name} ${g.last_name}`.trim(),
      telefono: g.phone,
      email: g.email,
      pais: g.country,
    })),
    bloqueos: (blocks.data ?? []).map((b: any) => ({
      propiedad: properties.find((p) => p.id === b.property_id)?.name,
      desde: b.start_date,
      hasta: b.end_date,
      motivo: b.reason,
    })),
    finanzas: {
      periodo: `${desde} a ${hasta} (mes calendario de ${monthLabel(today)})`,
      ingresos_reservado_mes: fin.ingresosReservado,
      cobrado_mes_actual: fin.cobrado,
      gastos_mes_actual: fin.gastos,
      resultado_neto_mes: fin.resultadoNeto,
      pendiente_de_cobro_total: fin.pendienteCobro,
      definiciones: {
        "Ingresos (reservado)": "suma de total de reservas no canceladas con check-in en el período",
        Cobrado: "suma de pagos con fecha de pago en el período",
        "Pendiente de cobro": "saldo (total - cobrado) de todas las reservas no canceladas",
        Gastos: "gastos con fecha en el período",
        "Resultado neto": "Cobrado - Gastos",
      },
    },
  };
}


export async function callGateway(messages: { role: string; content: string }[]) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Falta la configuración de IA.");
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: MODEL, messages }),
  });
  if (resp.status === 429) return "Alcanzaste el límite de consultas por ahora. Probá en unos minutos.";
  if (resp.status === 402)
    return "Se agotaron los créditos de IA del espacio de trabajo. Recargá créditos para seguir usando el asistente.";
  if (!resp.ok) {
    const text = await resp.text();
    console.error("AI gateway error", resp.status, text);
    throw new Error("No pude consultar a la IA en este momento.");
  }
  const json = (await resp.json()) as any;
  return (json.choices?.[0]?.message?.content as string) ?? "";
}
