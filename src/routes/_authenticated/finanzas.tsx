import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Empty, Field, SectionCard, StatCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useExpenses, usePayments, useProperties, useReservations, useSave } from "@/lib/data";
import { balanceFor } from "@/lib/business";
import { fmtDate, money, toISODate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/finanzas")({
  head: () => ({
    meta: [
      { title: "Finanzas — Aluvia AI" },
      { name: "description", content: "Ingresos, gastos y rentabilidad por propiedad en pesos argentinos." },
      { property: "og:title", content: "Finanzas — Aluvia AI" },
      { property: "og:description", content: "Controlá ingresos cobrados, gastos y resultado neto de tu negocio." },
    ],
  }),
  component: FinancePage,
});

const SELECT_CLASS =
  "h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";
const CATEGORIES = ["limpieza", "mantenimiento", "servicios", "impuestos", "comisiones", "insumos", "general"];

function FinancePage() {
  const { data: payments = [] } = usePayments();
  const { data: expenses = [] } = useExpenses();
  const { data: properties = [] } = useProperties();
  const { data: reservations = [] } = useReservations();
  const saveExpense = useSave("expenses", ["expenses"]);
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<"mes" | "anio" | "custom">("mes");
  const [month, setMonth] = useState(() => toISODate(new Date()).slice(0, 7));
  const [year, setYear] = useState(() => String(new Date().getFullYear()));
  const [custom, setCustom] = useState(() => ({
    from: `${toISODate(new Date()).slice(0, 4)}-01-01`,
    to: toISODate(new Date()),
  }));
  const [form, setForm] = useState({
    amount: "",
    category: "general",
    description: "",
    property_id: "",
    spent_at: toISODate(new Date()),
  });

  const period = useMemo(() => {
    if (range === "mes") {
      const [y, m] = month.split("-").map(Number);
      const last = new Date(y!, m!, 0).getDate();
      return { from: `${month}-01`, to: `${month}-${String(last).padStart(2, "0")}`, label: `Mes ${month}` };
    }
    if (range === "anio") return { from: `${year}-01-01`, to: `${year}-12-31`, label: `Año ${year}` };
    return { from: custom.from, to: custom.to, label: "Período personalizado" };
  }, [range, month, year, custom]);

  const inRange = (d: string) => d >= period.from && d <= period.to;

  const monthPayments = payments.filter((p) => inRange(p.paid_at));
  const monthExpenses = expenses.filter((e) => inRange(e.spent_at));
  const income = monthPayments.reduce((s, p) => s + Number(p.amount), 0);
  const outcome = monthExpenses.reduce((s, e) => s + Number(e.amount), 0);
  const pending = reservations.reduce((s, r) => s + Math.max(0, balanceFor(r, payments).pending), 0);


  const byProperty = useMemo(() => {
    return properties.map((prop) => {
      const resIds = reservations.filter((r) => r.property_id === prop.id).map((r) => r.id);
      const inc = monthPayments.filter((p) => resIds.includes(p.reservation_id)).reduce((s, p) => s + Number(p.amount), 0);
      const out = monthExpenses.filter((e) => e.property_id === prop.id).reduce((s, e) => s + Number(e.amount), 0);
      return { prop, inc, out, net: inc - out };
    });
  }, [properties, reservations, monthPayments, monthExpenses]);

  async function addExpense(e: React.FormEvent) {
    e.preventDefault();
    if (!Number(form.amount)) {
      toast.error("Ingresá un importe");
      return;
    }
    await saveExpense.mutateAsync({
      values: {
        amount: Number(form.amount),
        category: form.category,
        description: form.description,
        property_id: form.property_id || null,
        spent_at: form.spent_at,
      },
    });
    setForm({ ...form, amount: "", description: "" });
    setOpen(false);
    toast.success("Gasto registrado");
  }

  return (
    <AppShell
      title="Finanzas"
      action={
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Gasto
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="bg-card space-y-3 rounded-2xl border p-3">
          <div className="flex gap-2">
            {(
              [
                ["mes", "Mes"],
                ["anio", "Año"],
                ["custom", "Personalizado"],
              ] as const
            ).map(([v, label]) => (
              <button
                key={v}
                type="button"
                onClick={() => setRange(v)}
                className={`h-9 flex-1 rounded-lg text-sm font-medium ${range === v ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {label}
              </button>
            ))}
          </div>
          {range === "mes" && (
            <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="h-11 sm:max-w-xs" />
          )}
          {range === "anio" && (
            <select className={SELECT_CLASS} value={year} onChange={(e) => setYear(e.target.value)}>
              {Array.from({ length: 6 }, (_, i) => String(new Date().getFullYear() - i)).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          )}
          {range === "custom" && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Desde">
                <Input type="date" value={custom.from} onChange={(e) => setCustom({ ...custom, from: e.target.value })} className="h-11" />
              </Field>
              <Field label="Hasta">
                <Input type="date" value={custom.to} onChange={(e) => setCustom({ ...custom, to: e.target.value })} className="h-11" />
              </Field>
            </div>
          )}
          <p className="text-muted-foreground text-xs">
            Mostrando {fmtDate(period.from)} → {fmtDate(period.to)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Ingresos del período" value={money(income)} tone="success" />
          <StatCard label="Gastos del período" value={money(outcome)} tone="warning" />

          <StatCard label="Resultado neto" value={money(income - outcome)} />
          <StatCard label="Por cobrar" value={money(pending)} tone="warning" hint="Saldo de todas las reservas" />
        </div>

        <SectionCard title="Rentabilidad por propiedad">
          {byProperty.length === 0 ? (
            <Empty text="Cargá propiedades para ver su rentabilidad." />
          ) : (
            <ul className="divide-y">
              {byProperty.map(({ prop, inc, out, net }) => (
                <li key={prop.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{prop.name}</p>
                    <p className="text-muted-foreground text-xs">
                      Ingresos {money(inc)} · Gastos {money(out)}
                    </p>
                  </div>
                  <span className={net >= 0 ? "text-success font-semibold" : "text-destructive font-semibold"}>
                    {money(net)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Gastos del período">
          {monthExpenses.length === 0 ? (
            <Empty text="Sin gastos registrados este mes." />
          ) : (
            <ul className="divide-y">
              {monthExpenses.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium capitalize">
                      {e.category} {e.description ? `· ${e.description}` : ""}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {fmtDate(e.spent_at)}
                      {e.property_id ? ` · ${properties.find((p) => p.id === e.property_id)?.name ?? ""}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{money(e.amount)}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive size-8"
                      onClick={() => saveExpense.mutate({ id: e.id, remove: true })}
                      aria-label="Eliminar gasto"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Cobros del mes">
          {monthPayments.length === 0 ? (
            <Empty text="Sin cobros registrados este mes." />
          ) : (
            <ul className="divide-y">
              {monthPayments.map((p) => {
                const res = reservations.find((r) => r.id === p.reservation_id);
                return (
                  <li key={p.id} className="flex items-center justify-between py-2.5 text-sm">
                    <div>
                      <p className="font-medium capitalize">{p.method.replace("_", " ")}</p>
                      <p className="text-muted-foreground text-xs">
                        {fmtDate(p.paid_at)}
                        {res ? ` · ${properties.find((x) => x.id === res.property_id)?.name ?? ""}` : ""}
                      </p>
                    </div>
                    <span className="text-success font-semibold">{money(p.amount)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo gasto</DialogTitle>
          </DialogHeader>
          <form onSubmit={addExpense} className="space-y-3">
            <Field label="Importe (ARS)">
              <Input type="number" min={0} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="h-11" />
            </Field>
            <Field label="Categoría">
              <select className={SELECT_CLASS} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Propiedad (opcional)">
              <select className={SELECT_CLASS} value={form.property_id} onChange={(e) => setForm({ ...form, property_id: e.target.value })}>
                <option value="">General del negocio</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Descripción">
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="h-11" />
            </Field>
            <Field label="Fecha">
              <Input type="date" value={form.spent_at} onChange={(e) => setForm({ ...form, spent_at: e.target.value })} className="h-11" />
            </Field>
            <Button type="submit" className="h-12 w-full" disabled={saveExpense.isPending}>
              Guardar gasto
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
