import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { BottleIllustration } from "@/components/BottleIllustration";
import { AdminShell } from "../AdminShell";
import { toggleProduct, updateVariant } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await prisma.product.findMany({
    orderBy: { sortOrder: "asc" },
    include: { variants: { orderBy: { sizeMl: "asc" } } },
  });

  return (
    <AdminShell active="products">
      <h1 className="mb-8 font-display text-4xl">Sản phẩm</h1>
      <div className="flex flex-col gap-6">
        {products.map((p) => (
          <section key={p.id} className="flex flex-wrap gap-6 border border-ivory/10 bg-ink-2 p-6">
            <BottleIllustration shape={p.shape} tint={p.tint} name={p.name} className="h-32 w-24 shrink-0" />
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl">{p.name}</h2>
                  <p className="text-xs text-smoke">/{p.slug} · {p.notesVi}</p>
                </div>
                <form action={toggleProduct}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className={`border px-3 py-1.5 text-xs ${p.active ? "border-accent-light text-accent-light" : "border-ivory/20 text-ash"}`}>
                    {p.active ? "Đang bán · bấm để ẩn" : "Đang ẩn · bấm để bán"}
                  </button>
                </form>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {p.variants.map((v) => (
                  <form key={v.id} action={updateVariant} className="flex flex-col gap-2 border border-ivory/10 p-4">
                    <input type="hidden" name="id" value={v.id} />
                    <p className="text-sm">{v.sizeMl} ml <span className="text-xs text-ash">· {v.sku}</span></p>
                    <label className="text-xs text-smoke" htmlFor={`price-${v.id}`}>Giá (VNĐ)</label>
                    <input id={`price-${v.id}`} name="price" type="number" min={0} step={1000} defaultValue={v.price} className="field min-h-10" />
                    <label className="text-xs text-smoke" htmlFor={`stock-${v.id}`}>Tồn kho</label>
                    <input id={`stock-${v.id}`} name="stock" type="number" min={0} defaultValue={v.stock} className={`field min-h-10 ${v.stock <= 5 ? "border-accent-light" : ""}`} />
                    <button className="btn-ghost min-h-10 px-3 text-xs">Lưu</button>
                  </form>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </AdminShell>
  );
}
