export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "vi";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Lấy chuỗi theo ngôn ngữ từ cặp field Vi/En của database */
export function pick<T>(locale: Locale, vi: T, en: T): T {
  return locale === "vi" ? vi : en;
}
