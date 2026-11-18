import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { ProductView } from "@/lib/products";
import { formatVnd } from "@/lib/format";
import { BottleIllustration } from "./BottleIllustration";

export function ProductCard({ product, locale, fromLabel }: { product: ProductView; locale: Locale; fromLabel: string }) {
  return (
    <Link href={`/${locale}/products/${product.slug}`} className="group flex flex-col gap-5 text-ivory hover:text-ivory">
      <div
        className="flex h-[360px] items-center justify-center transition-colors duration-500 [perspective:900px]"
        style={{ background: `radial-gradient(ellipse at 50% 35%, ${product.tint}33 0%, #1A1612 65%)` }}
      >
        <BottleIllustration
          shape={product.shape}
          tint={product.tint}
          name={product.name}
          className="h-[270px] w-[180px] transition-transform duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:[transform:translateY(-14px)_rotateY(16deg)_scale(1.04)]"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="font-display text-[28px] font-medium">{product.name}</h3>
        <p className="text-[13px] tracking-wide text-smoke">{product.notes}</p>
        <p className="mt-2 text-sm text-accent-light">
          {fromLabel} {formatVnd(product.minPrice, locale)}
        </p>
      </div>
    </Link>
  );
}
