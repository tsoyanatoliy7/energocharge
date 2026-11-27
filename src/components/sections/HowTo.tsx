"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/lib/site";
import type { Dictionary } from "@/i18n/dictionaries/ru";

/* ---------- экраны телефона (схемы, не реальные скриншоты) ---------- */
function ScreenApp() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-6 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-[22px] bg-ink shadow-[0_18px_40px_-12px_rgb(2_216_102/0.6)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/mark.svg" alt="" className="h-11 w-11" />
      </div>
      <div className="text-lg font-semibold">EnerGo</div>
      <div className="w-full rounded-2xl border border-line bg-paper px-4 py-3 text-left text-[15px] text-ink/40">+998 •• ••• •• ••</div>
      <div className="h-11 w-full rounded-2xl bg-malachite" />
    </div>
  );
}
function ScreenWallet() {
  return (
    <div className="flex h-full flex-col gap-4 px-5 pt-10">
      <div className="text-sm text-muted">Wallet</div>
      <div className="rounded-3xl bg-ink p-5 text-floral">
        <div className="text-xs opacity-60">Balance · demo</div>
        <div className="mt-1 text-3xl font-semibold tracking-tight">250 000</div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full bg-malachite" initial={{ width: "20%" }} animate={{ width: "72%" }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }} />
        </div>
      </div>
      {["Visa / Uzcard / Humo", "Click"].map((m, i) => (
        <div key={m} className={`flex items-center justify-between rounded-2xl border px-4 py-3.5 text-[15px] ${i === 1 ? "border-malachite bg-malachite/10" : "border-line bg-paper"}`}>
          {m}
          <span className={`h-4 w-4 rounded-full border-2 ${i === 1 ? "border-malachite bg-malachite" : "border-ink/20"}`} />
        </div>
      ))}
    </div>
  );
}
function ScreenCharge() {
  const reduce = useReducedMotion();
  const [pct, setPct] = useState(reduce ? 80 : 18);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setPct((p) => (p >= 100 ? 18 : p + 1)), 70);
    return () => clearInterval(id);
  }, [reduce]);
  const C = 2 * Math.PI * 70;
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-5">
      <div className="relative h-48 w-48">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
          <circle cx="80" cy="80" r="70" fill="none" stroke="rgb(19 18 20 / 0.07)" strokeWidth="10" />
          <circle cx="80" cy="80" r="70" fill="none" stroke="#02d866" strokeWidth="10" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="text-5xl font-semibold tracking-tight tabular-nums">{pct}%</div>
            <div className="text-xs text-muted">GB/T A · demo</div>
          </div>
        </div>
      </div>
      <div className="grid w-full grid-cols-2 gap-2 text-center">
        <div className="rounded-2xl bg-paper p-3"><div className="text-xs text-muted">kWh</div><div className="font-semibold tabular-nums">{(pct * 0.42).toFixed(1)}</div></div>
        <div className="rounded-2xl bg-paper p-3"><div className="text-xs text-muted">SOS</div><div className="font-semibold">24/7</div></div>
      </div>
    </div>
  );
}

function Phone({ step }: { step: number }) {
  const screens = [<ScreenApp key="a" />, <ScreenWallet key="w" />, <ScreenCharge key="c" />];
  return (
    <div className="relative mx-auto h-[560px] w-[276px] rounded-[48px] bg-ink p-[10px] shadow-[0_50px_100px_-40px_rgb(19_18_20/0.55)]">
      <div className="absolute top-[18px] left-1/2 z-10 h-[26px] w-[86px] -translate-x-1/2 rounded-full bg-black" />
      <div className="relative h-full overflow-hidden rounded-[38px] bg-floral">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -24, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            {screens[step]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Step({ i, title, text, onActive, active }: { i: number; title: string; text: string; onActive: (i: number) => void; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive(i);
  }, [inView, i, onActive]);
  return (
    <div ref={ref} className="lg:flex lg:min-h-[52vh] lg:items-center">
      <button
        onClick={() => onActive(i)}
        className={`card w-full p-6 text-left transition duration-500 sm:p-8 ${active ? "border-malachite/60 shadow-[0_30px_60px_-36px_rgb(2_216_102/0.6)]" : "lg:opacity-45"}`}
      >
        <div className="flex items-start justify-between gap-6">
          <span className={`grid h-12 w-12 place-items-center rounded-2xl text-lg font-semibold transition ${active ? "bg-malachite text-ink" : "bg-ink/5"}`}>{i + 1}</span>
          <span className="text-[64px] leading-none font-semibold tracking-tighter text-ink/[0.06]">0{i + 1}</span>
        </div>
        <h3 className="mt-6 text-2xl font-semibold tracking-[-0.02em]">{title}</h3>
        <p className="mt-2 max-w-md text-muted">{text}</p>
      </button>
    </div>
  );
}

export default function HowTo({ t }: { t: Dictionary }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const s = t.steps;
  return (
    <section id="howto" className="relative py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading eyebrow={s.eyebrow} title={s.title} />
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
          <div className="space-y-3 lg:space-y-0">
            {s.items.map((item, i) => (
              <Step key={item.title} i={i} title={item.title} text={item.text} active={active === i} onActive={setActive} />
            ))}
          </div>
          <div className="order-first lg:order-none">
            <div className="lg:sticky lg:top-[calc(50vh-300px)]">
              <Phone step={active} />
              <p className="mt-4 text-center text-[12px] text-muted">{s.mockNote}</p>
            </div>
          </div>
        </div>

        {/* Пошаговые инструкции (раскрывающийся блок из драфта) */}
        <Reveal id="guide" className="card mt-16 overflow-hidden">
          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h3 className="text-xl font-semibold tracking-tight">{s.guideTitle}</h3>
              <p className="mt-1 text-muted">{s.guideLead}</p>
            </div>
            <a href={site.videoGuide} target="_blank" rel="noopener noreferrer" className="btn-dark shrink-0">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden><path d="M7 4v16l13-8L7 4Z" /></svg>
              {s.video}
            </a>
          </div>
          <div className="divide-y divide-line border-t border-line">
            {s.faq.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-[16px] font-medium transition hover:bg-floral sm:px-8"
                  >
                    {f.q}
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-lg transition duration-300 ${isOpen ? "rotate-45 border-malachite bg-malachite" : ""}`}>+</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 text-muted sm:px-8">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
