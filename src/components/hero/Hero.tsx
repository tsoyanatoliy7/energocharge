"use client";

import dynamic from "next/dynamic";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import StoreButtons from "@/components/ui/StoreButtons";
import { useMediaQuery } from "@/lib/useMediaQuery";
import type { Dictionary } from "@/i18n/dictionaries/ru";
import ScreenUI from "./ScreenUI";

// three.js грузим только на клиенте и только для десктопной кинематографичной версии
const MarkScene = dynamic(() => import("./MarkScene"), { ssr: false });

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Первый экран. Десктоп: «пиннинг» на 320vh и три кадра режиссуры скролла —
 *  1) обложка: слоган + станция + 3D-знак;
 *  2) камера переходит к фронтальному виду станции, подписи узлов, знак раскрывается;
 *  3) наезд в экран станции, который превращается в интерфейс приложения → переход к разделам.
 * Мобильные и prefers-reduced-motion: статичная лёгкая версия без WebGL.
 */
export default function Hero({ t }: { t: Dictionary }) {
  const isDesktop = useMediaQuery("(min-width: 1024px) and (min-height: 640px)");
  const reduce = useReducedMotion();
  const cinematic = isDesktop && !reduce;
  return cinematic ? <CinematicHero t={t} /> : <StaticHero t={t} />;
}

function HeroCopy({ t, className = "" }: { t: Dictionary; className?: string }) {
  return (
    <div className={className}>
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[13px] text-floral/75 backdrop-blur"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-malachite opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-malachite" />
        </span>
        EnerGo · Uzbekistan
      </motion.p>
      <h1 className="mt-6 text-[clamp(2.9rem,7.2vw,6.4rem)] leading-[0.94] font-semibold tracking-[-0.045em]">
        <span className="block overflow-hidden pb-[0.08em]">
          <motion.span className="block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.1, ease }}>
            {t.hero.slogan}
          </motion.span>
        </span>
      </h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.35, ease }}
        className="mt-3 text-[clamp(1.4rem,2.6vw,2.1rem)] font-medium tracking-[-0.02em] text-malachite"
      >
        {t.hero.subtitle}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.45, ease }}
        className="mt-5 max-w-[30rem] text-[17px] leading-relaxed text-floral/65"
      >
        {t.hero.lead}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.55, ease }}
        className="mt-8 flex flex-wrap items-center gap-2.5"
      >
        <a href="#stations" className="btn-primary h-12">
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
            <circle cx="11" cy="11" r="6.5" />
            <path d="m20 20-4.2-4.2" />
          </svg>
          {t.hero.ctaFind}
        </a>
        <StoreButtons tone="light" />
      </motion.div>
    </div>
  );
}

/** Отражение станции на глянцевом полу. */
function Reflection({ src }: { src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden
      className="pointer-events-none absolute top-full left-0 h-full w-full -scale-y-100 opacity-25 blur-[1.5px] [mask-image:linear-gradient(to_bottom,transparent_70%,#000)]"
    />
  );
}

function Stage({ children }: { children?: React.ReactNode }) {
  return (
    <>
      {/* студийный свет и пол */}
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_62%_38%,#1f3a2c_0%,#131214_62%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[34%] bg-[linear-gradient(to_bottom,transparent,rgb(0_0_0/0.55))]" />
      <div className="absolute inset-x-0 bottom-[16%] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="absolute top-[-20%] left-[48%] h-[90%] w-[28%] rotate-[14deg] bg-[linear-gradient(to_bottom,rgb(250_252_240/0.10),transparent)] blur-2xl" />
      {children}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_220px_60px_rgb(0_0_0/0.7)]" />
    </>
  );
}

function CinematicHero({ t }: { t: Dictionary }) {
  const ref = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(p, "change", (v) => (progress.current = v));

  // Кадр 1 → 2
  const copyOpacity = useTransform(p, [0, 0.16, 0.28], [1, 1, 0]);
  const copyY = useTransform(p, [0, 0.28], [0, -90]);
  const stationLeft = useTransform(p, [0, 0.24, 0.48], ["66%", "66%", "50%"]);
  const stationScale = useTransform(p, [0, 0.24, 0.48, 0.62, 0.92], [1, 1, 1.04, 1.04, 7.2]);
  // «перевод фокуса» между ракурсами: 3/4 уходит в размытие, фронтальный вид проявляется
  const frontOpacity = useTransform(p, [0.28, 0.4], [0, 1]);
  const frontBlur = useTransform(p, [0.28, 0.4], ["blur(14px)", "blur(0px)"]);
  const sideOpacity = useTransform(p, [0.26, 0.36], [1, 0]);
  const sideBlur = useTransform(p, [0.26, 0.36], ["blur(0px)", "blur(16px)"]);
  const vignette = useTransform(p, [0.66, 0.82], [0, 1]);
  const calloutOpacity = useTransform(p, [0.42, 0.5, 0.58, 0.64], [0, 1, 1, 0]);
  const beat2Opacity = useTransform(p, [0.4, 0.48, 0.58, 0.64], [0, 1, 1, 0]);
  const beat2Y = useTransform(p, [0.4, 0.48], [30, 0]);
  // Кадр 3: экран станции становится интерфейсом приложения
  const screenOpacity = useTransform(p, [0.6, 0.74], [0, 1]);
  const beat3Opacity = useTransform(p, [0.76, 0.84, 0.94, 0.99], [0, 1, 1, 0]);
  const fadeOut = useTransform(p, [0.94, 1], [0, 1]);
  const sceneOpacity = useTransform(p, [0.55, 0.72], [1, 0]);
  const hintOpacity = useTransform(p, [0, 0.06], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative h-[320vh] bg-ink text-floral">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <Stage>
          <motion.div style={{ opacity: sceneOpacity }} className="absolute inset-0">
            <MarkScene progress={progress} />
          </motion.div>
        </Stage>

        {/* Станция: 3/4 → фронт → наезд в экран */}
        <motion.div
          style={{ left: stationLeft, scale: stationScale, transformOrigin: "50% 49%" }}
          className="absolute bottom-[16%] h-[74vh] w-[calc(74vh*0.4593)] -translate-x-1/2 will-change-transform"
        >
          <motion.div style={{ opacity: sideOpacity, filter: sideBlur }} className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/station-3q-screen.webp" alt="" aria-hidden className="absolute bottom-0 left-1/2 h-[104%] w-auto max-w-none -translate-x-[54%]" />
          </motion.div>
          <motion.div style={{ opacity: frontOpacity, filter: frontBlur }} className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/station-front-screen.webp" alt={t.hero.concept} className="absolute inset-0 h-full w-full" />
            <Reflection src="/media/station-front-screen.webp" />
            {/* экран станции: x 38.4–61.6%, y 39.7–58.6% от изображения */}
            <motion.div style={{ opacity: screenOpacity }} className="absolute top-[39.7%] left-[38.4%] h-[18.9%] w-[23.2%] overflow-hidden rounded-[2px] bg-ink">
              <ScreenUI />
            </motion.div>
            <Callouts t={t} opacity={calloutOpacity} />
          </motion.div>
        </motion.div>

        {/* затемнение корпуса при наезде — фокус на экране */}
        <motion.div
          style={{ opacity: vignette }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side_at_50%_50%,transparent_42%,rgb(19_18_20/0.92)_80%)]"
        />

        {/* Кадр 1: обложка */}
        <motion.div style={{ opacity: copyOpacity, y: copyY }} className="absolute inset-0 flex items-center">
          <div className="container-x">
            <HeroCopy t={t} className="max-w-[40rem] pt-16" />
          </div>
        </motion.div>

        {/* Кадр 2 */}
        <motion.div style={{ opacity: beat2Opacity, y: beat2Y }} className="pointer-events-none absolute inset-x-0 bottom-[8%]">
          <div className="container-x">
            <p className="max-w-sm text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.08] font-semibold tracking-[-0.03em]">{t.hero.beat2}</p>
          </div>
        </motion.div>

        {/* Кадр 3 */}
        <motion.div style={{ opacity: beat3Opacity }} className="pointer-events-none absolute inset-0 flex items-center">
          <div className="container-x flex justify-between">
            <p className="max-w-[17rem] text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.08] font-semibold tracking-[-0.03em]">{t.hero.beat3}</p>
            <a href="#howto" className="pointer-events-auto btn-primary self-end">{t.nav.howto} →</a>
          </div>
        </motion.div>

        <motion.div style={{ opacity: hintOpacity }} className="absolute inset-x-0 bottom-6">
          <div className="container-x flex items-end justify-between text-[12px] text-floral/45">
            <span className="flex items-center gap-2">
              <span className="relative h-8 w-5 rounded-full border border-floral/30">
                <motion.span
                  className="absolute top-1.5 left-1/2 h-1.5 w-1 -translate-x-1/2 rounded-full bg-floral/70"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
              </span>
              {t.hero.scroll}
            </span>
            <span>{t.hero.concept}</span>
          </div>
        </motion.div>

        <motion.div style={{ opacity: fadeOut }} className="pointer-events-none absolute inset-0 bg-floral" />
      </div>
    </section>
  );
}

function Callouts({ t, opacity }: { t: Dictionary; opacity: MotionValue<number> }) {
  // координаты точек в % от фронтального изображения станции
  const items = [
    { x: 30, y: 69, label: t.hero.callouts[0], side: "left" as const },
    { x: 50, y: 49, label: t.hero.callouts[1], side: "right" as const },
    { x: 69, y: 64, label: t.hero.callouts[2], side: "right" as const },
  ];
  return (
    <motion.div style={{ opacity }} className="pointer-events-none absolute inset-0">
      {items.map((c) => (
        <div key={c.label} className="absolute" style={{ left: `${c.x}%`, top: `${c.y}%` }}>
          <span className="absolute -top-1.5 -left-1.5 h-3 w-3 rounded-full bg-malachite shadow-[0_0_0_6px_rgb(2_216_102/0.25)]" />
          <span
            className={`absolute top-0 h-px w-[min(16vw,190px)] bg-floral/40 ${c.side === "left" ? "right-3" : "left-3"}`}
          />
          <span
            className={`absolute -top-3.5 rounded-full bg-ink/75 px-2.5 py-1 text-[13px] font-medium whitespace-nowrap text-floral backdrop-blur ${
              c.side === "left" ? "right-[calc(min(16vw,190px)+20px)]" : "left-[calc(min(16vw,190px)+20px)]"
            }`}
          >
            {c.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

function StaticHero({ t }: { t: Dictionary }) {
  return (
    <section id="top" className="relative overflow-hidden bg-ink pt-24 text-floral">
      <Stage>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/mark.svg" alt="" aria-hidden className="absolute top-[42%] left-1/2 w-[130%] max-w-[760px] -translate-x-1/2 opacity-[0.08] blur-[2px]" />
      </Stage>
      <div className="container-x relative grid gap-6 pb-10 lg:grid-cols-2 lg:items-center lg:pb-20">
        <HeroCopy t={t} />
        <div className="relative mx-auto h-[min(62vh,520px)] w-[calc(min(62vh,520px)*0.4593)] lg:h-[70vh] lg:w-[calc(70vh*0.4593)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/station-front-screen.webp" alt={t.hero.concept} className="h-full w-full animate-float" />
        </div>
      </div>
      <p className="container-x relative pb-6 text-[12px] text-floral/40">{t.hero.concept}</p>
    </section>
  );
}
