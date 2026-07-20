"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Premium magnetic CTA — the button drifts gently toward the cursor,
 * with a gold fill that rises on hover. Slow, damped, no bounce.
 */
export default function MagneticButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 90, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 90, damping: 22, mass: 0.6 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.25);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ x: sx, y: sy }}
      className="group relative cursor-pointer overflow-hidden border border-champagne/50 px-12 py-5 text-[11px] tracking-[0.4em] text-champagne uppercase transition-colors duration-700 hover:text-noir"
    >
      <span className="absolute inset-0 origin-bottom scale-y-0 bg-champagne transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-y-100" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
