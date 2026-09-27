import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Adds viewport reveals (images + major headings) to the public site.
 * Pure enhancement: classes are applied after hydration, so markup is unchanged.
 */
export function MotionLayer() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const root = document.documentElement;
    if (pathname.startsWith("/admin")) {
      root.classList.remove("dhara-motion");
      return;
    }
    root.classList.add("dhara-motion");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    const setup = () => {
      document.querySelectorAll<HTMLImageElement>("main img:not([data-motion])").forEach((img) => {
        img.dataset["motion"] = "1";
        // Hero crossfade images manage their own opacity.
        if (img.classList.contains("absolute")) return;
        img.parentElement?.classList.add("dhara-img-wrap");
        img.classList.add("dhara-img-reveal");
        observer.observe(img);
      });
      document.querySelectorAll<HTMLElement>("main h2:not([data-motion])").forEach((h) => {
        h.dataset["motion"] = "1";
        if (h.classList.contains("dhara-reveal")) return;
        h.classList.add("dhara-heading-reveal");
        observer.observe(h);
      });
    };

    setup();
    const mutation = new MutationObserver(setup);
    mutation.observe(document.body, { childList: true, subtree: true });
    return () => {
      mutation.disconnect();
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
