"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE, checkPassword, createSessionToken } from "@/lib/admin-auth";
import { requireAdmin } from "@/lib/admin-guard";
import { restockOrder } from "@/lib/orders";

export async function login(_: { error?: string } | undefined, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!(await checkPassword(password))) return { error: "Sai mật khẩu" };
  const { token, maxAge } = await createSessionToken();
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

const statusSchema = z.object({
  code: z.string(),
  status: z.enum(["PENDING", "CONFIRMED", "SHIPPING", "COMPLETED", "CANCELLED"]),
  paymentStatus: z.enum(["UNPAID", "PAID", "FAILED"]),
});

export async function updateOrder(formData: FormData) {
  await requireAdmin();
  const data = statusSchema.parse(Object.fromEntries(formData));
  const order = await prisma.order.findUniqueOrThrow({ where: { code: data.code } });
  // Huỷ đơn → hoàn lại tồn kho (chỉ một lần)
  if (data.status === "CANCELLED" && order.status !== "CANCELLED") await restockOrder(order.id);
  await prisma.order.update({ where: { code: data.code }, data: { status: data.status, paymentStatus: data.paymentStatus } });
  revalidatePath(`/admin/orders/${data.code}`);
  revalidatePath("/admin");
}

const variantSchema = z.object({
  id: z.string(),
  price: z.coerce.number().int().min(0).max(1_000_000_000),
  stock: z.coerce.number().int().min(0).max(1_000_000),
});

export async function updateVariant(formData: FormData) {
  await requireAdmin();
  const data = variantSchema.parse(Object.fromEntries(formData));
  await prisma.variant.update({ where: { id: data.id }, data: { price: data.price, stock: data.stock } });
  revalidatePath("/admin/products");
}

export async function toggleProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const p = await prisma.product.findUniqueOrThrow({ where: { id }, select: { active: true } });
  await prisma.product.update({ where: { id }, data: { active: !p.active } });
  revalidatePath("/admin/products");
}
