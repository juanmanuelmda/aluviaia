import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Empty, Field } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useProperties, useSave, type Property } from "@/lib/data";
import { money } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/propiedades/")({
  head: () => ({
    meta: [
      { title: "Propiedades — Aluvia AI" },
      { name: "description", content: "Creá y administrá las propiedades de tu negocio de alquiler temporario." },
      { property: "og:title", content: "Propiedades — Aluvia AI" },
      { property: "og:description", content: "Todas tus propiedades, con precios, capacidad y fotos reales." },
    ],
  }),
  component: PropertiesPage,
});

const EMPTY = {
  name: "",
  description: "",
  address: "",
  city: "",
  province: "",
  country: "Argentina",
  capacity: 2,
  bedrooms: 1,
  beds: 1,
  bathrooms: 1,
  services: "",
  amenities: "",
  rules: "",
  check_in_time: "14:00",
  check_out_time: "10:00",
  base_price: 0,
  extra_info: "",
  active: true,
};

export function PropertyForm({
  open,
  onOpenChange,
  property,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  property?: Property | null;
}) {
  const save = useSave("properties", ["properties"]);
  const [form, setForm] = useState(() =>
    property
      ? {
          ...EMPTY,
          ...property,
          services: (property.services ?? []).join(", "),
          amenities: (property.amenities ?? []).join(", "),
        }
      : EMPTY,
  );

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const values = {
      name: form.name,
      description: form.description,
      address: form.address,
      city: form.city,
      province: form.province,
      country: form.country,
      capacity: Number(form.capacity),
      bedrooms: Number(form.bedrooms),
      beds: Number(form.beds),
      bathrooms: Number(form.bathrooms),
      services: form.services.split(",").map((s) => s.trim()).filter(Boolean),
      amenities: form.amenities.split(",").map((s) => s.trim()).filter(Boolean),
      rules: form.rules,
      check_in_time: form.check_in_time,
      check_out_time: form.check_out_time,
      base_price: Number(form.base_price),
      extra_info: form.extra_info,
      active: form.active,
    };
    try {
      await save.mutateAsync({ id: property?.id, values });
      toast.success(property ? "Propiedad actualizada" : "Propiedad creada");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo guardar");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{property ? "Editar propiedad" : "Nueva propiedad"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Nombre">
            <Input required value={form.name} onChange={(e) => set("name", e.target.value)} className="h-11" />
          </Field>
          <Field label="Descripción">
            <Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </Field>
          <Field label="Dirección">
            <Input value={form.address} onChange={(e) => set("address", e.target.value)} className="h-11" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Localidad">
              <Input value={form.city} onChange={(e) => set("city", e.target.value)} className="h-11" />
            </Field>
            <Field label="Provincia">
              <Input value={form.province} onChange={(e) => set("province", e.target.value)} className="h-11" />
            </Field>
            <Field label="País">
              <Input value={form.country} onChange={(e) => set("country", e.target.value)} className="h-11" />
            </Field>
            <Field label="Capacidad">
              <Input type="number" min={1} value={form.capacity} onChange={(e) => set("capacity", e.target.value)} className="h-11" />
            </Field>
            <Field label="Dormitorios">
              <Input type="number" min={0} value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} className="h-11" />
            </Field>
            <Field label="Camas">
              <Input type="number" min={0} value={form.beds} onChange={(e) => set("beds", e.target.value)} className="h-11" />
            </Field>
            <Field label="Baños">
              <Input type="number" min={0} value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} className="h-11" />
            </Field>
            <Field label="Precio base por noche">
              <Input type="number" min={0} value={form.base_price} onChange={(e) => set("base_price", e.target.value)} className="h-11" />
            </Field>
            <Field label="Check-in">
              <Input value={form.check_in_time} onChange={(e) => set("check_in_time", e.target.value)} className="h-11" />
            </Field>
            <Field label="Check-out">
              <Input value={form.check_out_time} onChange={(e) => set("check_out_time", e.target.value)} className="h-11" />
            </Field>
          </div>
          <Field label="Servicios (separados por coma)">
            <Input value={form.services} onChange={(e) => set("services", e.target.value)} className="h-11" placeholder="Wifi, Cochera, Aire acondicionado" />
          </Field>
          <Field label="Comodidades (separadas por coma)">
            <Input value={form.amenities} onChange={(e) => set("amenities", e.target.value)} className="h-11" placeholder="Pileta, Parrilla, Vista al mar" />
          </Field>
          <Field label="Reglas">
            <Textarea rows={2} value={form.rules} onChange={(e) => set("rules", e.target.value)} />
          </Field>
          <Field label="Información adicional">
            <Textarea rows={2} value={form.extra_info} onChange={(e) => set("extra_info", e.target.value)} />
          </Field>
          <label className="flex items-center justify-between rounded-xl border px-3 py-3">
            <span className="text-sm font-medium">Propiedad activa</span>
            <Switch checked={form.active} onCheckedChange={(v) => set("active", v)} />
          </label>
          <Button type="submit" className="h-12 w-full" disabled={save.isPending}>
            {save.isPending ? "Guardando..." : "Guardar propiedad"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PropertiesPage() {
  const { data: properties = [], isLoading } = useProperties();
  const [open, setOpen] = useState(false);

  return (
    <AppShell
      title="Propiedades"
      action={
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Nueva
        </Button>
      }
    >
      {open && <PropertyForm open={open} onOpenChange={setOpen} />}
      {isLoading ? (
        <Empty text="Cargando..." />
      ) : properties.length === 0 ? (
        <div className="bg-card shadow-soft rounded-2xl border p-8 text-center">
          <p className="font-semibold">Todavía no cargaste propiedades</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Cargá tu primera propiedad para empezar a registrar reservas y pagos.
          </p>
          <Button className="mt-5 h-12" onClick={() => setOpen(true)}>
            <Plus className="size-4" /> Crear propiedad
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <Link
              key={p.id}
              to="/propiedades/$id"
              params={{ id: p.id }}
              className="bg-card shadow-soft hover:shadow-lift rounded-2xl border p-4 transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold">{p.name}</h2>
                {!p.active && (
                  <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[11px]">Inactiva</span>
                )}
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                {[p.city, p.province].filter(Boolean).join(", ") || "Sin ubicación"}
              </p>
              <p className="text-muted-foreground mt-2 text-xs">
                {p.capacity} huéspedes · {p.bedrooms} dorm · {p.bathrooms} baños
              </p>
              <p className="text-primary mt-3 font-bold">{money(p.base_price)} <span className="text-muted-foreground text-xs font-normal">/ noche</span></p>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
