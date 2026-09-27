import { createFileRoute } from "@tanstack/react-router";
import { useSiteImages } from "@/hooks/use-site-images";
import { groupByCategory } from "@/lib/site-images";
import { DhaRaMediaFrame, DhaRaPage, EditorialArrowLink } from "../components/dhara-site";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { title: "Experience | DhaRa Studios & Films" },
      { name: "description", content: "The photography experiences and visual disciplines of DhaRa Studios & Films." },
      { property: "og:title", content: "Experience | DhaRa Studios & Films" },
      { property: "og:description", content: "The photography experiences and visual disciplines of DhaRa Studios & Films." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExperiencePage,
});

const experiences = [
  ["01", "Weddings & Celebrations", "The movement, anticipation and quiet in-between moments of a day that deserves to be remembered in full.", "aspect-[16/9]", true, "weddings"],
  ["02", "Portraits & Fashion", "An attentive study of presence, gesture and the way a person inhabits a frame.", "aspect-[4/3]", false, "portraits"],
  ["03", "Maternity", "A gentle visual language for the waiting, wonder and connection before a new beginning.", "aspect-[3/4]", false, "maternity"],
  ["04", "Baby & Family", "The unrepeatable details of growing up, held with warmth and an honest eye.", "aspect-[4/3]", false, "baby-family"],
  ["05", "Food", "Texture, craft and atmosphere brought together to make the feeling of a table visible.", "aspect-[16/10]", false, "food"],
  ["06", "Product", "Objects considered with clarity, restraint and the visual space they deserve.", "aspect-square", false, "product"],
  ["07", "Corporate", "People, purpose and culture translated into imagery with a human point of view.", "aspect-[3/2]", false, "corporate"],
] as const;

function ExperiencePage() {
  const { data: experienceImages = [] } = useSiteImages("experience");
  const imagesBySection = groupByCategory(experienceImages);

  return (
    <DhaRaPage activePath="/experience">
      <section className="border-b border-dhara-ink/10" aria-labelledby="experience-heading">
        <div className="dhara-container grid grid-cols-1 gap-14 py-16 lg:grid-cols-12 lg:gap-10 lg:py-28">
          <div className="lg:col-span-7"><span className="dhara-reveal dhara-letter-reveal text-[11px] uppercase tracking-[0.34em] text-dhara-champagne">Our experience</span><h1 id="experience-heading" className="dhara-reveal dhara-delay-1 mt-7 max-w-[13ch] font-serif text-[clamp(2.8rem,5.6vw,5rem)] leading-[1.04] tracking-tight">Different stories. One visual language.</h1></div>
          <div className="flex items-end lg:col-span-5"><p className="max-w-[40ch] text-[15px] leading-relaxed text-dhara-ink/70">From intimate personal stories to professional brand campaigns, DhaRa Studios brings the same attention to detail, visual consistency and storytelling into every assignment.</p></div>
        </div>
      </section>

      <div>
        {experiences.map(([number, title, copy, ratio, featured, workAnchor], index) => (
          <section key={title} className={`border-b border-dhara-ink/10 ${featured ? "bg-dhara-paper" : ""}`} aria-labelledby={`experience-${number}`}>
            <div className={`dhara-container grid grid-cols-1 gap-10 py-16 lg:grid-cols-12 lg:gap-14 ${index % 2 === 1 ? "lg:py-24" : "lg:py-20"}`}>
              <div className={`lg:col-span-4 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <span className="font-serif text-lg text-dhara-champagne">{number}</span>
                <h2 id={`experience-${number}`} className="mt-5 max-w-[12ch] font-serif text-[clamp(2rem,3.7vw,3.1rem)] leading-[1.1] tracking-tight">{title}</h2>
                <p className="mt-6 max-w-[38ch] text-[14px] leading-relaxed text-dhara-ink/65">{copy}</p>
                <div className="mt-8"><EditorialArrowLink to={`/work#${workAnchor}` as `/work#${string}`}>View work</EditorialArrowLink></div>
              </div>
               <div className={`lg:col-span-8 ${index % 2 === 1 ? "lg:order-1" : ""}`}><DhaRaMediaFrame number={number} format="07" type={title} className={`${ratio} w-full ${featured ? "lg:aspect-[16/8]" : ""}`} label={`${title} photography placeholder`} src={imagesBySection[workAnchor]?.[0]?.url} alt={imagesBySection[workAnchor]?.[0]?.caption ?? `${title} photography by DhaRa Studios`} /></div>
            </div>
          </section>
        ))}
      </div>
    </DhaRaPage>
  );
}