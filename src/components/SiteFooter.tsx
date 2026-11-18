import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Newsletter } from "./Newsletter";
import { brand } from "@/brand/brand";

export function SiteFooter({ locale, t }: { locale: Locale; t: Dictionary }) {
  const home = `/${locale}`;
  return (
    <footer className="border-t border-ivory/10 bg-[#0A0907]">
      <div className="container-x flex flex-col gap-16 pb-10 pt-20">
        <div className="flex flex-wrap justify-between gap-12">
          <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-4">
            <span className="font-display text-[26px] tracking-[0.25em]">{brand.wordmark}</span>
            <p className="max-w-[360px] text-sm leading-7 text-smoke">{t.newsletter.text}</p>
            <Newsletter t={t.newsletter} locale={locale} />
          </div>
          <div className="flex flex-wrap gap-16 text-sm">
            <div className="flex flex-col gap-3.5">
              <span className="text-xs uppercase tracking-[0.25em] text-ash">{t.footer.shop}</span>
              <Link href={`${home}#collection`} className="text-sand hover:text-accent-light">{t.nav.collection}</Link>
              <Link href={`${home}#services`} className="text-sand hover:text-accent-light">Discovery Set</Link>
              <Link href={`${home}#services`} className="text-sand hover:text-accent-light">{t.footer.gifts}</Link>
            </div>
            <div className="flex flex-col gap-3.5">
              <span className="text-xs uppercase tracking-[0.25em] text-ash">{t.footer.help}</span>
              <Link href={`${home}#services`} className="text-sand hover:text-accent-light">{t.nav.boutique}</Link>
              <Link href={`${home}#services`} className="text-sand hover:text-accent-light">{t.footer.shipping}</Link>
              <Link href={`${home}#services`} className="text-sand hover:text-accent-light">{t.footer.contact}</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-ivory/10 pt-7 text-xs text-ash">{t.footer.copyright}</div>
      </div>
    </footer>
  );
}
