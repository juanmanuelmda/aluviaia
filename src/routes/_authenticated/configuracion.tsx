import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Field, SectionCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useSave } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { DemoDataSection } from "@/components/DemoDataSection";
import { PlansSection } from "@/components/PlansSection";


export const Route = createFileRoute("/_authenticated/configuracion")({
  head: () => ({
    meta: [
      { title: "Configuración — Aluvia AI" },
      { name: "description", content: "Datos de tu cuenta y de tu negocio de alquileres temporarios." },
      { property: "og:title", content: "Configuración — Aluvia AI" },
      { property: "og:description", content: "Actualizá tu perfil, tu negocio y cerrá sesión de forma segura." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const save = useSave("profiles", ["profile"]);
  const [form, setForm] = useState({ first_name: "", last_name: "" });
  const [ready, setReady] = useState(false);

  if (profile && !ready) {
    setReady(true);
    setForm({
      first_name: profile.first_name ?? "",
      last_name: profile.last_name ?? "",
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await save.mutateAsync({ id: user?.id, values: form });
    toast.success("Datos actualizados");
  }

  return (
    <AppShell title="Configuración">
      <div className="space-y-4">
        <SectionCard title="Tu cuenta">
          <form onSubmit={submit} className="space-y-3">
            <Field label="Email">
              <Input value={user?.email ?? ""} disabled className="h-11" />
            </Field>
            <Field label="Nombre">
              <Input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className="h-11" />
            </Field>
            <Field label="Apellido">
              <Input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className="h-11" />
            </Field>
            <Button type="submit" className="h-12 w-full" disabled={save.isPending}>
              Guardar cambios
            </Button>
          </form>
        </SectionCard>

        <PlansSection />

        <DemoDataSection />


        <SectionCard title="Sesión">
          <p className="text-muted-foreground text-sm">
            Tus datos están aislados por usuario: nadie más puede ver tus propiedades, reservas ni pagos.
          </p>
          <Button
            variant="outline"
            className="mt-4 h-11 w-full"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/";
            }}
          >
            <LogOut className="size-4" /> Cerrar sesión
          </Button>
        </SectionCard>
      </div>
    </AppShell>
  );
}
