"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Decal, RoundedBox } from "@react-three/drei";
import { brand } from "@/brand/brand";

export type BottleShape = "RECT" | "CYLINDER" | "FACETED" | "ROUND";

export type BottleProps = {
  shape: BottleShape;
  /** Màu nước hoa, ví dụ "#C8873A" */
  tint: string;
  name: string;
  /** Dòng nhỏ trên nhãn, ví dụ "50 ml · 1.7 fl.oz" */
  sizeLabel?: string;
  /** Chữ khắc hiển thị trực tiếp trên nhãn */
  engraving?: string | null;
};

const DISPLAY = brand.fonts.display;
const SANS = brand.fonts.sans;

/* ── Nhãn chai vẽ bằng canvas, cập nhật khi đổi dung tích hoặc chữ khắc ── */
function useLabelTexture(name: string, sizeLabel: string, engraving: string) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 448;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    // Decal chiếu texture từ phía trước: lật lại để chữ đọc đúng chiều
    tex.flipY = false;
    return tex;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const draw = () => {
      const canvas = texture.image as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const { width: w, height: h } = canvas;
      const center = w / 2;

      ctx.fillStyle = "#F2EBDD";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(138,90,36,0.75)";
      ctx.lineWidth = 3;
      ctx.strokeRect(18, 18, w - 36, h - 36);

      ctx.fillStyle = "#1A1612";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const spaced = (text: string, y: number, font: string, spacing: number) => {
        ctx.font = font;
        if ("letterSpacing" in ctx) {
          (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${spacing}px`;
        }
        ctx.fillText(text, center, y);
        if ("letterSpacing" in ctx) {
          (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0px";
        }
      };

      spaced(brand.wordmark, 70, `400 20px "${SANS}", sans-serif`, 8);

      // Tên: phần chữ chính + "Nº x" (nếu có)
      const [main, ...rest] = name.split(/\s(?=Nº)/);
      let size = 92;
      ctx.font = `500 ${size}px "${DISPLAY}", serif`;
      while (ctx.measureText(main.toUpperCase()).width > w - 110 && size > 40) {
        size -= 4;
        ctx.font = `500 ${size}px "${DISPLAY}", serif`;
      }
      spaced(main.toUpperCase(), engraving ? 150 : 165, `500 ${size}px "${DISPLAY}", serif`, 6);

      if (rest.length) {
        ctx.fillStyle = "#8A5A24";
        spaced(rest.join(" "), engraving ? 212 : 232, `italic 400 40px "${DISPLAY}", serif`, 1);
        ctx.fillStyle = "#1A1612";
      }

      ctx.fillStyle = "#8A5A24";
      ctx.fillRect(center - 34, engraving ? 246 : 272, 68, 2);
      ctx.fillStyle = "#1A1612";
      spaced(brand.productLine.toUpperCase(), engraving ? 282 : 310, `400 18px "${SANS}", sans-serif`, 6);
      ctx.fillStyle = "#4A4238";
      spaced(sizeLabel, engraving ? 314 : 346, `300 17px "${SANS}", sans-serif`, 2);

      if (engraving) {
        ctx.fillStyle = "#8A5A24";
        spaced(engraving, 376, `italic 500 46px "${DISPLAY}", serif`, 2);
      }
      texture.needsUpdate = true;
    };

    draw();
    document.fonts?.ready.then(() => !cancelled && draw());
    return () => {
      cancelled = true;
    };
  }, [texture, name, sizeLabel, engraving]);

  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

/* ── Vật liệu ── */
function Glass() {
  return (
    <meshPhysicalMaterial
      transparent
      opacity={0.22}
      roughness={0.04}
      metalness={0}
      clearcoat={1}
      clearcoatRoughness={0.04}
      envMapIntensity={2.2}
      depthWrite={false}
      color="#ffffff"
    />
  );
}

function Liquid({ tint }: { tint: string }) {
  return (
    <meshPhysicalMaterial
      color={tint}
      roughness={0.18}
      metalness={0.05}
      clearcoat={0.6}
      sheen={0.4}
      sheenColor={tint}
      emissive={tint}
      emissiveIntensity={0.12}
      envMapIntensity={0.9}
    />
  );
}

const Gold = () => <meshStandardMaterial color="#D8B26E" metalness={1} roughness={0.28} />;
const Silver = () => <meshStandardMaterial color="#D4D8D6" metalness={1} roughness={0.22} />;
const Lacquer = () => (
  <meshPhysicalMaterial color="#120E0B" roughness={0.22} metalness={0.2} clearcoat={1} clearcoatRoughness={0.08} />
);
const Ceramic = () => <meshPhysicalMaterial color="#F4EFE4" roughness={0.35} clearcoat={0.6} />;

/* ── Chai ── */
export function Bottle({ shape, tint, name, sizeLabel = "", engraving }: BottleProps) {
  const label = useLabelTexture(name, sizeLabel, engraving?.trim() ?? "");

  const facetedBody = useMemo(() => new THREE.CylinderGeometry(0.62, 0.62, 1.55, 8).rotateY(Math.PI / 8), []);
  const facetedLiquid = useMemo(() => new THREE.CylinderGeometry(0.5, 0.5, 1.1, 8).rotateY(Math.PI / 8), []);
  const roundBody = useMemo(() => new THREE.SphereGeometry(0.8, 64, 48).scale(1, 0.95, 0.62), []);
  const roundLiquid = useMemo(() => new THREE.SphereGeometry(0.66, 64, 48).scale(1, 0.92, 0.6), []);

  useEffect(
    () => () => [facetedBody, facetedLiquid, roundBody, roundLiquid].forEach((g) => g.dispose()),
    [facetedBody, facetedLiquid, roundBody, roundLiquid],
  );

  const labelProps = { map: label, polygonOffsetFactor: -10 } as const;

  switch (shape) {
    case "CYLINDER":
      return (
        <group>
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 1.9, 64]} />
            <Glass />
            <Decal position={[0, -0.05, 0.42]} scale={[0.56, 0.4, 0.4]} {...labelProps} />
          </mesh>
          <mesh position={[0, -0.47, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 1.45, 48]} />
            <Liquid tint={tint} />
          </mesh>
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.1, 32]} />
            <Glass />
          </mesh>
          <mesh position={[0, 0.78, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.08, 48]} />
            <Silver />
          </mesh>
          <mesh position={[0, 1.07, 0]}>
            <cylinderGeometry args={[0.27, 0.27, 0.5, 64]} />
            <Silver />
          </mesh>
        </group>
      );

    case "FACETED":
      return (
        <group>
          <mesh position={[0, -0.4, 0]} geometry={facetedBody}>
            <Glass />
            <Decal position={[0, -0.05, 0.57]} scale={[0.46, 0.32, 0.3]} {...labelProps} />
          </mesh>
          <mesh position={[0, -0.55, 0]} geometry={facetedLiquid}>
            <Liquid tint={tint} />
          </mesh>
          <mesh position={[0, 0.43, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.1, 32]} />
            <Glass />
          </mesh>
          <mesh position={[0, 0.51, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.08, 48]} />
            <Gold />
          </mesh>
          <mesh position={[0, 0.86, 0]}>
            <sphereGeometry args={[0.32, 64, 48]} />
            <Lacquer />
          </mesh>
        </group>
      );

    case "ROUND":
      return (
        <group>
          <mesh position={[0, -0.35, 0]} geometry={roundBody}>
            <Glass />
            <Decal position={[0, -0.05, 0.49]} scale={[0.6, 0.42, 0.4]} {...labelProps} />
          </mesh>
          <mesh position={[0, -0.42, 0]} geometry={roundLiquid}>
            <Liquid tint={tint} />
          </mesh>
          <mesh position={[0, 0.46, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.12, 32]} />
            <Glass />
          </mesh>
          <mesh position={[0, 0.54, 0]}>
            <cylinderGeometry args={[0.17, 0.17, 0.07, 48]} />
            <Gold />
          </mesh>
          <mesh position={[0, 0.575, 0]}>
            <sphereGeometry args={[0.36, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <Ceramic />
          </mesh>
        </group>
      );

    case "RECT":
    default:
      return (
        <group>
          <RoundedBox args={[1.3, 1.65, 0.48]} radius={0.06} smoothness={6} position={[0, -0.35, 0]}>
            <Glass />
            <Decal position={[0, -0.05, 0.24]} scale={[0.74, 0.52, 0.3]} {...labelProps} />
          </RoundedBox>
          <RoundedBox args={[1.12, 1.2, 0.32]} radius={0.04} smoothness={4} position={[0, -0.48, 0]}>
            <Liquid tint={tint} />
          </RoundedBox>
          <mesh position={[0, 0.525, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.1, 32]} />
            <Glass />
          </mesh>
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.08, 48]} />
            <Gold />
          </mesh>
          <RoundedBox args={[0.5, 0.42, 0.34]} radius={0.02} smoothness={4} position={[0, 0.85, 0]}>
            <Lacquer />
          </RoundedBox>
          <mesh position={[0, 1.065, 0]}>
            <boxGeometry args={[0.5, 0.012, 0.34]} />
            <Gold />
          </mesh>
          <mesh position={[0, 0.68, 0.171]}>
            <boxGeometry args={[0.5, 0.012, 0.002]} />
            <Gold />
          </mesh>
        </group>
      );
  }
}
