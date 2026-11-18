"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { useCart, cartTotals } from "@/lib/cart-store";
import { BagIcon } from "./icons";
import { brand } from "@/brand/brand";

export function SiteHeader({ locale, t }: { locale: Locale; t: Dictionary["nav"] }) {
  const pathname = usePathname();
  const router = useRouter();
  const lines = useCart((s) => s.lines);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const count = mounted ? cartTotals(lines).count : 0;

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; samesite=lax`;
    router.push(pathname.replace(/^\/(vi|en)/, `/${next}`));
  };

  const home = `/${locale}`;
  const links = [
    { href: `${home}#collection`, label: t.collection },
    { href: `${home}#finder`, label: t.finder },
    { href: `${home}#story`, label: t.story },
    { href: `${home}#services`, label: t.boutique },
  ];

  return (
    <header className="border-b border-ivory/10">
      <nav className="container-x flex flex-wrap items-center justify-between gap-5 py-5">
        <Link href={home} className="font-display text-[26px] font-medium tracking-[0.25em] text-ivory hover:text-ivory">
          {brand.wordmark}
        </Link>
        <div className="order-3 flex w-full flex-wrap gap-x-8 gap-y-2 text-[13px] uppercase tracking-[0.15em] md:order-none md:w-auto">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sand hover:text-accent-light">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div role="group" aria-label={t.language} className="mr-2 flex border border-ivory/25">
            {(["vi", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => switchTo(l)}
                aria-pressed={l === locale}
                className={`h-9 min-w-11 text-xs font-medium uppercase tracking-[0.15em] transition-colors ${
                  l === locale ? "bg-ivory text-ink" : "text-sand hover:text-ivory"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <Link href={`/${locale}/cart`} aria-label={t.cart} className="relative flex h-11 w-11 items-center justify-center text-ivory hover:text-accent-light">
            <BagIcon />
            {count > 0 && (
              <span className="absolute right-0.5 top-1 flex h-[18px] min-w-[18px] animate-toast items-center justify-center rounded-full bg-accent px-1 text-[11px] font-medium text-ink">
                {count}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
