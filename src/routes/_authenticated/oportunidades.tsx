import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Megaphone, MessageSquare, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Empty, Field, SectionCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  useDismissals,
  useGuests,
  usePayments,
  useProperties,
  useReservations,
  useSave,
  usePhotos,
} from "@/lib/data";
import { useSignedPhotoUrls } from "@/lib/photos";
import { Markdown, TextSkeleton } from "@/components/Markdown";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { detectOpportunities, type Opportunity } from "@/lib/business";
import { generateMessage, generatePublication } from "@/lib/aluvia.functions";

export const Route = createFileRoute("/_authenticated/oportunidades")({
  head: () => ({
    meta: [
      { title: "Oportunidades — Aluvia AI" },
      { name: "description", content: "La IA analiza tus datos reales y detecta fechas vacías, baja ocupación y pagos pendientes." },
      { property: "og:title", content: "Oportunidades — Aluvia AI" },
      { property: "og:description", content: "Detectá y accioná oportunidades reales de tu negocio de alquiler temporario." },
    ],
  }),
  component: OpportunitiesPage,
});

const SELECT_CLASS =
  "h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

function CampaignDialog({ opp, onClose }: { opp: Opportunity; onClose: () => void }) {
  const pub = useServerFn(generatePublication);
  const msg = useServerFn(generateMessage);
  const { data: photos = [] } = usePhotos();
  const { data: guests = [] } = useGuests();
  const savePublication = useSave("publications", ["publications"]);
  const saveMessage = useSave("messages", ["messages"]);
  const [mode, setMode] = useState<"publicacion" | "mensaje">(
    opp.type === "consulta" || opp.type === "pago_pendiente" ? "mensaje" : "publicacion",
  );
  const [platform, setPlatform] = useState<"instagram" | "facebook" | "whatsapp" | "portal">("instagram");
  const [kind, setKind] = useState(opp.type === "pago_pendiente" ? "recordatorio de pago" : "seguimiento de consulta");
  const [extra, setExtra] = useState(opp.recommendation);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const propertyPhotos = photos.filter((ph) => ph.property_id === opp.propertyId);
  const mainPhoto = propertyPhotos.find((ph) => ph.is_primary) ?? propertyPhotos[0];
  const { data: photoUrls = {} } = useSignedPhotoUrls(mainPhoto ? [mainPhoto.storage_path] : []);
  const mainPhotoUrl = mainPhoto ? photoUrls[mainPhoto.storage_path] : undefined;
  const guestPhone = guests.find((g) => g.id === opp.guestId)?.phone;

  async function run() {
    setLoading(true);
    setResult("");
    try {
      if (mode === "publicacion") {
        if (!opp.propertyId) throw new Error("Esta oportunidad no tiene una propiedad asociada");
        const r = await pub({
          data: { propertyId: opp.propertyId, platform, objective: opp.type, extra },
        });
        setResult(r.content);
      } else {
        const r = await msg({
          data: {
            kind,
            reservationId: opp.reservationId ?? null,
            propertyId: opp.propertyId ?? null,
            extra,
          },
        });
        setResult(r.content);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo generar el contenido");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (mode === "publicacion") {
      await savePublication.mutateAsync({
        values: { property_id: opp.propertyId ?? null, platform, objective: opp.type, content: result },
      });
      toast.success("Publicación guardada");
    } else {
      await saveMessage.mutateAsync({
        values: {
          guest_id: opp.guestId ?? null,
          reservation_id: opp.reservationId ?? null,
          property_id: opp.propertyId ?? null,
          kind,
          channel: "whatsapp",
          content: result,
        },
      });
      toast.success("Mensaje guardado");
    }
    onClose();
  }

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Campaña: {opp.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button variant={mode === "publicacion" ? "default" : "outline"} className="h-11" onClick={() => setMode("publicacion")}>
              <Megaphone className="size-4" /> Publicación
            </Button>
            <Button variant={mode === "mensaje" ? "default" : "outline"} className="h-11" onClick={() => setMode("mensaje")}>
              <MessageSquare className="size-4" /> Mensaje
            </Button>
          </div>

          {mode === "publicacion" ? (
            <Field label="Plataforma">
              <select className={SELECT_CLASS} value={platform} onChange={(e) => setPlatform(e.target.value as typeof platform)}>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="whatsapp">WhatsApp / Estado</option>
                <option value="portal">Portal de alquileres</option>
              </select>
            </Field>
          ) : (
            <Field label="Tipo de mensaje">
              <select className={SELECT_CLASS} value={kind} onChange={(e) => setKind(e.target.value)}>
                {["seguimiento de consulta", "recordatorio de pago", "bienvenida", "check-in", "check-out", "reseña", "promoción"].map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <Field label="Indicaciones para la IA">
            <Textarea rows={3} value={extra} onChange={(e) => setExtra(e.target.value)} />
          </Field>

          <Button className="h-12 w-full" onClick={run} disabled={loading}>
            <Sparkles className="size-4" /> {loading ? "Generando..." : "Generar con IA"}
          </Button>

          {loading && (
            <div className="bg-muted rounded-xl p-4">
              <TextSkeleton lines={6} />
            </div>
          )}

          {result && (
            <div className="space-y-3">
              <div className="overflow-hidden rounded-2xl border">
                {mode === "publicacion" && mainPhotoUrl && (
                  <img src={mainPhotoUrl} alt="Foto de la propiedad" className="aspect-square w-full object-cover" loading="lazy" />
                )}
                <div className="bg-card p-3 text-sm">
                  <Markdown content={result} />
                </div>
              </div>
              <Textarea rows={10} value={result} onChange={(e) => setResult(e.target.value)} />
              <div className="grid gap-2 sm:grid-cols-3">
                <Button
                  variant="outline"
                  className="h-11"
                  onClick={() => {
                    navigator.clipboard.writeText(result);
                    toast.success("Copiado");
                  }}
                >
                  <Copy className="size-4" /> Copiar
                </Button>
                <WhatsAppButton phone={guestPhone} text={result} />
                <Button className="h-11" onClick={save}>
                  Guardar
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function OpportunitiesPage() {
  const { data: properties = [] } = useProperties();
  const { data: reservations = [] } = useReservations();
  const { data: payments = [] } = usePayments();
  const { data: guests = [] } = useGuests();
  const { data: dismissals = [] } = useDismissals();
  const saveDismissal = useSave("opportunity_dismissals", ["dismissals"]);
  const [active, setActive] = useState<Opportunity | null>(null);

  const opportunities = detectOpportunities({
    properties,
    reservations,
    payments,
    guests,
    dismissed: dismissals as unknown as string[],
  });

  return (
    <AppShell title="Oportunidades">
      {active && <CampaignDialog opp={active} onClose={() => setActive(null)} />}
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Cada oportunidad se detecta analizando tus datos reales: reservas, calendario y pagos registrados.
        </p>
        {opportunities.length === 0 ? (
          <Empty text="No detectamos oportunidades pendientes. Todo bajo control." />
        ) : (
          opportunities.map((o) => (
            <SectionCard
              key={o.key}
              title={o.title}
              action={
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8"
                  aria-label="Descartar"
                  onClick={() => saveDismissal.mutate({ values: { opportunity_key: o.key } })}
                >
                  <X className="size-4" />
                </Button>
              }
            >
              <dl className="space-y-2 text-sm">
                <Row label="Qué detectamos" value={o.detected} />
                <Row label="Con qué datos" value={o.data} />
                <Row label="Por qué importa" value={o.why} />
                <Row label="Qué recomendamos" value={o.recommendation} />
              </dl>
              <Button className="mt-4 h-11 w-full" onClick={() => setActive(o)}>
                <Sparkles className="size-4" /> Crear campaña
              </Button>
            </SectionCard>
          ))
        )}
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
