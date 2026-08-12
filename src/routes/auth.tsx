import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

type Modo = "login" | "registro" | "recuperar";

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): { modo?: "registro" } =>
    search["modo"] === "registro" ? { modo: "registro" } : {},
  head: () => ({
    meta: [
      { title: "Ingresar a Aluvia AI" },
      { name: "description", content: "Accedé a tu cuenta de Aluvia AI para administrar tus alquileres temporarios." },
      { property: "og:title", content: "Ingresar a Aluvia AI" },
      { property: "og:description", content: "Accedé a tu cuenta de Aluvia AI." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [modo, setModo] = useState<Modo>(search.modo === "registro" ? "registro" : "login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/panel" });
    });
  }, [navigate]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (modo === "registro") {
        if (form.password !== form.confirm) {
          toast.error("Las contraseñas no coinciden");
          return;
        }
        if (form.password.length < 6) {
          toast.error("La contraseña debe tener al menos 6 caracteres");
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            emailRedirectTo: `${window.location.origin}/panel`,
            data: { first_name: form.firstName, last_name: form.lastName },
          },
        });
        if (error) throw error;
        const { data: sess } = await supabase.auth.getSession();
        if (sess.session) {
          navigate({ to: "/panel" });
        } else {
          toast.success("Te enviamos un email para confirmar tu cuenta.");
          setModo("login");
        }
      } else if (modo === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        navigate({ to: "/panel" });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
          redirectTo: `${window.location.origin}/configuracion`,
        });
        if (error) throw error;
        toast.success("Te enviamos un email para recuperar tu contraseña.");
        setModo("login");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("No pudimos iniciar sesión con Google");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/panel" });
  }

  return (
    <div className="bg-hero flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Link to="/" className="mb-6">
        <Logo size={40} />
      </Link>
      <div className="bg-card shadow-lift w-full max-w-md rounded-3xl border p-6 sm:p-8">
        <h1 className="text-2xl font-bold">
          {modo === "registro" ? "Creá tu cuenta" : modo === "login" ? "Ingresá" : "Recuperar contraseña"}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {modo === "registro"
            ? "Empezá a organizar tus alquileres en minutos."
            : modo === "login"
              ? "Bienvenido de nuevo a Aluvia AI."
              : "Te enviamos un enlace a tu email."}
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {modo === "registro" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">Nombre</Label>
                <Input id="firstName" required value={form.firstName} onChange={set("firstName")} className="h-12" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Apellido</Label>
                <Input id="lastName" required value={form.lastName} onChange={set("lastName")} className="h-12" />
              </div>
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={form.email} onChange={set("email")} className="h-12" />
          </div>
          {modo !== "recuperar" && (
            <div className="space-y-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" required value={form.password} onChange={set("password")} className="h-12" />
            </div>
          )}
          {modo === "registro" && (
            <div className="space-y-1.5">
              <Label htmlFor="confirm">Confirmar contraseña</Label>
              <Input id="confirm" type="password" required value={form.confirm} onChange={set("confirm")} className="h-12" />
            </div>
          )}
          <Button type="submit" className="h-12 w-full text-base" disabled={loading}>
            {loading ? "Un momento..." : modo === "registro" ? "Crear cuenta" : modo === "login" ? "Ingresar" : "Enviar enlace"}
          </Button>
        </form>

        {modo !== "recuperar" && (
          <>
            <div className="text-muted-foreground my-4 flex items-center gap-3 text-xs">
              <span className="bg-border h-px flex-1" /> o <span className="bg-border h-px flex-1" />
            </div>
            <Button type="button" variant="outline" className="h-12 w-full" onClick={google}>
              Continuar con Google
            </Button>
          </>
        )}

        <div className="text-muted-foreground mt-6 space-y-2 text-center text-sm">
          {modo === "login" && (
            <>
              <button type="button" className="text-primary font-medium" onClick={() => setModo("recuperar")}>
                Olvidé mi contraseña
              </button>
              <p>
                ¿No tenés cuenta?{" "}
                <button type="button" className="text-primary font-medium" onClick={() => setModo("registro")}>
                  Registrate
                </button>
              </p>
            </>
          )}
          {modo !== "login" && (
            <button type="button" className="text-primary font-medium" onClick={() => setModo("login")}>
              Volver a ingresar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
