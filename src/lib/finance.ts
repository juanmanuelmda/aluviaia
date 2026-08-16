/**
 * Única fuente de verdad de los cálculos financieros de Aluvia AI.
 * La usan Panel, Finanzas y el snapshot del Asistente IA, para que el mismo
 * concepto muestre exactamente el mismo número en los tres módulos.
 */

export const EXPENSE_CATEGORIES = [
  "limpieza",
  "mantenimiento",
  "servicios",
  "reparaciones",
  "publicidad",
  "impuestos",
  "otros",
] as const;

/** Estados que NO se consideran para saldos ni ingresos. */
export const CANCELLED_STATUS = "cancelada";

export type FinanceReservation = {
  id: string;
  property_id: string;
  status: string;
  check_in: string;
  total_price: number | string;
};
export type FinancePayment = {
  reservation_id: string;
  amount: number | string;
  paid_at: string;
};
export type FinanceExpense = {
  property_id?: string | null;
  amount: number | string;
  spent_at: string;
};

export type FinanzasInput = {
  desde: string;
  hasta: string;
  propiedadId?: string | null;
  reservations: FinanceReservation[];
  payments: FinancePayment[];
  expenses: FinanceExpense[];
};

export type Finanzas = {
  desde: string;
  hasta: string;
  /** Suma de total_price de reservas NO canceladas con check-in en el período. */
  ingresosReservado: number;
  /** Suma de pagos por fecha de pago dentro del período. */
  cobrado: number;
  /** Saldo (total - cobrado) de TODAS las reservas no canceladas. */
  pendienteCobro: number;
  /** Gastos por fecha dentro del período. */
  gastos: number;
  /** Cobrado - Gastos. */
  resultadoNeto: number;
  reservasPeriodo: number;
};

const num = (v: number | string) => Number(v) || 0;
const inRange = (d: string, from: string, to: string) => d >= from && d <= to;

export function getFinanzas(input: FinanzasInput): Finanzas {
  const { desde, hasta, propiedadId } = input;
  const prop = propiedadId || null;

  const reservations = input.reservations.filter((r) => !prop || r.property_id === prop);
  const activeRes = reservations.filter((r) => r.status !== CANCELLED_STATUS);
  const resIds = new Set(activeRes.map((r) => r.id));

  const payments = input.payments.filter((p) => resIds.has(p.reservation_id));
  const expenses = input.expenses.filter((e) => !prop || e.property_id === prop);

  const periodRes = activeRes.filter((r) => inRange(r.check_in, desde, hasta));
  const ingresosReservado = periodRes.reduce((s, r) => s + num(r.total_price), 0);

  const cobrado = payments
    .filter((p) => inRange(p.paid_at, desde, hasta))
    .reduce((s, p) => s + num(p.amount), 0);

  const pendienteCobro = activeRes.reduce((s, r) => {
    const paid = payments
      .filter((p) => p.reservation_id === r.id)
      .reduce((t, p) => t + num(p.amount), 0);
    return s + Math.max(0, num(r.total_price) - paid);
  }, 0);

  const gastos = expenses
    .filter((e) => inRange(e.spent_at, desde, hasta))
    .reduce((s, e) => s + num(e.amount), 0);

  return {
    desde,
    hasta,
    ingresosReservado,
    cobrado,
    pendienteCobro,
    gastos,
    resultadoNeto: cobrado - gastos,
    reservasPeriodo: periodRes.length,
  };
}

/** Rango del mes calendario de una fecha, en formato ISO (inclusive). */
export function monthPeriod(date = new Date()) {
  const y = date.getFullYear();
  const m = date.getMonth();
  const pad = (n: number) => String(n).padStart(2, "0");
  const last = new Date(y, m + 1, 0).getDate();
  return { desde: `${y}-${pad(m + 1)}-01`, hasta: `${y}-${pad(m + 1)}-${pad(last)}` };
}

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export function monthLabel(date = new Date()) {
  return MESES[date.getMonth()] ?? "";
}
