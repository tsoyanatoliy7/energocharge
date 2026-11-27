import Reveal from "./Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  lead,
  className = "",
  dark = false,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <Reveal className={`max-w-3xl ${className}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="h-section mt-4">{title}</h2>
      {lead && <p className={`mt-4 max-w-xl text-[17px] leading-relaxed ${dark ? "text-floral/65" : "text-muted"}`}>{lead}</p>}
    </Reveal>
  );
}
