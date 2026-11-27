import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter_Tight } from "next/font/google";
import { getDictionary } from "@/i18n/get-dictionary";
import { htmlLang, isLocale, locales } from "@/i18n/config";
import { site } from "@/lib/site";
import "../globals.css";

// Фирменный шрифт по брендбуку (стр. 8)
const interTight = Inter_Tight({ subsets: ["latin", "cyrillic"], variable: "--font-inter-tight", display: "swap" });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: "#131214" };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getDictionary(locale);
  return {
    metadataBase: new URL(site.url),
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [htmlLang[l], `/${l}`])),
    },
    openGraph: { title: t.meta.title, description: t.meta.description, type: "website", locale },
    icons: { icon: "/brand/favicon.svg" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={htmlLang[locale]} className={interTight.variable}>
      <body className="min-h-dvh overflow-x-clip">{children}</body>
    </html>
  );
}
