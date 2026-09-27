import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

import { naturalPhotoFrameClass } from "@/lib/photo-frame";

export type DhaRaPath = "/" | "/about" | "/work" | "/experience" | "/contact";

export const siteNavItems: Array<{ label: string; to: DhaRaPath }> = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Work", to: "/work" },
  { label: "Experience", to: "/experience" },
  { label: "Contact", to: "/contact" },
];

export function DhaRaMediaFrame({
  number,
  type,
  format,
  className = "",
  label = "Intentional photography media placeholder",
  src,
  alt,
}: {
  number?: string;
  type?: string;
  format?: string;
  className?: string;
  label?: string;
  src?: string | undefined;
  alt?: string | undefined;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${naturalPhotoFrameClass(className)}`}>
        <img src={src} alt={alt ?? type ?? "DhaRa photography"} className="block h-auto w-full" loading="lazy" decoding="async" />
      </div>
    );
  }

  return (
    <div
      className={`dhara-media-frame relative grid place-items-center overflow-hidden ${className}`}
      role="img"
      aria-label={label}
    >
      <span className="sr-only">Real DhaRa photography will be added here.</span>
      {number ? (
        <span className="absolute left-3 top-3 font-serif text-[11px] text-dhara-ink/35">{number}</span>
      ) : null}
      {format ? (
        <span className="absolute right-3 top-3 font-serif text-[11px] text-dhara-ink/35">{format}</span>
      ) : null}
      {type ? (
        <span className="absolute bottom-3 left-3 text-[9px] uppercase tracking-[0.24em] text-dhara-ink/45">
          {type}
        </span>
      ) : null}
      <span className="absolute bottom-3 right-3 text-[9px] uppercase tracking-[0.24em] text-dhara-champagne">
        DhaRa
      </span>
    </div>
  );
}

export function DhaRaHeader({ activePath }: { activePath: DhaRaPath }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-dhara-ink/10 bg-dhara-ivory/95 backdrop-blur-sm lg:static lg:z-auto lg:backdrop-blur-none">
      <div className="dhara-container grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-5 lg:flex lg:justify-between">
        <Link to="/" className="group flex min-w-0 items-baseline gap-2" aria-label="DhaRa Studios & Films home">
          <span className="font-serif text-lg tracking-tight">DhaRa</span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-dhara-mist">Studios &amp; Films</span>
        </Link>

        <nav className="hidden items-center gap-7 text-[11px] uppercase tracking-[0.2em] text-dhara-ink/70 lg:flex" aria-label="Primary navigation">
          {siteNavItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={item.to === activePath ? "text-dhara-ink" : "transition-colors hover:text-dhara-ink"}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="ml-2 border border-dhara-ink/30 px-4 py-2 transition-colors hover:border-dhara-ink hover:bg-dhara-ink hover:text-dhara-ivory"
          >
            Book your date
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className="text-[11px] uppercase tracking-[0.22em] lg:hidden"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>
      {menuOpen ? (
        <nav id="mobile-navigation" className="max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-dhara-ink/10 bg-dhara-ivory px-6 py-5 lg:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-4 text-[11px] uppercase tracking-[0.2em] text-dhara-ink/70">
            {siteNavItems.map((item) => (
              <Link key={item.label} to={item.to} onClick={() => setMenuOpen(false)} className="transition-colors hover:text-dhara-ink">
                {item.label}
              </Link>
            ))}
            <Link to="/contact" onClick={() => setMenuOpen(false)} className="pt-1 text-dhara-champagne">
              Book your date
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

export function DhaRaFooter() {
  return (
    <footer className="border-t border-dhara-ink/10">
      <div className="dhara-container grid grid-cols-2 gap-x-8 gap-y-10 py-14 md:grid-cols-12 md:gap-10">
        <div className="col-span-2 min-w-0 md:col-span-5">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="font-serif text-lg tracking-tight">DhaRa</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-dhara-mist">Studios &amp; Films</span>
          </div>
          <p className="mt-5 max-w-[40ch] text-[13px] leading-relaxed text-dhara-ink/55">LET THE FEELING FLOW</p>
        </div>
        <div className="min-w-0 md:col-span-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-dhara-mist">Navigate</span>
          <ul className="mt-4 space-y-2 text-[13px] text-dhara-ink/70">
            {siteNavItems.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="transition-colors hover:text-dhara-ink">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0 md:col-span-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-dhara-mist">Connect</span>
          <ul className="mt-4 space-y-2 text-[13px] text-dhara-ink/70">
            <li><a href="#" className="transition-colors hover:text-dhara-ink">Instagram</a></li>
            <li><a href="#" className="transition-colors hover:text-dhara-ink">YouTube</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-dhara-ink/10">
        <div className="dhara-container flex flex-col gap-3 py-5 text-[10px] uppercase tracking-[0.24em] text-dhara-mist sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 DhaRa Studios &amp; Films. All Rights Reserved.</span>
          <span>LET THE FEELING FLOW</span>
        </div>
      </div>
    </footer>
  );
}

export function DhaRaPage({ activePath, children }: { activePath: DhaRaPath; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-dhara-ivory text-dhara-ink antialiased">
      <DhaRaHeader activePath={activePath} />
      {children}
      <DhaRaFooter />
    </main>
  );
}

export function EditorialArrowLink({ to, children }: { to: DhaRaPath | `${DhaRaPath}#${string}`; children: ReactNode }) {
  const hashIndex = to.indexOf("#");
  const pathname = (hashIndex === -1 ? to : to.slice(0, hashIndex)) as DhaRaPath;
  const hash = hashIndex === -1 ? undefined : to.slice(hashIndex + 1);

  return (
    <Link
      to={pathname}
      {...(hash ? { hash } : {})}
      className="inline-flex items-center gap-3 border-b border-dhara-ink/30 pb-1 text-[11px] uppercase tracking-[0.22em] text-dhara-ink/70 transition-colors hover:border-dhara-champagne hover:text-dhara-ink"
    >
      {children} <span aria-hidden="true">→</span>
    </Link>
  );
}