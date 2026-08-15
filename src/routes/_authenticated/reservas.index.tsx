import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash2, Wallet } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Empty, Field, SectionCard, StatusBadge } from "@/components/common";
import { GuestForm } from "./huespedes";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useBlocks,
  useGuests,
  usePayments,
  useProperties,
  useReservations,
  useSave,
  type Reservation,
} from "@/lib/data";
import { ACTIVE_STATUSES, balanceFor, findConflict, paidFor } from "@/lib/business";

import { fmtDate, money, nights, STATUS_LABEL, toISODate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/reservas/")({
  head: () => ({
    meta: [
      { title: "Reservas — Aluvia AI" },
      { name: "description", content: "Cargá reservas sin solapamientos, seguí estados y registrá cobros en pesos." },
      { property: "og:title", content: "Reservas — Aluvia AI" },
      { property: "og:description", content: "Gestión completa de reservas y cobros de tu alquiler temporario." },
    ],
  }),
  component: ReservationsPage,
});

const SELECT_CLASS =
  "h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

const STATUSES = ["consulta", "pendiente", "confirmada", "checkin", "finalizada", "cancelada"];

export function ReservationForm({
  open,
  onOpenChange,
  reservation,
  preset,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  reservation?: Reservation | null;
  preset?: { property_id?: string; check_in?: string; check_out?: string };
}) {
  const { data: properties = [] } = useProperties();
  const { data: guests = [] } = useGuests();
  const { data: reservations = [] } = useReservations();
  const { data: blocks = [] } = useBlocks();
  const { data: payments = [] } = usePayments();
  const save = useSave("reservations", ["reservations"]);
  const savePayment = useSave("payments", ["payments", "reservations"]);
  const [guestOpen, setGuestOpen] = useState(false);
  const [deposit, setDeposit] = useState("");
  const [form, setForm] = useState(() => ({
    property_id: reservation?.property_id ?? preset?.property_id ?? properties[0]?.id ?? "",
    guest_id: reservation?.guest_id ?? "",
    check_in: reservation?.check_in ?? preset?.check_in ?? toISODate(new Date()),
    check_out: reservation?.check_out ?? preset?.check_out ?? "",
    guests_count: reservation?.guests_count ?? 2,
    total_price: reservation?.total_price ?? 0,
    status: reservation?.status ?? "pendiente",
    notes: reservation?.notes ?? "",
  }));

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const suggested = useMemo(() => {
    const prop = properties.find((p) => p.id === form.property_id);
    if (!prop || !form.check_in || !form.check_out) return 0;
    return Math.max(0, nights(form.check_in, form.check_out)) * prop.base_price;
  }, [properties, form.property_id, form.check_in, form.check_out]);

  const blocking = form.status === "cancelada" || form.status === "consulta";

  const conflict = useMemo(
    () =>
      blocking
        ? null
        : findConflict({
            propertyId: form.property_id,
            checkIn: form.check_in,
            checkOut: form.check_out,
            reservations,
            blocks,
            excludeId: reservation?.id,
          }),
    [blocking, form.property_id, form.check_in, form.check_out, reservations, blocks, reservation?.id],
  );

  // Próximas fechas ocupadas de la propiedad elegida (referencia visual).
  const busy = useMemo(() => {
    if (!form.property_id) return [];
    const today = toISODate(new Date());
    const fromRes = reservations
      .filter(
        (r) =>
          r.property_id === form.property_id &&
          r.id !== reservation?.id &&
          ACTIVE_STATUSES.includes(r.status) &&
          r.check_out >= today,
      )
      .map((r) => ({ from: r.check_in, to: r.check_out, label: "Reservada" }));
    const fromBlocks = blocks
      .filter((b) => b.property_id === form.property_id && b.end_date >= today)
      .map((b) => ({ from: b.start_date, to: b.end_date, label: "Bloqueada" }));
    return [...fromRes, ...fromBlocks].sort((a, b) => a.from.localeCompare(b.from)).slice(0, 8);
  }, [form.property_id, reservations, blocks, reservation?.id]);

  const alreadyPaid = reservation ? paidFor(reservation.id, payments) : 0;
  const totalNumber = Number(form.total_price) || 0;
  const depositNumber = Number(deposit) || 0;
  const balance = Math.max(0, totalNumber - (reservation ? alreadyPaid : depositNumber));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.property_id) {
      toast.error("Elegí una propiedad");
      return;
    }
    if (!form.check_out || form.check_out <= form.check_in) {
      toast.error("El check-out debe ser posterior al check-in");
      return;
    }
    if (conflict) {
      toast.error(
        conflict.kind === "reserva"
          ? "Estas fechas ya están reservadas para esta propiedad."
          : "Estas fechas están bloqueadas para esta propiedad.",
        { description: `${conflict.kind === "reserva" ? "Reservada" : "Bloqueada"} desde ${fmtDate(conflict.from)} hasta ${fmtDate(conflict.to)}.` },
      );
      return;
    }
    if (!reservation && depositNumber > totalNumber) {
      toast.error("La seña no puede ser mayor al precio total");
      return;
    }
    try {
      const row = await save.mutateAsync({
        id: reservation?.id,
        values: {
          property_id: form.property_id,
          guest_id: form.guest_id || null,
          check_in: form.check_in,
          check_out: form.check_out,
          guests_count: Number(form.guests_count),
          total_price: totalNumber,
          status: form.status,
          notes: form.notes,
        },
      });
      if (!reservation && depositNumber > 0 && row) {
        await savePayment.mutateAsync({
          values: {
            reservation_id: (row as { id: string }).id,
            amount: depositNumber,
            method: "transferencia",
            paid_at: toISODate(new Date()),
            notes: "Seña",
          },
        });
      }
      toast.success(reservation ? "Reserva actualizada" : "Reserva creada");
      onOpenChange(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (/overlap|solap|Ya existe una reserva|exclusion/i.test(msg)) {
        toast.error("Estas fechas ya están reservadas para esta propiedad.");
      } else if (/bloquead/i.test(msg)) {
        toast.error("Estas fechas están bloqueadas en el calendario.");
      } else {
        toast.error(msg || "No se pudo guardar la reserva");
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{reservation ? "Editar reserva" : "Nueva reserva"}</DialogTitle>
        </DialogHeader>
        {guestOpen && (
          <GuestForm open={guestOpen} onOpenChange={setGuestOpen} onCreated={(id) => set("guest_id", id)} />
        )}
        <form onSubmit={submit} className="space-y-4">
          <Field label="Propiedad">
            <select className={SELECT_CLASS} value={form.property_id} onChange={(e) => set("property_id", e.target.value)}>
              <option value="">Elegí una propiedad</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Huésped">
            <div className="flex gap-2">
              <select className={SELECT_CLASS} value={form.guest_id} onChange={(e) => set("guest_id", e.target.value)}>
                <option value="">Sin asignar</option>
                {guests.map((g) => (
                  <option key={g.id} value={g.id}>
                    {`${g.first_name} ${g.last_name}`.trim()}
                  </option>
                ))}
              </select>
              <Button type="button" variant="outline" className="h-11 shrink-0" onClick={() => setGuestOpen(true)}>
                <Plus className="size-4" />
              </Button>
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Check-in">
              <Input type="date" value={form.check_in} onChange={(e) => set("check_in", e.target.value)} className="h-11" required />
            </Field>
            <Field label="Check-out">
              <Input type="date" value={form.check_out} onChange={(e) => set("check_out", e.target.value)} className="h-11" required />
            </Field>
            <Field label="Cantidad de huéspedes">
              <Input type="number" min={1} value={form.guests_count} onChange={(e) => set("guests_count", e.target.value)} className="h-11" />
            </Field>
            <Field label="Estado">
              <select className={SELECT_CLASS} value={form.status} onChange={(e) => set("status", e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s] ?? s}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {conflict && (
            <div className="bg-destructive/10 text-destructive rounded-xl p-3 text-sm">
              <p className="font-semibold">
                {conflict.kind === "reserva"
                  ? "Estas fechas ya están reservadas para esta propiedad."
                  : "Estas fechas están bloqueadas para esta propiedad."}
              </p>
              <p className="mt-1 text-xs">
                {conflict.kind === "reserva" ? "Reservada" : "Bloqueada"} desde {fmtDate(conflict.from)} hasta{" "}
                {fmtDate(conflict.to)}.
              </p>
            </div>
          )}

          {busy.length > 0 && (
            <div className="bg-muted rounded-xl p-3">
              <p className="text-xs font-semibold">Fechas no disponibles</p>
              <ul className="text-muted-foreground mt-1 space-y-0.5 text-xs">
                {busy.map((b, i) => (
                  <li key={`${b.from}-${i}`}>
                    {b.label}: {fmtDate(b.from)} → {fmtDate(b.to)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-xl border p-3">
            <p className="text-sm font-bold">Pago</p>
            <div className="mt-3 space-y-3">
              <Field label="Precio total (ARS)">
                <Input type="number" min={0} value={form.total_price} onChange={(e) => set("total_price", e.target.value)} className="h-11" />
              </Field>
              {suggested > 0 && (
                <button type="button" onClick={() => set("total_price", suggested)} className="text-primary text-xs font-medium">
                  Usar precio sugerido: {money(suggested)} ({nights(form.check_in, form.check_out)} noches)
                </button>
              )}
              {reservation ? (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Cobrado</p>
                    <p className="text-success font-semibold">{money(alreadyPaid)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Saldo pendiente</p>
                    <p className="font-semibold">{money(balance)}</p>
                  </div>
                </div>
              ) : (
                <>
                  <Field label="Seña (ARS)">
                    <Input
                      type="number"
                      min={0}
                      max={totalNumber || undefined}
                      value={deposit}
                      onChange={(e) => setDeposit(e.target.value)}
                      className="h-11"
                      placeholder="0"
                    />
                  </Field>
                  {depositNumber > totalNumber && (
                    <p className="text-destructive text-xs">La seña no puede superar el precio total.</p>
                  )}
                  <div className="bg-muted flex items-center justify-between rounded-lg px-3 py-2 text-sm">
                    <span className="text-muted-foreground">Saldo pendiente</span>
                    <span className="font-semibold">{money(balance)}</span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    La seña se registra como un pago real de la reserva y se refleja en Finanzas.
                  </p>
                </>
              )}
            </div>
          </div>

          <Field label="Notas">
            <Textarea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </Field>
          <Button type="submit" className="h-12 w-full" disabled={save.isPending || !!conflict}>
            Guardar reserva
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}


function PaymentsDialog({ reservation, onClose }: { reservation: Reservation; onClose: () => void }) {
  const { data: payments = [] } = usePayments();
  const savePayment = useSave("payments", ["payments"]);
  const list = payments.filter((p) => p.reservation_id === reservation.id);
  const balance = balanceFor(reservation, payments).pending;
  const [amount, setAmount] = useState(balance > 0 ? String(balance) : "");
  const [method, setMethod] = useState("transferencia");
  const [paidAt, setPaidAt] = useState(toISODate(new Date()));

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!Number(amount)) {
      toast.error("Ingresá un importe");
      return;
    }
    await savePayment.mutateAsync({
      values: { reservation_id: reservation.id, amount: Number(amount), method, paid_at: paidAt, notes: "" },
    });
    setAmount("");
    toast.success("Pago registrado");
  }

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pagos de la reserva</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted grid grid-cols-3 gap-2 rounded-xl p-3 text-center text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Total</p>
              <p className="font-semibold">{money(reservation.total_price)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Cobrado</p>
              <p className="text-success font-semibold">{money(paidFor(reservation.id, payments))}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Saldo</p>
              <p className="font-semibold">{money(balance)}</p>
            </div>
          </div>
          <form onSubmit={add} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Importe">
                <Input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} className="h-11" />
              </Field>
              <Field label="Fecha">
                <Input type="date" value={paidAt} onChange={(e) => setPaidAt(e.target.value)} className="h-11" />
              </Field>
            </div>
            <Field label="Medio de pago">
              <select className={SELECT_CLASS} value={method} onChange={(e) => setMethod(e.target.value)}>
                {["efectivo", "transferencia", "mercado_pago", "tarjeta", "otro"].map((m) => (
                  <option key={m} value={m}>
                    {m.replace("_", " ")}
                  </option>
                ))}
              </select>
            </Field>
            <Button type="submit" className="h-11 w-full" disabled={savePayment.isPending}>
              Registrar pago
            </Button>
          </form>
          {list.length > 0 && (
            <ul className="divide-y">
              {list.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2 text-sm">
                  <div>
                    <p className="font-medium">{money(p.amount)}</p>
                    <p className="text-muted-foreground text-xs capitalize">
                      {p.method.replace("_", " ")} · {fmtDate(p.paid_at)}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => savePayment.mutate({ id: p.id, remove: true })}
                    aria-label="Eliminar pago"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ReservationsPage() {
  const { data: reservations = [] } = useReservations();
  const { data: properties = [] } = useProperties();
  const { data: guests = [] } = useGuests();
  const { data: payments = [] } = usePayments();
  const save = useSave("reservations", ["reservations"]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Reservation | null>(null);
  const [paying, setPaying] = useState<Reservation | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("");

  const filtered = reservations.filter(
    (r) => (!statusFilter || r.status === statusFilter) && (!propertyFilter || r.property_id === propertyFilter),
  );

  const guestName = (id: string | null) => {
    const g = guests.find((x) => x.id === id);
    return g ? `${g.first_name} ${g.last_name}`.trim() : "Sin huésped";
  };

  async function remove(r: Reservation) {
    if (!confirm("¿Eliminar esta reserva y sus pagos?")) return;
    await save.mutateAsync({ id: r.id, remove: true });
    toast.success("Reserva eliminada");
  }

  return (
    <AppShell
      title="Reservas"
      action={
        <Button size="sm" onClick={() => setOpen(true)} disabled={properties.length === 0}>
          <Plus className="size-4" /> Nueva
        </Button>
      }
    >
      {open && <ReservationForm open={open} onOpenChange={setOpen} />}
      {editing && <ReservationForm open onOpenChange={(v) => !v && setEditing(null)} reservation={editing} />}
      {paying && <PaymentsDialog reservation={paying} onClose={() => setPaying(null)} />}

      <div className="space-y-4">
        {properties.length === 0 && (
          <p className="bg-warning-soft rounded-xl p-3 text-sm">
            Primero cargá una propiedad para poder registrar reservas.
          </p>
        )}
        <div className="grid grid-cols-2 gap-3">
          <select className={SELECT_CLASS} value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)}>
            <option value="">Todas las propiedades</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <select className={SELECT_CLASS} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Todos los estados</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s] ?? s}
              </option>
            ))}
          </select>
        </div>

        <SectionCard title={`${filtered.length} reserva(s)`}>
          {filtered.length === 0 ? (
            <Empty text="No hay reservas con estos filtros." />
          ) : (
            <ul className="divide-y">
              {filtered.map((r) => {
                const balance = balanceFor(r, payments).pending;
                return (
                  <li key={r.id} className="py-3">
                    <div className="flex items-start justify-between gap-3">
                      <button className="min-w-0 flex-1 text-left" onClick={() => setEditing(r)}>
                        <p className="truncate font-medium">{guestName(r.guest_id)}</p>
                        <p className="text-muted-foreground text-xs">
                          {properties.find((p) => p.id === r.property_id)?.name} · {fmtDate(r.check_in)} → {fmtDate(r.check_out)}
                        </p>
                        <p className="mt-1 text-xs">
                          Total {money(r.total_price)} ·{" "}
                          <span className={balance > 0 ? "text-warning font-medium" : "text-success font-medium"}>
                            {balance > 0 ? `Saldo ${money(balance)}` : "Cobrado"}
                          </span>
                        </p>
                      </button>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <StatusBadge status={r.status} />
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="size-8" onClick={() => setPaying(r)} aria-label="Pagos">
                            <Wallet className="size-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="text-destructive size-8" onClick={() => remove(r)} aria-label="Eliminar">
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}
