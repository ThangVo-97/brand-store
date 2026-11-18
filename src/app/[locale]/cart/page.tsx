import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { CartView } from "@/components/CartView";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: isLocale(locale) ? getDictionary(locale).cart.title : "Cart", robots: { index: false } };
}

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return (
    <section className="container-x py-20">
      <h1 className="mb-12 font-display text-[56px] font-normal">{t.cart.title}</h1>
      <CartView t={t.cart} locale={locale} />
    </section>
  );
}
