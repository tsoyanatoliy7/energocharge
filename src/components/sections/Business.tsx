"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/lib/site";
import type { Dictionary } from "@/i18n/dictionaries/ru";

type Mode = "station" | "fleet";

const Check = () => (
  <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-malachite-deep" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
    <path d="m5 12 5 5 9-10" />
  </svg>
);

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-ink/70">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
const input =
  "h-12 w-full rounded-2xl border border-line bg-floral/60 px-4 text-[15px] outline-none transition focus:border-malachite focus:bg-paper focus:shadow-[0_0_0_4px_rgb(2_216_102/0.15)]";

export default function Business({ t }: { t: Dictionary }) {
  const b = t.business;
  const f = b.form;
  const [mode, setMode] = useState<Mode>("station");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const banner = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: banner, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1, 1.04]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      setError(true);
      e.currentTarget.reportValidity();
      return;
    }
    // TODO(product): отправка заявки в CRM/бэкенд. Сейчас — только демо-состояние.
    setError(false);
    setSent(true);
  };

  const options: { id: Mode; title: string; items: string[]; icon: string }[] = [
    { id: "station", title: b.station.title, items: b.station.items, icon: "M4 21V8l8-5 8 5v13M9 21v-6h6v6" },
    { id: "fleet", title: b.fleet.title, items: b.fleet.items, icon: "M3 13l2-6h14l2 6v5h-2a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H3v-5Zm2 0h14" },
  ];

  return (
    <section id="business" className="relative py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading eyebrow={b.eyebrow} title={b.title} lead={b.lead} />

        {/* Визуал: навес-хаб EnerGo из брендбука, стр. 13 */}
        <div ref={banner} className="relative mt-10 h-[240px] overflow-hidden rounded-[32px] bg-ink sm:h-[360px]">
          <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_70%_30%,#21402f,#131214_70%)]" />
          <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0 flex items-end justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/canopy-hub.webp" alt="EnerGo charging hub (brand book visual)" className="h-[92%] w-auto max-w-none" loading="lazy" />
          </motion.div>
          <div className="absolute bottom-4 left-5 text-[12px] text-floral/45">EnerGo hub · brand book visual</div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
          <div className="grid gap-3" role="radiogroup" aria-label={b.title}>
            {options.map((o) => {
              const active = mode === o.id;
              return (
                <button
                  key={o.id}
                  role="radio"
                  aria-checked={active}
                  onClick={() => setMode(o.id)}
                  className={`card relative p-6 text-left transition duration-300 ${active ? "border-malachite shadow-[0_0_0_3px_rgb(2_216_102/0.18)]" : "hover:border-ink/25"}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className={`grid h-11 w-11 place-items-center rounded-2xl transition ${active ? "bg-malachite" : "bg-ink/5"}`}>
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden><path d={o.icon} /></svg>
                      </span>
                      <h3 className="text-lg font-semibold tracking-tight">{o.title}</h3>
                    </div>
                    <span className={`grid h-6 w-6 place-items-center rounded-full border-2 ${active ? "border-malachite" : "border-ink/20"}`}>
                      {active && <span className="h-2.5 w-2.5 rounded-full bg-malachite" />}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {o.items.map((it) => (
                      <li key={it} className="flex gap-2.5 text-[15px] text-ink/75"><Check />{it}</li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          <Reveal className="card p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="ok" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex h-full min-h-[360px] flex-col items-center justify-center text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-malachite text-2xl">✓</span>
                  <p className="mt-5 max-w-sm text-lg font-medium">{f.success}</p>
                  <button onClick={() => setSent(false)} className="mt-6 text-sm text-muted underline">←</button>
                </motion.div>
              ) : (
                <motion.form key="form" noValidate onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h3 className="text-xl font-semibold tracking-tight">{f.title}</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label={`${f.name} *`}><input name="name" required autoComplete="name" className={input} /></Field>
                    <Field label={f.company}><input name="company" autoComplete="organization" className={input} /></Field>
                    <Field label={`${f.phone} *`}><input name="phone" type="tel" required defaultValue="+998 " pattern="^\+?998[\s\d-]{9,14}$" autoComplete="tel" className={input} /></Field>
                    <Field label={f.city}><input name="city" placeholder={f.cityPlaceholder} className={input} /></Field>
                  </div>
                  {mode === "station" ? (
                    <fieldset>
                      <legend className="text-[13px] font-medium text-ink/70">{f.grid}</legend>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {f.gridOptions.map((opt, i) => (
                          <label key={opt} className="cursor-pointer">
                            <input type="radio" name="grid" value={opt} defaultChecked={i === 2} className="peer sr-only" />
                            <span className="inline-block rounded-full border border-line px-4 py-2 text-[14px] transition peer-checked:border-ink peer-checked:bg-ink peer-checked:text-floral peer-focus-visible:ring-2 peer-focus-visible:ring-malachite">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ) : (
                    <Field label={f.volume}><input name="volume" type="number" min={0} inputMode="numeric" className={input} /></Field>
                  )}
                  <label className="flex items-start gap-2.5 text-[13px] text-ink/70">
                    <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-[#02d866]" />
                    <span>
                      {f.consent}{" "}
                      <a href={site.privacy} target="_blank" rel="noopener noreferrer" className="underline">{f.privacy}</a>
                    </span>
                  </label>
                  {error && <p className="text-[13px] font-medium text-red-600">{f.required}</p>}
                  <button type="submit" className="btn-dark w-full">{f.submit}</button>
                  <p className="flex items-start gap-2 text-[12px] text-muted"><span className="demo-badge shrink-0">demo</span>{f.demoNote}</p>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
