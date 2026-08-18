import { useEffect, useMemo, useState } from "react";
import { ACTIVE_STATUSES, balanceFor } from "@/lib/business";
import { useGuests, usePayments, useProperties, useReservations } from "@/lib/data";
import { addDays, fmtDate, money, toISODate } from "@/lib/format";

export type AppNotification = {
  key: string;
  kind: "checkin" | "checkout" | "saldo" | "consulta";
  title: string;
  body: string;
};

const STORAGE_KEY = "aluvia:notif-read";

function readStored(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

/** Notificaciones derivadas de datos reales: check-in 72hs, check-out 48hs, saldos y consultas. */
export function useNotifications() {
  const { data: reservations = [] } = useReservations();
  const { data: payments = [] } = usePayments();
  const { data: guests = [] } = useGuests();
  const { data: properties = [] } = useProperties();
  const [read, setRead] = useState<string[]>([]);

  useEffect(() => setRead(readStored()), []);

  const items = useMemo(() => {
    const today = toISODate(new Date());
    const in72 = toISODate(addDays(new Date(), 3));
    const in48 = toISODate(addDays(new Date(), 2));
    const guestName = (id: string | null) => {
      const g = guests.find((x) => x.id === id);
      return g ? `${g.first_name} ${g.last_name}`.trim() : "Huésped";
    };
    const propName = (id: string) => properties.find((p) => p.id === id)?.name ?? "Propiedad";
    const out: AppNotification[] = [];

    for (const r of reservations) {
      if (r.status === "cancelada") continue;
      if (ACTIVE_STATUSES.includes(r.status) && r.check_in >= today && r.check_in <= in72) {
        out.push({
          key: `checkin:${r.id}`,
          kind: "checkin",
          title: `Check-in de ${guestName(r.guest_id)}`,
          body: `${propName(r.property_id)} · ${fmtDate(r.check_in)}`,
        });
      }
      if (ACTIVE_STATUSES.includes(r.status) && r.check_out >= today && r.check_out <= in48) {
        out.push({
          key: `checkout:${r.id}`,
          kind: "checkout",
          title: `Check-out de ${guestName(r.guest_id)}`,
          body: `${propName(r.property_id)} · ${fmtDate(r.check_out)}`,
        });
      }
      const { pending } = balanceFor(r, payments);
      if (pending > 0 && r.status !== "consulta") {
        out.push({
          key: `saldo:${r.id}`,
          kind: "saldo",
          title: `Saldo pendiente de ${guestName(r.guest_id)}`,
          body: `${money(pending)} · ${propName(r.property_id)}`,
        });
      }
      if (r.status === "consulta" && r.check_out >= today) {
        out.push({
          key: `consulta:${r.id}`,
          kind: "consulta",
          title: `Consulta sin responder: ${guestName(r.guest_id)}`,
          body: `${propName(r.property_id)} · ${fmtDate(r.check_in)} → ${fmtDate(r.check_out)}`,
        });
      }
    }
    return out;
  }, [reservations, payments, guests, properties]);

  const unread = items.filter((i) => !read.includes(i.key));

  function markAllRead() {
    const keys = items.map((i) => i.key);
    setRead(keys);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
    }
  }

  return { items, unread, read, markAllRead };
}
