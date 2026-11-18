"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { fill, type Dictionary } from "@/lib/i18n/dictionaries";
import { useCart, cartTotals } from "@/lib/cart-store";
import { SHOP } from "@/lib/config";
import { formatVnd } from "@/lib/format";
import { BottleIllustration } from "./BottleIllustration";
import { OrderTotals } from "./OrderSummary";
import { useHydrated } from "./useHydrated";

type Shape = "RECT" | "CYLINDER" | "FACETED" | "ROUND";

export function CartView({ t, locale }: { t: Dictionary["cart"]; locale: Locale }) {
  const ready = useHydrated();
  const { lines, setQuantity, remove } = useCart();
  if (!ready) return <div className="h-64" />;

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-24 text-center">
        <p className="font-display text-3xl">{t.empty}</p>
        <Link href={`/${locale}#collection`} className="btn-ghost">{t.continue}</Link>
      </div>
    );
  }

  const { subtotal } = cartTotals(lines);
  const missing = SHOP.freeShippingFrom - subtotal;

  return (
    <div className="flex flex-wrap items-start gap-12">
      <ul className="flex min-w-0 flex-[2_1_560px] flex-col border-t border-ivory/15">
        {lines.map((l) => (
          <li key={l.key} className="flex flex-wrap items-center gap-6 border-b border-ivory/15 py-6">
            <Link href={`/${locale}/products/${l.slug}`} className="flex h-32 w-24 shrink-0 items-center justify-center bg-ink-3">
              <BottleIllustration shape={l.shape as Shape} tint={l.tint} name={l.name} className="h-28 w-20" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Link href={`/${locale}/products/${l.slug}`} className="font-display text-2xl text-ivory hover:text-accent-light">{l.name}</Link>
              <span className="text-sm text-smoke">{l.sizeMl} ml · {formatVnd(l.price, locale)}</span>
              {l.engraving && <span className="text-sm text-sand">{t.engraving}: <em className="font-display text-base">“{l.engraving}”</em></span>}
              {l.giftWrap && <span className="text-sm text-sand">{t.giftWrap}</span>}
            </div>
            <div className="flex items-center border border-ivory/30">
              <button type="button" aria-label="−" onClick={() => setQuantity(l.key, l.quantity - 1)} className="h-11 w-10">−</button>
              <span className="min-w-8 text-center text-sm">{l.quantity}</span>
              <button type="button" aria-label="+" onClick={() => setQuantity(l.key, l.quantity + 1)} className="h-11 w-10">+</button>
            </div>
            <span className="w-32 text-right text-sm">{formatVnd(l.price * l.quantity, locale)}</span>
            <button type="button" onClick={() => remove(l.key)} className="text-xs uppercase tracking-[0.15em] text-ash hover:text-accent-light">
              {t.remove}
            </button>
          </li>
        ))}
      </ul>

      <aside className="flex min-w-0 flex-[1_1_320px] flex-col gap-6 border border-ivory/10 bg-ink-2 p-8">
        <OrderTotals lines={lines} t={t} locale={locale} />
        {missing > 0 && <p className="text-xs text-accent-light">{fill(t.freeShippingHint, { amount: formatVnd(missing, locale) })}</p>}
        <Link href={`/${locale}/checkout`} className="btn-primary w-full">{t.checkout}</Link>
        <Link href={`/${locale}#collection`} className="text-center text-xs uppercase tracking-[0.15em] text-smoke hover:text-accent-light">{t.continue}</Link>
      </aside>
    </div>
  );
}
