import Reveal from "@/components/ui/Reveal";
import { site } from "@/lib/site";
import type { Dictionary } from "@/i18n/dictionaries/ru";

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

export default function Support({ t }: { t: Dictionary }) {
  const s = t.support;
  const items = [
    { href: site.phoneHref, title: s.call.title, value: site.phone, note: s.call.note, d: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z", external: false },
    { href: site.telegram, title: s.telegram.title, value: s.telegram.note, note: "Telegram", d: "m21 4-18 7.5 6 2 2 6 3.5-4.5L19 19l2-15ZM9 13.5 18 7", external: true },
    { href: "#guide", title: s.video.title, value: s.video.note, note: "YouTube", d: "M4 6h12a2 2 0 0 1 2 2v1l3-2v10l-3-2v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z", external: false },
  ];
  return (
    <section id="support" className="relative pt-20 pb-10 sm:pt-28">
      <div className="container-x">
        <Reveal className="card overflow-hidden p-6 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:items-center">
            <div>
              <span className="eyebrow">{s.eyebrow}</span>
              <h2 className="mt-3 text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight font-semibold tracking-[-0.03em]">{s.title}</h2>
              <p className="mt-3 text-muted">{s.lead}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {items.map((i) => (
                <a
                  key={i.title}
                  href={i.href}
                  {...(i.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group relative flex flex-col justify-between gap-6 overflow-hidden rounded-[22px] border border-line bg-floral/60 p-5 transition duration-500 hover:-translate-y-1 hover:border-malachite/60 hover:bg-paper hover:shadow-[0_20px_50px_-24px_rgb(2_216_102/0.45)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-malachite/12 text-malachite-deep transition group-hover:bg-malachite group-hover:text-ink">
                      <Icon d={i.d} />
                    </span>
                    <span className="text-ink/30 transition group-hover:translate-x-1 group-hover:text-ink">→</span>
                  </div>
                  <div>
                    <div className="text-[13px] text-muted">{i.title}</div>
                    <div className="mt-1 text-[17px] font-semibold">{i.value}</div>
                    <div className="mt-1 text-[13px] text-muted">{i.note}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
