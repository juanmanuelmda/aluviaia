import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const PHOTO_BUCKET = "property-photos";

/** Genera URLs firmadas para las fotos privadas del usuario. */
export function useSignedPhotoUrls(paths: string[]) {
  const key = [...paths].sort().join("|");
  return useQuery({
    queryKey: ["photo-urls", key],
    enabled: paths.length > 0,
    staleTime: 1000 * 60 * 30,
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from(PHOTO_BUCKET)
        .createSignedUrls(paths, 60 * 60);
      if (error) throw error;
      const map: Record<string, string> = {};
      for (const item of data ?? []) {
        if (item.path && item.signedUrl) map[item.path] = item.signedUrl;
      }
      return map;
    },
  });
}

export async function uploadPropertyPhoto(propertyId: string, file: File) {
  const { data: userRes } = await supabase.auth.getUser();
  const uid = userRes.user!.id;
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${uid}/${propertyId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function removePhotoFile(path: string) {
  await supabase.storage.from(PHOTO_BUCKET).remove([path]);
}
