"use client";

import { useActionState } from "react";
import { login } from "../actions";
import { brand } from "@/brand/brand";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form action={action} className="flex w-full max-w-sm flex-col gap-5 border border-ivory/10 bg-ink-2 p-10">
        <h1 className="font-display text-3xl tracking-[0.15em]">{brand.wordmark}</h1>
        <p className="text-sm text-smoke">Đăng nhập trang quản trị</p>
        <label htmlFor="password" className="text-xs text-smoke">Mật khẩu</label>
        <input id="password" name="password" type="password" required autoFocus className="field" />
        {state?.error && <p role="alert" className="text-sm text-red-300">{state.error}</p>}
        <button disabled={pending} className="btn-primary">{pending ? "Đang đăng nhập…" : "Đăng nhập"}</button>
      </form>
    </div>
  );
}
