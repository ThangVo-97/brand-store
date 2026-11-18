import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getProducts } from "@/lib/products";
import { formatVnd, mlToOz } from "@/lib/format";
import LazyBottleCanvas from "@/components/three/LazyBottleCanvas";
import { ProductCard } from "@/components/ProductCard";
import { ScentFinder } from "@/components/ScentFinder";
import { Marquee } from "@/components/Marquee";
import { Reveal } from "@/components/Reveal";
import { RotateIcon, ServiceIcons } from "@/components/icons";

// Dữ liệu sản phẩm đọc từ database mỗi lần tải (giá, tồn kho luôn mới)
export const dynamic = "force-dynamic";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const products = await getProducts(locale);
  const hero = products.find((p) => p.shape === "RECT") ?? products[0];

  return (
    <>
      {/* HERO */}
      <section id="top" className="container-x flex flex-wrap items-center gap-16 pb-28 pt-16 md:pt-24">
        <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-7">
          <p className="eyebrow animate-fade-up [animation-delay:150ms]">{t.hero.eyebrow}</p>
          <h1 className="animate-fade-up font-display text-[52px] font-normal leading-[1.05] tracking-tight [animation-delay:350ms] md:text-[76px]">
            {t.hero.titleA}
            <em className="text-accent">{t.hero.titleB}</em>
          </h1>
          <p className="max-w-[460px] animate-fade-up text-base leading-8 text-[#BDB3A2] [animation-delay:600ms]">{t.hero.text}</p>
          <div className="mt-2 flex animate-fade-up flex-wrap gap-4 [animation-delay:850ms]">
            <a href="#collection" className="btn-primary">{t.hero.ctaExplore}</a>
            <a href="#finder" className="btn-ghost">{t.hero.ctaFind}</a>
          </div>
        </div>
        {hero && (
          <div className="relative h-[480px] min-w-0 flex-[1_1_380px] md:h-[580px]">
            <div
              aria-hidden
              className="absolute inset-0 m-auto h-[460px] w-[460px] max-w-full animate-pulse rounded-full [animation-duration:6s]"
              style={{ background: "radial-gradient(circle, rgba(200,135,58,0.28) 0%, rgba(200,135,58,0) 70%)" }}
            />
            <LazyBottleCanvas
              mode="hero"
              shape={hero.shape}
              tint={hero.tint}
              name={hero.name}
              sizeLabel={`50 ml · ${mlToOz(50)}`}
              className="!absolute inset-0"
            />
            <p className="pointer-events-none absolute inset-x-0 bottom-2 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.25em] text-smoke">
              <RotateIcon /> {t.hero.dragHint}
            </p>
          </div>
        )}
      </section>

      <Marquee items={t.marquee} />

      {/* COLLECTION */}
      <section id="collection" className="border-t border-ivory/10 bg-ink-2">
        <div className="container-x py-28">
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <Reveal className="flex flex-col gap-4">
              <p className="eyebrow">{t.collection.eyebrow}</p>
              <h2 className="heading-xl">{t.collection.title}</h2>
            </Reveal>
          </div>
          <Reveal stagger={0.12} className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-7">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} fromLabel={t.collection.from} />
            ))}
          </Reveal>
        </div>
      </section>

      {/* SCENT FINDER */}
      <section id="finder" className="border-t border-ivory/10">
        <div className="container-x py-28">
          <ScentFinder
            t={t.finder}
            locale={locale}
            products={products.map((p) => ({ slug: p.slug, name: p.name, notes: p.notes, description: p.tagline, mood: p.mood }))}
          />
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="border-t border-ivory/10 bg-ivory text-ink-3">
        <div className="container-x flex flex-wrap gap-[72px] py-28">
          <Reveal className="flex min-w-0 flex-[1_1_420px] flex-col gap-6">
            <p className="text-xs uppercase tracking-[0.3em] text-accent-dark">{t.story.eyebrow}</p>
            <h2 className="heading-xl">{t.story.title}</h2>
            <p className="text-base leading-[1.9] text-umber">{t.story.text}</p>
          </Reveal>
          <Reveal stagger={0.15} className="flex min-w-0 flex-[1_1_460px] flex-col border-b border-ink-3/15">
            {t.story.steps.map((s, i) => (
              <div key={s.title} className="flex gap-7 border-t border-ink-3/15 py-7">
                <span className="w-12 shrink-0 font-display text-[34px] text-accent-dark">{["I", "II", "III"][i]}</span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-[26px] font-medium">{s.title}</h3>
                  <p className="text-sm leading-7 text-umber">{s.text}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="border-t border-ivory/10">
        <div className="container-x py-28">
          <Reveal className="mb-14 flex flex-col items-center gap-4 text-center">
            <p className="eyebrow">{t.services.eyebrow}</p>
            <h2 className="heading-xl">{t.services.title}</h2>
          </Reveal>
          <Reveal stagger={0.1} className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-px border border-ivory/10 bg-ivory/10">
            {t.services.items.map((s, i) => {
              const Icon = ServiceIcons[i];
              return (
                <div key={s.title} className="flex flex-col gap-3.5 bg-ink px-8 py-10 transition-colors hover:bg-[#18130F]">
                  <Icon className="text-accent-light" />
                  <h3 className="font-display text-[26px] font-medium">{s.title}</h3>
                  <p className="text-sm leading-7 text-smoke">{s.text}</p>
                </div>
              );
            })}
          </Reveal>
          {products[0] && (
            <p className="mt-10 text-center text-xs text-ash">
              {locale === "vi" ? "Giá từ" : "Prices from"} {formatVnd(Math.min(...products.map((p) => p.minPrice)), locale)}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
