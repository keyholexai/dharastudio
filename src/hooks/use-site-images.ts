import { useQuery } from "@tanstack/react-query";

import { fetchSiteImages, type SiteImage } from "@/lib/site-images";

export function useSiteImages(placement?: "home" | "gallery" | "experience") {
  return useQuery<SiteImage[]>({
    queryKey: ["site-images", placement ?? "all"],
    queryFn: () => fetchSiteImages(placement),
    staleTime: 60_000,
    // Signed image links expire after 6 hours — refresh them well before that
    // so photos never break on any host (Lovable, Vercel, etc.).
    refetchInterval: 1000 * 60 * 60 * 4,
    refetchOnWindowFocus: true,
    retry: 3,
  });
}
