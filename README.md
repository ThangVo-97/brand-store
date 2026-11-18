# brand-store

Bộ khung (starter kit) để dựng nhanh website bán hàng cao cấp: song ngữ Việt/Anh, sản phẩm 3D xoay được, khắc tên xem trước trực tiếp, giỏ hàng, thanh toán (COD, chuyển khoản VietQR, VNPay) và trang quản trị.

Thương hiệu demo đi kèm là **Maison** – nước hoa niche. Mọi thứ riêng của thương hiệu nằm trong `src/brand/` và `prisma/seed.ts`, nên một web mới chỉ cần thay mấy file này.

## Tạo web mới từ bộ khung

| Việc cần đổi | File |
| --- | --- |
| Tên, chữ logo, tiền tố mã đơn, dòng sản phẩm, font, liên hệ | `src/brand/brand.ts` |
| Màu sắc, font chữ | `src/brand/theme.css` |
| Nội dung trang chủ, SEO, câu chuyện, dịch vụ (vi/en) | `src/brand/content.ts` |
| Sản phẩm, giá, tồn kho mẫu | `prisma/seed.ts` |
| Phí giao hàng, phí gói quà, độ dài chữ khắc | `src/lib/config.ts` |

Các bước:
1. Copy cả thư mục (hoặc dùng repo này làm GitHub template), đổi `name` trong `package.json`.
2. Sửa 4 file trong bảng trên.
3. Tạo database mới, điền `.env`, chạy migrate + seed (phần dưới).
4. Nếu sản phẩm không phải chai nước hoa: dáng 3D nằm ở `src/components/three/Bottle.tsx`, hình minh hoạ 2D ở `src/components/BottleIllustration.tsx`. Có thể thay bằng mô hình `.glb` (xem cuối file).

## Công nghệ

| Phần | Công nghệ |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Giao diện | Tailwind CSS 4, GSAP + ScrollTrigger, Lenis (cuộn mượt) |
| 3D | three.js, React Three Fiber, drei |
| Dữ liệu | PostgreSQL, Prisma 7 (driver adapter `pg`) |
| Trạng thái | Zustand (giỏ hàng lưu ở localStorage) |
| Kiểm tra dữ liệu | Zod |

## Tính năng

**Khách hàng**
- Trang chủ: hero có chai 3D lơ lửng nghiêng theo chuột, dải chữ chạy, hiệu ứng hiện dần khi cuộn.
- Bộ sưu tập lấy từ database, giá "từ …" theo dung tích rẻ nhất.
- Scent Finder: chọn tâm trạng → gợi ý mùi hương.
- Trang sản phẩm: chai 3D xoay 360° (4 dáng chai: vuông, trụ, cắt mặt, bầu tròn), chọn dung tích, **khắc tên hiển thị ngay trên nhãn 3D**, gói quà, tháp hương, thông tin chi tiết, sản phẩm liên quan, dữ liệu có cấu trúc (JSON-LD) cho SEO.
- Giỏ hàng: gộp dòng theo dung tích + chữ khắc + gói quà, tự tính phí giao hàng và gợi ý mức miễn phí ship.
- Thanh toán: kiểm tra form (số điện thoại Việt Nam), COD, chuyển khoản qua mã VietQR, VNPay.
- Song ngữ `/vi` và `/en`, tự chọn theo trình duyệt và nhớ lựa chọn.

**Quản trị (`/admin`)**
- Đăng nhập bằng mật khẩu, phiên lưu trong cookie có ký HMAC.
- Danh sách đơn: lọc theo trạng thái, tìm theo mã đơn / số điện thoại / tên, thống kê nhanh.
- Chi tiết đơn: cập nhật trạng thái và tình trạng thanh toán; huỷ đơn tự hoàn lại tồn kho.
- Sản phẩm: sửa giá, tồn kho từng dung tích; ẩn/hiện sản phẩm.

**An toàn dữ liệu**
- Server luôn tính lại giá từ database, không tin giá client gửi lên.
- Trừ tồn kho có điều kiện trong transaction, không bán vượt số lượng.
- Chữ ký VNPay được kiểm tra ở cả Return URL và IPN.

## Chạy trên máy

Yêu cầu: Node.js 20+ và PostgreSQL 14+.

```bash
# 1. Cài thư viện
npm install

# 2. Tạo file môi trường rồi sửa DATABASE_URL, ADMIN_PASSWORD, ADMIN_SECRET
cp .env.example .env

# 3. Tạo bảng trong database (lần đầu) và nạp dữ liệu mẫu
npx prisma migrate dev --name init
npm run db:seed

# 4. Chạy
npm run dev
```

Mở http://localhost:3000 (tự chuyển sang `/vi`). Trang quản trị ở http://localhost:3000/admin.

> Giá trong `prisma/seed.ts` là **giá mẫu** để demo, sửa lại trong trang admin hoặc ngay trong file seed.

## Biến môi trường

| Biến | Bắt buộc | Ý nghĩa |
| --- | --- | --- |
| `DATABASE_URL` | Có | Chuỗi kết nối PostgreSQL |
| `NEXT_PUBLIC_SITE_URL` | Có khi deploy | Địa chỉ website, dùng cho SEO và link trả về của VNPay |
| `ADMIN_PASSWORD` | Có | Mật khẩu trang admin |
| `ADMIN_SECRET` | Có | Chuỗi ngẫu nhiên ≥ 32 ký tự để ký cookie admin |
| `BANK_BIN`, `BANK_ACCOUNT_NO`, `BANK_ACCOUNT_NAME` | Không | Bật chuyển khoản VietQR (BIN: Vietcombank 970436, Techcombank 970407…) |
| `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET`, `VNPAY_URL` | Không | Bật VNPay. Đăng ký sandbox tại sandbox.vnpayment.vn |

Phương thức thanh toán chỉ hiện khi biến môi trường tương ứng được điền.

Phí giao hàng, mức miễn phí ship, phí gói quà, độ dài chữ khắc: chỉnh trong `src/lib/config.ts`.

## Cấu trúc thư mục

```
prisma/
  schema.prisma          Bảng: Product, Variant, Order, OrderItem, Subscriber
  seed.ts                4 sản phẩm mẫu × 3 dung tích
src/
  app/
    [locale]/            Trang khách (vi/en): trang chủ, sản phẩm, giỏ hàng, thanh toán
    admin/               Trang quản trị + server actions
    api/                 orders, newsletter, payments/vnpay/{return,ipn}
  components/
    three/               Chai 3D (Bottle.tsx) và cảnh (BottleCanvas.tsx)
    …                    Header, footer, giỏ hàng, form thanh toán, hiệu ứng
  lib/
    i18n/                Từ điển vi/en
    cart-store.ts        Giỏ hàng (Zustand)
    orders.ts            Tạo đơn, trừ/hoàn tồn kho
    vnpay.ts             Tạo URL và xác minh chữ ký VNPay
    admin-auth.ts        Phiên đăng nhập admin
  middleware.ts          Chuyển hướng ngôn ngữ, chặn /admin khi chưa đăng nhập
```

## Deploy

**Vercel + Neon/Supabase (PostgreSQL)**
1. Tạo database PostgreSQL, lấy chuỗi kết nối.
2. Import repo vào Vercel, điền các biến môi trường ở trên.
3. Chạy migration lên database production: `npx prisma migrate deploy` (từ máy của bạn với `DATABASE_URL` production, hoặc thêm vào bước build).
4. Nạp dữ liệu mẫu nếu muốn: `npm run db:seed`.
5. Nếu dùng VNPay: khai báo IPN URL `https://<domain>/api/payments/vnpay/ipn` trong trang merchant.

## Gợi ý phát triển tiếp

- Mô hình 3D thật (file `.glb` dựng bằng Blender) thay cho chai dựng bằng code: dùng `useGLTF` của drei trong `Bottle.tsx`.
- Ảnh và video sản phẩm thật cho trang chủ.
- Gửi email xác nhận đơn (Resend, Nodemailer).
- Đặt lịch hẹn tại boutique, mã giảm giá, MoMo.
- Thêm trang quản lý sản phẩm đầy đủ (tạo mới, sửa mô tả, upload ảnh).
