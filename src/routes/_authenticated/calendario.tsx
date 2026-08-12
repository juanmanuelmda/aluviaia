import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Empty, Field, SectionCard, StatusBadge } from "@/components/common";
import { ReservationForm } from "./reservas.index";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useBlocks, useGuests, useProperties, useReservations, useSave } from "@/lib/data";
import { ACTIVE_STATUSES } from "@/lib/business";
import { addDays, fmtDate, toISODate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/calendario")({
  head: () => ({
    meta: [
      { title: "Calendario — Aluvia AI" },
      { name: "description", content: "Calendario visual de ocupación, bloqueos y fechas libres por propiedad." },
      { property: "og:title", content: "Calendario — Aluvia AI" },
      { property: "og:description", content: "Mirá de un vistazo qué noches están ocupadas, bloqueadas o libres." },
    ],
  }),
  component: CalendarPage,
});

const SELECT_CLASS =
  "h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";
const DAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

function CalendarPage() {
  const { data: properties = [] } = useProperties();
  const { data: reservations = [] } = useReservations();
  const { data: blocks = [] } = useBlocks();
  const { data: guests = [] } = useGuests();
  const saveBlock = useSave("calendar_blocks", ["blocks"]);

  const [propertyId, setPropertyId] = useState("");
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [resOpen, setResOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [blockEnd, setBlockEnd] = useState("");

  const activeProperty = propertyId || properties[0]?.id || "";

  const cells = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const out: (string | null)[] = Array.from({ length: offset }, () => null);
    for (let d = 1; d <= daysInMonth; d++) {
      out.push(toISODate(new Date(cursor.getFullYear(), cursor.getMonth(), d)));
    }
    return out;
  }, [cursor]);

  const monthLabel = cursor.toLocaleDateString("es-AR", { month: "long", year: "numeric" });

  function reservationOn(day: string) {
    return reservations.find(
      (r) =>
        r.property_id === activeProperty &&
        ACTIVE_STATUSES.includes(r.status) &&
        day >= r.check_in &&
        day < r.check_out,
    );
  }
  function blockOn(day: string) {
    return blocks.find((b) => b.property_id === activeProperty && day >= b.start_date && day < b.end_date);
  }

  const dayRes = selectedDay ? reservationOn(selectedDay) : undefined;
  const dayBlock = selectedDay ? blockOn(selectedDay) : undefined;

  async function createBlock(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDay) return;
    const end = blockEnd || toISODate(addDays(new Date(`${selectedDay}T12:00:00`), 1));
    if (end <= selectedDay) return toast.error("La fecha de fin debe ser posterior");
    try {
      await saveBlock.mutateAsync({
        values: { property_id: activeProperty, start_date: selectedDay, end_date: end, reason: "personal", notes: "" },
      });
      toast.success("Fechas bloqueadas");
      setBlockOpen(false);
      setSelectedDay(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo bloquear");
    }
  }

  return (
    <AppShell title="Calendario">
      {resOpen && selectedDay && (
        <ReservationForm
          open={resOpen}
          onOpenChange={(v) => {
            setResOpen(v);
            if (!v) setSelectedDay(null);
          }}
          preset={{
            property_id: activeProperty,
            check_in: selectedDay,
            check_out: toISODate(addDays(new Date(`${selectedDay}T12:00:00`), 2)),
          }}
        />
      )}

      {properties.length === 0 ? (
        <Empty text="Cargá una propiedad para ver su calendario." />
      ) : (
        <div className="space-y-4">
          <select className={SELECT_CLASS} value={activeProperty} onChange={(e) => setPropertyId(e.target.value)}>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <SectionCard
            title={monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
            action={
              <div className="flex gap-1">
                <Button size="icon" variant="outline" className="size-8" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} aria-label="Mes anterior">
                  <ChevronLeft className="size-4" />
                </Button>
                <Button size="icon" variant="outline" className="size-8" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} aria-label="Mes siguiente">
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            }
          >
            <div className="grid grid-cols-7 gap-1 text-center">
              {DAYS.map((d) => (
                <div key={d} className="text-muted-foreground pb-1 text-[11px] font-medium">
                  {d}
                </div>
              ))}
              {cells.map((day, i) => {
                if (!day) return <div key={`e${i}`} />;
                const res = reservationOn(day);
                const blk = blockOn(day);
                const today = day === toISODate(new Date());
                const tone = res
                  ? "bg-primary text-primary-foreground"
                  : blk
                    ? "bg-muted-foreground/25 text-foreground"
                    : "bg-success-soft text-foreground";
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`aspect-square rounded-lg text-xs font-medium ${tone} ${today ? "ring-primary ring-2" : ""}`}
                  >
                    {Number(day.slice(-2))}
                  </button>
                );
              })}
            </div>
            <div className="text-muted-foreground mt-4 flex flex-wrap gap-4 text-xs">
              <span className="flex items-center gap-1.5"><i className="bg-success-soft size-3 rounded" /> Libre</span>
              <span className="flex items-center gap-1.5"><i className="bg-primary size-3 rounded" /> Reservado</span>
              <span className="flex items-center gap-1.5"><i className="bg-muted-foreground/25 size-3 rounded" /> Bloqueado</span>
            </div>
          </SectionCard>
        </div>
      )}

      <Dialog open={!!selectedDay && !resOpen} onOpenChange={(v) => !v && setSelectedDay(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{selectedDay ? fmtDate(selectedDay) : ""}</DialogTitle>
          </DialogHeader>
          {dayRes ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {(() => {
                    const g = guests.find((x) => x.id === dayRes.guest_id);
                    return g ? `${g.first_name} ${g.last_name}`.trim() : "Sin huésped";
                  })()}
                </span>
                <StatusBadge status={dayRes.status} />
              </div>
              <p className="text-muted-foreground">
                {fmtDate(dayRes.check_in)} → {fmtDate(dayRes.check_out)}
              </p>
            </div>
          ) : dayBlock ? (
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2 font-medium">
                <Lock className="size-4" /> Fechas bloqueadas ({dayBlock.reason})
              </p>
              <p className="text-muted-foreground">
                {fmtDate(dayBlock.start_date)} → {fmtDate(dayBlock.end_date)}
              </p>
              <Button
                variant="outline"
                className="text-destructive w-full"
                onClick={async () => {
                  await saveBlock.mutateAsync({ id: dayBlock.id, remove: true });
                  setSelectedDay(null);
                  toast.success("Bloqueo eliminado");
                }}
              >
                Quitar bloqueo
              </Button>
            </div>
          ) : blockOpen ? (
            <form onSubmit={createBlock} className="space-y-3">
              <Field label="Bloquear desde">
                <Input value={selectedDay ?? ""} disabled className="h-11" />
              </Field>
              <Field label="Hasta (exclusivo)">
                <Input type="date" value={blockEnd} onChange={(e) => setBlockEnd(e.target.value)} className="h-11" />
              </Field>
              <Button type="submit" className="h-11 w-full">
                Confirmar bloqueo
              </Button>
            </form>
          ) : (
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">Esta noche está libre.</p>
              <Button className="h-11 w-full" onClick={() => setResOpen(true)}>
                Crear reserva
              </Button>
              <Button variant="outline" className="h-11 w-full" onClick={() => setBlockOpen(true)}>
                <Lock className="size-4" /> Bloquear fechas
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
