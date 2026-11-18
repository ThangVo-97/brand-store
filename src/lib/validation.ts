import { z } from "zod";
import { SHOP } from "./config";

/** Số điện thoại Việt Nam: 0xxxxxxxxx hoặc +84xxxxxxxxx */
export const vnPhone = z
  .string()
  .trim()
  .transform((s) => s.replace(/[\s.-]/g, ""))
  .refine((s) => /^(0|\+84)(3|5|7|8|9)\d{8}$/.test(s), "invalid_phone");

export const customerSchema = z.object({
  customerName: z.string().trim().min(2).max(80),
  phone: vnPhone,
  email: z.string().trim().email().max(120),
  address: z.string().trim().min(5).max(200),
  province: z.string().trim().min(2).max(60),
  note: z.string().trim().max(500).optional().default(""),
});

export const orderSchema = customerSchema.extend({
  locale: z.enum(["vi", "en"]).default("vi"),
  paymentMethod: z.enum(["COD", "BANK_TRANSFER", "VNPAY"]),
  items: z
    .array(
      z.object({
        variantId: z.string().min(1),
        quantity: z.number().int().min(1).max(SHOP.maxQtyPerLine),
        engraving: z.string().trim().max(SHOP.engravingMaxLength).nullable().optional(),
        giftWrap: z.boolean().default(false),
      }),
    )
    .min(1)
    .max(30),
});

export type OrderInput = z.infer<typeof orderSchema>;
export type CustomerField = keyof z.infer<typeof customerSchema>;
