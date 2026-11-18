import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({ email: z.string().trim().toLowerCase().email().max(120), locale: z.enum(["vi", "en"]).default("vi") });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "validation" }, { status: 400 });
  await prisma.subscriber.upsert({
    where: { email: parsed.data.email },
    update: {},
    create: parsed.data,
  });
  return NextResponse.json({ ok: true });
}
