import { Bell, CalendarCheck, CalendarX, MessageCircle, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "@/lib/notifications";
import { cn } from "@/lib/utils";

const ICONS = {
  checkin: CalendarCheck,
  checkout: CalendarX,
  saldo: Wallet,
  consulta: MessageCircle,
} as const;

export function NotificationsBell() {
  const { items, unread, read, markAllRead } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Notificaciones"
          className="hover:bg-secondary relative rounded-lg p-2"
        >
          <Bell className="size-5" />
          {unread.length > 0 && (
            <span className="bg-destructive text-destructive-foreground absolute -top-0.5 -right-0.5 min-w-4 rounded-full px-1 text-[10px] leading-4 font-bold">
              {unread.length > 9 ? "9+" : unread.length}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(22rem,calc(100vw-2rem))] p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-bold">Notificaciones</p>
          {items.length > 0 && (
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={markAllRead}>
              Marcar leídas
            </Button>
          )}
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-muted-foreground p-4 text-sm">Todo al día. No hay avisos.</p>
          ) : (
            <ul className="divide-y">
              {items.map((n) => {
                const Icon = ICONS[n.kind];
                const isRead = read.includes(n.key);
                return (
                  <li
                    key={n.key}
                    className={cn("flex gap-3 px-4 py-3", !isRead && "bg-primary-soft/40")}
                  >
                    <Icon className="text-primary mt-0.5 size-4 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-muted-foreground text-xs">{n.body}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
