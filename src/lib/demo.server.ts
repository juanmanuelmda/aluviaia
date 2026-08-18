import type { SupabaseClient } from "@supabase/supabase-js";
import { buildDemoScenario } from "./demo.data";
import { DEMO_PHOTOS } from "./demo.photos";

// Cliente laxo: las tablas se recorren por nombre.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Db = SupabaseClient<any, any, any>;

const PHOTO_BUCKET = "property-photos";

const DEMO_TABLES = [
  "payments",
  "messages",
  "publications",
  "reservations",
  "calendar_blocks",
  "expenses",
  "property_photos",
  "guests",
  "properties",
  "notifications",
] as const;

export async function countDemo(supabase: Db, userId: string) {
  const counts: Record<string, number> = {};
  for (const t of DEMO_TABLES) {
    const { count, error } = await (supabase as any)
      .from(t)
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_demo", true);
    if (error) throw new Error(error.message);
    counts[t] = count ?? 0;
  }
  const total = Object.values(counts).reduce((s, n) => s + n, 0);
  return { total, counts, loaded: total > 0 };
}

export async function removeDemo(supabase: Db, userId: string) {
  // Primero los archivos del storage, después las filas.
  const { data: photos } = await (supabase as any)
    .from("property_photos")
    .select("storage_path")
    .eq("user_id", userId)
    .eq("is_demo", true);
  const paths = ((photos ?? []) as { storage_path: string }[]).map((p) => p.storage_path);
  if (paths.length > 0) await supabase.storage.from(PHOTO_BUCKET).remove(paths);

  for (const t of DEMO_TABLES) {
    const { error } = await (supabase as any)
      .from(t)
      .delete()
      .eq("user_id", userId)
      .eq("is_demo", true);
    if (error) throw new Error(`No se pudieron eliminar los datos demo de ${t}: ${error.message}`);
  }
  return { removed: true };
}

async function uploadDemoPhotos(
  supabase: Db,
  userId: string,
  propertyKey: string,
  propertyId: string,
) {
  const scenes = DEMO_PHOTOS[propertyKey] ?? [];
  const rows: Record<string, unknown>[] = [];
  for (let i = 0; i < scenes.length; i++) {
    const path = `${userId}/${propertyId}/demo-${i + 1}.svg`;
    const { error } = await supabase.storage
      .from(PHOTO_BUCKET)
      .upload(path, new Blob([scenes[i]!.svg], { type: "image/svg+xml" }), {
        contentType: "image/svg+xml",
        upsert: true,
      });
    if (error) continue; // si falla una foto, el resto del escenario sigue
    rows.push({
      user_id: userId,
      is_demo: true,
      property_id: propertyId,
      storage_path: path,
      position: i,
      is_primary: i === 0,
    });
  }
  if (rows.length > 0) await insertMany(supabase, "property_photos", rows);
}

async function insertMany(supabase: Db, table: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return [] as { id: string }[];
  const { data, error } = await (supabase as any).from(table).insert(rows).select("id");
  if (error) throw new Error(`Error creando datos demo en ${table}: ${error.message}`);
  return (data ?? []) as { id: string }[];
}

export async function createDemo(supabase: Db, userId: string) {
  const s = buildDemoScenario();
  const base = { user_id: userId, is_demo: true };

  const propertyIds = await insertMany(
    supabase,
    "properties",
    s.properties.map(({ key: _key, ...p }) => ({ ...base, ...p, active: true })),
  );
  const propMap = new Map(s.properties.map((p, i) => [p.key, propertyIds[i]!.id]));

  const guestIds = await insertMany(
    supabase,
    "guests",
    s.guests.map(({ key: _key, ...g }) => ({ ...base, ...g })),
  );
  const guestMap = new Map(s.guests.map((g, i) => [g.key, guestIds[i]!.id]));

  // Las reservas se insertan de a una: el trigger de solapamiento valida cada fila.
  const resMap = new Map<string, string>();
  for (const r of s.reservations) {
    const { key, property, guest, ...rest } = r;
    const rows = await insertMany(supabase, "reservations", [
      { ...base, ...rest, property_id: propMap.get(property), guest_id: guestMap.get(guest) },
    ]);
    resMap.set(key, rows[0]!.id);
  }

  await insertMany(
    supabase,
    "payments",
    s.payments.map(({ reservation, ...p }) => ({
      ...base,
      ...p,
      reservation_id: resMap.get(reservation),
    })),
  );

  await insertMany(
    supabase,
    "expenses",
    s.expenses.map(({ property, ...e }) => ({
      ...base,
      ...e,
      property_id: property ? propMap.get(property) : null,
    })),
  );

  await insertMany(
    supabase,
    "calendar_blocks",
    s.blocks.map(({ property, ...b }) => ({ ...base, ...b, property_id: propMap.get(property) })),
  );

  await insertMany(
    supabase,
    "publications",
    s.publications.map(({ property, ...p }) => ({
      ...base,
      ...p,
      property_id: propMap.get(property),
    })),
  );

  await insertMany(
    supabase,
    "messages",
    s.messages.map(({ property, guest, reservation, ...m }) => ({
      ...base,
      ...m,
      property_id: propMap.get(property),
      guest_id: guestMap.get(guest),
      reservation_id: resMap.get(reservation),
    })),
  );

  await insertMany(
    supabase,
    "notifications",
    s.notifications.map((n) => ({ ...base, ...n })),
  );

  return { created: true };
}
