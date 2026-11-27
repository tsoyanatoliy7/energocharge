import { site } from "@/lib/site";

const Apple = () => (
  <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="currentColor" aria-hidden>
    <path d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.74-.78-2.87-.76-1.47.02-2.83.86-3.59 2.18-1.53 2.66-.39 6.6 1.1 8.76.73 1.06 1.6 2.24 2.73 2.2 1.1-.05 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.07 2.65-2.13.84-1.22 1.18-2.41 1.2-2.47-.03-.01-2.3-.88-2.32-3.5ZM14.2 6.13c.6-.74 1.01-1.75.9-2.77-.87.04-1.93.58-2.55 1.31-.56.64-1.05 1.68-.92 2.67.97.08 1.97-.49 2.57-1.21Z" />
  </svg>
);
const Play = () => (
  <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" aria-hidden>
    <path d="M4 2.8v18.4c0 .4.4.6.7.4l10.2-9.6L4.7 2.4c-.3-.2-.7 0-.7.4Z" fill="#02d866" />
    <path d="m14.9 12 2.7 2.5 1.9-1.1c.9-.5.9-1.8 0-2.3l-1.9-1.1Z" fill="#98daf7" />
    <path d="M4.7 2.4 17.6 9.5 14.9 12Z" fill="#fafcf0" opacity=".85" />
    <path d="M4.7 21.6 17.6 14.5 14.9 12Z" fill="#01a84f" />
  </svg>
);

function Badge({ href, icon, top, bottom, tone }: { href: string; icon: React.ReactNode; top: string; bottom: string; tone: "dark" | "light" }) {
  const cls =
    tone === "dark"
      ? "bg-ink text-floral hover:bg-ink-3"
      : "border border-white/15 bg-white/10 text-floral backdrop-blur-md hover:bg-white/20";
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex h-12 items-center gap-2.5 rounded-2xl px-4 transition ${cls}`}>
      {icon}
      <span className="leading-none">
        <span className="block text-[10px] opacity-70">{top}</span>
        <span className="mt-0.5 block text-[15px] font-semibold">{bottom}</span>
      </span>
    </a>
  );
}

export default function StoreButtons({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      <Badge href={site.appStore} icon={<Apple />} top="Download on the" bottom="App Store" tone={tone} />
      <Badge href={site.googlePlay} icon={<Play />} top="Get it on" bottom="Google Play" tone={tone} />
    </div>
  );
}
