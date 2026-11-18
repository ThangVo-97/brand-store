import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { locales } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const products = await prisma.product.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } });
  return locales.flatMap((l) => [
    { url: `${site}/${l}`, changeFrequency: "weekly" as const, priority: 1 },
    ...products.map((p) => ({ url: `${site}/${l}/products/${p.slug}`, lastModified: p.updatedAt, priority: 0.8 })),
  ]);
}
