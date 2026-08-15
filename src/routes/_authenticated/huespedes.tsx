import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Empty, Field, SectionCard, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useGuests,
  useMessages,
  usePayments,
  useProperties,
  useReservations,
  useSave,
  type Guest,
} from "@/lib/data";
import { paidFor } from "@/lib/business";
import { fmtDate, money } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/huespedes")({
  head: () => ({
    meta: [
      { title: "Huéspedes — Aluvia AI" },
      { name: "description", content: "Base de huéspedes con historial de reservas, pagos y comunicaciones." },
      { property: "og:title", content: "Huéspedes — Aluvia AI" },
      { property: "og:description", content: "Toda la información de tus huéspedes en un solo lugar." },
    ],
  }),
  component: GuestsPage,
});

const EMPTY = { first_name: "", last_name: "", phone: "", email: "", country: "Argentina", notes: "" };

export function GuestForm({
  open,
  onOpenChange,
  guest,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  guest?: Guest | null;
  onCreated?: (id: string) => void;
}) {
  const save = useSave("guests", ["guests"]);
  const [form, setForm] = useState(() => (guest ? { ...EMPTY, ...guest } : EMPTY));
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const values = {
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
        email: form.email,
        country: form.country,
        notes: form.notes,
      };
      const row = await save.mutateAsync({ id: guest?.id, values });
      toast.success(guest ? "Huésped actualizado" : "Huésped creado");
      if (onCreated && row) onCreated((row as { id: string }).id);
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo guardar");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{guest ? "Editar huésped" : "Nuevo huésped"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nombre">
              <Input required value={form.first_name} onChange={(e) => set("first_name", e.target.value)} className="h-11" />
            </Field>
            <Field label="Apellido">
              <Input value={form.last_name} onChange={(e) => set("last_name", e.target.value)} className="h-11" />
            </Field>
          </div>
          <Field label="Teléfono / WhatsApp">
            <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} className="h-11" placeholder="+54 9 11 ..." />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="h-11" />
          </Field>
          <Field label="País">
            <Input value={form.country} onChange={(e) => set("country", e.target.value)} className="h-11" />
          </Field>
          <Field label="Observaciones">
            <Textarea rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </Field>
          <Button type="submit" className="h-12 w-full" disabled={save.isPending}>
            Guardar huésped
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function GuestsPage() {
  const { data: guests = [] } = useGuests();
  const { data: reservations = [] } = useReservations();
  const { data: payments = [] } = usePayments();
  const { data: properties = [] } = useProperties();
  const { data: messages = [] } = useMessages();
  const save = useSave("guests", ["guests"]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Guest | null>(null);

  const propName = (id: string) => properties.find((p) => p.id === id)?.name ?? "-";

  async function remove(g: Guest) {
    if (!confirm(`¿Eliminar a ${g.first_name}? Sus reservas quedarán sin huésped asignado.`)) return;
    await save.mutateAsync({ id: g.id, remove: true });
    setSelected(null);
    toast.success("Huésped eliminado");
  }

  const guestRes = selected ? reservations.filter((r) => r.guest_id === selected.id) : [];
  const guestMsgs = selected ? messages.filter((m) => m.guest_id === selected.id) : [];

  const q = query.trim().toLowerCase();
  const filtered = q
    ? guests.filter((g) =>
        [g.first_name, g.last_name, g.phone, g.email]
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
    : guests;


  return (
    <AppShell
      title="Huéspedes"
      action={
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Nuevo
        </Button>
      }
    >
      {open && <GuestForm open={open} onOpenChange={setOpen} />}

      {guests.length === 0 ? (
        <Empty text="Todavía no cargaste huéspedes." />
      ) : (
        <div className="space-y-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, apellido, teléfono o email"
            className="h-11"
          />
          {filtered.length === 0 ? (
            <Empty text={`No encontramos huéspedes para "${query}".`} />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelected(g)}
                  className="bg-card shadow-soft rounded-2xl border p-4 text-left"
                >
                  <p className="font-semibold">{`${g.first_name} ${g.last_name}`.trim()}</p>
                  <p className="text-muted-foreground mt-0.5 text-sm">{g.phone || g.email || g.country}</p>
                  <p className="text-muted-foreground mt-2 text-xs">
                    {reservations.filter((r) => r.guest_id === g.id).length} reserva(s)
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}


      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{`${selected.first_name} ${selected.last_name}`.trim()}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-sm">
                  <p className="text-muted-foreground">{selected.email || "Sin email"}</p>
                  <p className="text-muted-foreground">{selected.country}</p>
                  {selected.notes && <p className="mt-2">{selected.notes}</p>}
                </div>
                {selected.phone && (
                  <Button asChild variant="outline" className="h-11 w-full">
                    <a href={`https://wa.me/${selected.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                      <Phone className="size-4" /> Abrir WhatsApp
                    </a>
                  </Button>
                )}
                <SectionCard title="Historial de reservas y pagos">
                  {guestRes.length === 0 ? (
                    <Empty text="Sin reservas." />
                  ) : (
                    <ul className="divide-y">
                      {guestRes.map((r) => {
                        const paid = paidFor(r.id, payments);
                        return (
                          <li key={r.id} className="py-2.5 text-sm">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium">{propName(r.property_id)}</span>
                              <StatusBadge status={r.status} />
                            </div>
                            <p className="text-muted-foreground text-xs">
                              {fmtDate(r.check_in)} → {fmtDate(r.check_out)} · Total {money(r.total_price)} · Cobrado {money(paid)}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </SectionCard>
                <SectionCard title="Comunicaciones">
                  {guestMsgs.length === 0 ? (
                    <Empty text="Sin mensajes generados." />
                  ) : (
                    <ul className="space-y-2">
                      {guestMsgs.map((m) => (
                        <li key={m.id} className="bg-muted rounded-xl p-3 text-sm">
                          <p className="text-muted-foreground text-xs capitalize">{m.kind.replace(/_/g, " ")}</p>
                          <p className="mt-1 whitespace-pre-wrap">{m.content}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </SectionCard>
                <Button variant="outline" className="text-destructive w-full" onClick={() => remove(selected)}>
                  <Trash2 className="size-4" /> Eliminar huésped
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
