"use client";

import { motion } from "motion/react";
import SectionHeading from "@/components/ui/SectionHeading";
import { clubPlans } from "@/data/club";
import { formatNumber } from "@/lib/format";
import { site } from "@/lib/site";
import type { Dictionary } from "@/i18n/dictionaries/ru";

export default function Club({ t }: { t: Dictionary }) {
  const c = t.club;
  const maxKwh = Math.max(...clubPlans.map((p) => p.kwh));
  return (
    <section id="club" className="relative overflow-hidden py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} lead={c.lead} />
      </div>
      <div className="container-x mt-12">
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:px-0 lg:grid lg:grid-cols-5 lg:overflow-visible">
          {clubPlans.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8 }}
              className={`relative flex w-[78%] shrink-0 snap-start flex-col rounded-[26px] border p-5 sm:w-[44%] lg:w-auto ${
                p.promo ? "border-sky bg-sky/35" : "border-line bg-paper"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-medium text-muted">{p.name}</h3>
                {p.promo && <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-floral">{c.promo}</span>}
              </div>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-[44px] leading-none font-semibold tracking-[-0.04em]">{formatNumber(p.kwh)}</span>
                <span className="text-muted">{c.kwh}</span>
              </div>
              <div className="mt-1 text-[13px] text-muted">{p.days} {c.days}</div>

              {/* «заряд» пакета: относительный объём */}
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-ink/[0.06]">
                <motion.div
                  className="h-full rounded-full bg-malachite"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.max(10, (p.kwh / maxKwh) * 100)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>

              <div className="mt-5 border-t border-line pt-4">
                <div className="text-[22px] font-semibold tracking-tight text-malachite-deep">
                  {formatNumber(p.pricePerKwh)} <span className="text-[13px] font-normal text-muted">{c.perKwh}</span>
                </div>
                {p.promo && <div className="mt-1 text-[12px] font-medium">{c.promoUntil}</div>}
              </div>
              <div className="mt-auto pt-5">
                <div className="flex items-baseline justify-between text-[13px]">
                  <span className="text-muted">{c.total}</span>
                  <span className="text-[16px] font-semibold">{formatNumber(p.kwh * p.pricePerKwh)} {c.sum}</span>
                </div>
                <a href={site.appStore} target="_blank" rel="noopener noreferrer" className={`${p.promo ? "btn-dark" : "btn-primary"} mt-4 w-full`}>
                  {c.buy}
                </a>
              </div>
            </motion.article>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-2 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>{c.note}</span>
          <span className="flex items-center gap-2"><span className="demo-badge">demo</span>{c.demo}</span>
        </div>
      </div>
    </section>
  );
}
