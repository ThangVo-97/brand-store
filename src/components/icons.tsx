import type { SVGProps } from "react";

const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, "aria-hidden": true } as const;

export const SearchIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
);
export const BagIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...p}><path d="M5 8h14l-1.2 12H6.2z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
);
export const TruckIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...p}><path d="M3 7h11v10H3zM14 10h4l3 3v4h-7" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></svg>
);
export const CardIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...p}><rect x="3" y="6" width="18" height="13" rx="1" /><path d="M3 10h18" /></svg>
);
export const ChatIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...p}><path d="M4 5h16v11H9l-5 4z" /></svg>
);
export const RotateIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...p}><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" /><path d="M18 3v4h-4M6 21v-4h4" /></svg>
);
export const DropIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="40" height="40" {...base} strokeWidth={1} {...p}><path d="M12 3c2 3 5 5 5 9a5 5 0 0 1-10 0c0-4 3-6 5-9z" /></svg>
);
export const ServiceIcons = [
  (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="28" height="28" {...base} strokeWidth={1.2} {...p}><rect x="4" y="9" width="4" height="11" rx="1" /><rect x="10" y="9" width="4" height="11" rx="1" /><rect x="16" y="9" width="4" height="11" rx="1" /><path d="M5 9V6h2v3M11 9V6h2v3M17 9V6h2v3" /></svg>
  ),
  (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="28" height="28" {...base} strokeWidth={1.2} {...p}><path d="M4 20l4-1 11-11-3-3L5 16z" /><path d="M14 6l3 3" /></svg>
  ),
  (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="28" height="28" {...base} strokeWidth={1.2} {...p}><rect x="3" y="9" width="18" height="12" rx="1" /><path d="M3 13h18M12 9v12" /><path d="M12 9c-2-4-6-4-6-1s6 1 6 1 6 2 6-1-4-3-6 1z" /></svg>
  ),
  (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="28" height="28" {...base} strokeWidth={1.2} {...p}><rect x="3" y="5" width="18" height="16" rx="1" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
  ),
];
