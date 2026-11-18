import "../globals.css";
import { brand } from "@/brand/brand";

export const metadata = { title: `Admin · ${brand.name}`, robots: { index: false, follow: false } };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-ink font-sans text-ivory">{children}</body>
    </html>
  );
}
