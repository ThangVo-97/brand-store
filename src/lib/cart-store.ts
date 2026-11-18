"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SHOP } from "./config";
import { brand } from "@/brand/brand";

export type CartLine = {
  /** variantId + engraving + gift → một dòng riêng */
  key: string;
  variantId: string;
  slug: string;
  name: string;
  shape: string;
  tint: string;
  sizeMl: number;
  /** Giá hiển thị; server luôn tính lại từ database khi đặt hàng */
  price: number;
  quantity: number;
  engraving: string | null;
  giftWrap: boolean;
};

type CartState = {
  lines: CartLine[];
  add: (line: Omit<CartLine, "key">) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const lineKey = (l: Pick<CartLine, "variantId" | "engraving" | "giftWrap">) =>
  `${l.variantId}|${l.engraving ?? ""}|${l.giftWrap ? 1 : 0}`;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (line) =>
        set((state) => {
          const key = lineKey(line);
          const existing = state.lines.find((l) => l.key === key);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.key === key ? { ...l, quantity: Math.min(SHOP.maxQtyPerLine, l.quantity + line.quantity) } : l,
              ),
            };
          }
          return { lines: [...state.lines, { ...line, key }] };
        }),
      setQuantity: (key, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            l.key === key ? { ...l, quantity: Math.max(1, Math.min(SHOP.maxQtyPerLine, quantity)) } : l,
          ),
        })),
      remove: (key) => set((state) => ({ lines: state.lines.filter((l) => l.key !== key) })),
      clear: () => set({ lines: [] }),
    }),
    { name: `${brand.slug}-cart`, version: 1 },
  ),
);

export function cartTotals(lines: CartLine[]) {
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const giftFee = lines.reduce((sum, l) => sum + (l.giftWrap ? SHOP.giftWrapFee * l.quantity : 0), 0);
  const shipping = lines.length === 0 || subtotal >= SHOP.freeShippingFrom ? 0 : SHOP.shippingFee;
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  return { subtotal, giftFee, shipping, total: subtotal + giftFee + shipping, count };
}
