"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows } from "@react-three/drei";
import RingModel, { createSpinState } from "./RingModel";
import DragRotate from "./DragRotate";

/**
 * Lighter-weight ring scene for the finale — no camera rig, slow scroll
 * rotation, drag-rotatable. Renders only while on screen.
 */
export default function FinaleScene({
  progressRef,
}: {
  progressRef: React.RefObject<number>;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const spinRef = useRef(createSpinState());
  const [visible, setVisible] = useState(false);

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
        dpr={[1, 1.5]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0.5, 5.4], fov: 40 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          powerPreference: "high-performance",
          stencil: false,
        }}
        className="!absolute inset-0"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.18} color="#f5ead6" />
          <spotLight
            position={[3, 6, 4]}
            angle={0.5}
            penumbra={1}
            intensity={160}
            color="#ffe9c4"
          />
          <DragRotate spinRef={spinRef} />
          <RingModel progressRef={progressRef} spinRef={spinRef} scale={0.92} />
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.5}
            scale={8}
            blur={2.8}
            far={3}
            resolution={256}
            color="#000000"
          />
          <Environment resolution={128}>
            <Lightformer intensity={4} position={[0, 4, -4]} scale={[6, 3, 1]} color="#fff4dd" />
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
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}
