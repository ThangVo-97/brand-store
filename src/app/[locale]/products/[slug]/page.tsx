import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { fill, getDictionary } from "@/lib/i18n/dictionaries";
import { getProduct, getProducts } from "@/lib/products";
import { SHOP } from "@/lib/config";
import { formatVnd } from "@/lib/format";
import { ProductPurchase } from "@/components/ProductPurchase";
import { ProductCard } from "@/components/ProductCard";
import { Accordion } from "@/components/Accordion";
import { Reveal } from "@/components/Reveal";
import { brand } from "@/brand/brand";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const p = await getProduct(slug, locale);
  return p ? { title: p.name, description: p.tagline } : {};
}

const tierStyle = {
  top: { width: "46%", bg: "linear-gradient(180deg,#F3D9A0,#E3B479)", fg: "#1A1612", clip: "polygon(18% 0,82% 0,100% 100%,0 100%)" },
  heart: { width: "72%", bg: "linear-gradient(180deg,#D9964B,#B06A2A)", fg: "#1A1612", clip: "polygon(9% 0,91% 0,100% 100%,0 100%)" },
  base: { width: "100%", bg: "linear-gradient(180deg,#7A4418,#3E2210)", fg: "#F2EBDD", clip: "polygon(6% 0,94% 0,100% 100%,0 100%)" },
} as const;

export default async function ProductPage({ params }: Params) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const product = await getProduct(slug, locale);
  if (!product) notFound();
  const related = (await getProducts(locale)).filter((p) => p.slug !== slug).slice(0, 3);

  const details = t.product.details.map((d) => ({ ...d, body: fill(d.body, { free: formatVnd(SHOP.freeShippingFrom, locale) }) }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: brand.name },
    offers: product.variants.map((v) => ({
      "@type": "Offer",
      priceCurrency: "VND",
      price: v.price,
      availability: v.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      name: `${v.sizeMl} ml`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="container-x flex flex-wrap gap-2.5 pt-6 text-xs tracking-wide text-ash">
        <Link href={`/${locale}`} className="text-smoke hover:text-accent-light">{t.nav.home}</Link>
        <span aria-hidden>/</span>
        <Link href={`/${locale}#collection`} className="text-smoke hover:text-accent-light">{t.nav.collection}</Link>
        <span aria-hidden>/</span>
        <span className="text-ivory">{product.name}</span>
      </nav>

      <section className="container-x pb-28 pt-8">
        <ProductPurchase product={product} locale={locale} t={t.product} hero={t.hero} />
      </section>

      {/* Pyramid */}
      <section className="border-t border-ivory/10 bg-ink-2">
        <div className="container-x flex flex-wrap items-center gap-[72px] py-28">
          <Reveal className="flex min-w-0 flex-[1_1_420px] flex-col gap-5">
            <p className="eyebrow">{t.product.pyramidEyebrow}</p>
            <h2 className="heading-xl">{t.product.pyramidTitle}</h2>
            <p className="text-[15px] leading-[1.9] text-[#BDB3A2]">{t.product.pyramidText}</p>
          </Reveal>
          <Reveal stagger={0.15} className="flex min-w-0 flex-[1_1_520px] flex-col items-center gap-1.5">
            {(["top", "heart", "base"] as const).map((tier) => {
              const s = tierStyle[tier];
              return (
                <div
                  key={tier}
                  className="flex min-h-[132px] flex-col items-center justify-center gap-1.5 px-7 py-5 text-center"
                  style={{ width: s.width, background: s.bg, color: s.fg, clipPath: s.clip }}
                >
                  <span className="text-[11px] uppercase tracking-[0.25em] opacity-85">{t.product.tiers[tier].label}</span>
                  <span className="font-display text-[26px]">{product.pyramid[tier]}</span>
                  <span className="text-xs opacity-80">{t.product.tiers[tier].when}</span>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* Details */}
      <section className="border-t border-ivory/10">
        <div className="mx-auto max-w-[880px] px-5 py-28 md:px-10">
          <h2 className="mb-10 text-center font-display text-[44px] font-normal">{t.product.detailsTitle}</h2>
          <Accordion items={details} />
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-ivory/10 bg-ink-2">
          <div className="container-x py-28">
            <h2 className="mb-14 font-display text-[48px] font-normal">{t.product.related}</h2>
            <Reveal stagger={0.12} className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-7">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} locale={locale} fromLabel={t.collection.from} />
              ))}
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
