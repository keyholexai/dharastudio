import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { DhaRaPage } from "../components/dhara-site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact DhaRa Studios & Films" },
      { name: "description", content: "Begin a conversation with DhaRa Studios & Films about your next story." },
      { property: "og:title", content: "Contact DhaRa Studios & Films" },
      { property: "og:description", content: "Begin a conversation with DhaRa Studios & Films about your next story." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const photographyTypes = ["Wedding & Celebration", "Portrait", "Fashion", "Maternity", "Baby & Family", "Food", "Product", "Corporate", "Other"];

const contactDetails: Array<{ label: string; value: string; href?: string; external?: boolean }> = [
  { label: "Email", value: "Dhara.studios.films@gmail.com", href: "mailto:Dhara.studios.films@gmail.com" },
  { label: "Phone", value: "+91 80961 43076", href: "tel:+918096143076" },
  { label: "Instagram", value: "@eventsbynn", href: "https://www.instagram.com/eventsbynn", external: true },
  {
    label: "Location",
    value: "Road No. 1, Banjara Hills, Hyderabad, Telangana 500034",
    href: "https://www.google.com/maps/search/?api=1&query=Road%20No.%201%2C%20Banjara%20Hills%2C%20Hyderabad%2C%20Telangana%20500034",
    external: true,
  },
];

const WHATSAPP_NUMBER = "918096143076";

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const type = String(data.get("photographyType") || "");
    const date = String(data.get("date") || "");
    const location = String(data.get("location") || "");
    const lines = [
      "Hello DhaRa Studios & Films,",
      "",
      `Name: ${String(data.get("name") || "")}`,
      `Email: ${String(data.get("email") || "")}`,
      `Phone: ${String(data.get("phone") || "")}`,
      type ? `Type of photography: ${type}` : null,
      date ? `Event / project date: ${date}` : null,
      location ? `Location: ${location}` : null,
      "",
      `My story: ${String(data.get("story") || "")}`,
    ].filter((line): line is string => line !== null);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(whatsappUrl, "_blank", "noopener");
    setSubmitted(true);
  }

  return (
    <DhaRaPage activePath="/contact">
      <section className="border-b border-dhara-ink/10" aria-labelledby="contact-heading">
        <div className="dhara-container py-20 lg:py-28">
          <span className="dhara-reveal dhara-letter-reveal text-[11px] uppercase tracking-[0.34em] text-dhara-champagne">Let the feeling flow</span>
          <h1 id="contact-heading" className="dhara-reveal dhara-delay-1 mt-7 max-w-[13ch] font-serif text-[clamp(2.8rem,5.6vw,5rem)] leading-[1.04] tracking-tight">Let&apos;s create something worth remembering.</h1>
          <p className="dhara-reveal dhara-delay-2 mt-7 max-w-[38ch] text-[15px] leading-relaxed text-dhara-ink/70">For stories that deserve more than a photograph.</p>
        </div>
      </section>

      <section aria-labelledby="enquiry-heading">
        <div className="dhara-container grid grid-cols-1 gap-16 py-20 lg:grid-cols-12 lg:gap-14 lg:py-28">
          <div className="lg:col-span-7">
            <div className="mb-10 border-b border-dhara-ink/15 pb-5"><span className="text-[10px] uppercase tracking-[0.3em] text-dhara-mist">01 — Your story</span><h2 id="enquiry-heading" className="mt-4 font-serif text-[clamp(1.9rem,3.2vw,2.6rem)] leading-tight tracking-tight">Start a conversation.</h2></div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
              <label className="dhara-field"><span>Name</span><input name="name" type="text" required autoComplete="name" /></label>
              <label className="dhara-field"><span>Email</span><input name="email" type="email" required autoComplete="email" /></label>
              <label className="dhara-field"><span>Phone</span><input name="phone" type="tel" autoComplete="tel" /></label>
              <label className="dhara-field"><span>Type of photography</span><select name="photographyType" required defaultValue=""><option value="" disabled>Select one</option>{photographyTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
              <label className="dhara-field"><span>Event / project date</span><input name="date" type="date" /></label>
              <label className="dhara-field"><span>Location</span><input name="location" type="text" /></label>
              <label className="dhara-field sm:col-span-2"><span>Tell us about your story</span><textarea name="story" required rows={5} /></label>
              <div className="sm:col-span-2"><button type="submit" className="inline-flex items-center gap-3 bg-dhara-ink px-7 py-3.5 text-[11px] uppercase tracking-[0.22em] text-dhara-ivory ring-1 ring-dhara-ink transition hover:ring-dhara-champagne">Start a conversation <span aria-hidden="true">→</span></button>{submitted ? <p className="mt-4 text-[13px] text-dhara-champagne" role="status">WhatsApp is opening with your details — press send there to reach us.</p> : null}</div>
            </form>
          </div>
          <aside className="lg:col-span-4 lg:col-start-9" aria-label="DhaRa contact details">
            <span className="text-[10px] uppercase tracking-[0.3em] text-dhara-champagne">02 — Find us here</span>
            <div className="mt-8 border-t border-dhara-ink/15">
              {contactDetails.map((detail) => (
                <div key={detail.label} className="border-b border-dhara-ink/15 py-5">
                  <span className="text-[10px] uppercase tracking-[0.24em] text-dhara-mist">{detail.label}</span>
                  {detail.href ? (
                    <a
                      href={detail.href}
                      {...(detail.external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="mt-2 block font-serif text-lg text-dhara-ink transition-colors hover:text-dhara-champagne"
                    >
                      {detail.value}
                    </a>
                  ) : (
                    <p className="mt-2 font-serif text-lg text-dhara-ink">{detail.value}</p>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-8 max-w-[30ch] text-[14px] leading-relaxed text-dhara-ink/60">Share what you have in mind. We&apos;ll take it from there.</p>
          </aside>
        </div>
      </section>
    </DhaRaPage>
  );
}