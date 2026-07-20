"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows } from "@react-three/drei";
import RingModel, { createSpinState } from "./RingModel";
import DragRotate from "./DragRotate";

/**
 * Full-viewport 3D scene for the hero. Scroll progress (0..1) is written into
 * a shared ref by the Hero section's ScrollTrigger and read every frame —
 * no React re-renders during scroll. Rendering pauses entirely while the
 * section is off-screen, and the ring is drag-rotatable.
 */

function CameraRig({ progressRef }: { progressRef: React.RefObject<number> }) {
  const { camera } = useThree();
  useFrame((_, delta) => {
    const p = progressRef.current;
    const targetZ = 6.2 - p * 1.9;
    const targetY = 0.4 + p * 0.5;
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 2.5, delta);
    camera.lookAt(0, 0.45, 0);
  });
  return null;
}

function KeyLight({ progressRef }: { progressRef: React.RefObject<number> }) {
  const light = useRef<THREE.SpotLight>(null);
  useFrame((_, delta) => {
    if (!light.current) return;
    const p = progressRef.current;
    light.current.intensity = THREE.MathUtils.damp(
      light.current.intensity,
      120 + p * 160,
      2.5,
      delta
    );
  });
  return (
    <spotLight
      ref={light}
      position={[4, 6, 5]}
      angle={0.5}
      penumbra={1}
      intensity={120}
      color="#ffe9c4"
    />
  );
}

export default function HeroScene({
  progressRef,
}: {
  progressRef: React.RefObject<number>;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const spinRef = useRef(createSpinState());
  const [dpr, setDpr] = useState<[number, number]>([1, 1.75]);
  const [mobile, setMobile] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 768px)").matches;
    setMobile(narrow);
    if (narrow) setDpr([1, 1.25]);
  }, []);

  // Stop the render loop entirely once the hero is scrolled out of view.
  useEffect(() => {
    if (!wrapper.current) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "100px" }
    );
    io.observe(wrapper.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapper} className="absolute inset-0">
      <Canvas
        dpr={dpr}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0.4, 6.2], fov: 38 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
          powerPreference: "high-performance",
          stencil: false,
        }}
        className="!absolute inset-0"
      >
        <Suspense fallback={null}>
          <CameraRig progressRef={progressRef} />
          <DragRotate spinRef={spinRef} />
          <KeyLight progressRef={progressRef} />
          <ambientLight intensity={0.15} color="#f5ead6" />

          <RingModel
            progressRef={progressRef}
            spinRef={spinRef}
            scale={mobile ? 0.8 : 1}
            quality={mobile ? "low" : "high"}
          />

          <ContactShadows
            position={[0, -1.55, 0]}
            opacity={0.55}
            scale={9}
            blur={2.6}
            far={3}
            resolution={mobile ? 128 : 256}
            color="#000000"
          />

          {/* Procedural studio environment — champagne key panels, cool rim */}
          <Environment resolution={mobile ? 128 : 256}>
            <Lightformer
              intensity={4}
              position={[0, 4, -4]}
              scale={[6, 3, 1]}
              color="#fff4dd"
            />
            <Lightformer
              intensity={2.5}
              position={[-5, 1, 2]}
              rotation-y={Math.PI / 2}
              scale={[5, 2, 1]}
              color="#e8c98e"
            />
            <Lightformer
              intensity={2}
              position={[5, 0, 1]}
              rotation-y={-Math.PI / 2}
              scale={[5, 1.5, 1]}
              color="#d8e4ff"
            />
            <Lightformer
              intensity={1.2}
              position={[0, -3, 3]}
              rotation-x={Math.PI / 2}
              scale={[6, 4, 1]}
              color="#caa66a"
            />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}
