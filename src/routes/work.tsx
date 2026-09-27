import { createFileRoute } from "@tanstack/react-router";
import { DhaRaMediaFrame, DhaRaPage, EditorialArrowLink } from "../components/dhara-site";
import { useSiteImages } from "@/hooks/use-site-images";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Selected Work | DhaRa Studios & Films" },
      { name: "description", content: "Explore the evolving portfolio of DhaRa Studios & Films." },
      { property: "og:title", content: "Selected Work | DhaRa Studios & Films" },
      { property: "og:description", content: "Explore the evolving portfolio of DhaRa Studios & Films." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkPage,
});

const placeholderFrames = [
  { number: "01", className: "aspect-[16/9]", span: "md:col-span-7" },
  { number: "02", className: "aspect-[16/10]", span: "md:col-span-5" },
  { number: "03", className: "aspect-[4/3]", span: "md:col-span-4" },
  { number: "04", className: "aspect-[3/2]", span: "md:col-span-8" },
  { number: "05", className: "aspect-[16/10]", span: "md:col-span-5" },
  { number: "06", className: "aspect-[16/9]", span: "md:col-span-7" },
];

const spans = ["md:col-span-7", "md:col-span-5", "md:col-span-4", "md:col-span-8", "md:col-span-6", "md:col-span-6"];

function WorkPage() {
  const { data: galleryImages = [] } = useSiteImages("gallery");

  return (
    <DhaRaPage activePath="/work">
      <section className="border-b border-dhara-ink/10" aria-labelledby="work-heading">
        <div className="dhara-container grid grid-cols-1 gap-14 py-16 lg:grid-cols-12 lg:gap-10 lg:py-28">
          <div className="lg:col-span-6">
            <span className="dhara-reveal dhara-letter-reveal text-[11px] uppercase tracking-[0.34em] text-dhara-champagne">Selected work</span>
            <h1 id="work-heading" className="dhara-reveal dhara-delay-1 mt-7 max-w-[12ch] font-serif text-[clamp(2.8rem,5.6vw,5rem)] leading-[1.04] tracking-tight">Stories, captured as they unfold.</h1>
          </div>
          <div className="flex items-end lg:col-span-5 lg:col-start-8">
            <p className="max-w-[39ch] text-[15px] leading-relaxed text-dhara-ink/70">A growing collection of moments, made with attention to what happens between the frames.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-dhara-ink/10" aria-labelledby="gallery-heading">
        <div className="dhara-container py-20 lg:py-28">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-dhara-mist">The archive</span>
              <h2 id="gallery-heading" className="mt-4 font-serif text-[clamp(1.9rem,3.2vw,2.6rem)] leading-tight tracking-tight">Moments, thoughtfully observed.</h2>
            </div>
            {galleryImages.length > 0 ? (
              <span className="text-[10px] uppercase tracking-[0.24em] text-dhara-mist">
                {String(galleryImages.length).padStart(2, "0")} frames / growing
              </span>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-x-7 gap-y-8 md:grid-cols-12 lg:gap-x-10 lg:gap-y-12">
            {galleryImages.length === 0
              ? placeholderFrames.map((frame, index) => (
                  <div key={frame.number} className={`col-span-1 ${frame.span} ${index % 2 === 1 ? "md:mt-6" : ""}`}>
                    <DhaRaMediaFrame
                      number={frame.number}
                      format="DhaRa"
                      className={`${frame.className} w-full`}
                      label="Intentional photography media placeholder"
                    />
                  </div>
                ))
              : galleryImages.map((image, index) => (
                  <figure
                    key={image.id}
                    className={`col-span-1 ${spans[index % spans.length]} ${index % 2 === 1 ? "md:mt-6" : ""}`}
                  >
                    <img
                      src={image.url}
                      alt={image.caption ?? "Photography by DhaRa Studios & Films"}
                      className="block h-auto w-full"
                      loading="lazy"
                      decoding="async"
                    />
                    {image.caption ? (
                      <figcaption className="mt-4 border-t border-dhara-ink/15 pt-3 text-[10px] uppercase tracking-[0.22em] text-dhara-mist">
                        {image.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
          </div>

          <div className="mt-16"><EditorialArrowLink to="/contact">Begin a project</EditorialArrowLink></div>
        </div>
      </section>
    </DhaRaPage>
  );
}
