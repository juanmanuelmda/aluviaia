import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Empty, Field, SectionCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useGuests, useMessages, useProperties, useReservations, useSave } from "@/lib/data";
import { generateMessage } from "@/lib/aluvia.functions";
import { fmtDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/mensajes")({
  head: () => ({
    meta: [
      { title: "Mensajes — Aluvia AI" },
      { name: "description", content: "Generá mensajes de WhatsApp para tus huéspedes con datos reales de cada reserva." },
      { property: "og:title", content: "Mensajes — Aluvia AI" },
      { property: "og:description", content: "Bienvenida, check-in, recordatorios de pago y reseñas en un clic." },
    ],
  }),
  component: MessagesPage,
});

const SELECT_CLASS =
  "h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";
const KINDS = ["bienvenida", "check-in", "check-out", "recordatorio de pago", "seguimiento de consulta", "reseña", "promoción"];

function MessagesPage() {
  const { data: reservations = [] } = useReservations();
  const { data: guests = [] } = useGuests();
  const { data: properties = [] } = useProperties();
  const { data: messages = [] } = useMessages();
  const save = useSave("messages", ["messages"]);
  const gen = useServerFn(generateMessage);
  const [reservationId, setReservationId] = useState("");
  const [kind, setKind] = useState("bienvenida");
  const [extra, setExtra] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const reservation = reservations.find((r) => r.id === reservationId) ?? null;
  const guest = guests.find((g) => g.id === reservation?.guest_id) ?? null;

  async function run() {
    setLoading(true);
    try {
      const r = await gen({
        data: {
          kind,
          reservationId: reservationId || null,
          propertyId: reservation?.property_id ?? null,
          extra,
        },
      });
      setResult(r.content);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo generar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell title="Mensajes">
      <div className="space-y-4">
        <SectionCard title="Generar mensaje">
          <div className="space-y-3">
            <Field label="Reserva (opcional)">
              <select className={SELECT_CLASS} value={reservationId} onChange={(e) => setReservationId(e.target.value)}>
                <option value="">Sin reserva asociada</option>
                {reservations.map((r) => {
                  const g = guests.find((x) => x.id === r.guest_id);
                  const p = properties.find((x) => x.id === r.property_id);
                  return (
                    <option key={r.id} value={r.id}>
                      {`${g ? g.first_name : "Sin huésped"} · ${p?.name ?? ""} · ${fmtDate(r.check_in)}`}
                    </option>
                  );
                })}
              </select>
            </Field>
            <Field label="Tipo de mensaje">
              <select className={SELECT_CLASS} value={kind} onChange={(e) => setKind(e.target.value)}>
                {KINDS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Indicaciones extra">
              <Textarea rows={2} value={extra} onChange={(e) => setExtra(e.target.value)} />
            </Field>
            <Button className="h-12 w-full" onClick={run} disabled={loading}>
              <Sparkles className="size-4" /> {loading ? "Generando..." : "Generar con IA"}
            </Button>
            {result && (
              <div className="space-y-2">
                <Textarea rows={8} value={result} onChange={(e) => setResult(e.target.value)} />
                <div className="grid gap-2 sm:grid-cols-3">
                  <Button
                    variant="outline"
                    className="h-11"
                    onClick={() => {
                      navigator.clipboard.writeText(result);
                      toast.success("Copiado");
                    }}
                  >
                    <Copy className="size-4" /> Copiar
                  </Button>
                  {guest?.phone && (
                    <Button asChild variant="outline" className="h-11">
                      <a
                        href={`https://wa.me/${guest.phone.replace(/\D/g, "")}?text=${encodeURIComponent(result)}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Enviar por WhatsApp
                      </a>
                    </Button>
                  )}
                  <Button
                    className="h-11"
                    onClick={async () => {
                      await save.mutateAsync({
                        values: {
                          guest_id: guest?.id ?? null,
                          reservation_id: reservationId || null,
                          property_id: reservation?.property_id ?? null,
                          kind,
                          channel: "whatsapp",
                          content: result,
                        },
                      });
                      toast.success("Mensaje guardado");
                      setResult("");
                    }}
                  >
                    Guardar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Mensajes guardados">
          {messages.length === 0 ? (
            <Empty text="Todavía no guardaste mensajes." />
          ) : (
            <ul className="space-y-3">
              {messages.map((m) => (
                <li key={m.id} className="bg-muted rounded-xl p-3 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-muted-foreground text-xs capitalize">
                      {m.kind} · {m.channel} · {fmtDate(m.created_at.slice(0, 10))}
                    </p>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive size-8"
                      aria-label="Eliminar"
                      onClick={() => save.mutate({ id: m.id, remove: true })}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap">{m.content}</p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}
