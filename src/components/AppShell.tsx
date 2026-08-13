import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  BarChart3,
  CalendarDays,
  Home,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MessageSquare,
  Menu,
  Settings,
  Sparkles,
  Target,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useDemoMode } from "@/lib/demo";

const NAV = [
  { to: "/panel", label: "Panel", icon: LayoutDashboard },
  { to: "/propiedades", label: "Propiedades", icon: Home },
  { to: "/reservas", label: "Reservas", icon: BarChart3 },
  { to: "/calendario", label: "Calendario", icon: CalendarDays },
  { to: "/huespedes", label: "Huéspedes", icon: Users },
  { to: "/finanzas", label: "Finanzas", icon: Wallet },
  { to: "/oportunidades", label: "Oportunidades", icon: Target },
  { to: "/publicaciones", label: "Publicaciones", icon: Megaphone },
  { to: "/asistente", label: "Asistente IA", icon: Sparkles },
  { to: "/mensajes", label: "Mensajes", icon: MessageSquare },
  { to: "/configuracion", label: "Configuración", icon: Settings },
] as const;

const BOTTOM = [
  { to: "/panel", label: "Panel", icon: LayoutDashboard },
  { to: "/reservas", label: "Reservas", icon: BarChart3 },
  { to: "/calendario", label: "Calendario", icon: CalendarDays },
  { to: "/asistente", label: "Aluvia IA", icon: Sparkles },
] as const;

export function AppShell({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const demoMode = useDemoMode();

  // Cierre garantizado del menú ante cualquier cambio de ruta.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function signOut() {
    setOpen(false);
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  function go(to: string) {
    setOpen(false);
    navigate({ to });
  }

  const NavList = ({ onPick }: { onPick: (to: string) => void }) => (
    <nav className="flex flex-col gap-1 p-3">
      {NAV.map((item) => {
        const activeItem = pathname.startsWith(item.to);
        return (
          <button
            key={item.to}
            type="button"
            onClick={() => onPick(item.to)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors",
              activeItem
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="size-[18px]" />
            {item.label}
          </button>
        );
      })}
      <button
        type="button"
        onClick={signOut}
        className="text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground mt-2 flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium"
      >
        <LogOut className="size-[18px]" />
        Cerrar sesión
      </button>
    </nav>
  );

  return (
    <div className="bg-background min-h-screen">
      {/* Sidebar fijo en desktop */}
      <aside className="bg-sidebar border-sidebar-border fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r lg:flex">
        <div className="border-sidebar-border flex h-16 items-center border-b px-4">
          <Link to="/panel" className="text-sidebar-foreground">
            <Logo />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavList onPick={go} />
        </div>
      </aside>

      {/* Drawer móvil */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <div className="bg-sidebar absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col shadow-lift">
            <div className="border-sidebar-border flex h-16 items-center justify-between border-b px-4">
              <span className="text-sidebar-foreground">
                <Logo />
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="text-sidebar-foreground/70 hover:bg-sidebar-accent rounded-lg p-2"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavList onPick={go} />
            </div>
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="bg-background/85 border-border sticky top-0 z-20 flex h-16 items-center gap-3 border-b px-4 backdrop-blur">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            className="hover:bg-secondary -ml-1 rounded-lg p-2 lg:hidden"
          >
            <Menu className="size-5" />
          </button>
          <h1 className="flex-1 truncate text-lg font-bold">{title}</h1>
          {demoMode && (
            <span className="border-border text-muted-foreground hidden rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wide sm:inline">
              MODO DEMO
            </span>
          )}
          {action}
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 pt-5 pb-28 lg:pb-10">{children}</main>
      </div>

      {/* Nav inferior móvil */}
      <nav className="bg-background/95 border-border fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t backdrop-blur lg:hidden">
        {BOTTOM.map((item) => {
          const activeItem = pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
                activeItem ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
