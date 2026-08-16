import { Check } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { SectionCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import { useProfile, useSave, useSubscription } from "@/lib/data";
import { fmtDate } from "@/lib/format";

type Plan = {
  key: string;
  name: string;
  price: string;
  detail: string;
  features: string[];
};

export const PLANS: Plan[] = [
  {
    key: "free",
    name: "Gratis",
    price: "$0",
    detail: "Para empezar a ordenar tu operación.",
    features: ["Hasta 2 propiedades", "Reservas y huéspedes ilimitados", "Calendario y pagos básicos"],
  },
  {
    key: "pro",
    name: "Pro",
    price: "$14.900 / mes",
    detail: "Para quien vive de sus alquileres.",
    features: ["Hasta 10 propiedades", "Asistente IA y oportunidades", "Publicaciones y mensajes con IA", "Finanzas con filtros por período"],
  },
  {
    key: "business",
    name: "Business",
    price: "$29.900 / mes",
    detail: "Para administradores con varias unidades.",
    features: ["Propiedades ilimitadas", "Todo lo de Pro", "Reportes avanzados", "Soporte prioritario"],
  },
];

const PLAN_LABEL: Record<string, string> = { free: "Gratis", pro: "Pro", business: "Business" };

export function PlansSection() {
  const { data: profile } = useProfile();
  const { data: subscription } = useSubscription();
  const saveProfile = useSave("profiles", ["profile"]);
  const saveSub = useSave("subscriptions", ["subscription"]);
  const qc = useQueryClient();

  const current = profile?.plan ?? "free";

  async function choose(plan: string) {
    if (plan === current) return;
    const now = new Date();
    const renews = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    try {
      await saveProfile.mutateAsync({ id: profile?.id, values: { plan } });
      await saveSub.mutateAsync({
        id: subscription?.id,
        values: {
          plan,
          status: "active",
          started_at: now.toISOString(),
          renews_at: plan === "free" ? null : renews.toISOString(),
          payment_status: plan === "free" ? "no_aplica" : "pendiente",
        },
      });
      qc.invalidateQueries({ queryKey: ["subscription"] });
      toast.success(
        plan === "free" ? "Volviste al plan Gratis" : `Plan ${PLAN_LABEL[plan]} activado. El cobro se habilita en el próximo paso.`,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No pudimos cambiar el plan");
    }
  }

  return (
    <SectionCard title="Tu plan">
      <div className="bg-muted mb-4 rounded-xl px-3 py-2 text-sm">
        <p className="font-semibold">Plan actual: {PLAN_LABEL[current] ?? current}</p>
        <p className="text-muted-foreground text-xs">
          {subscription?.renews_at
            ? `Renueva el ${fmtDate(subscription.renews_at.slice(0, 10))} · Pago: ${subscription.payment_status ?? "-"}`
            : "Sin cobros programados."}
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {PLANS.map((p) => {
          const active = p.key === current;
          return (
            <div
              key={p.key}
              className={`rounded-2xl border p-4 ${active ? "border-primary bg-primary-soft" : "bg-card"}`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-bold">{p.name}</p>
                <p className="text-sm font-semibold">{p.price}</p>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">{p.detail}</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="text-success mt-0.5 size-4 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={active ? "outline" : "default"}
                className="mt-4 h-11 w-full"
                disabled={active || saveProfile.isPending || saveSub.isPending}
                onClick={() => choose(p.key)}
              >
                {active ? "Plan actual" : `Elegir ${p.name}`}
              </Button>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
