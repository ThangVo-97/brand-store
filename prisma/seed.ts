/**
 * Dữ liệu mẫu (thương hiệu demo: Maison – nước hoa niche).
 * Làm web mới: thay mảng `products` bên dưới bằng sản phẩm của thương hiệu mới.
 * Chạy: npm run db:seed
 *
 * LƯU Ý: giá và tồn kho dưới đây là GIÁ MẪU để demo,
 * hãy chỉnh lại trong trang admin hoặc ngay tại file này.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, BottleShape, Mood } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

type Seed = {
  slug: string;
  name: string;
  shape: BottleShape;
  mood: Mood;
  tint: string;
  notesVi: string;
  notesEn: string;
  taglineVi: string;
  taglineEn: string;
  descriptionVi: string;
  descriptionEn: string;
  pyramid: Record<"top" | "heart" | "base", { vi: string; en: string }>;
  prices: [number, number, number]; // 10 ml, 50 ml, 100 ml
};

const products: Seed[] = [
  {
    slug: "ember-no-1",
    name: "Ember Nº 1",
    shape: "RECT",
    mood: "WARM",
    tint: "#C8873A",
    notesVi: "Trầm hương · Hổ phách · Khói gỗ",
    notesEn: "Agarwood · Amber · Smoked wood",
    taglineVi: "Hơi ấm của trầm hương bên ngọn lửa tàn.",
    taglineEn: "The warmth of agarwood beside dying embers.",
    descriptionVi:
      "Ember Nº 1 mở đầu bằng vị cay nhẹ của tiêu hồng và cam bergamot, rồi lắng xuống trầm hương và hoa hồng, khép lại bằng hổ phách và khói gỗ ấm áp. Một mùi hương sâu lắng dành cho buổi tối và những ngày se lạnh.",
    descriptionEn:
      "Ember Nº 1 opens with a soft spark of pink pepper and bergamot, settles into agarwood and rose, and closes on warm amber and smoked wood. A deep, lingering scent for evenings and cooler days.",
    pyramid: {
      top: { vi: "Tiêu hồng · Cam bergamot", en: "Pink pepper · Bergamot" },
      heart: { vi: "Trầm hương · Hoa hồng", en: "Agarwood · Rose" },
      base: { vi: "Hổ phách · Gỗ đàn hương · Khói gỗ", en: "Amber · Sandalwood · Smoked wood" },
    },
    prices: [650_000, 2_450_000, 3_950_000],
  },
  {
    slug: "saigon-rain",
    name: "Saigon Rain",
    shape: "CYLINDER",
    mood: "FRESH",
    tint: "#6F978B",
    notesVi: "Đất ẩm · Hoa nhài · Cỏ vetiver",
    notesEn: "Wet earth · Jasmine · Vetiver",
    taglineVi: "Cơn mưa đầu mùa trên phố cũ.",
    taglineEn: "The first monsoon rain on old streets.",
    descriptionVi:
      "Saigon Rain mát lành như cơn mưa đầu mùa: mùi đất ẩm, hoa nhài nở muộn và cỏ vetiver xanh. Nhẹ nhàng, dễ chịu, hợp dùng hằng ngày.",
    descriptionEn:
      "Saigon Rain is cool as the first rain of the season: wet earth, late-blooming jasmine and green vetiver. Light, easy and made for every day.",
    pyramid: {
      top: { vi: "Chanh xanh · Lá chè", en: "Lime · Tea leaf" },
      heart: { vi: "Hoa nhài · Đất ẩm", en: "Jasmine · Wet earth" },
      base: { vi: "Cỏ vetiver · Xạ hương", en: "Vetiver · Musk" },
    },
    prices: [550_000, 2_150_000, 3_450_000],
  },
  {
    slug: "velvet-smoke",
    name: "Velvet Smoke",
    shape: "FACETED",
    mood: "MYSTERY",
    tint: "#6E3A66",
    notesVi: "Hoa hồng đen · Da thuộc · Hoắc hương",
    notesEn: "Black rose · Leather · Patchouli",
    taglineVi: "Bí ẩn như một buổi hẹn lúc nửa đêm.",
    taglineEn: "Mysterious as a midnight rendezvous.",
    descriptionVi:
      "Velvet Smoke quyến rũ và bí ẩn: hoa hồng đen, da thuộc mềm và hoắc hương, để lại dư hương khó quên cho những buổi tối.",
    descriptionEn:
      "Velvet Smoke is seductive and mysterious: black rose, soft leather and patchouli, leaving a trail that lingers long into the night.",
    pyramid: {
      top: { vi: "Mận chín · Nghệ tây", en: "Plum · Saffron" },
      heart: { vi: "Hoa hồng đen · Da thuộc", en: "Black rose · Leather" },
      base: { vi: "Hoắc hương · Nhựa hương", en: "Patchouli · Labdanum" },
    },
    prices: [690_000, 2_650_000, 4_250_000],
  },
  {
    slug: "white-lotus",
    name: "White Lotus",
    shape: "ROUND",
    mood: "CLEAN",
    tint: "#D9C7A3",
    notesVi: "Sen trắng · Trà xanh · Xạ hương",
    notesEn: "White lotus · Green tea · Musk",
    taglineVi: "Tĩnh lặng như hồ sen buổi sớm.",
    taglineEn: "Still as a lotus pond at dawn.",
    descriptionVi:
      "White Lotus thanh khiết và tinh tế, mang tinh thần Á Đông: sen trắng, trà xanh và xạ hương mềm. Hợp nơi công sở và những ngày cần sự tĩnh lặng.",
    descriptionEn:
      "White Lotus is pure and refined with an Eastern spirit: white lotus, green tea and soft musk. Made for the office and quiet days.",
    pyramid: {
      top: { vi: "Trà xanh · Lê", en: "Green tea · Pear" },
      heart: { vi: "Sen trắng · Hoa mộc lan", en: "White lotus · Magnolia" },
      base: { vi: "Xạ hương trắng · Gỗ tuyết tùng", en: "White musk · Cedarwood" },
    },
    prices: [590_000, 2_250_000, 3_650_000],
  },
];

async function main() {
  for (const [index, p] of products.entries()) {
    const { prices, ...data } = p;
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: { ...data, sortOrder: index },
      create: { ...data, sortOrder: index },
    });

    const sizes = [10, 50, 100] as const;
    for (const [i, sizeMl] of sizes.entries()) {
      await prisma.variant.upsert({
        where: { productId_sizeMl: { productId: product.id, sizeMl } },
        update: { price: prices[i] },
        create: {
          productId: product.id,
          sizeMl,
          price: prices[i],
          stock: sizeMl === 10 ? 60 : 25,
          sku: `${p.slug.toUpperCase()}-${sizeMl}`,
        },
      });
    }
  }
  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
