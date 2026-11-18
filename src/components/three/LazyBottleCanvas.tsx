"use client";

import dynamic from "next/dynamic";

/** Tải three.js phía client, không render trên server */
const LazyBottleCanvas = dynamic(() => import("./BottleCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <span className="h-10 w-10 animate-spin rounded-full border border-accent-light/30 border-t-accent-light" aria-hidden />
    </div>
  ),
});

export default LazyBottleCanvas;
