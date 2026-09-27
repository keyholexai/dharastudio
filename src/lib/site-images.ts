import { supabase } from "@/integrations/supabase/client";

export const IMAGE_BUCKET = "site-images";

export type SiteImageRow = {
  id: string;
  placement: string;
  slot: string | null;
  category: string | null;
  storage_path: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
};

export type SiteImage = SiteImageRow & { url: string };

export const HOME_SLOTS: Array<{ key: string; label: string }> = [
  { key: "hero", label: "Home — opening frames (loop of up to 5)" },
  { key: "work-01", label: "Home — selected work 01 (wide)" },
  { key: "work-02", label: "Home — selected work 02 (portrait)" },
  { key: "work-03", label: "Home — selected work 03 (square)" },
  { key: "work-04", label: "Home — selected work 04 (landscape)" },
  { key: "work-05", label: "Home — selected work 05 (portrait)" },
  { key: "about", label: "Home — about DhaRa" },
];

export const EXPERIENCE_SECTIONS: Array<{ key: string; label: string }> = [
  { key: "weddings", label: "Experience — Weddings & Celebrations" },
  { key: "portraits", label: "Experience — Portraits & Fashion" },
  { key: "maternity", label: "Experience — Maternity" },
  { key: "baby-family", label: "Experience — Baby & Family" },
  { key: "food", label: "Experience — Food" },
  { key: "product", label: "Experience — Product" },
  { key: "corporate", label: "Experience — Corporate" },
];

export const MAX_UPLOAD_FILES = 10;

const SIGNED_URL_TTL = 60 * 60 * 6;

async function withUrls(rows: SiteImageRow[]): Promise<SiteImage[]> {
  if (rows.length === 0) return [];
  const { data, error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .createSignedUrls(rows.map((row) => row.storage_path), SIGNED_URL_TTL);
  if (error) throw error;

  const urlByPath = new Map<string, string>();
  (data ?? []).forEach((entry) => {
    if (entry.path && entry.signedUrl) urlByPath.set(entry.path, entry.signedUrl);
  });

  return rows
    .map((row) => ({ ...row, url: urlByPath.get(row.storage_path) ?? "" }))
    .filter((row) => row.url !== "");
}

export async function fetchSiteImages(placement?: "home" | "gallery" | "experience"): Promise<SiteImage[]> {
  let query = supabase
    .from("site_images")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (placement) query = query.eq("placement", placement);

  const { data, error } = await query;
  if (error) throw error;
  return withUrls((data ?? []) as SiteImageRow[]);
}

export function groupBySlot(images: SiteImage[]): Record<string, SiteImage> {
  const map: Record<string, SiteImage> = {};
  images.forEach((image) => {
    if (image.slot && !map[image.slot]) map[image.slot] = image;
  });
  return map;
}

export function groupByCategory(images: SiteImage[]): Record<string, SiteImage[]> {
  const map: Record<string, SiteImage[]> = {};
  images.forEach((image) => {
    const key = image.category ?? "uncategorised";
    map[key] = [...(map[key] ?? []), image];
  });
  return map;
}
