import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { prisma } from "@/lib/prisma";
import { formatVnd } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false } };

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ code?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { code } = await searchParams;
  const t = getDictionary(locale);

  const order = code
    ? await prisma.order.findUnique({ where: { code }, include: { items: true } })
    : null;

  if (!order) {
    return (
      <section className="container-x flex flex-col items-center gap-6 py-28 text-center">
        <p className="font-display text-3xl">{t.success.notFound}</p>
        <Link href={`/${locale}`} className="btn-ghost">{t.success.back}</Link>
      </section>
    );
  }

  const bank = order.paymentMethod === "BANK_TRANSFER" && process.env.BANK_BIN && process.env.BANK_ACCOUNT_NO;
  const qrUrl = bank
    ? `https://img.vietqr.io/image/${process.env.BANK_BIN}-${process.env.BANK_ACCOUNT_NO}-compact2.png?amount=${order.total}&addInfo=${encodeURIComponent(order.code)}&accountName=${encodeURIComponent(process.env.BANK_ACCOUNT_NAME ?? "")}`
    : null;

  const message =
    order.paymentStatus === "PAID"
      ? t.success.paid
      : order.paymentStatus === "FAILED"
        ? t.success.failed
        : order.paymentMethod === "BANK_TRANSFER"
          ? t.success.bankText
          : t.success.codText;

  return (
    <section className="container-x flex flex-col items-center gap-10 py-24 text-center">
      <div className="flex animate-fade-up flex-col items-center gap-5">
        <p className="eyebrow">{t.success.code}: {order.code}</p>
        <h1 className="font-display text-[48px] font-normal leading-tight md:text-[60px]">{t.success.title}</h1>
        <p className="max-w-xl text-[15px] leading-8 text-[#BDB3A2]">{message}</p>
      </div>

      {qrUrl && order.paymentStatus !== "PAID" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={qrUrl} alt={`VietQR ${order.code}`} width={300} height={300} className="rounded bg-white p-3" />
      )}

      <div className="w-full max-w-lg border border-ivory/10 bg-ink-2 p-8 text-left">
        <h2 className="mb-4 text-xs uppercase tracking-[0.25em] text-smoke">{t.success.items}</h2>
        <ul className="flex flex-col gap-3 text-sm">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between gap-4">
              <span className="text-sand">
                {i.productName} · {i.sizeMl} ml × {i.quantity}
                {i.engraving && <em className="block font-display text-base text-smoke">“{i.engraving}”</em>}
              </span>
              <span>{formatVnd(i.unitPrice * i.quantity, locale)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex items-baseline justify-between border-t border-ivory/15 pt-4">
          <span className="text-xs uppercase tracking-[0.25em] text-smoke">{t.cart.total}</span>
          <span className="font-display text-3xl text-accent-light">{formatVnd(order.total, locale)}</span>
        </div>
      </div>

      <Link href={`/${locale}`} className="btn-ghost">{t.success.back}</Link>
    </section>
  );
}
