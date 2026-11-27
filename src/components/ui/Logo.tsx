/**
 * Оригинальный логотип EnerGo. Векторы извлечены без изменений из брендбука
 * (Energo Guideline.pdf, стр. 6 — четыре допустимые версии на фонах).
 * Не перерисовывать и не менять пропорции. Охранное поле — брендбук, стр. 4–5.
 */
const files = {
  green: "/brand/logo-green.svg", // на Floral White / светлом
  white: "/brand/logo-white.svg", // на Malachite
  dark: "/brand/logo-on-dark.svg", // на Chinese Black
  blue: "/brand/logo-on-blue.svg", // на Non-Photo Blue
} as const;

export default function Logo({ variant = "green", className = "h-7" }: { variant?: keyof typeof files; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={files[variant]} alt="EnerGo" width={552} height={106} className={`w-auto ${className}`} />;
}
