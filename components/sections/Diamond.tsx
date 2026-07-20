"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { IMG, BLUR } from "@/lib/images";

export default function Diamond() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(section);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "+=280%",
          pin: true,
          scrub: 0.8,
        },
        defaults: { ease: "none" },
      });

      // Slow cinematic zoom into the stone
      tl.fromTo(
        q(".diamond-img"),
        { scale: 1, yPercent: 4 },
        { scale: 1.65, yPercent: -6, duration: 3 },
        0
      )
        // Frame narrows — theatre-curtain effect
        .fromTo(
          q(".diamond-frame"),
          { clipPath: "inset(18% 22% 18% 22%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power1.inOut" },
          0
        )
        // Light sweep across the stone
        .fromTo(
          q(".diamond-sweep"),
          { xPercent: -120, opacity: 0 },
          { xPercent: 120, opacity: 0.5, duration: 1.6, ease: "power1.inOut" },
          1.1
        )
        // Typography phases
        .fromTo(
          q(".diamond-title"),
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          0.35
        )
        .to(q(".diamond-title"), { opacity: 0, y: -50, duration: 0.6 }, 1.6)
        .fromTo(
          q(".diamond-phrase"),
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          2.2
        )
        .to(q(".diamond-phrase"), { opacity: 0, duration: 0.4 }, 2.85);
    },
    { scope: section }
  );

  return (
    <section
      ref={section}
      id="diamonds"
      className="relative h-screen overflow-hidden bg-noir"
    >
      {/* Photograph — real macro of a solitaire on black */}
      <div className="diamond-frame absolute inset-0 will-change-[clip-path]">
        <div className="diamond-img relative h-full w-full will-change-transform">
          <Image
            src={IMG.solitaire}
            alt="Solitaire diamond ring on black"
            fill
            sizes="100vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL={BLUR}
          />
          {/* moving light sweep */}
          <div
            className="diamond-sweep pointer-events-none absolute inset-y-0 w-1/2 opacity-0"
            style={{
              background:
                "linear-gradient(100deg, transparent, rgba(245,241,234,0.16), transparent)",
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-noir/70 via-transparent to-noir/50" />
      </div>

      {/* Phase 1 typography */}
      <div className="diamond-title absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center opacity-0">
        <p className="mb-6 text-[10px] tracking-[0.5em] text-champagne uppercase">
          Chapter II — Light
        </p>
        <h2 className="font-serif text-7xl leading-[0.95] font-light text-ivory md:text-[9vw]">
          LIGHT,
          <br />
          <span className="italic">perfected.</span>
        </h2>
      </div>

      {/* Phase 2 typography */}
      <div className="diamond-phrase absolute inset-x-0 bottom-24 z-10 px-6 text-center opacity-0">
        <p className="mx-auto max-w-lg font-serif text-2xl leading-relaxed font-light italic text-ivory/90 md:text-3xl">
          Every facet exists for one reason:
          <br />
          to return light.
        </p>
      </div>
    </section>
  );
}
