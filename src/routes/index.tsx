import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Home,
  Megaphone,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Target,
  Wallet,
} from "lucide-react";
import heroImage from "@/assets/hero-aluvia.jpg";
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
  { icon: Home, title: "Propiedades", text: "Fichas completas, fotos reales y precios en un solo lugar." },
  { icon: BarChart3, title: "Reservas", text: "Estados claros y control automático de superposiciones." },
  { icon: CalendarDays, title: "Calendario", text: "Disponibilidad visual con bloqueos y mantenimiento." },
  { icon: Wallet, title: "Finanzas", text: "Cobrado, pendiente, gastos y resultado, siempre al día." },
  { icon: Sparkles, title: "Asistente IA", text: "Preguntá por tu negocio y respondé con datos reales." },
  { icon: Target, title: "Oportunidades", text: "Fechas vacías, baja ocupación y saldos pendientes." },
  { icon: Megaphone, title: "Publicaciones", text: "Instagram, Facebook, WhatsApp y portales en segundos." },
  { icon: MessageSquare, title: "Mensajes", text: "Bienvenida, check-in y cobros con tu tono de siempre." },
];

const STEPS = [
  {
    n: "01",
    title: "Cargá tus propiedades",
    text: "En minutos tenés fichas con fotos, precios, reglas y servicios. También podés probar con datos demo.",
  },
  {
    n: "02",
    title: "Gestioná reservas y pagos",
    text: "Registrá reservas sin superposiciones, cobrá seña y saldo, y mirá el resultado neto en ARS.",
  },
  {
    n: "03",
    title: "Convertí oportunidades",
    text: "Aluvia detecta fechas vacías o saldos y te deja la publicación o el mensaje listo para enviar.",
  },
];

const FAQ = [
  {
    q: "¿Sirve si tengo una sola propiedad?",
    a: "Sí. El plan gratis cubre hasta 2 propiedades con reservas, pagos y asistente IA.",
  },
  {
    q: "¿La IA inventa datos?",
    a: "No. Las respuestas se arman sobre tus reservas, pagos y gastos reales cargados en la plataforma.",
  },
  {
    q: "¿Puedo probarla sin cargar mi información?",
    a: "Sí. Desde Configuración cargás un escenario demo completo y lo eliminás cuando quieras.",
  },
  {
    q: "¿Mis datos están aislados?",
    a: "Cada cuenta ve únicamente su propia información, con reglas de acceso a nivel de base de datos.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="border-border/60 bg-background/85 sticky top-0 z-30 border-b backdrop-blur">
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
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:py-20 lg:grid-cols-2 lg:items-center">
          <div className="text-center lg:text-left">
            <span className="bg-primary-soft text-primary inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold">
              <Sparkles className="size-3.5" /> Gestioná menos. Ganá más.
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Tu asistente inteligente para{" "}
              <span className="text-primary">alquileres temporarios</span>
            </h1>
            <p className="text-muted-foreground mt-4 text-lg">
              Reservas, pagos, finanzas y marketing en una sola app pensada para propietarios
              argentinos. Sin planillas ni anotaciones sueltas.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:justify-start">
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <Link to="/auth" search={{ modo: "registro" }}>
                  Comenzar gratis <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
                <Link to="/auth">Ya tengo cuenta</Link>
              </Button>
            </div>
            <p className="text-muted-foreground mt-6 flex items-center justify-center gap-2 text-sm lg:justify-start">
              <ShieldCheck className="size-4" /> Para propietarios con 1 a 20 propiedades.
            </p>
          </div>
          <div className="relative">
            <img
              src={heroImage}
              alt="Living luminoso de un departamento en alquiler temporario"
              width={1408}
              height={1008}
              className="shadow-soft aspect-[4/3] w-full rounded-3xl border object-cover"
            />
            <div className="bg-card shadow-soft absolute -bottom-5 left-4 rounded-2xl border p-4 sm:left-8">
              <p className="text-muted-foreground text-xs font-medium">Oportunidad detectada</p>
              <p className="mt-1 text-sm font-bold">6 noches libres este mes</p>
              <p className="text-primary mt-1 text-xs font-semibold">Publicación lista para enviar</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Cómo funciona</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-card shadow-soft rounded-2xl border p-6">
              <span className="text-primary text-sm font-bold tracking-widest">{s.n}</span>
              <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
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
        </div>
      </section>

      <section className="bg-brand text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-20">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Aluvia no solo administra tus alquileres. Te ayuda a conseguir más reservas.
          </h2>
          <p className="mt-4 opacity-90">
            Detecta la oportunidad, arma la campaña y te deja el mensaje listo para enviar por
            WhatsApp o redes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-semibold">
            <span className="rounded-full bg-white/15 px-4 py-2">Oportunidad</span>
            <span className="rounded-full bg-white/15 px-4 py-2">Campaña</span>
            <span className="rounded-full bg-white/15 px-4 py-2">Publicación o mensaje</span>
          </div>
          <Button asChild size="lg" variant="secondary" className="mt-8 h-12 px-8 text-base">
            <Link to="/auth" search={{ modo: "registro" }}>
              Comenzar gratis
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Planes</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              name: "Gratis · $0",
              desc: "Para propietarios pequeños.",
              items: ["Hasta 2 propiedades", "Reservas y pagos", "Asistente IA básico"],
            },
            {
              name: "Pro · $14.900 / mes",
              desc: "Para propietarios con varias propiedades.",
              items: ["Hasta 10 propiedades", "Oportunidades y campañas", "Publicaciones ilimitadas"],
            },
            {
              name: "Business · $29.900 / mes",
              desc: "Para administradores profesionales.",
              items: ["Propiedades ilimitadas", "Finanzas avanzadas", "Soporte prioritario"],
            },
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

      <section className="border-t bg-secondary/40">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Preguntas frecuentes</h2>
          <div className="mt-8 space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="bg-card shadow-soft group rounded-2xl border p-5">
                <summary className="cursor-pointer list-none text-sm font-semibold">{f.q}</summary>
                <p className="text-muted-foreground mt-2 text-sm">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-border border-t py-10">
        <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-sm">
          <Logo size={26} />
          <p>Aluvia AI — Tu asistente inteligente para alquileres temporarios.</p>
        </div>
      </footer>
    </div>
  );
}
