"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Newsletter({ t, locale }: { t: Dictionary["newsletter"]; locale: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, locale }),
    }).catch(() => null);
    setState(res?.ok ? "ok" : "error");
    if (res?.ok) setEmail("");
  }

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={submit} className="flex max-w-[440px] flex-wrap">
        <label htmlFor="nl-email" className="sr-only">{t.email}</label>
        <input
          id="nl-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.email}
          className="field min-h-[52px] flex-[1_1_220px]"
        />
        <button type="submit" disabled={state === "loading"} className="btn-primary px-7 text-xs">
          {t.submit}
        </button>
      </form>
      <p role="status" className="min-h-5 text-sm text-smoke">
        {state === "ok" ? t.success : state === "error" ? t.error : ""}
      </p>
    </div>
  );
}
