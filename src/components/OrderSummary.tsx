"use client";

import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cartTotals, type CartLine } from "@/lib/cart-store";
import { formatVnd } from "@/lib/format";

export function OrderTotals({ lines, t, locale }: { lines: CartLine[]; t: Dictionary["cart"]; locale: Locale }) {
  const totals = cartTotals(lines);
  const row = (label: string, value: string) => (
    <div className="flex justify-between text-sm text-sand">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
  return (
    <div className="flex flex-col gap-3">
      {row(t.subtotal, formatVnd(totals.subtotal, locale))}
      {totals.giftFee > 0 && row(t.giftFee, formatVnd(totals.giftFee, locale))}
      {row(t.shipping, totals.shipping === 0 ? t.free : formatVnd(totals.shipping, locale))}
      <div className="mt-2 flex items-baseline justify-between border-t border-ivory/15 pt-4">
        <span className="text-xs uppercase tracking-[0.25em] text-smoke">{t.total}</span>
        <span className="font-display text-3xl text-accent-light">{formatVnd(totals.total, locale)}</span>
      </div>
    </div>
  );
}
