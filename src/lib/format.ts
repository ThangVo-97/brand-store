import type { Locale } from "./i18n/config";

export function formatVnd(value: number, locale: Locale = "vi") {
  return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: Date, locale: Locale = "vi") {
  return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(date);
}

/** 50 → "1.7 fl.oz" */
export function mlToOz(ml: number) {
  return `${(ml / 29.5735).toFixed(ml < 30 ? 2 : 1)} fl.oz`;
}
