import { createFileRoute } from "@tanstack/react-router";
import aboutFounderAsset from "@/assets/dhara-about-founder.webp.asset.json";
import {
  DhaRaMediaFrame,
  DhaRaPage,
  EditorialArrowLink,
} from "../components/dhara-site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About DhaRa Studios & Films" },
      { name: "description", content: "The story, philosophy, and flow behind DhaRa Studios & Films." },
      { property: "og:title", content: "About DhaRa Studios & Films" },
      { property: "og:description", content: "The story, philosophy, and flow behind DhaRa Studios & Films." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <DhaRaPage activePath="/about">
      <section className="border-b border-dhara-ink/10" aria-labelledby="about-heading">
        <div className="dhara-container grid grid-cols-1 gap-12 py-14 sm:gap-14 sm:py-16 lg:grid-cols-12 lg:gap-10 lg:py-28">
          <div className="flex min-w-0 flex-col justify-center lg:col-span-5">
            <span className="dhara-reveal dhara-letter-reveal text-[11px] uppercase tracking-[0.34em] text-dhara-champagne">Our story</span>
            <h1 id="about-heading" className="dhara-reveal dhara-delay-1 mt-6 max-w-[9ch] break-words font-serif text-[2.4rem] leading-[1.08] tracking-tight sm:mt-7 sm:text-[2.8rem] lg:text-[clamp(2.8rem,5.6vw,5rem)] lg:leading-[1.04]">More Than<br />Just Pictures.</h1>
            <p className="dhara-reveal dhara-delay-2 mt-7 max-w-[30ch] text-[15px] leading-relaxed text-dhara-ink/70">Photography, with a feeling that stays.</p>
          </div>
          <div className="relative min-w-0 pt-7 sm:pt-0 lg:col-span-6 lg:col-start-7">
            <span className="absolute left-0 top-0 max-w-full text-[10px] uppercase tracking-[0.2em] text-dhara-mist sm:-top-6 sm:left-1/2 sm:-translate-x-1/2 sm:whitespace-nowrap sm:tracking-[0.3em]">fig. 01 — the story behind the frame</span>
            <DhaRaMediaFrame
              number="01"
              format="04"
              type="About DhaRa"
              className="dhara-reveal dhara-delay-2 aspect-[3/4] w-full"
              src={aboutFounderAsset.url}
              alt="DhaRa Studios founder with camera"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-dhara-ink/10" aria-labelledby="belief-heading">
        <div className="dhara-container grid grid-cols-1 gap-5 py-16 sm:py-20 lg:grid-cols-12 lg:gap-8 lg:py-28">
          <div className="min-w-0 lg:col-span-1"><span className="text-[10px] uppercase tracking-[0.3em] text-dhara-mist">01</span></div>
          <div className="min-w-0 lg:col-span-9 lg:col-start-3">
            <h2 id="belief-heading" className="max-w-[17ch] break-words font-serif text-[1.8rem] leading-[1.25] tracking-tight lg:text-[clamp(1.8rem,3.6vw,3rem)]">Photography, with a feeling that stays.</h2>
            <p className="mt-8 max-w-[57ch] text-[15px] leading-relaxed text-dhara-ink/70">DhaRa Studios is built around one simple idea: beautiful photographs should do more than preserve a moment. They should bring the feeling of that moment back to life.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-dhara-ink/10" aria-labelledby="journey-heading">
        <div className="dhara-container grid grid-cols-1 gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:gap-10 lg:py-28">
          <div className="min-w-0 lg:col-span-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dhara-champagne">02 — The journey</span>
            <h2 id="journey-heading" className="mt-6 max-w-[13ch] break-words font-serif text-[1.9rem] leading-tight tracking-tight lg:text-[clamp(1.9rem,3.2vw,2.7rem)]">A practice shaped by time.</h2>
          </div>
          <div className="min-w-0 lg:col-span-8">
            <div className="border-t border-dhara-ink/15">
              {[
                ["2016", "The beginning", "The photography journey began."],
                ["2017–18", "Pixel Perfect", "Professional photography education at Hamstech Institute of Fashion Technology, Hyderabad."],
                ["2018", "Weddings", "Wedding photography became part of the DhaRa story."],
                ["Then", "A name in motion", "From Event's by NN, the business evolved into DhaRa Studios."],
              ].map(([year, title, copy]) => (
                <div key={year} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 border-b border-dhara-ink/15 py-6 sm:grid-cols-12 sm:gap-8">
                  <span className="font-serif text-lg text-dhara-champagne sm:col-span-2">{year}</span>
                  <div className="min-w-0 sm:col-span-10"><h3 className="break-words font-serif text-xl tracking-tight">{title}</h3><p className="mt-2 max-w-[45ch] break-words text-[14px] leading-relaxed text-dhara-ink/65">{copy}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-dhara-ink/10" aria-labelledby="dhara-heading">
        <div className="dhara-container py-20 lg:py-28">
          <div className="max-w-[52ch] lg:col-start-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dhara-champagne">03 — The name</span>
            <h2 id="dhara-heading" className="mt-6 font-serif text-[clamp(2rem,4vw,3.4rem)] leading-[1.08] tracking-tight">A constant flow.</h2>
            <p className="mt-7 text-[15px] leading-relaxed text-dhara-ink/70">DhaRa represents a constant flow — of emotions, stories, memories and happiness. The name also carries a personal connection, inspired by the founder's mother, Radha.</p>
            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-[10px] uppercase tracking-[0.24em] text-dhara-mist"><span>Emotions</span><span>Stories</span><span>Memories</span><span>Happiness</span></div>
            <div className="mt-10"><EditorialArrowLink to="/work">Explore the work</EditorialArrowLink></div>
          </div>
        </div>
      </section>
    </DhaRaPage>
  );
}