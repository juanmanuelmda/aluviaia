import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, ImagePlus, Pencil, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Empty, SectionCard, StatCard, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { PropertyForm } from "./propiedades.index";
import {
  useGuests,
  usePayments,
  usePhotos,
  useProperties,
  useReservations,
  useSave,
} from "@/lib/data";
import { occupancyRate, paidFor } from "@/lib/business";
import { addDays, fmtDate, money } from "@/lib/format";
import { removePhotoFile, uploadPropertyPhoto, useSignedPhotoUrls } from "@/lib/photos";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/propiedades/$id")({
  head: () => ({
    meta: [
      { title: "Detalle de propiedad — Aluvia AI" },
      { name: "description", content: "Ficha completa de la propiedad: datos, fotos, ocupación y reservas." },
      { property: "og:title", content: "Detalle de propiedad — Aluvia AI" },
      { property: "og:description", content: "Datos, fotos reales, ocupación e ingresos de tu propiedad." },
    ],
  }),
  component: PropertyDetail,
});

function PropertyDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: properties = [] } = useProperties();
  const { data: photos = [] } = usePhotos();
  const { data: reservations = [] } = useReservations();
  const { data: payments = [] } = usePayments();
  const { data: guests = [] } = useGuests();
  const savePhoto = useSave("property_photos", ["photos"]);
  const saveProperty = useSave("properties", ["properties"]);
  const fileRef = useRef<HTMLInputElement>(null);
  const [edit, setEdit] = useState(false);
  const [uploading, setUploading] = useState(false);

  const property = properties.find((p) => p.id === id);
  const propPhotos = photos.filter((p) => p.property_id === id);
  const { data: urls = {} } = useSignedPhotoUrls(propPhotos.map((p) => p.storage_path));
  const propRes = reservations.filter((r) => r.property_id === id);

  if (!property) {
    return (
      <AppShell title="Propiedad">
        <Empty text="No encontramos esta propiedad." />
      </AppShell>
    );
  }

  const occ = occupancyRate(property.id, reservations, new Date(), addDays(new Date(), 30));
  const income = propRes.reduce((s, r) => s + paidFor(r.id, payments), 0);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const [i, file] of files.entries()) {
        const path = await uploadPropertyPhoto(id, file);
        await savePhoto.mutateAsync({
          values: {
            property_id: id,
            storage_path: path,
            position: propPhotos.length + i,
            is_primary: propPhotos.length === 0 && i === 0,
          },
        });
      }
      qc.invalidateQueries({ queryKey: ["photo-urls"] });
      toast.success("Fotos subidas");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudieron subir las fotos");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function makePrimary(photoId: string) {
    for (const p of propPhotos) {
      if (p.is_primary && p.id !== photoId) await savePhoto.mutateAsync({ id: p.id, values: { is_primary: false } });
    }
    await savePhoto.mutateAsync({ id: photoId, values: { is_primary: true } });
  }

  async function move(photoId: string, dir: -1 | 1) {
    const idx = propPhotos.findIndex((p) => p.id === photoId);
    const target = propPhotos[idx + dir];
    const current = propPhotos[idx];
    if (!target || !current) return;
    await savePhoto.mutateAsync({ id: current.id, values: { position: target.position } });
    await savePhoto.mutateAsync({ id: target.id, values: { position: current.position } });
  }

  async function deletePhoto(photoId: string, path: string) {
    if (!confirm("¿Eliminar esta foto?")) return;
    await removePhotoFile(path);
    await savePhoto.mutateAsync({ id: photoId, remove: true });
    toast.success("Foto eliminada");
  }

  async function deleteProperty() {
    if (!confirm(`¿Eliminar "${property!.name}"? Se eliminarán sus reservas y fotos asociadas.`)) return;
    await saveProperty.mutateAsync({ id: property!.id, remove: true });
    toast.success("Propiedad eliminada");
    navigate({ to: "/propiedades" });
  }

  return (
    <AppShell
      title={property.name}
      action={
        <Button size="sm" variant="outline" onClick={() => setEdit(true)}>
          <Pencil className="size-4" /> Editar
        </Button>
      }
    >
      {edit && <PropertyForm open={edit} onOpenChange={setEdit} property={property} />}
      <div className="space-y-5">
        <Link to="/propiedades" className="text-muted-foreground inline-flex items-center gap-1 text-sm">
          <ArrowLeft className="size-4" /> Volver a propiedades
        </Link>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Ocupación 30 días" value={`${Math.round(occ.rate * 100)}%`} hint={`${occ.busy} de ${occ.total} noches`} />
          <StatCard label="Reservas" value={String(propRes.filter((r) => r.status !== "cancelada").length)} />
          <StatCard label="Cobrado" value={money(income)} tone="success" />
          <StatCard label="Precio base" value={money(property.base_price)} />
        </div>

        <SectionCard
          title="Fotografías"
          action={
            <>
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onFiles} />
              <Button size="sm" variant="outline" disabled={uploading} onClick={() => fileRef.current?.click()}>
                <ImagePlus className="size-4" /> {uploading ? "Subiendo..." : "Subir"}
              </Button>
            </>
          }
        >
          {propPhotos.length === 0 ? (
            <Empty text="Todavía no subiste fotos de esta propiedad." />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {propPhotos.map((photo, i) => (
                <div key={photo.id} className="group relative overflow-hidden rounded-xl border">
                  {urls[photo.storage_path] ? (
                    <img src={urls[photo.storage_path]} alt={`Foto de ${property.name}`} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="bg-muted aspect-[4/3] w-full" />
                  )}
                  {photo.is_primary && (
                    <span className="bg-primary text-primary-foreground absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-semibold">
                      Principal
                    </span>
                  )}
                  <div className="flex items-center justify-between gap-1 p-1.5">
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="size-8" disabled={i === 0} onClick={() => move(photo.id, -1)}>
                        ←
                      </Button>
                      <Button size="icon" variant="ghost" className="size-8" disabled={i === propPhotos.length - 1} onClick={() => move(photo.id, 1)}>
                        →
                      </Button>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="size-8" onClick={() => makePrimary(photo.id)} aria-label="Marcar como principal">
                        <Star className="size-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive size-8" onClick={() => deletePhoto(photo.id, photo.storage_path)} aria-label="Eliminar foto">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Datos de la propiedad">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <Info label="Dirección" value={[property.address, property.city, property.province, property.country].filter(Boolean).join(", ")} />
            <Info label="Capacidad" value={`${property.capacity} huéspedes`} />
            <Info label="Distribución" value={`${property.bedrooms} dorm · ${property.beds} camas · ${property.bathrooms} baños`} />
            <Info label="Horarios" value={`Check-in ${property.check_in_time} · Check-out ${property.check_out_time}`} />
            <Info label="Servicios" value={(property.services ?? []).join(", ") || "-"} />
            <Info label="Comodidades" value={(property.amenities ?? []).join(", ") || "-"} />
            <Info label="Reglas" value={property.rules || "-"} />
            <Info label="Información adicional" value={property.extra_info || "-"} />
            <Info label="Descripción" value={property.description || "-"} />
          </dl>
        </SectionCard>

        <SectionCard title="Reservas de esta propiedad">
          {propRes.length === 0 ? (
            <Empty text="Sin reservas registradas." />
          ) : (
            <ul className="divide-y">
              {propRes.map((r) => {
                const g = guests.find((x) => x.id === r.guest_id);
                return (
                  <li key={r.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{g ? `${g.first_name} ${g.last_name}` : "Sin huésped"}</p>
                      <p className="text-muted-foreground text-xs">
                        {fmtDate(r.check_in)} → {fmtDate(r.check_out)}
                      </p>
                    </div>
                    <StatusBadge status={r.status} />
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>

        <Button variant="outline" className="text-destructive w-full" onClick={deleteProperty}>
          <Trash2 className="size-4" /> Eliminar propiedad
        </Button>
      </div>
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
