import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale } from "@/i18n/config";
import Header from "@/components/sections/Header";
import Hero from "@/components/hero/Hero";
import Support from "@/components/sections/Support";
import HowTo from "@/components/sections/HowTo";
import Stations from "@/components/sections/Stations";
import Club from "@/components/sections/Club";
import Business from "@/components/sections/Business";
import AppBand from "@/components/sections/AppBand";
import Footer from "@/components/sections/Footer";

// Порядок разделов повторяет драфт команды: быстро зарядиться → абонементы → бизнес → поддержка/контакты.
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getDictionary(locale);

  return (
    <>
      <Header t={t} locale={locale} />
      <main id="main">
        <Hero t={t} />
        <Support t={t} />
        <HowTo t={t} />
        <Stations t={t} />
        <Club t={t} />
        <Business t={t} />
        <AppBand t={t} />
      </main>
      <Footer t={t} locale={locale} />
    </>
  );
}
