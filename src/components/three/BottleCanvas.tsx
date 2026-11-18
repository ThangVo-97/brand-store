"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, OrbitControls, Sparkles } from "@react-three/drei";
import type { Group } from "three";
import { Bottle, type BottleProps } from "./Bottle";

type Props = BottleProps & {
  /** hero: lơ lửng + tự xoay nhẹ; viewer: xoay 360° theo chuột */
  mode?: "hero" | "viewer";
  autoRotate?: boolean;
  className?: string;
};

/** Ánh sáng studio dựng bằng Lightformer – không cần tải file HDR */
function Studio() {
  return (
    <Environment resolution={256}>
      <Lightformer form="rect" intensity={3} color="#FFE7C2" position={[0, 3, 2]} scale={[6, 2, 1]} />
      <Lightformer form="rect" intensity={2.2} color="#FFFFFF" position={[-4, 0.5, 1]} rotation-y={Math.PI / 2} scale={[3, 5, 1]} />
      <Lightformer form="rect" intensity={1.6} color="#E3B479" position={[4, -0.5, 1]} rotation-y={-Math.PI / 2} scale={[3, 5, 1]} />
      <Lightformer form="ring" intensity={1.2} color="#C8873A" position={[0, 0, -4]} scale={4} />
    </Environment>
  );
}

/** Lắc lư nhẹ theo con trỏ (hero) */
function PointerSway({ children }: { children: React.ReactNode }) {
  const ref = useRef<Group>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const targetY = Math.sin(t * 0.35) * 0.55 + state.pointer.x * 0.45;
    const targetX = -state.pointer.y * 0.18;
    ref.current.rotation.y += (targetY - ref.current.rotation.y) * Math.min(1, delta * 2.5);
    ref.current.rotation.x += (targetX - ref.current.rotation.x) * Math.min(1, delta * 2.5);
  });
  return <group ref={ref}>{children}</group>;
}

export default function BottleCanvas({ mode = "viewer", autoRotate = true, className, ...bottle }: Props) {
  const isHero = mode === "hero";
  return (
    <Canvas
      className={className}
      dpr={[1, 2]}
      camera={{ position: [0, 0.1, isHero ? 6.2 : 6], fov: 30 }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: isHero ? "pan-y" : "none" }}
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color="#FFE7C2" />
      <Suspense fallback={null}>
        <Studio />
        {isHero ? (
          <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.6}>
            <PointerSway>
              <Bottle {...bottle} />
            </PointerSway>
          </Float>
        ) : (
          <Float speed={1.2} rotationIntensity={0} floatIntensity={0.35}>
            <Bottle {...bottle} />
          </Float>
        )}
        <Sparkles count={36} scale={[4, 4, 2]} size={2.5} speed={0.35} color="#F0B060" opacity={0.8} />
        <ContactShadows position={[0, -1.32, 0]} opacity={0.65} scale={6} blur={2.6} far={2.5} color="#000000" />
      </Suspense>
      {!isHero && (
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate={autoRotate}
          autoRotateSpeed={0.9}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.7}
          makeDefault
        />
      )}
    </Canvas>
  );
}
