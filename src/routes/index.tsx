import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import aboutFounderAsset from "@/assets/dhara-about-founder.webp.asset.json";
import { useSiteImages } from "@/hooks/use-site-images";
import { naturalPhotoFrameClass } from "@/lib/photo-frame";
import { groupBySlot } from "@/lib/site-images";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DhaRa Studios & Films | Let the Feeling Flow" },
      {
        name: "description",
        content:
          "DhaRa Studios & Films creates photography and films that bring the feeling of a moment back to life.",
      },
      {
        property: "og:title",
        content: "DhaRa Studios & Films | Let the Feeling Flow",
      },
      {
        property: "og:description",
        content:
          "Photography and films created to bring you back to how it felt.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Work", to: "/work" },
  { label: "Experience", to: "/experience" },
  { label: "Contact", to: "/contact" },
];

function MediaFrame({
  number,
  type,
  format,
  className = "",
  src,
  alt,
}: {
  number?: string;
  type?: string;
  format?: string;
  className?: string;
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
      aria-label="Photography media frame"
    >
      <span className="sr-only">Photography media will be added here.</span>
      {number ? (
        <span className="absolute left-3 top-3 font-serif text-[11px] text-dhara-ink/35">
          {number}
        </span>
      ) : null}
      {format ? (
        <span className="absolute right-3 top-3 font-serif text-[11px] text-dhara-ink/35">
          {format}
        </span>
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

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: homeImages = [] } = useSiteImages("home");
  const bySlot = groupBySlot(homeImages);
  const aboutImageUrl = bySlot["about"]?.url ?? aboutFounderAsset.url;
  const aboutImageAlt = bySlot["about"]?.caption ?? "DhaRa Studios founder with camera";

  const heroImages = useMemo(
    () => homeImages.filter((image) => image.slot === "hero").slice(0, 5),
    [homeImages],
  );
  const [heroIndex, setHeroIndex] = useState(0);
  const activeHeroIndex = Math.min(heroIndex, Math.max(heroImages.length - 1, 0));

  useEffect(() => {
    if (heroImages.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setHeroIndex((index) => (index + 1) % heroImages.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [heroImages.length]);

  return (
    <main id="home" className="min-h-screen bg-dhara-ivory text-dhara-ink antialiased">
      <header className="border-b border-dhara-ink/10 bg-dhara-ivory/95">
        <div className="dhara-container grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-5 lg:flex lg:justify-between">
          <Link to="/" className="group flex min-w-0 items-baseline gap-2" aria-label="DhaRa Studios & Films home">
            <span className="font-serif text-lg tracking-tight">DhaRa</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-dhara-mist">
              Studios &amp; Films
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-[11px] uppercase tracking-[0.2em] text-dhara-ink/70 lg:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link key={item.label} to={item.to} className="transition-colors hover:text-dhara-ink">
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
          <nav id="mobile-navigation" className="border-t border-dhara-ink/10 px-6 py-5 lg:hidden" aria-label="Mobile navigation">
            <div className="flex flex-col gap-4 text-[11px] uppercase tracking-[0.2em] text-dhara-ink/70">
              {navItems.map((item) => (
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

      <section className="border-b border-dhara-ink/10" aria-labelledby="hero-heading">
        <div className="dhara-container grid grid-cols-1 gap-y-14 py-16 lg:grid-cols-12 lg:gap-x-10 lg:py-28">
          <div className="flex flex-col justify-center lg:col-span-5">
            <span className="dhara-reveal dhara-letter-reveal text-[11px] uppercase tracking-[0.34em] text-dhara-champagne">
              DhaRa Studios &amp; Films
            </span>
            <h1 id="hero-heading" className="dhara-reveal dhara-delay-1 mt-7 max-w-[10ch] font-serif text-[clamp(2.65rem,5.4vw,4.4rem)] leading-[1.04] tracking-tight">
              Stories That <span className="italic">Stay</span> With You.
            </h1>
            <p className="dhara-reveal dhara-delay-2 mt-7 max-w-[42ch] text-[15px] leading-relaxed text-dhara-ink/70">
              Photography and films created to bring you back to how it felt.
            </p>
            <div className="dhara-reveal dhara-delay-3 mt-9 flex flex-wrap items-center gap-6">
              <Link to="/work" className="inline-flex items-center gap-3 bg-dhara-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-dhara-ivory ring-1 ring-dhara-ink transition hover:ring-dhara-champagne">
                Discover our work <span aria-hidden="true">→</span>
              </Link>
              <Link to="/about" className="text-[11px] uppercase tracking-[0.22em] text-dhara-ink/60 transition-colors hover:text-dhara-ink">
                Our story <span aria-hidden="true">→</span>
              </Link>
            </div>
            <span className="mt-14 text-[10px] uppercase tracking-[0.3em] text-dhara-mist">Est. 2016</span>
          </div>

          <div className="relative lg:col-span-7">
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] text-dhara-mist">
              fig. 01 — the opening frame
            </span>
            {heroImages.length > 0 ? (
              <div className="dhara-reveal dhara-delay-2 relative aspect-[16/10] w-full overflow-hidden">
                {heroImages.map((image, index) => (
                  <img
                    key={image.id}
                    src={image.url}
                    alt={image.caption ?? "DhaRa Studios photography"}
                    decoding="async"
                    fetchPriority={index === activeHeroIndex ? "high" : "auto"}
                    loading="eager"
                    sizes="(min-width: 1024px) 58vw, calc(100vw - 3rem)"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
                      index === activeHeroIndex ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
              </div>
            ) : (
              <MediaFrame number="01" format="06" type="DhaRa — Reel" className="dhara-reveal dhara-delay-2 aspect-[16/10] w-full" />
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-dhara-ink/10" aria-label="Brand statement">
        <div className="dhara-container grid grid-cols-[auto_minmax(0,1fr)] gap-5 py-20 sm:gap-8 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-1"><span className="text-[10px] uppercase tracking-[0.3em] text-dhara-mist">01</span></div>
          <div className="min-w-0 lg:col-span-11">
            <p className="dhara-reveal max-w-[26ch] font-serif text-[clamp(1.55rem,2.7vw,2.1rem)] leading-[1.4] tracking-tight text-dhara-ink/85">
              Photography, with a feeling that stays.
            </p>
            <p className="mt-7 max-w-[58ch] text-[14px] leading-relaxed text-dhara-ink/65">
              DhaRa Studios is built around a simple belief — beautiful photographs should do more than preserve a moment. They should bring the feeling of that moment back to life.
            </p>
          </div>
        </div>
      </section>

      <section id="about" className="border-b border-dhara-ink/10" aria-labelledby="philosophy-heading">
        <div className="dhara-container grid grid-cols-1 gap-10 py-20 lg:grid-cols-12 lg:py-28">
          <div className="min-w-0 lg:col-span-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dhara-champagne">02 — The DhaRa philosophy</span>
            <h2 id="philosophy-heading" className="mt-6 font-serif text-[clamp(1.9rem,3.2vw,2.6rem)] leading-tight tracking-tight">
              A constant flow of stories, emotions &amp; memories.
            </h2>
          </div>
          <div className="min-w-0 lg:col-span-8">
            <div className="border-t border-dhara-ink/15 pt-5">
              <p className="max-w-[52ch] text-[15px] leading-relaxed text-dhara-ink/70">
                DhaRa represents a constant flow — of emotions, stories, memories and happiness. Every photograph should carry something beyond the frame: a feeling that returns naturally every time you look back.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-3 sm:gap-5">
              <div className="h-20 border-l border-dhara-champagne/60" />
              <div className="h-32 border-l border-dhara-ink/15" />
              <div className="h-24 border-l border-dhara-ink/15" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-dhara-ink/10" aria-labelledby="categories-heading">
        <div className="dhara-container grid grid-cols-1 gap-10 py-16 lg:grid-cols-12 lg:py-20">
          <div className="min-w-0 lg:col-span-3"><span className="text-[10px] uppercase tracking-[0.3em] text-dhara-mist">03 — What we photograph</span></div>
          <div className="min-w-0 lg:col-span-9">
            <h2 id="categories-heading" className="mb-7 font-serif text-[clamp(1.9rem,3.2vw,2.6rem)] leading-tight tracking-tight">Stories take many forms.</h2>
            <div className="flex flex-col">
              {["Weddings & Celebrations", "Portraits & Fashion", "Maternity", "Baby & Family", "Food", "Product", "Corporate"].map((category, index) => (
                <Link key={category} to="/work" className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 border-b border-dhara-ink/10 py-5 transition-colors hover:border-dhara-champagne/60">
                  <span className="min-w-0 font-serif text-[clamp(1.35rem,2.7vw,2.1rem)] tracking-tight transition-transform group-hover:translate-x-1">{category}</span>
                  <span className="shrink-0 text-[11px] uppercase tracking-[0.24em] text-dhara-mist transition-colors group-hover:text-dhara-champagne">0{index + 1} →</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="border-b border-dhara-ink/10" aria-labelledby="work-heading">
        <div className="dhara-container py-20 lg:py-28">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-dhara-champagne">04 — Selected work</span>
              <h2 id="work-heading" className="mt-4 max-w-[24ch] font-serif text-[clamp(1.9rem,3.2vw,2.6rem)] leading-tight tracking-tight">Moments, thoughtfully observed.</h2>
            </div>
            <Link to="/work" className="hidden text-[11px] uppercase tracking-[0.22em] text-dhara-ink/60 transition-colors hover:text-dhara-ink sm:inline">View all work <span aria-hidden="true">→</span></Link>
          </div>

          <div className="grid grid-cols-12 gap-x-8 gap-y-14 lg:gap-x-10">
            <div className="col-span-12">
              <MediaFrame number="01" format="06" type="Wedding" className="aspect-[16/9] w-full" src={bySlot["work-01"]?.url} alt={bySlot["work-01"]?.caption ?? "Wedding photography"} />
            </div>
            <div className="col-span-12 md:col-span-7">
              <MediaFrame number="02" format="06" type="Portrait" className="aspect-[3/4] w-full" src={bySlot["work-02"]?.url} alt={bySlot["work-02"]?.caption ?? "Portrait photography"} />
            </div>
            <div className="col-span-12 mt-8 md:col-span-5 md:mt-14">
              <MediaFrame number="03" format="06" type="Fashion" className="aspect-square w-full" src={bySlot["work-03"]?.url} alt={bySlot["work-03"]?.caption ?? "Fashion photography"} />
            </div>
            <div className="col-span-12 md:col-span-5">
              <MediaFrame number="04" format="06" type="Maternity" className="aspect-[3/2] w-full" src={bySlot["work-04"]?.url} alt={bySlot["work-04"]?.caption ?? "Maternity photography"} />
            </div>
            <div className="col-span-12 mt-8 md:col-span-7 md:mt-14">
              <MediaFrame number="05" format="06" type="Celebrations" className="aspect-[3/4] w-full" src={bySlot["work-05"]?.url} alt={bySlot["work-05"]?.caption ?? "Celebration photography"} />
            </div>
          </div>
          <Link to="/work" className="mt-12 inline-flex items-center gap-3 border-b border-dhara-ink/30 pb-1 text-[11px] uppercase tracking-[0.22em] text-dhara-ink/70 transition-colors hover:border-dhara-champagne hover:text-dhara-ink sm:hidden">View all work <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section id="experience" className="border-b border-dhara-ink/10" aria-labelledby="experience-heading">
        <div className="dhara-container grid grid-cols-1 gap-10 py-20 lg:grid-cols-12 lg:py-28">
          <div className="min-w-0 lg:col-span-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dhara-champagne">05 — Experience &amp; craft</span>
            <h2 id="experience-heading" className="mt-6 font-serif text-[clamp(1.9rem,3.2vw,2.6rem)] leading-tight tracking-tight">Not just pictures. An experience worth remembering.</h2>
          </div>
          <div className="grid min-w-0 gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-8">
            {[
              ["01", "Timeless", "Images created to remain meaningful beyond trends."],
              ["02", "Authentic", "Real moments, real emotions, captured honestly."],
              ["03", "Emotive", "Every frame should carry feeling, depth and meaning."],
              ["04", "Cinematic", "A visual approach that turns memories into something lasting."],
            ].map(([number, title, copy]) => (
              <div key={number} className="border-t border-dhara-ink/15 pt-5">
                <span className="font-serif text-lg text-dhara-champagne">{number}</span>
                <h3 className="mt-2 font-serif text-xl tracking-tight uppercase">{title}</h3>
                <p className="mt-3 max-w-[32ch] text-[14px] leading-relaxed text-dhara-ink/65">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="story" className="border-b border-dhara-ink/10" aria-labelledby="story-heading">
        <div className="dhara-container grid grid-cols-1 gap-10 py-20 lg:grid-cols-12 lg:py-28">
          <div className="min-w-0 lg:col-span-5">
            <MediaFrame type="About DhaRa" className="aspect-[3/4] w-full" src={aboutImageUrl} alt={aboutImageAlt} />
          </div>
          <div className="min-w-0 flex flex-col justify-center lg:col-span-7">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dhara-champagne">06 — About DhaRa</span>
            <h2 id="story-heading" className="mt-6 font-serif text-[clamp(2rem,4vw,3.2rem)] leading-[1.08] tracking-tight">More Than<br />Just Pictures</h2>
            <p className="mt-7 text-[15px] leading-relaxed text-dhara-ink/70">With roots in photography since 2016, DhaRa Studios has grown across weddings, portraits, fashion, maternity, baby photography, food, products and corporate assignments.</p>
            <p className="mt-5 text-[15px] leading-relaxed text-dhara-ink/70">From Event&apos;s by NN to DhaRa Studios, the name has evolved — but the intention remains the same: to create photographs that hold a feeling, not just a moment.</p>
            <Link to="/about" className="mt-8 inline-flex items-center gap-3 self-start border-b border-dhara-ink/30 pb-1 text-[11px] uppercase tracking-[0.22em] text-dhara-ink/70 transition-colors hover:border-dhara-champagne hover:text-dhara-ink">Read our story <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section className="border-b border-dhara-ink/10" aria-label="DhaRa experience">
        <div className="dhara-container flex flex-col gap-8 py-12 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-5 sm:gap-x-10">
            <div className="border-r border-dhara-ink/15 pr-8 sm:pr-10"><span className="font-serif text-3xl tracking-tight">2016</span><span className="mt-1 block text-[10px] uppercase tracking-[0.24em] text-dhara-mist">Established</span></div>
            <div className="border-r border-dhara-ink/15 pr-8 sm:pr-10"><span className="font-serif text-3xl tracking-tight">8+</span><span className="mt-1 block text-[10px] uppercase tracking-[0.24em] text-dhara-mist">Years of experience</span></div>
            <div><span className="font-serif text-lg tracking-tight">Weddings &amp; celebrations</span><span className="mt-1 block text-[10px] uppercase tracking-[0.24em] text-dhara-mist">Multi-disciplinary photography</span></div>
          </div>
        </div>
      </section>

      <section id="contact" className="relative overflow-hidden" aria-labelledby="contact-heading">
        <div className="dhara-container py-24 text-center lg:py-32">
          <span className="text-[11px] uppercase tracking-[0.34em] text-dhara-champagne">Let the feeling flow</span>
          <h2 id="contact-heading" className="mt-8 font-serif text-[clamp(2.2rem,5.2vw,4rem)] leading-[1.06] tracking-tight">Let&apos;s create something<br className="hidden sm:block" /> worth remembering.</h2>
          <p className="mx-auto mt-6 max-w-[38ch] text-[15px] leading-relaxed text-dhara-ink/65">For stories that deserve more than a photograph.</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
            <Link to="/contact" className="inline-flex items-center gap-3 bg-dhara-ink px-7 py-3.5 text-[11px] uppercase tracking-[0.22em] text-dhara-ivory ring-1 ring-dhara-ink transition hover:ring-dhara-champagne">Book your date <span aria-hidden="true">→</span></Link>
            <Link to="/contact" className="text-[11px] uppercase tracking-[0.22em] text-dhara-ink/60 transition-colors hover:text-dhara-ink">Start a conversation <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-dhara-ink/10">
        <div className="dhara-container grid grid-cols-2 gap-x-8 gap-y-10 py-14 md:grid-cols-12 md:gap-10">
          <div className="col-span-2 min-w-0 md:col-span-5">
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1"><span className="font-serif text-lg tracking-tight">DhaRa</span><span className="text-[10px] uppercase tracking-[0.3em] text-dhara-mist">Studios &amp; Films</span></div>
            <p className="mt-5 max-w-[40ch] text-[13px] leading-relaxed text-dhara-ink/55">LET THE FEELING FLOW</p>
          </div>
          <div className="min-w-0 md:col-span-3"><span className="text-[10px] uppercase tracking-[0.3em] text-dhara-mist">Navigate</span><ul className="mt-4 space-y-2 text-[13px] text-dhara-ink/70">{navItems.map((item) => <li key={item.label}><Link to={item.to} className="transition-colors hover:text-dhara-ink">{item.label}</Link></li>)}</ul></div>
          <div className="min-w-0 md:col-span-4"><span className="text-[10px] uppercase tracking-[0.3em] text-dhara-mist">Connect</span><ul className="mt-4 space-y-2 text-[13px] text-dhara-ink/70"><li><a href="#" className="transition-colors hover:text-dhara-ink">Instagram</a></li><li><a href="#" className="transition-colors hover:text-dhara-ink">YouTube</a></li></ul></div>
        </div>
        <div className="border-t border-dhara-ink/10"><div className="dhara-container flex flex-col gap-3 py-5 text-[10px] uppercase tracking-[0.24em] text-dhara-mist sm:flex-row sm:items-center sm:justify-between"><span>© 2026 DhaRa Studios &amp; Films. All Rights Reserved.</span><span>LET THE FEELING FLOW</span></div></div>
      </footer>
    </main>
  );
}