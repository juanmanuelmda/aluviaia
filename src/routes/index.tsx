import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Home,
  Megaphone,
  MessageSquare,
  Sparkles,
  Target,
  Wallet,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aluvia AI — Asistente inteligente para alquileres temporarios" },
      {
        name: "description",
        content:
          "Administrá propiedades, reservas, pagos y finanzas de tus alquileres temporarios, y descubrí oportunidades para conseguir más reservas con IA.",
      },
      { property: "og:title", content: "Aluvia AI — Gestioná menos. Ganá más." },
      {
        property: "og:description",
        content:
          "La plataforma con IA para propietarios de alquileres temporarios: reservas, pagos, finanzas, oportunidades y publicaciones.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const BENEFITS = [
  { icon: Home, title: "Administrá tus propiedades", text: "Fichas completas, fotos reales y precios en un solo lugar." },
  { icon: BarChart3, title: "Organizá tus reservas", text: "Estados claros y control automático de superposiciones." },
  { icon: CalendarDays, title: "Controlá la disponibilidad", text: "Calendario visual con bloqueos y mantenimiento." },
  { icon: Wallet, title: "Controlá tus finanzas", text: "Cobrado, pendiente, gastos y resultado, siempre al día." },
  { icon: Sparkles, title: "Consultá a tu IA", text: "Preguntá por tu negocio y respondé con datos reales." },
  { icon: Target, title: "Detectá oportunidades", text: "Fechas vacías, baja ocupación y saldos pendientes." },
  { icon: Megaphone, title: "Creá publicaciones", text: "Instagram, Facebook, WhatsApp y portales en segundos." },
  { icon: MessageSquare, title: "Conseguí más reservas", text: "De la oportunidad al mensaje enviado, sin recargar datos." },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="border-border/60 sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo size={34} />
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth">Ingresar</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/auth" search={{ modo: "registro" }}>
                Comenzar gratis
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="bg-hero">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
          <span className="bg-primary-soft text-primary inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold">
            <Sparkles className="size-3.5" /> Gestioná menos. Ganá más.
          </span>
          <h1 className="mt-6 text-4xl font-extrabold sm:text-6xl">
            Aluvia<span className="text-primary"> AI</span>
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-lg">
            Tu asistente inteligente para alquileres temporarios.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link to="/auth" search={{ modo: "registro" }}>
                Comenzar gratis
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
              <Link to="/auth">Ya tengo cuenta</Link>
            </Button>
          </div>
          <p className="text-muted-foreground mt-6 text-sm">
            Para propietarios con 1 a 20 propiedades. Sin planillas, sin anotaciones sueltas.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Todo tu negocio, ordenado</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="bg-card shadow-soft rounded-2xl border p-5">
              <span className="bg-primary-soft text-primary inline-flex size-10 items-center justify-center rounded-xl">
                <b.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold">{b.title}</h3>
              <p className="text-muted-foreground mt-1 text-sm">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Aluvia no solo administra tus alquileres. Te ayuda a conseguir más reservas.
          </h2>
          <p className="mt-4 opacity-90">
            Detecta fechas vacías, arma la campaña y te deja el mensaje listo para enviar.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8 h-12 px-8 text-base">
            <Link to="/auth" search={{ modo: "registro" }}>
              Comenzar gratis
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Planes</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { name: "Gratis", desc: "Para propietarios pequeños.", items: ["Hasta 2 propiedades", "Reservas y pagos", "Asistente IA básico"] },
            { name: "Pro", desc: "Para propietarios con varias propiedades.", items: ["Hasta 10 propiedades", "Oportunidades y campañas", "Publicaciones ilimitadas"] },
            { name: "Business", desc: "Para administradores profesionales.", items: ["Propiedades ilimitadas", "Finanzas avanzadas", "Soporte prioritario"] },
          ].map((plan, i) => (
            <div
              key={plan.name}
              className={`bg-card shadow-soft rounded-2xl border p-6 ${i === 1 ? "border-primary ring-primary/20 ring-2" : ""}`}
            >
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <p className="text-muted-foreground mt-1 text-sm">{plan.desc}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {plan.items.map((it) => (
                  <li key={it} className="flex items-start gap-2">
                    <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground mt-6 text-center text-sm">
          Durante la etapa inicial todas las funciones están disponibles sin costo.
        </p>
      </section>

      <footer className="border-border border-t py-8">
        <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-sm">
          <Logo size={26} />
          <p>Aluvia AI — Tu asistente inteligente para alquileres temporarios.</p>
        </div>
      </footer>
    </div>
  );
}
