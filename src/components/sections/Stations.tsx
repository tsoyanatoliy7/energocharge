"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { demoStations, type DemoStation } from "@/data/stations.demo";
import { formatNumber } from "@/lib/format";
import { site } from "@/lib/site";
import type { Dictionary } from "@/i18n/dictionaries/ru";

const distance = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) =>
  Math.hypot(a.lat - b.lat, (a.lng - b.lng) * Math.cos((a.lat * Math.PI) / 180));

function StationCard({ s, t }: { s: DemoStation; t: Dictionary["stations"] }) {
  const ratio = s.free / s.total;
  const status = s.free === 0 ? "bg-ink/25" : ratio < 1 ? "bg-amber-400" : "bg-malachite";
  const routeUrl = `https://yandex.uz/maps/?rtext=~${s.lat},${s.lng}&rtt=auto`;
  const mapUrl = `https://yandex.uz/maps/?pt=${s.lng},${s.lat}&z=16&l=map`;
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35 }}
      className="rounded-[22px] border border-line bg-paper p-4 transition hover:border-malachite/50"
    >
      <div className="flex items-start gap-3.5">
        <div className="relative grid h-12 w-12 shrink-0 place-items-center">
          <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90">
            <circle cx="24" cy="24" r="21" fill="none" stroke="rgb(19 18 20/.08)" strokeWidth="4" />
            <circle cx="24" cy="24" r="21" fill="none" stroke="#02d866" strokeWidth="4" strokeDasharray={132} strokeDashoffset={132 * (1 - ratio)} strokeLinecap="round" />
          </svg>
          <span className="text-[11px] font-semibold">{s.free}/{s.total}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-semibold">{s.name}</h3>
            <span className="demo-badge">demo</span>
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[13px] text-muted">
            <span className={`h-2 w-2 rounded-full ${status}`} />
            {t.free} {s.free} {t.of} {s.total}
          </div>
          <p className="mt-1 truncate text-[13px] text-muted">{s.address}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1.5">
          {s.connectors.map((c) => (
            <span key={c} className="rounded-lg bg-ink/5 px-2 py-1 text-[12px] font-medium">{c}</span>
          ))}
        </div>
        <div className="text-[14px]">
          <b>{formatNumber(s.pricePerKwh)}</b> <span className="text-muted">{t.perKwh}</span>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-ink/5 py-2.5 text-center text-[13px] font-medium transition hover:bg-ink/10">
          {t.onMap}
        </a>
        <a href={routeUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-ink py-2.5 text-center text-[13px] font-medium text-floral transition hover:bg-malachite hover:text-ink">
          {t.route}
        </a>
      </div>
    </motion.article>
  );
}

export default function Stations({ t }: { t: Dictionary }) {
  const s = t.stations;
  const [query, setQuery] = useState("");
  const [city, setCity] = useState<number | "all">("all");
  const [me, setMe] = useState<{ lat: number; lng: number } | null>(null);
  const [mapOn, setMapOn] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    let r = demoStations.filter(
      (st) => (city === "all" || st.cityIndex === city) && (!q || `${st.name} ${st.address} ${s.cities[st.cityIndex]}`.toLowerCase().includes(q)),
    );
    if (me) r = [...r].sort((a, b) => distance(a, me) - distance(b, me));
    return r;
  }, [query, city, me, s.cities]);

  const locate = () =>
    navigator.geolocation?.getCurrentPosition((pos) => setMe({ lat: pos.coords.latitude, lng: pos.coords.longitude }));

  const chip = (active: boolean) =>
    `shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition ${active ? "bg-ink text-floral" : "bg-paper border border-line hover:border-ink/30"}`;

  return (
    <section id="stations" className="relative bg-[#f1f3e8] py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading eyebrow={s.eyebrow} title={s.title} />

        <Reveal delay={0.05} className="mt-10">
          <label className="relative block">
            <span className="sr-only">{s.search}</span>
            <svg viewBox="0 0 24 24" className="absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-ink/40" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="6.5" />
              <path d="m20 20-4.2-4.2" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={s.search}
              className="h-14 w-full rounded-full border border-line bg-paper pr-5 pl-13 text-[16px] outline-none transition focus:border-malachite focus:shadow-[0_0_0_4px_rgb(2_216_102/0.15)]"
            />
          </label>
          <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0">
            <button onClick={locate} className={chip(!!me)}>
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-malachite" />
              {s.near}
            </button>
            <button onClick={() => setCity("all")} className={chip(city === "all")}>{s.all}</button>
            {s.cities.map((c, i) => (
              <button key={c} onClick={() => setCity(i)} className={chip(city === i)}>{c}</button>
            ))}
          </div>
        </Reveal>

        <div className="mt-6 grid gap-4 lg:grid-cols-[400px_1fr]">
          <div>
            <div className="mb-3 flex items-center justify-between text-[13px] text-muted">
              <span>{s.found}: {list.length}</span>
              <span>{s.openApp}</span>
            </div>
            <div className="space-y-3 lg:max-h-[560px] lg:overflow-y-auto lg:pr-1">
              <AnimatePresence mode="popLayout">
                {list.map((st) => (
                  <StationCard key={st.id} s={st} t={s} />
                ))}
              </AnimatePresence>
              {list.length === 0 && <p className="rounded-[22px] border border-dashed border-line p-6 text-center text-muted">{s.empty}</p>}
            </div>
          </div>

          <Reveal delay={0.1} className="relative min-h-[380px] overflow-hidden rounded-[28px] border border-line bg-paper lg:min-h-[600px]">
            {mapOn ? (
              <iframe src={site.mapWidget} title={s.mapNote} className="absolute inset-0 h-full w-full" loading="lazy" allowFullScreen />
            ) : (
              <button onClick={() => setMapOn(true)} className="group absolute inset-0 grid place-items-center overflow-hidden">
                {/* превью карты: загружаем виджет только по клику, чтобы не тормозить страницу */}
                <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
                  <rect width="800" height="600" fill="#eef1e4" />
                  <g stroke="#dfe4d2" strokeWidth="14" fill="none" strokeLinecap="round">
                    <path d="M-20 180 C 200 140, 420 260, 820 200" />
                    <path d="M-20 420 C 260 380, 520 500, 820 430" />
                    <path d="M240 -20 C 210 200, 300 420, 260 620" />
                    <path d="M560 -20 C 600 220, 520 400, 580 620" />
                  </g>
                  <circle cx="400" cy="300" r="200" fill="none" stroke="#d3dcc4" strokeWidth="6" />
                </svg>
                <span className="relative inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-semibold text-floral shadow-xl transition group-hover:bg-malachite group-hover:text-ink">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M12 21s-7-6-7-11.5a7 7 0 0 1 14 0C19 15 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
                  {s.mapNote}
                </span>
              </button>
            )}
          </Reveal>
        </div>
        <p className="mt-4 flex items-start gap-2 text-[13px] text-muted">
          <span className="demo-badge shrink-0">demo</span>
          {s.demo}
        </p>
      </div>
    </section>
  );
}
