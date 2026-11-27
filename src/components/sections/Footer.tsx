import Logo from "@/components/ui/Logo";
import StoreButtons from "@/components/ui/StoreButtons";
import { site } from "@/lib/site";
import type { Dictionary } from "@/i18n/dictionaries/ru";
import { localeLabels, locales, type Locale } from "@/i18n/config";

export default function Footer({ t, locale }: { t: Dictionary; locale: Locale }) {
  const f = t.footer;
  const col = "text-[13px] font-semibold uppercase tracking-wider text-floral/40";
  const link = "text-[15px] text-floral/75 transition hover:text-malachite";
  return (
    <footer id="contacts" className="bg-ink pt-16 pb-8 text-floral">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div>
            <Logo variant="dark" className="h-8" />
            <p className="mt-5 max-w-xs text-floral/60">{f.tagline} Harakatga qo‘shil!</p>
            <div className="mt-6"><StoreButtons tone="light" /></div>
          </div>
          <nav aria-label={f.navigation}>
            <h3 className={col}>{f.navigation}</h3>
            <ul className="mt-4 space-y-2.5">
              {(["support", "howto", "stations", "club", "business"] as const).map((k) => (
                <li key={k}><a href={`#${k}`} className={link}>{t.nav[k]}</a></li>
              ))}
            </ul>
          </nav>
          <div>
            <h3 className={col}>{f.users}</h3>
            <ul className="mt-4 space-y-2.5">
              <li><a href={site.videoGuide} target="_blank" rel="noopener noreferrer" className={link}>{f.links.video}</a></li>
              <li><a href={site.map} target="_blank" rel="noopener noreferrer" className={link}>{f.links.map}</a></li>
              <li><a href="#club" className={link}>{f.links.club}</a></li>
              <li><a href={site.telegram} target="_blank" rel="noopener noreferrer" className={link}>{f.links.telegram}</a></li>
              <li><a href={site.privacy} target="_blank" rel="noopener noreferrer" className={link}>{f.links.privacy}</a></li>
            </ul>
          </div>
          <div>
            <h3 className={col}>{f.contacts}</h3>
            <div className="mt-4 space-y-4">
              <div>
                <div className="text-[13px] text-floral/45">{f.support}</div>
                <a href={site.phoneHref} className="text-2xl font-semibold tracking-tight transition hover:text-malachite">{site.phone}</a>
              </div>
              <div>
                <div className="text-[13px] text-floral/45">{f.email}</div>
                <a href={`mailto:${site.email}`} className={link}>{site.email}</a>
              </div>
              <div className="text-[14px] text-floral/60">
                {f.legal}
                <br />
                {f.address}
              </div>
              <div className="flex gap-2">
                {[
                  [site.telegram, "Telegram", "m21 4-18 7.5 6 2 2 6 3.5-4.5L19 19l2-15Z"],
                  [site.instagram, "Instagram", "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5.5-1.5h.01"],
                  [`mailto:${site.email}`, "E-mail", "M3 6h18v12H3zM3 6l9 7 9-7"],
                ].map(([href, label, d]) => (
                  <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-malachite hover:text-ink">
                    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden><path d={d} /></svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-[13px] text-floral/45 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} EnerGo · {f.legal}. {f.rights}</span>
          <div className="flex items-center gap-4">
            {locales.map((l: Locale) => (
              <a key={l} href={`/${l}`} className={l === locale ? "text-floral" : "hover:text-floral"}>{localeLabels[l]}</a>
            ))}
            <a href="#top" className="hover:text-floral">{f.top} ↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
