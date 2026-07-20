"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import type { SpinState } from "./RingModel";

/**
 * Pointer drag → ring spin. Writes deltas into the shared SpinState ref that
 * RingModel reads every frame — no React state, no re-renders.
 * Horizontal drag spins the band, vertical drag tilts it; releasing with
 * momentum lets it coast. touch-action stays pan-y so the page still scrolls.
 */
export default function DragRotate({
  spinRef,
}: {
  spinRef: React.RefObject<SpinState>;
}) {
  const gl = useThree((s) => s.gl);

  useEffect(() => {
    const el = gl.domElement;
    const prevTouchAction = el.style.touchAction;
    const prevCursor = el.style.cursor;
    el.style.touchAction = "pan-y";
    el.style.cursor = "grab";

    let pointerId: number | null = null;
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;

    const onDown = (e: PointerEvent) => {
      if (!e.isPrimary || pointerId !== null) return;
      pointerId = e.pointerId;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = e.timeStamp;
      const spin = spinRef.current;
      spin.dragging = true;
      spin.vy = 0;
      spin.vx = 0;
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* capture can fail if the pointer is already gone */
      }
      el.style.cursor = "grabbing";
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dt = Math.max(e.timeStamp - lastT, 1);
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = e.timeStamp;

      const spin = spinRef.current;
      spin.y += dx * 0.006;
      spin.x += dy * 0.0035;
      // Velocity in rad/s for the inertia coast after release.
      spin.vy = (dx / dt) * 6;
      spin.vx = (dy / dt) * 3.5;
    };

    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      pointerId = null;
      spinRef.current.dragging = false;
      el.style.cursor = "grab";
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.style.touchAction = prevTouchAction;
      el.style.cursor = prevCursor;
      spinRef.current.dragging = false;
    };
  }, [gl, spinRef]);

  return null;
}
