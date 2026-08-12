export const ARS = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function money(value: number | null | undefined) {
  return ARS.format(Number(value ?? 0));
}

export function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function parseISODate(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y!, (m ?? 1) - 1, d ?? 1);
}

export function fmtDate(s: string | null | undefined) {
  if (!s) return "-";
  return parseISODate(s).toLocaleDateString("es-AR", { day: "2-digit", month: "short" });
}

export function fmtDateLong(s: string | null | undefined) {
  if (!s) return "-";
  return parseISODate(s).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function nights(checkIn: string, checkOut: string) {
  return Math.max(
    0,
    Math.round(
      (parseISODate(checkOut).getTime() - parseISODate(checkIn).getTime()) / 86400000,
    ),
  );
}

export function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export const STATUS_LABEL: Record<string, string> = {
  consulta: "Consulta",
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  checkin: "Check-in",
  finalizada: "Finalizada",
  cancelada: "Cancelada",
};

export const STATUS_CLASS: Record<string, string> = {
  consulta: "bg-secondary text-secondary-foreground",
  pendiente: "bg-accent-soft text-accent-foreground",
  confirmada: "bg-primary-soft text-primary",
  checkin: "bg-primary text-primary-foreground",
  finalizada: "bg-muted text-muted-foreground",
  cancelada: "bg-destructive/10 text-destructive",
};
