import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, CalendarPlus, Home, Sparkles, UserPlus, Wallet } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Empty, SectionCard, StatCard, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  useBlocks,
  useGuests,
  usePayments,
  useProperties,
  useReservations,
  useDismissals,
} from "@/lib/data";
import { detectOpportunities, occupancyRate, paidFor, ACTIVE_STATUSES } from "@/lib/business";
import { getFinanzas, monthLabel, monthPeriod } from "@/lib/finance";
import { addDays, fmtDate, money, toISODate } from "@/lib/format";


export const Route = createFileRoute("/_authenticated/panel")({
  head: () => ({
    meta: [
      { title: "Panel — Aluvia AI" },
      { name: "description", content: "Indicadores, próximas llegadas, salidas y alertas de tu negocio de alquileres." },
      { property: "og:title", content: "Panel — Aluvia AI" },
      { property: "og:description", content: "El estado de tu negocio de alquileres temporarios en un vistazo." },
    ],
  }),
  component: Panel,
});

function Panel() {
  const { data: properties = [] } = useProperties();
  const { data: reservations = [] } = useReservations();
  const { data: payments = [] } = usePayments();
  const { data: guests = [] } = useGuests();
  const { data: dismissed = [] } = useDismissals();
  useBlocks();

  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const { desde, hasta } = monthPeriod(today);
  const mesLabel = monthLabel(today);

  const fin = getFinanzas({ desde, hasta, reservations, payments, expenses: [] });
  const monthRes = reservations.filter(
    (r) => r.check_in >= desde && r.check_in <= hasta && r.status !== "cancelada",
  );

  const occ = properties.length
    ? properties.reduce((s, p) => s + occupancyRate(p.id, reservations, monthStart, monthEnd).rate, 0) /
      properties.length
    : 0;


  const guestName = (id: string | null) => {
    const g = guests.find((x) => x.id === id);
    return g ? `${g.first_name} ${g.last_name}`.trim() : "Sin huésped";
  };
  const propName = (id: string) => properties.find((p) => p.id === id)?.name ?? "-";

  const horizon = toISODate(addDays(today, 14));
  const arrivals = reservations
    .filter((r) => ACTIVE_STATUSES.includes(r.status) && r.check_in >= toISODate(today) && r.check_in <= horizon)
    .slice(0, 6);
  const departures = reservations
    .filter((r) => ACTIVE_STATUSES.includes(r.status) && r.check_out >= toISODate(today) && r.check_out <= horizon)
    .sort((a, b) => a.check_out.localeCompare(b.check_out))
    .slice(0, 6);

  const opportunities = detectOpportunities({ properties, reservations, payments, guests, dismissed });

  const alerts: { text: string; to: string }[] = [];
  const pendingPayments = reservations.filter(
    (r) => r.status !== "cancelada" && Number(r.total_price) - paidFor(r.id, payments) > 0,
  );

  if (pendingPayments.length)
    alerts.push({ text: `${pendingPayments.length} reserva(s) con saldo pendiente de cobro.`, to: "/finanzas" });
  const pendingRes = reservations.filter((r) => r.status === "pendiente" || r.status === "consulta");
  if (pendingRes.length) alerts.push({ text: `${pendingRes.length} consulta(s) o reserva(s) sin confirmar.`, to: "/reservas" });
  if (arrivals.length) alerts.push({ text: `${arrivals.length} llegada(s) en los próximos 14 días.`, to: "/calendario" });
  if (departures.length) alerts.push({ text: `${departures.length} salida(s) en los próximos 14 días.`, to: "/calendario" });
  if (opportunities.length) alerts.push({ text: `${opportunities.length} oportunidad(es) de ingresos detectadas.`, to: "/oportunidades" });

  return (
    <AppShell title="Panel">
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <StatCard label="Propiedades" value={String(properties.length)} hint={`${properties.filter((p) => p.active).length} activas`} />
          <StatCard label={`Reservas de ${mesLabel}`} value={String(monthRes.length)} />
          <StatCard label={`Ocupación de ${mesLabel}`} value={`${Math.round(occ * 100)}%`} hint="Mes calendario" />
          <StatCard label={`Ingresos (reservado) de ${mesLabel}`} value={money(fin.ingresosReservado)} hint="Reservas no canceladas con check-in este mes" />
          <StatCard label={`Cobrado en ${mesLabel}`} value={money(fin.cobrado)} tone="success" />
          <StatCard label="Pendiente de cobro" value={money(fin.pendienteCobro)} tone="warning" hint="Saldo de reservas no canceladas" />
        </div>


        <SectionCard title="Acciones rápidas">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            <Button asChild variant="outline" className="h-auto flex-col gap-1.5 py-3">
              <Link to="/propiedades"><Home className="size-4" />Nueva propiedad</Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col gap-1.5 py-3">
              <Link to="/reservas"><CalendarPlus className="size-4" />Nueva reserva</Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col gap-1.5 py-3">
              <Link to="/huespedes"><UserPlus className="size-4" />Nuevo huésped</Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col gap-1.5 py-3">
              <Link to="/reservas"><Wallet className="size-4" />Registrar pago</Link>
            </Button>
            <Button asChild className="h-auto flex-col gap-1.5 py-3">
              <Link to="/asistente"><Sparkles className="size-4" />Preguntar a Aluvia</Link>
            </Button>
          </div>
        </SectionCard>

        {alerts.length > 0 && (
          <SectionCard title="Alertas">
            <ul className="space-y-2">
              {alerts.map((a) => (
                <li key={a.text}>
                  <Link to={a.to} className="bg-accent-soft/60 hover:bg-accent-soft flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm">
                    <AlertTriangle className="text-accent-foreground mt-0.5 size-4 shrink-0" />
                    {a.text}
                  </Link>
                </li>
              ))}
            </ul>
          </SectionCard>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Próximas llegadas">
            {arrivals.length === 0 ? (
              <Empty text="No hay llegadas próximas." />
            ) : (
              <ul className="divide-y">
                {arrivals.map((r) => {
                  const paid = paidFor(r.id, payments);
                  const pend = Number(r.total_price) - paid;
                  return (
                    <li key={r.id} className="flex items-center justify-between gap-3 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{guestName(r.guest_id)}</p>
                        <p className="text-muted-foreground truncate text-xs">
                          {propName(r.property_id)} · {fmtDate(r.check_in)}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <StatusBadge status={r.status} />
                        <span className={pend > 0 ? "text-destructive text-[11px]" : "text-success text-[11px]"}>
                          {pend > 0 ? `Pendiente ${money(pend)}` : "Pagado"}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Próximas salidas">
            {departures.length === 0 ? (
              <Empty text="No hay salidas próximas." />
            ) : (
              <ul className="divide-y">
                {departures.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{guestName(r.guest_id)}</p>
                      <p className="text-muted-foreground truncate text-xs">{propName(r.property_id)}</p>
                    </div>
                    <span className="text-sm font-medium">{fmtDate(r.check_out)}</span>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
