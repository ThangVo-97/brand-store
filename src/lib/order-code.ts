import { randomInt } from "node:crypto";
import { brand } from "@/brand/brand";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // bỏ 0/O, 1/I dễ nhầm

/** <tiền tố>261118-7K3P, ví dụ MS261118-7K3P */
export function generateOrderCode(date = new Date()) {
  const vn = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  const ymd = vn.toISOString().slice(2, 10).replace(/-/g, "");
  let suffix = "";
  for (let i = 0; i < 4; i++) suffix += ALPHABET[randomInt(ALPHABET.length)];
  return `${brand.orderPrefix}${ymd}-${suffix}`;
}
