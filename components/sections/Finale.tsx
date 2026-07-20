"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { IMG, BLUR } from "@/lib/images";
import MagneticButton from "@/components/ui/MagneticButton";

const FinaleScene = dynamic(() => import("@/components/three/FinaleScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-noir" />,
});

export default function Finale() {
  const section = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const [desktop, setDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    setDesktop(window.matchMedia("(min-width: 768px)").matches);
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(section);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 0.7,
          onUpdate: (self) => {
            progressRef.current = self.progress;
          },
        },
        defaults: { ease: "power2.out" },
      });

      const lines = q(".finale-line");
      lines.forEach((line, i) => {
        tl.fromTo(
          line,
          { opacity: 0, y: 70 },
          { opacity: 1, y: 0, duration: 0.55 },
          0.25 + i * 0.5
        );
      });

      tl.fromTo(
        q(".finale-cta"),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.5 },
        2.0
      );
    },
    { scope: section }
  );

  return (
    <section ref={section} className="relative h-screen overflow-hidden bg-noir">
      {/* Signature ring — 3D on desktop, photograph on mobile */}
      {desktop === true && (
        <div className="absolute inset-0">
          <FinaleScene progressRef={progressRef} />
        </div>
      )}
      {desktop === false && (
        <div className="absolute inset-0">
          <Image
            src={IMG.solitaire}
            alt="The signature Aurelle solitaire"
            fill
            sizes="100vw"
            className="object-cover opacity-70"
            placeholder="blur"
            blurDataURL={BLUR}
          />
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(11,9,8,0.9) 100%)",
        }}
      />

      {/* Typography over the ring — pointer-events pass through to the canvas */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <h2 className="font-serif font-light text-ivory">
          <span className="finale-line block text-6xl leading-[1.05] opacity-0 md:text-[6.5vw]">
            ONE RING.
          </span>
          <span className="finale-line block text-6xl leading-[1.05] opacity-0 md:text-[6.5vw]">
            ONE STORY.
          </span>
          <span className="finale-line block text-6xl leading-[1.05] italic text-champagne-soft opacity-0 md:text-[6.5vw]">
            Yours.
          </span>
        </h2>

        <div className="finale-cta pointer-events-auto mt-14 opacity-0">
          <MagneticButton
            onClick={() =>
              document
                .getElementById("collection")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Discover the Collection
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
