import "server-only";
import { prisma } from "./prisma";
import { pick, type Locale } from "./i18n/config";
import type { BottleShape, Mood } from "@/generated/prisma/client";

type Pyramid = Record<"top" | "heart" | "base", { vi: string; en: string }>;

/** Dữ liệu sản phẩm đã chọn ngôn ngữ, an toàn để truyền xuống client component */
export type ProductView = {
  id: string;
  slug: string;
  name: string;
  shape: BottleShape;
  mood: Mood;
  tint: string;
  notes: string;
  tagline: string;
  description: string;
  pyramid: { top: string; heart: string; base: string };
  variants: { id: string; sizeMl: number; price: number; stock: number }[];
  minPrice: number;
};

const include = { variants: { orderBy: { sizeMl: "asc" as const } } };

type Row = Awaited<ReturnType<typeof prisma.product.findFirstOrThrow<{ include: typeof include }>>>;

function toView(p: Row, locale: Locale): ProductView {
  const pyr = p.pyramid as Pyramid;
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    shape: p.shape,
    mood: p.mood,
    tint: p.tint,
    notes: pick(locale, p.notesVi, p.notesEn),
    tagline: pick(locale, p.taglineVi, p.taglineEn),
    description: pick(locale, p.descriptionVi, p.descriptionEn),
    pyramid: {
      top: pick(locale, pyr.top.vi, pyr.top.en),
      heart: pick(locale, pyr.heart.vi, pyr.heart.en),
      base: pick(locale, pyr.base.vi, pyr.base.en),
    },
    variants: p.variants.map((v) => ({ id: v.id, sizeMl: v.sizeMl, price: v.price, stock: v.stock })),
    minPrice: Math.min(...p.variants.map((v) => v.price)),
  };
}

export async function getProducts(locale: Locale): Promise<ProductView[]> {
  const rows = await prisma.product.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    include,
  });
  return rows.map((r) => toView(r, locale));
}

export async function getProduct(slug: string, locale: Locale): Promise<ProductView | null> {
  const row = await prisma.product.findFirst({ where: { slug, active: true }, include });
  return row ? toView(row, locale) : null;
}
