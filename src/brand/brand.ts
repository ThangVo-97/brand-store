/**
 * ─────────────────────────────────────────────────────────────
 *  THÔNG TIN THƯƠNG HIỆU
 *  Làm web mới: sửa file này + content.ts + theme.css + prisma/seed.ts
 * ─────────────────────────────────────────────────────────────
 */
export const brand = {
  /** Tên hiển thị trong tiêu đề trang, SEO */
  name: "Maison",
  /** Chữ logo (thường viết hoa, giãn chữ) */
  wordmark: "MAISON",
  /** Viết thường, không dấu – dùng làm tiền tố cookie, localStorage */
  slug: "maison",
  /** Tiền tố mã đơn hàng, 2–3 chữ cái: MS261118-7K3P */
  orderPrefix: "MS",
  /** Dòng sản phẩm in trên nhãn chai và trên trang chi tiết */
  productLine: "Extrait de Parfum",

  fonts: {
    /** Tên font như khai báo trong CSS (phải khớp với fontsHref và theme.css) */
    display: "Cormorant Garamond",
    sans: "Be Vietnam Pro",
    /** Google Fonts – nhớ chọn font có hỗ trợ tiếng Việt */
    href: "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap",
  },

  contact: {
    phone: "[SỐ ĐIỆN THOẠI]",
    email: "[EMAIL]",
    zalo: "[LINK ZALO]",
    address: "[ĐỊA CHỈ BOUTIQUE]",
  },
} as const;

export type Brand = typeof brand;
