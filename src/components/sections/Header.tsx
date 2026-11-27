"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "@/components/ui/Logo";
import { localeLabels, locales, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/ru";

export default function Header({ t, locale }: { t: Dictionary; locale: Locale }) {
  const [onDark, setOnDark] = useState(true); // шапка над тёмным hero
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const hero = document.getElementById("top");
      if (!hero) return setOnDark(false);
      const r = hero.getBoundingClientRect();
      const pinned = r.height - window.innerHeight; // >0 для кинематографичной версии
      // в конце пиннинга hero растворяется в светлый фон — шапка переключается чуть раньше
      setOnDark(pinned > 0 ? -r.top / pinned < 0.93 : r.bottom > 72);
      setScrolled(window.scrollY > 16);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const links = [
    ["#support", t.nav.support],
    ["#howto", t.nav.howto],
    ["#stations", t.nav.stations],
    ["#club", t.nav.club],
    ["#business", t.nav.business],
    ["#contacts", t.nav.contacts],
  ] as const;

  const dark = onDark && !open;
  const shell = dark
    ? scrolled
      ? "bg-ink/60 backdrop-blur-xl border-white/10"
      : "bg-transparent border-transparent"
    : "bg-floral/85 backdrop-blur-xl border-line";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-floral">
        {t.skip}
      </a>
      <div className={`border-b transition-colors duration-500 ${shell}`}>
        <div className="container-x flex h-[68px] items-center justify-between gap-4">
          <Link href={`/${locale}`} aria-label="EnerGo" className="shrink-0">
            <Logo variant={dark ? "dark" : "green"} className="h-[26px]" />
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
            {links.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className={`rounded-full px-3.5 py-2 text-[14px] transition ${
                  dark ? "text-floral/70 hover:bg-white/10 hover:text-floral" : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                }`}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className={`hidden rounded-full p-1 text-[12px] font-semibold sm:flex ${dark ? "bg-white/10" : "bg-ink/5"}`}>
              {locales.map((l) => (
                <Link
                  key={l}
                  href={`/${l}`}
                  hrefLang={l}
                  className={`rounded-full px-2.5 py-1.5 transition ${
                    l === locale ? (dark ? "bg-floral text-ink" : "bg-ink text-floral") : dark ? "text-floral/60 hover:text-floral" : "text-ink/50 hover:text-ink"
                  }`}
                >
                  {localeLabels[l]}
                </Link>
              ))}
            </div>
            <a href="#app" className="btn-primary hidden h-10 px-4 text-[14px] md:inline-flex">
              {t.nav.download}
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              className={`grid h-10 w-10 place-items-center rounded-full lg:hidden ${dark ? "bg-white/10 text-floral" : "bg-ink/5 text-ink"}`}
              aria-label={t.nav.menu}
              aria-expanded={open}
            >
              <span className="relative block h-3 w-[18px]">
                <span className={`absolute left-0 h-[2px] w-[18px] rounded bg-current transition ${open ? "top-[5px] rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-[2px] w-[18px] rounded bg-current transition ${open ? "top-[5px] -rotate-45" : "top-[10px]"}`} />
              </span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-0 top-[68px] bottom-0 overflow-y-auto bg-floral lg:hidden"
          >
            <nav className="container-x flex flex-col py-6" aria-label="Mobile">
              {links.map(([href, label], i) => (
                <motion.a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * i }}
                  className="border-b border-line py-4 text-[26px] font-semibold tracking-tight"
                >
                  {label}
                </motion.a>
              ))}
              <div className="mt-6 flex gap-2">
                {locales.map((l) => (
                  <Link key={l} href={`/${l}`} className={`rounded-full px-4 py-2 text-sm font-semibold ${l === locale ? "bg-ink text-floral" : "bg-ink/5"}`}>
                    {localeLabels[l]}
                  </Link>
                ))}
              </div>
              <a href="#app" onClick={() => setOpen(false)} className="btn-primary mt-6">
                {t.nav.download}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
