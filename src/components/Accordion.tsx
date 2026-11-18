"use client";

import { useState } from "react";

export function Accordion({ items }: { items: { title: string; body: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-t border-ivory/15">
      {items.map((item, i) => {
        const isOpen = open === i;
        const id = `acc-${i}`;
        return (
          <div key={item.title} className="border-b border-ivory/15">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={id}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex min-h-[72px] w-full items-center justify-between px-1 text-left font-display text-[26px]"
            >
              <span>{item.title}</span>
              <span aria-hidden className={`font-sans text-[22px] text-accent-light transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
            </button>
            {isOpen && (
              <p id={id} className="animate-toast whitespace-pre-line px-1 pb-7 text-[15px] leading-[1.9] text-[#BDB3A2]">
                {item.body}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
