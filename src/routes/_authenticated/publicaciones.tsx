import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Empty, Field, SectionCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useProperties, usePhotos, usePublications, useSave } from "@/lib/data";
import { useSignedPhotoUrls } from "@/lib/photos";
import { Markdown, TextSkeleton } from "@/components/Markdown";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { generatePublication } from "@/lib/aluvia.functions";
import { fmtDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/publicaciones")({
  head: () => ({
    meta: [
      { title: "Publicaciones — Aluvia AI" },
      { name: "description", content: "Generá publicaciones para Instagram, Facebook y portales con los datos reales de tus propiedades." },
      { property: "og:title", content: "Publicaciones — Aluvia AI" },
      { property: "og:description", content: "Contenido de marketing listo para publicar, sin inventar datos." },
    ],
  }),
  component: PublicationsPage,
});

const SELECT_CLASS =
  "h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

function PublicationsPage() {
  const { data: properties = [] } = useProperties();
  const { data: publications = [] } = usePublications();
  const { data: photos = [] } = usePhotos();
  const save = useSave("publications", ["publications"]);
  const gen = useServerFn(generatePublication);
  const [propertyId, setPropertyId] = useState("");
  const [platform, setPlatform] = useState<"instagram" | "facebook" | "whatsapp" | "portal">("instagram");
  const [objective, setObjective] = useState("llenar fechas vacías");
  const [extra, setExtra] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const activeProperty = propertyId || properties[0]?.id || "";
  const propertyPhotos = photos.filter((ph) => ph.property_id === activeProperty);
  const mainPhoto = propertyPhotos.find((ph) => ph.is_primary) ?? propertyPhotos[0];
  const { data: photoUrls = {} } = useSignedPhotoUrls(mainPhoto ? [mainPhoto.storage_path] : []);
  const mainPhotoUrl = mainPhoto ? photoUrls[mainPhoto.storage_path] : undefined;
  const propertyName = properties.find((p) => p.id === activeProperty)?.name ?? "";

  async function run() {
    if (!activeProperty) {
      toast.error("Cargá una propiedad primero");
      return;
    }
    setLoading(true);
    try {
      const r = await gen({ data: { propertyId: activeProperty, platform, objective, extra } });
      setResult(r.content);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo generar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell title="Publicaciones">
      <div className="space-y-4">
        <SectionCard title="Generar publicación">
          <div className="space-y-3">
            <Field label="Propiedad">
              <select className={SELECT_CLASS} value={activeProperty} onChange={(e) => setPropertyId(e.target.value)}>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Plataforma">
              <select className={SELECT_CLASS} value={platform} onChange={(e) => setPlatform(e.target.value as typeof platform)}>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="whatsapp">WhatsApp / Estado</option>
                <option value="portal">Portal de alquileres</option>
              </select>
            </Field>
            <Field label="Objetivo">
              <select className={SELECT_CLASS} value={objective} onChange={(e) => setObjective(e.target.value)}>
                {["llenar fechas vacías", "promoción de temporada", "última disponibilidad", "presentación de la propiedad"].map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Indicaciones extra">
              <Textarea rows={2} value={extra} onChange={(e) => setExtra(e.target.value)} />
            </Field>
            <Button className="h-12 w-full" onClick={run} disabled={loading}>
              <Sparkles className="size-4" /> {loading ? "Generando..." : "Generar con IA"}
            </Button>
            {loading && !result && (
              <div className="bg-muted rounded-xl p-4">
                <TextSkeleton lines={6} />
              </div>
            )}
            {result && (
              <div className="space-y-2">
                <div className="overflow-hidden rounded-2xl border">
                  {mainPhotoUrl ? (
                    <img
                      src={mainPhotoUrl}
                      alt={`Foto principal de ${propertyName}`}
                      className="aspect-square w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="bg-muted text-muted-foreground flex aspect-square w-full items-center justify-center px-6 text-center text-xs">
                      Subí una foto a la propiedad para adjuntarla a la publicación
                    </div>
                  )}
                  <div className="bg-card p-3 text-sm">
                    <p className="text-muted-foreground mb-1 text-xs font-semibold capitalize">
                      {platform} · {propertyName}
                    </p>
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
                  <WhatsAppButton text={result} />
                  <Button
                    className="h-11"
                    onClick={async () => {
                      await save.mutateAsync({
                        values: { property_id: activeProperty, platform, objective, content: result },
                      });
                      toast.success("Publicación guardada");
                      setResult("");
                    }}
                  >
                    Guardar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Publicaciones guardadas">
          {publications.length === 0 ? (
            <Empty text="Todavía no guardaste publicaciones." />
          ) : (
            <ul className="space-y-3">
              {publications.map((p) => (
                <li key={p.id} className="bg-muted rounded-xl p-3 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-muted-foreground text-xs capitalize">
                      {p.platform} · {p.objective.replace(/_/g, " ")} · {fmtDate(p.created_at.slice(0, 10))}
                    </p>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8"
                        aria-label="Copiar"
                        onClick={() => {
                          navigator.clipboard.writeText(p.content);
                          toast.success("Copiado");
                        }}
                      >
                        <Copy className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive size-8"
                        aria-label="Eliminar"
                        onClick={() => save.mutate({ id: p.id, remove: true })}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <Markdown content={p.content} className="mt-2" />
                  <div className="mt-2">
                    <WhatsAppButton text={p.content} className="h-9" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}
