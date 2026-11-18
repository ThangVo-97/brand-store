import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { vnpayEnabled } from "@/lib/vnpay";
import { CheckoutForm } from "@/components/CheckoutForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: isLocale(locale) ? getDictionary(locale).checkout.title : "Checkout", robots: { index: false } };
}

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const methods: ("COD" | "BANK_TRANSFER" | "VNPAY")[] = ["COD"];
  if (process.env.BANK_BIN && process.env.BANK_ACCOUNT_NO) methods.push("BANK_TRANSFER");
  if (vnpayEnabled()) methods.push("VNPAY");

  return (
    <section className="container-x py-20">
      <h1 className="mb-12 font-display text-[56px] font-normal">{t.checkout.title}</h1>
      <CheckoutForm t={t.checkout} cartT={t.cart} locale={locale} methods={methods} />
    </section>
  );
}
