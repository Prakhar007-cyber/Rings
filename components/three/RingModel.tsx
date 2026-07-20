"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Procedural gold-and-diamond ring.
 * Band: torus with PBR gold. Head: six prongs cradling a brilliant-style
 * faceted gem built from truncated cones with flat shading.
 */

/** Shared mutable state for pointer-driven spin — written by DragRotate, read here every frame. */
export type SpinState = {
  y: number;
  x: number;
  vy: number;
  vx: number;
  dragging: boolean;
};

export const createSpinState = (): SpinState => ({
  y: 0,
  x: 0,
  vy: 0,
  vx: 0,
  dragging: false,
});

const TILT_LIMIT = 0.7;

function createGemGeometry() {
  const girdleR = 0.34;
  const tableR = 0.19;
  const crownH = 0.16;
  const pavilionH = 0.42;
  const segments = 8;

  const crown = new THREE.CylinderGeometry(tableR, girdleR, crownH, segments, 1);
  crown.translate(0, crownH / 2, 0);
  const pavilion = new THREE.CylinderGeometry(girdleR, 0.005, pavilionH, segments, 1);
  pavilion.translate(0, -pavilionH / 2, 0);
  pavilion.rotateY(Math.PI / segments);

  const merged = mergeGeometries([crown, pavilion]);
  merged.computeVertexNormals();
  return merged;
}

// Minimal merge (avoids importing three-stdlib) — index-free concat.
function mergeGeometries(geoms: THREE.BufferGeometry[]) {
  const nonIndexed = geoms.map((g) => g.toNonIndexed());
  const total = nonIndexed.reduce(
    (n, g) => n + g.attributes.position.count,
    0
  );
  const pos = new Float32Array(total * 3);
  let offset = 0;
  for (const g of nonIndexed) {
    pos.set(g.attributes.position.array as Float32Array, offset);
    offset += g.attributes.position.array.length;
    g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return out;
}

export const GOLD = new THREE.Color("#caa14f");

type RingModelProps = {
  /** externally-driven progress ref (0..1) from ScrollTrigger */
  progressRef?: React.RefObject<number>;
  /** pointer-driven spin offset, written by DragRotate */
  spinRef?: React.RefObject<SpinState>;
  scale?: number;
  /** "low" skips transmission — saves a full extra scene render pass */
  quality?: "high" | "low";
};

export default function RingModel({
  progressRef,
  spinRef,
  scale = 1,
  quality = "high",
}: RingModelProps) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);

  const gemGeometry = useMemo(() => createGemGeometry(), []);

  const goldMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: GOLD,
        metalness: 1,
        roughness: 0.14,
        clearcoat: 0.6,
        clearcoatRoughness: 0.25,
        reflectivity: 1,
      }),
    []
  );

  const gemMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#eef2fa"),
        metalness: 0,
        roughness: 0.04,
        // Transmission doubles the render cost — fake it with a bright env
        // map and slight opacity on low quality instead.
        ...(quality === "high"
          ? { transmission: 0.85, thickness: 1.4 }
          : { transparent: true, opacity: 0.92 }),
        ior: 2.4,
        envMapIntensity: quality === "high" ? 3.2 : 4.2,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        specularIntensity: 1.5,
        flatShading: true,
      }),
    [quality]
  );

  // Pavé stones are tiny — transmission adds nothing visible there, so they
  // always use the cheap variant.
  const paveMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#eef2fa"),
        metalness: 0,
        roughness: 0.04,
        envMapIntensity: 4,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        flatShading: true,
      }),
    []
  );

  useFrame((state, delta) => {
    const p = progressRef?.current ?? 0;
    const spin = spinRef?.current;

    if (spin && !spin.dragging) {
      // Inertia after release: coast on the flick velocity, then settle.
      spin.y += spin.vy * delta;
      spin.x = THREE.MathUtils.clamp(
        spin.x + spin.vx * delta,
        -TILT_LIMIT,
        TILT_LIMIT
      );
      const friction = Math.exp(-2.4 * delta);
      spin.vy *= friction;
      spin.vx *= friction;
      // Tilt eases back to neutral so scroll choreography stays framed.
      spin.x = THREE.MathUtils.damp(spin.x, 0, 1.1, delta);
    }

    if (group.current) {
      // Scroll drives the main pose; pointer spin offsets it on top.
      const targetY = p * Math.PI * 2.2 + (spin?.y ?? 0);
      const targetX = THREE.MathUtils.clamp(
        0.35 - p * 0.55 + (spin?.x ?? 0),
        -Math.PI / 2,
        Math.PI / 2
      );
      // Tighter damping while dragging so the ring feels attached to the pointer.
      const lambda = spin?.dragging ? 14 : 3;
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        targetY,
        lambda,
        delta
      );
      group.current.rotation.x = THREE.MathUtils.damp(
        group.current.rotation.x,
        targetX,
        lambda,
        delta
      );
    }
    if (inner.current) {
      inner.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.25) * 0.04;
    }
  });

  const prongs = useMemo(() => {
    const arr: { x: number; z: number; rot: number }[] = [];
    const n = 6;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      arr.push({ x: Math.cos(a) * 0.3, z: Math.sin(a) * 0.3, rot: a });
    }
    return arr;
  }, []);

  return (
    <group ref={group} scale={scale}>
      <group ref={inner}>
        {/* Band — upright in the XY plane so the gem sits at top */}
        <mesh material={goldMaterial}>
          <torusGeometry args={[1, 0.14, 48, 96]} />
        </mesh>

        {/* Head base — small collar under the gem */}
        <mesh material={goldMaterial} position={[0, 1.1, 0]}>
          <cylinderGeometry args={[0.17, 0.11, 0.18, 24]} />
        </mesh>

        {/* Prongs */}
        {prongs.map((pr, i) => (
          <mesh
            key={i}
            material={goldMaterial}
            position={[pr.x * 0.72, 1.26, pr.z * 0.72]}
            rotation={[0, -pr.rot, 0]}
          >
            <cylinderGeometry args={[0.018, 0.03, 0.26, 12]} />
          </mesh>
        ))}

        {/* Diamond */}
        <mesh
          geometry={gemGeometry}
          material={gemMaterial}
          position={[0, 1.36, 0]}
          scale={0.85}
        />

        {/* Pavé accents along shoulders */}
        {[-3, -2, -1, 1, 2, 3].map((i) => {
          const a = Math.PI / 2 + i * 0.16;
          return (
            <mesh
              key={`pave-${i}`}
              material={paveMaterial}
              position={[Math.cos(a) * 1.15, Math.sin(a) * 1.15, 0]}
              scale={0.045}
            >
              <icosahedronGeometry args={[1, 0]} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
