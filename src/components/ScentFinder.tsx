"use client";

import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { DropIcon } from "./icons";

type Mood = "WARM" | "FRESH" | "MYSTERY" | "CLEAN";
type Pick = { slug: string; name: string; notes: string; description: string; mood: Mood };

export function ScentFinder({ products, t, locale }: { products: Pick[]; t: Dictionary["finder"]; locale: Locale }) {
  const [mood, setMood] = useState<Mood | null>(null);
  const result = mood ? products.find((p) => p.mood === mood) : null;
  const moods = Object.keys(t.moods) as Mood[];

  return (
    <div className="flex flex-wrap items-stretch gap-16">
      <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-6">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2 className="heading-xl">{t.title}</h2>
        <p className="text-[15px] leading-8 text-[#BDB3A2]">{t.sub}</p>
        <div className="mt-2 grid grid-cols-2 gap-3.5">
          {moods.map((m) => {
            const on = m === mood;
            return (
              <button
                key={m}
                type="button"
                aria-pressed={on}
                onClick={() => setMood(m)}
                className={`flex min-h-[72px] flex-col gap-1 border px-5 py-4 text-left transition-colors ${
                  on ? "border-accent bg-accent text-ink" : "border-ivory/25 text-ivory hover:border-accent-light"
                }`}
              >
                <span className="text-base font-medium">{t.moods[m].label}</span>
                <span className={`text-xs ${on ? "" : "text-smoke"}`}>{t.moods[m].hint}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div aria-live="polite" className="flex min-w-0 flex-[1_1_380px] flex-col justify-center gap-4 border border-ivory/10 bg-ink-3 p-12">
        {result ? (
          <div key={result.slug} className="flex animate-toast flex-col gap-4">
            <p className="text-xs uppercase tracking-[0.3em] text-smoke">{t.result}</p>
            <h3 className="font-display text-[44px] font-medium text-accent">{result.name}</h3>
            <p className="text-[13px] tracking-wide text-sand">{result.notes}</p>
            <p className="text-[15px] leading-8 text-[#BDB3A2]">{result.description}</p>
            <div className="mt-2 flex flex-wrap gap-3.5">
              <Link href={`/${locale}/products/${result.slug}`} className="btn-primary bg-ivory hover:bg-accent-light">
                {locale === "vi" ? "Xem chi tiết" : "View details"}
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-3.5">
            <DropIcon className="text-accent-light" />
            <p className="font-display text-3xl leading-tight">{t.emptyTitle}</p>
            <p className="text-sm text-smoke">{t.emptyText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
