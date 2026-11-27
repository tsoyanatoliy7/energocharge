"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import StoreButtons from "@/components/ui/StoreButtons";
import type { Dictionary } from "@/i18n/dictionaries/ru";

export default function AppBand({ t }: { t: Dictionary }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const markRotate = useTransform(scrollYProgress, [0, 1], [-30, 40]);
  const stationY = useTransform(scrollYProgress, [0, 1], ["18%", "-6%"]);

  return (
    <section id="app" className="py-10 sm:py-16">
      <div className="container-x">
        <div ref={ref} className="relative overflow-hidden rounded-[36px] bg-malachite text-ink">
          {/* фирменный суперграфический элемент: знак крупным планом (брендбук, стр. 9–12) */}
          <motion.div
            aria-hidden
            style={{ rotate: markRotate, maskImage: "url(/brand/mark.svg)", WebkitMaskImage: "url(/brand/mark.svg)" }}
            className="pointer-events-none absolute top-1/2 -right-[18%] aspect-square h-[150%] -translate-y-1/2 bg-ink/[0.07] [mask-size:contain] [mask-repeat:no-repeat]"
          />
          <div className="relative grid gap-6 p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr] lg:p-16">
            <div className="max-w-xl">
              <h2 className="text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.02] font-semibold tracking-[-0.035em]">{t.app.title}</h2>
              <p className="mt-4 text-[17px] text-ink/75">{t.app.text}</p>
              <div className="mt-8">
                <StoreButtons />
              </div>
            </div>
            <motion.div style={{ y: stationY }} className="relative hidden h-[420px] lg:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/station-3q-mark.webp" alt="EnerGo station (brand book visual)" loading="lazy" className="absolute right-6 bottom-[-60px] h-[520px] w-auto drop-shadow-[0_40px_40px_rgb(19_18_20/0.35)]" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
