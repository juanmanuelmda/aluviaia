import type { Block, Guest, Payment, Property, Reservation } from "./data";
import { addDays, nights, parseISODate, toISODate } from "./format";

export const ACTIVE_STATUSES = ["pendiente", "confirmada", "checkin", "finalizada"];

export function paidFor(reservationId: string, payments: Payment[]) {
  return payments
    .filter((p) => p.reservation_id === reservationId)
    .reduce((s, p) => s + Number(p.amount), 0);
}

export function balanceFor(res: Reservation, payments: Payment[]) {
  const paid = paidFor(res.id, payments);
  return { paid, pending: Math.max(0, Number(res.total_price) - paid) };
}

export function overlaps(aIn: string, aOut: string, bIn: string, bOut: string) {
  return aIn < bOut && bIn < aOut;
}

/** Busca una reserva activa o un bloqueo que choque con el rango pedido. */
export function findConflict(args: {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  reservations: Reservation[];
  blocks?: Block[];
  excludeId?: string | undefined;
}) {
  const { propertyId, checkIn, checkOut, reservations, blocks = [], excludeId } = args;
  if (!propertyId || !checkIn || !checkOut || checkOut <= checkIn) return null;
  const res = reservations.find(
    (r) =>
      r.property_id === propertyId &&
      r.id !== excludeId &&
      ACTIVE_STATUSES.includes(r.status) &&
      overlaps(checkIn, checkOut, r.check_in, r.check_out),
  );
  if (res) return { kind: "reserva" as const, from: res.check_in, to: res.check_out, res };
  const blk = blocks.find(
    (b) => b.property_id === propertyId && overlaps(checkIn, checkOut, b.start_date, b.end_date),
  );
  if (blk) return { kind: "bloqueo" as const, from: blk.start_date, to: blk.end_date, block: blk };
  return null;
}


export function isBusy(
  propertyId: string,
  day: string,
  reservations: Reservation[],
  blocks: Block[],
) {
  const res = reservations.find(
    (r) =>
      r.property_id === propertyId &&
      ACTIVE_STATUSES.includes(r.status) &&
      day >= r.check_in &&
      day < r.check_out,
  );
  if (res) return { type: res.status === "pendiente" ? "pendiente" : "reservado", res } as const;
  const block = blocks.find(
    (b) => b.property_id === propertyId && day >= b.start_date && day < b.end_date,
  );
  if (block) return { type: block.reason, block } as const;
  return null;
}

export function occupancyRate(
  propertyId: string,
  reservations: Reservation[],
  from: Date,
  to: Date,
) {
  const total = Math.max(1, Math.round((to.getTime() - from.getTime()) / 86400000));
  let busy = 0;
  for (let i = 0; i < total; i++) {
    const day = toISODate(addDays(from, i));
    if (
      reservations.some(
        (r) =>
          r.property_id === propertyId &&
          ACTIVE_STATUSES.includes(r.status) &&
          day >= r.check_in &&
          day < r.check_out,
      )
    )
      busy++;
  }
  return { rate: busy / total, busy, total };
}

export function monthRange(date = new Date()) {
  const from = new Date(date.getFullYear(), date.getMonth(), 1);
  const to = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { from, to };
}

export type Opportunity = {
  key: string;
  type: "fechas_vacias" | "baja_ocupacion" | "bajo_rendimiento" | "consulta" | "pago_pendiente";
  title: string;
  detected: string;
  data: string;
  why: string;
  recommendation: string;
  propertyId?: string;
  reservationId?: string;
  guestId?: string | null;
};

/** Todas las oportunidades se derivan de datos reales del usuario. */
export function detectOpportunities(args: {
  properties: Property[];
  reservations: Reservation[];
  payments: Payment[];
  guests: Guest[];
  dismissed: string[];
}): Opportunity[] {
  const { properties, reservations, payments, guests, dismissed } = args;
  const out: Opportunity[] = [];
  const today = new Date();
  const horizon = addDays(today, 15);
  const active = properties.filter((p) => p.active);

  const rates = active.map((p) => ({
    p,
    ...occupancyRate(p.id, reservations, today, horizon),
  }));
  const avg = rates.length ? rates.reduce((s, r) => s + r.rate, 0) / rates.length : 0;

  for (const r of rates) {
    const free = r.total - r.busy;
    if (free >= 5) {
      out.push({
        key: `fechas_vacias:${r.p.id}`,
        type: "fechas_vacias",
        title: `${r.p.name} tiene ${free} noches libres`,
        detected: `${free} noches disponibles en los próximos 15 días.`,
        data: `Calendario y reservas activas de ${r.p.name}.`,
        why: "Las noches sin reservar no se recuperan: cada día vacío es ingreso perdido.",
        recommendation: "Promocioná esas fechas con una publicación y un mensaje de WhatsApp.",
        propertyId: r.p.id,
      });
    }
    if (rates.length > 1 && r.rate < avg * 0.7) {
      out.push({
        key: `baja_ocupacion:${r.p.id}`,
        type: "baja_ocupacion",
        title: `${r.p.name} está por debajo del promedio`,
        detected: `Ocupación ${(r.rate * 100).toFixed(0)}% vs promedio ${(avg * 100).toFixed(0)}%.`,
        data: "Ocupación calculada sobre los próximos 15 días de todas tus propiedades.",
        why: "Una propiedad muy por debajo del promedio suele indicar precio o difusión.",
        recommendation: "Revisá el precio base y publicá contenido nuevo para esta propiedad.",
        propertyId: r.p.id,
      });
    }
  }

  // Rendimiento por ingresos cobrados
  const income = new Map<string, number>();
  for (const pay of payments) {
    const res = reservations.find((r) => r.id === pay.reservation_id);
    if (!res) continue;
    income.set(res.property_id, (income.get(res.property_id) ?? 0) + Number(pay.amount));
  }
  if (active.length > 1 && income.size > 0) {
    const totals = active.map((p) => ({ p, total: income.get(p.id) ?? 0 }));
    const avgIncome = totals.reduce((s, t) => s + t.total, 0) / totals.length;
    for (const t of totals) {
      if (t.total < avgIncome * 0.5) {
        out.push({
          key: `bajo_rendimiento:${t.p.id}`,
          type: "bajo_rendimiento",
          title: `${t.p.name} genera menos ingresos que el resto`,
          detected: `Cobrado histórico por debajo de la mitad del promedio de tus propiedades.`,
          data: "Pagos registrados y reservas asociadas a cada propiedad.",
          why: "Puede haber menos demanda, menos difusión o un precio desalineado.",
          recommendation: "Generá una promoción específica y evaluá ajustar el precio.",
          propertyId: t.p.id,
        });
      }
    }
  }

  for (const r of reservations) {
    if (r.status === "consulta" || r.status === "pendiente") {
      if (parseISODate(r.check_out) < today) continue;
      const g = guests.find((x) => x.id === r.guest_id);
      out.push({
        key: `consulta:${r.id}`,
        type: "consulta",
        title: `Consulta sin cerrar: ${g ? `${g.first_name} ${g.last_name}` : "huésped"}`,
        detected: `Reserva en estado "${r.status}" del ${r.check_in} al ${r.check_out}.`,
        data: "Estado de la reserva registrada.",
        why: "Las consultas sin seguimiento se pierden en pocas horas.",
        recommendation: "Enviá un mensaje de seguimiento para confirmar la reserva.",
        propertyId: r.property_id,
        reservationId: r.id,
        guestId: r.guest_id,
      });
    }
    const paid = paidFor(r.id, payments);
    const pending = Number(r.total_price) - paid;
    if (pending > 0 && r.status !== "cancelada") {
      const g = guests.find((x) => x.id === r.guest_id);
      out.push({
        key: `pago_pendiente:${r.id}`,
        type: "pago_pendiente",
        title: `Saldo pendiente de ${g ? g.first_name : "huésped"}`,
        detected: `Faltan cobrar $${pending.toLocaleString("es-AR")} de ${nights(r.check_in, r.check_out)} noches.`,
        data: "Precio total de la reserva menos los pagos registrados.",
        why: "El saldo pendiente afecta directamente tu flujo de caja.",
        recommendation: "Enviá un recordatorio de pago por WhatsApp.",
        propertyId: r.property_id,
        reservationId: r.id,
        guestId: r.guest_id,
      });
    }
  }

  return out.filter((o) => !dismissed.includes(o.key));
}
