"use client";

import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { ProductView } from "@/lib/products";
import { fill, type Dictionary } from "@/lib/i18n/dictionaries";
import { SHOP } from "@/lib/config";
import { formatVnd, mlToOz } from "@/lib/format";
import { useCart } from "@/lib/cart-store";
import LazyBottleCanvas from "./three/LazyBottleCanvas";
import { CardIcon, ChatIcon, RotateIcon, TruckIcon } from "./icons";
import { brand } from "@/brand/brand";

function Switch({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      className={`relative h-[30px] w-[52px] shrink-0 rounded-full border border-ivory/30 transition-colors ${on ? "bg-accent" : "bg-ivory/5"}`}
    >
      <span className={`absolute top-[3px] h-[22px] w-[22px] rounded-full bg-ivory transition-[left] ${on ? "left-[25px]" : "left-[3px]"}`} />
    </button>
  );
}

export function ProductPurchase({ product, locale, t, hero }: { product: ProductView; locale: Locale; t: Dictionary["product"]; hero: Dictionary["hero"] }) {
  const defaultVariant = product.variants.find((v) => v.sizeMl === 50 && v.stock > 0) ?? product.variants.find((v) => v.stock > 0) ?? product.variants[0];
  const [variantId, setVariantId] = useState(defaultVariant?.id);
  const [engrave, setEngrave] = useState(false);
  const [text, setText] = useState("");
  const [gift, setGift] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);

  const variant = product.variants.find((v) => v.id === variantId) ?? defaultVariant;
  if (!variant) return null;
  const soldOut = variant.stock <= 0;
  const maxQty = Math.max(1, Math.min(SHOP.maxQtyPerLine, variant.stock));
  const engraving = engrave && text.trim() ? text.trim() : null;

  function addToCart() {
    add({
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      shape: product.shape,
      tint: product.tint,
      sizeMl: variant.sizeMl,
      price: variant.price,
      quantity: Math.min(qty, maxQty),
      engraving,
      giftWrap: gift,
    });
    setAdded(true);
  }

  return (
    <div className="flex flex-wrap items-start gap-16">
      {/* 3D viewer */}
      <div className="flex min-w-0 flex-[1_1_560px] flex-col gap-4">
        <div
          className="relative h-[520px] overflow-hidden md:h-[660px]"
          style={{ background: `radial-gradient(ellipse at 50% 40%, ${product.tint}40 0%, #15110E 62%, #100D0A 100%)` }}
        >
          <LazyBottleCanvas
            mode="viewer"
            autoRotate={!engrave}
            shape={product.shape}
            tint={product.tint}
            name={product.name}
            sizeLabel={`${variant.sizeMl} ml · ${mlToOz(variant.sizeMl)}`}
            engraving={engraving}
          />
          <p className="pointer-events-none absolute inset-x-0 bottom-4 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.25em] text-smoke">
            <RotateIcon /> {hero.dragHint}
          </p>
        </div>
      </div>

      {/* Purchase panel */}
      <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-7">
        <div className="flex flex-col gap-3.5">
          <p className="eyebrow animate-fade-up">{brand.productLine} · {t.collectionName}</p>
          <h1 className="animate-fade-up font-display text-[56px] font-normal leading-none [animation-delay:150ms] md:text-[72px]">{product.name}</h1>
          <p className="animate-fade-up font-display text-2xl italic text-sand [animation-delay:300ms]">{product.tagline}</p>
        </div>
        <p className="animate-fade-up text-[15px] leading-[1.85] text-[#BDB3A2] [animation-delay:400ms]">{product.description}</p>

        <div className="h-px bg-ivory/10" />

        {/* Size */}
        <div className="flex flex-col gap-3.5">
          <div className="flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-[0.25em] text-smoke">{t.size}</span>
            <span className="font-display text-[30px] text-accent-light">{formatVnd(variant.price, locale)}</span>
          </div>
          <div role="group" aria-label={t.size} className="grid grid-cols-3 gap-3">
            {product.variants.map((v) => {
              const on = v.id === variant.id;
              const out = v.stock <= 0;
              return (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={on}
                  disabled={out}
                  onClick={() => {
                    setVariantId(v.id);
                    setAdded(false);
                    setQty(1);
                  }}
                  className={`flex min-h-[76px] flex-col items-center justify-center gap-1 border p-3 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    on ? "border-ivory bg-ivory text-ink" : "border-ivory/25 text-ivory hover:border-accent-light"
                  }`}
                >
                  <span className="text-lg font-medium">{v.sizeMl} ml</span>
                  <span className="text-[11px] tracking-wide opacity-80">{out ? t.outOfStock : t.sizeNotes[v.sizeMl] ?? ""}</span>
                </button>
              );
            })}
          </div>
          {!soldOut && variant.stock <= 5 && <p className="text-xs text-accent-light">{fill(t.lowStock, { n: variant.stock })}</p>}
        </div>

        {/* Engraving */}
        <div className="flex flex-col gap-3.5 border border-ivory/10 bg-ink-2 p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[15px] font-normal">{t.engraveTitle}</span>
              <span className="text-xs text-smoke">{t.engraveSub}</span>
            </div>
            <Switch on={engrave} onToggle={() => setEngrave((v) => !v)} label={t.engraveTitle} />
          </div>
          {engrave && (
            <div className="flex animate-toast flex-col gap-2">
              <label htmlFor="engrave" className="text-xs text-smoke">{t.engraveLabel}</label>
              <input
                id="engrave"
                value={text}
                maxLength={SHOP.engravingMaxLength}
                onChange={(e) => setText(e.target.value)}
                placeholder={t.engravePlaceholder}
                className="field font-display text-xl italic"
              />
              <span className="text-xs text-ash">
                {text.length}/{SHOP.engravingMaxLength} · {fill(t.engraveHint, { n: SHOP.engravingMaxLength })}
              </span>
            </div>
          )}
        </div>

        {/* Gift */}
        <div className="flex items-center justify-between gap-4 border border-ivory/10 bg-ink-2 p-5">
          <div className="flex flex-col gap-1">
            <span className="text-[15px] font-normal">{t.giftTitle}</span>
            <span className="text-xs text-smoke">{fill(t.giftSub, { fee: formatVnd(SHOP.giftWrapFee, locale) })}</span>
          </div>
          <Switch on={gift} onToggle={() => setGift((v) => !v)} label={t.giftTitle} />
        </div>

        {/* Qty + add */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center border border-ivory/30">
            <button type="button" aria-label={t.decrease} onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-14 w-12 text-xl">−</button>
            <span aria-live="polite" className="min-w-9 text-center">{qty}</span>
            <button type="button" aria-label={t.increase} onClick={() => setQty((q) => Math.min(maxQty, q + 1))} className="h-14 w-12 text-xl">+</button>
          </div>
          <button type="button" disabled={soldOut} onClick={addToCart} className="btn-primary min-h-[58px] flex-[1_1_220px]">
            {soldOut ? t.outOfStock : t.addToCart}
          </button>
        </div>
        {added && (
          <div role="status" className="flex animate-toast flex-wrap items-center justify-between gap-3 border border-accent-light/40 bg-accent/10 px-5 py-4 text-sm">
            <span>
              {t.added}: {product.name} · {variant.sizeMl} ml × {qty}
              {engraving ? ` · “${engraving}”` : ""}
            </span>
            <Link href={`/${locale}/cart`} className="link-underline text-xs">{t.viewCart}</Link>
          </div>
        )}

        <ul className="flex flex-col gap-3 text-[13px] text-smoke">
          {[TruckIcon, CardIcon, ChatIcon].map((Icon, i) => (
            <li key={i} className="flex items-center gap-3">
              <Icon className="text-accent-light" /> {t.perks[i]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
