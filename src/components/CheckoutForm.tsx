"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { useCart } from "@/lib/cart-store";
import { customerSchema, type CustomerField } from "@/lib/validation";
import { formatVnd } from "@/lib/format";
import { OrderTotals } from "./OrderSummary";
import { useHydrated } from "./useHydrated";

type Method = "COD" | "BANK_TRANSFER" | "VNPAY";

export function CheckoutForm({
  t,
  cartT,
  locale,
  methods,
}: {
  t: Dictionary["checkout"];
  cartT: Dictionary["cart"];
  locale: Locale;
  methods: Method[];
}) {
  const ready = useHydrated();
  const router = useRouter();
  const { lines, clear } = useCart();
  const [method, setMethod] = useState<Method>("COD");
  const [errors, setErrors] = useState<Partial<Record<CustomerField, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  if (!ready) return <div className="h-64" />;
  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-24 text-center">
        <p className="font-display text-3xl">{cartT.empty}</p>
        <Link href={`/${locale}#collection`} className="btn-ghost">{cartT.continue}</Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");
    const form = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = customerSchema.safeParse(form);
    if (!parsed.success) {
      const next: Partial<Record<CustomerField, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as CustomerField;
        if (field !== "note") next[field] = t.errors[field as Exclude<CustomerField, "note">];
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...parsed.data,
        locale,
        paymentMethod: method,
        items: lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity, engraving: l.engraving, giftWrap: l.giftWrap })),
      }),
    }).catch(() => null);
    const data = res ? await res.json().catch(() => ({})) : {};

    if (!res?.ok) {
      setSubmitting(false);
      setServerError(
        data.error === "out_of_stock"
          ? locale === "vi"
            ? `${data.detail ?? "Sản phẩm"} không đủ số lượng. Vui lòng giảm số lượng trong giỏ.`
            : `Not enough stock for ${data.detail ?? "an item"}. Please reduce the quantity.`
          : t.errorGeneric,
      );
      return;
    }
    clear();
    if (data.paymentUrl) window.location.href = data.paymentUrl;
    else router.push(`/${locale}/checkout/success?code=${data.code}`);
  }

  const field = (name: Exclude<CustomerField, "note">, label: string, type = "text", autoComplete?: string) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-xs text-smoke">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-err` : undefined}
        className={`field ${errors[name] ? "border-red-400" : ""}`}
      />
      {errors[name] && <span id={`${name}-err`} className="text-xs text-red-300">{errors[name]}</span>}
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-wrap items-start gap-12">
      <div className="flex min-w-0 flex-[2_1_520px] flex-col gap-10">
        <fieldset className="flex flex-col gap-5">
          <legend className="mb-5 font-display text-3xl">{t.contact}</legend>
          {field("customerName", t.name, "text", "name")}
          <div className="grid gap-5 sm:grid-cols-2">
            {field("phone", t.phone, "tel", "tel")}
            {field("email", t.email, "email", "email")}
          </div>
          {field("address", t.address, "text", "street-address")}
          {field("province", t.province, "text", "address-level1")}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="note" className="text-xs text-smoke">{t.note}</label>
            <textarea id="note" name="note" rows={3} className="field py-3" />
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-5 font-display text-3xl">{t.payment}</legend>
          {methods.map((m) => (
            <label
              key={m}
              className={`flex cursor-pointer items-start gap-4 border p-5 transition-colors ${method === m ? "border-accent-light bg-accent/10" : "border-ivory/20 hover:border-ivory/40"}`}
            >
              <input type="radio" name="paymentMethod" value={m} checked={method === m} onChange={() => setMethod(m)} className="mt-1 accent-[#C8873A]" />
              <span className="flex flex-col gap-1">
                <span className="text-[15px]">{t.methods[m].label}</span>
                <span className="text-xs text-smoke">{t.methods[m].hint}</span>
              </span>
            </label>
          ))}
        </fieldset>
      </div>

      <aside className="flex min-w-0 flex-[1_1_340px] flex-col gap-6 border border-ivory/10 bg-ink-2 p-8">
        <h2 className="font-display text-2xl">{t.summary}</h2>
        <ul className="flex flex-col gap-3 text-sm">
          {lines.map((l) => (
            <li key={l.key} className="flex justify-between gap-4">
              <span className="text-sand">
                {l.name} · {l.sizeMl} ml × {l.quantity}
                {l.engraving && <em className="block font-display text-base text-smoke">“{l.engraving}”</em>}
              </span>
              <span>{formatVnd(l.price * l.quantity, locale)}</span>
            </li>
          ))}
        </ul>
        <OrderTotals lines={lines} t={cartT} locale={locale} />
        {serverError && <p role="alert" className="text-sm text-red-300">{serverError}</p>}
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? t.placing : t.placeOrder}
        </button>
      </aside>
    </form>
  );
}
