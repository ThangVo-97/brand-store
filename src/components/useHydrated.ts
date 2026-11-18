"use client";
import { useEffect, useState } from "react";

/** Giỏ hàng lưu ở localStorage: chỉ hiển thị sau khi client đã đọc xong, tránh lệch khi hydrate */
export function useHydrated() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready;
}
