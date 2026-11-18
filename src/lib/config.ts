/** Các con số kinh doanh – chỉnh tại đây. Đơn vị: VNĐ. */
export const SHOP = {
  /** Phí giao hàng tiêu chuẩn */
  shippingFee: 35_000,
  /** Miễn phí giao hàng khi tạm tính từ mức này trở lên */
  freeShippingFrom: 2_000_000,
  /** Phí gói quà cho mỗi sản phẩm */
  giftWrapFee: 150_000,
  /** Số ký tự tối đa khi khắc tên */
  engravingMaxLength: 14,
  /** Số lượng tối đa của một dòng trong giỏ */
  maxQtyPerLine: 9,
} as const;

export function calcShipping(subtotal: number) {
  return subtotal >= SHOP.freeShippingFrom ? 0 : SHOP.shippingFee;
}
