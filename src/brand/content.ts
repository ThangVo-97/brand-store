/**
 * ─────────────────────────────────────────────────────────────
 *  NỘI DUNG RIÊNG CỦA THƯƠNG HIỆU (song ngữ)
 *  Câu chữ trên trang chủ, SEO, câu chuyện, dịch vụ…
 *  Chữ giao diện chung (nút, form, giỏ hàng) nằm ở src/lib/i18n/dictionaries.ts
 * ─────────────────────────────────────────────────────────────
 */
import { brand } from "./brand";

const vi = {
  meta: {
    title: `${brand.name} – Nước hoa niche chế tác thủ công`,
    description:
      "Nước hoa niche chế tác thủ công từ trầm hương, hoa nhài, sen trắng. Khắc tên lên chai, gói quà cao cấp, giao hàng toàn quốc.",
  },
  hero: {
    eyebrow: "Nước hoa niche · Chế tác thủ công",
    /** Tiêu đề lớn: phần A thường, phần B in nghiêng màu nhấn */
    titleA: "Mùi hương của những điều ",
    titleB: "không nói thành lời",
    text: `Từ trầm hương, khói gỗ đến cơn mưa đầu mùa của Sài Gòn — mỗi chai ${brand.name} là một ký ức được chưng cất và ủ chậm trong từng mẻ nhỏ.`,
  },
  /** Dải chữ chạy dưới hero */
  marquee: ["Trầm hương", "Hổ phách", "Hoa nhài", "Sen trắng", "Cỏ vetiver", "Da thuộc", "Trà xanh", "Xạ hương"],
  collection: {
    eyebrow: "Bộ sưu tập Signature",
    title: "Bốn câu chuyện, bốn mùi hương",
  },
  /** Tên bộ sưu tập in trên trang chi tiết sản phẩm */
  collectionName: "Bộ sưu tập Signature",
  finder: {
    eyebrow: "Scent Finder",
    title: "Bạn muốn mình mang cảm giác gì hôm nay?",
    sub: "Chọn một tâm trạng — chúng tôi sẽ gợi ý mùi hương hợp với bạn nhất.",
  },
  /** Nhãn cho 4 tâm trạng (khớp enum Mood trong database) */
  moods: {
    WARM: { label: "Ấm áp", hint: "Gỗ, hổ phách, gia vị" },
    FRESH: { label: "Tươi mát", hint: "Mưa, cỏ, cam chanh" },
    MYSTERY: { label: "Bí ẩn", hint: "Khói, da thuộc, hoa tối" },
    CLEAN: { label: "Thanh lịch", hint: "Sen, trà, xạ hương" },
  },
  story: {
    eyebrow: "Nghệ thuật chế tác",
    title: "Chậm rãi, từng mẻ nhỏ, bằng đôi tay",
    text: "Chúng tôi tin một mùi hương đẹp cần thời gian. Nguyên liệu được chọn lọc kỹ, phối trộn thủ công và để ủ cho đến khi các nốt hương hòa quyện trọn vẹn — không vội vàng, không sản xuất hàng loạt.",
    steps: [
      { title: "Tuyển chọn nguyên liệu", text: "Trầm hương, hoa nhài, sen trắng… mỗi nguyên liệu đều có nguồn gốc rõ ràng." },
      { title: "Phối hương & ủ chậm", text: "Công thức được tinh chỉnh qua nhiều lần thử, rồi ủ để mùi hương chín và sâu hơn." },
      { title: "Hoàn thiện thủ công", text: "Từng chai được chiết, dán nhãn và kiểm tra bằng tay trước khi đến với bạn." },
    ],
  },
  services: {
    eyebrow: `Trải nghiệm ${brand.name}`,
    title: "Dịch vụ dành riêng cho bạn",
    items: [
      { title: "Discovery Set", text: "Bộ sample cả bộ sưu tập để thử trên da trước khi chọn chai lớn." },
      { title: "Khắc tên lên chai", text: "Cá nhân hóa nhãn chai bằng tên hoặc một lời nhắn riêng." },
      { title: "Gói quà cao cấp", text: "Hộp quà thủ công kèm thiệp viết tay cho những dịp đặc biệt." },
      { title: "Hẹn tại boutique", text: "Đặt lịch để chuyên viên tư vấn riêng và thử hương tại cửa hàng." },
    ],
  },
  newsletterText: "Nhận thông tin về bộ sưu tập mới và những mẻ hương giới hạn.",
  copyright: `© ${brand.name} — dự án portfolio, thương hiệu giả định`,
};

export type BrandContent = typeof vi;

const en: BrandContent = {
  meta: {
    title: `${brand.name} – Handcrafted niche perfumery`,
    description:
      "Handcrafted niche perfume from agarwood, jasmine and white lotus. Bottle engraving, luxury gift wrapping, nationwide delivery.",
  },
  hero: {
    eyebrow: "Niche perfumery · Handcrafted",
    titleA: "The scent of things ",
    titleB: "left unsaid",
    text: `From agarwood and smoked timber to the first monsoon rain over Saigon — every bottle of ${brand.name} is a memory, distilled and slowly aged in small batches.`,
  },
  marquee: ["Agarwood", "Amber", "Jasmine", "White lotus", "Vetiver", "Leather", "Green tea", "Musk"],
  collection: {
    eyebrow: "The Signature Collection",
    title: "Four stories, four scents",
  },
  collectionName: "The Signature Collection",
  finder: {
    eyebrow: "Scent Finder",
    title: "How do you want to feel today?",
    sub: "Choose a mood — we will suggest the scent that suits you best.",
  },
  moods: {
    WARM: { label: "Warm", hint: "Woods, amber, spice" },
    FRESH: { label: "Fresh", hint: "Rain, grass, citrus" },
    MYSTERY: { label: "Mysterious", hint: "Smoke, leather, dark florals" },
    CLEAN: { label: "Elegant", hint: "Lotus, tea, musk" },
  },
  story: {
    eyebrow: "The art of perfumery",
    title: "Slowly, in small batches, by hand",
    text: "We believe a beautiful scent takes time. Ingredients are carefully sourced, blended by hand and left to mature until every note settles into harmony — never rushed, never mass-produced.",
    steps: [
      { title: "Sourcing the ingredients", text: "Agarwood, jasmine, white lotus… every ingredient has a known origin." },
      { title: "Blending & slow ageing", text: "Each formula is refined over many trials, then aged until it grows rich and deep." },
      { title: "Finished by hand", text: "Every bottle is filled, labelled and checked by hand before it reaches you." },
    ],
  },
  services: {
    eyebrow: `The ${brand.name} experience`,
    title: "Services made for you",
    items: [
      { title: "Discovery Set", text: "Samples of the whole collection, to try on skin before choosing a full bottle." },
      { title: "Bottle engraving", text: "Personalise the label with a name or a private message." },
      { title: "Luxury gift wrapping", text: "A handmade gift box with a handwritten card for special moments." },
      { title: "Boutique appointment", text: "Book a private consultation and discover the scents in store." },
    ],
  },
  newsletterText: "Be the first to hear about new collections and limited batches.",
  copyright: `© ${brand.name} — portfolio project, fictional brand`,
};

export const content = { vi, en };
