import { useId } from "react";
import { brand } from "@/brand/brand";

type Shape = "RECT" | "CYLINDER" | "FACETED" | "ROUND";

/** Hình minh hoạ chai (SVG) cho thẻ sản phẩm, giỏ hàng – nhẹ hơn nhiều so với 3D */
export function BottleIllustration({
  shape,
  tint,
  name,
  className,
}: {
  shape: Shape;
  tint: string;
  name: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const g = (k: string) => `${id}-${k}`;
  const url = (k: string) => `url(#${g(k)})`;
  const title = name.toUpperCase();

  const glassStops = (
    <>
      <stop offset="0" stopColor="#fff" stopOpacity="0.3" />
      <stop offset="0.15" stopColor="#fff" stopOpacity="0.06" />
      <stop offset="0.85" stopColor="#fff" stopOpacity="0.04" />
      <stop offset="1" stopColor="#fff" stopOpacity="0.26" />
    </>
  );
  const goldStops = (
    <>
      <stop offset="0" stopColor="#7A5A2C" />
      <stop offset="0.45" stopColor="#F3D9A0" />
      <stop offset="1" stopColor="#8C6A34" />
    </>
  );
  const liquidStops = (
    <>
      <stop offset="0" stopColor={tint} stopOpacity="0.95" />
      <stop offset="1" stopColor="#120a04" stopOpacity="0.95" />
    </>
  );

  return (
    <svg viewBox="0 0 200 300" role="img" aria-label={name} className={className}>
      <defs>
        <linearGradient id={g("glass")} x1="0" y1="0" x2="1" y2="0">{glassStops}</linearGradient>
        <linearGradient id={g("gold")} x1="0" y1="0" x2="1" y2="0">{goldStops}</linearGradient>
        <linearGradient id={g("liq")} x1="0" y1="0" x2="0" y2="1.4">{liquidStops}</linearGradient>
        <linearGradient id={g("cap")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#080605" />
          <stop offset="0.38" stopColor="#3D342B" />
          <stop offset="0.58" stopColor="#17120E" />
          <stop offset="1" stopColor="#080605" />
        </linearGradient>
        <linearGradient id={g("silver")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5A5F5C" />
          <stop offset="0.38" stopColor="#ECEFED" />
          <stop offset="0.6" stopColor="#9AA09D" />
          <stop offset="1" stopColor="#4A4F4C" />
        </linearGradient>
        <radialGradient id={g("sphere")} cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#6A5662" />
          <stop offset="0.55" stopColor="#1D1419" />
          <stop offset="1" stopColor="#070407" />
        </radialGradient>
        <radialGradient id={g("ceramic")} cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.6" stopColor="#EAE3D5" />
          <stop offset="1" stopColor="#B9AE9A" />
        </radialGradient>
        <clipPath id={g("round")}>
          <rect x="43" y="106" width="114" height="168" rx="56" />
        </clipPath>
      </defs>

      <ellipse cx="100" cy="287" rx="70" ry="7" fill="#000" opacity="0.55" />

      {shape === "RECT" && (
        <>
          <rect x="70" y="14" width="60" height="60" rx="3" fill={url("cap")} />
          <rect x="70" y="14" width="60" height="5" rx="2" fill={url("gold")} />
          <rect x="70" y="66" width="60" height="2.5" fill={url("gold")} />
          <rect x="82" y="74" width="36" height="11" fill={url("gold")} />
          <rect x="88" y="85" width="24" height="11" fill="#fff" opacity="0.16" />
          <rect x="38" y="96" width="124" height="186" rx="12" fill={url("glass")} stroke="#fff" strokeOpacity="0.38" />
          <rect x="49" y="122" width="102" height="138" rx="5" fill={url("liq")} />
          <rect x="49" y="122" width="102" height="3" fill="#fff" opacity="0.45" />
          <rect x="63" y="158" width="74" height="70" fill="#F2EBDD" />
          <rect x="67" y="162" width="66" height="62" fill="none" stroke="#8A5A24" strokeWidth="0.6" />
          <text x="100" y="198" textAnchor="middle" fontSize="11" letterSpacing="1.2" fill="#1A1612" fontFamily={`${brand.fonts.display}, serif`}>{title}</text>
          <rect x="45" y="104" width="7" height="150" rx="3.5" fill="#fff" opacity="0.32" />
        </>
      )}

      {shape === "CYLINDER" && (
        <>
          <rect x="72" y="8" width="56" height="68" rx="8" fill={url("silver")} />
          <rect x="84" y="76" width="32" height="8" fill={url("silver")} />
          <rect x="56" y="84" width="88" height="198" rx="16" fill={url("glass")} stroke="#fff" strokeOpacity="0.38" />
          <rect x="63" y="106" width="74" height="168" rx="11" fill={url("liq")} />
          <ellipse cx="100" cy="106" rx="36" ry="3.5" fill="#fff" opacity="0.45" />
          <rect x="85" y="140" width="30" height="110" fill="#F2EBDD" />
          <text transform="rotate(-90 100 195)" x="100" y="198" textAnchor="middle" fontSize="10" letterSpacing="2" fill="#1A1612" fontFamily={`${brand.fonts.display}, serif`}>{title}</text>
          <rect x="64" y="92" width="6" height="178" rx="3" fill="#fff" opacity="0.35" />
        </>
      )}

      {shape === "FACETED" && (
        <>
          <circle cx="100" cy="50" r="34" fill={url("sphere")} />
          <ellipse cx="88" cy="36" rx="10" ry="6" fill="#fff" opacity="0.35" />
          <rect x="85" y="82" width="30" height="12" fill={url("gold")} />
          <polygon points="62,94 138,94 170,126 170,248 138,282 62,282 30,248 30,126" fill={url("glass")} stroke="#fff" strokeOpacity="0.38" />
          <polygon points="72,118 128,118 152,140 152,240 128,266 72,266 48,240 48,140" fill={url("liq")} />
          <line x1="72" y1="118" x2="128" y2="118" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" />
          <polygon points="34,130 42,130 42,244 34,244" fill="#fff" opacity="0.28" />
          <rect x="66" y="172" width="68" height="46" fill="#F2EBDD" />
          <text x="100" y="199" textAnchor="middle" fontSize="10" letterSpacing="1.4" fill="#1A1612" fontFamily={`${brand.fonts.display}, serif`}>{title}</text>
        </>
      )}

      {shape === "ROUND" && (
        <>
          <path d="M62 80 C62 34, 138 34, 138 80 Z" fill={url("ceramic")} />
          <path d="M100 40 C90 54, 90 68, 100 80 C110 68, 110 54, 100 40 Z" fill="none" stroke="#A89C86" strokeWidth="0.9" />
          <ellipse cx="86" cy="50" rx="9" ry="5" fill="#fff" opacity="0.7" />
          <rect x="80" y="80" width="40" height="9" fill={url("gold")} />
          <rect x="34" y="98" width="132" height="184" rx="64" fill={url("glass")} stroke="#fff" strokeOpacity="0.4" />
          <rect x="43" y="140" width="114" height="140" fill={url("liq")} clipPath={url("round")} />
          <ellipse cx="100" cy="200" rx="38" ry="25" fill="#FBF7EE" stroke={url("gold")} strokeWidth="1.2" />
          <text x="100" y="204" textAnchor="middle" fontSize="9" letterSpacing="1.5" fill="#1A1612" fontFamily={`${brand.fonts.display}, serif`}>{title}</text>
          <path d="M48 150 C44 180, 46 230, 62 262" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
