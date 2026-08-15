"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, useGSAP } from "@/lib/gsap";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-noir" />,
});

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const progressRef = useRef(0);

  useGSAP(
    () => {
      const q = gsap.utils.selector(section);

      // Entrance choreography — one staggered tween, resilient to interruption
      gsap.fromTo(
        [
          ...q(".hero-kicker"),
          ...q(".hero-line"),
          ...q(".hero-support"),
          ...q(".hero-cta"),
        ],
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.6,
          stagger: 0.16,
          delay: 0.35,
          ease: "power4.out",
          clearProps: "opacity,transform",
        }
      );

      // Scroll-driven: pin the hero, write progress for the 3D rig,
      // dissolve the front typography as the ring takes over.
      gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "+=220%",
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            progressRef.current = self.progress;
          },
        },
      })
        .to(q(".hero-front"), { opacity: 0, y: -60, ease: "none", duration: 0.35 }, 0.1)
        .to(q(".hero-back"), { opacity: 0.06, scale: 1.06, ease: "none", duration: 0.6 }, 0.15)
        .fromTo(
          q(".hero-outro"),
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, ease: "none", duration: 0.3 },
          0.62
        )
        .to(q(".hero-outro"), { opacity: 0, ease: "none", duration: 0.15 }, 0.92);
    },
    { scope: section }
  );

  const scrollToCollection = () => {
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={section} id="hero" className="relative h-screen overflow-hidden bg-noir">
      {/* Oversized serif backdrop — sits behind the ring */}
      <div className="hero-back pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-[0.13]">
        <span className="font-serif text-[38vw] leading-none text-ivory select-none">
          A
        </span>
      </div>

      {/* 3D ring */}
      <div className="absolute inset-0 z-10">
        <HeroScene progressRef={progressRef} />
      </div>

      {/* Radial vignette above canvas */}
      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(11,9,8,0.85) 100%)",
        }}
      />

      {/* Foreground typography — pointer-events pass through to the ring canvas */}
      <div className="hero-front pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center">
        <p className="hero-kicker mb-8 text-[11px] font-light tracking-[0.5em] text-champagne uppercase">
          The Signature Collection
        </p>
        <h1 className="font-serif text-ivory">
          <span className="hero-line block text-[13vw] leading-[0.95] font-light md:text-[8.5vw]">
            FOREVER,
          </span>
          <span className="hero-line block text-[13vw] leading-[0.95] font-light italic md:text-[8.5vw]">
            made tangible.
          </span>
        </h1>
        <p className="hero-support mt-10 max-w-md text-[13px] font-light leading-relaxed tracking-[0.18em] text-ivory-dim uppercase">
          Gold shaped by precision.
          <br />
          Diamonds chosen for brilliance.
        </p>
        <button
          onClick={scrollToCollection}
          className="hero-cta group pointer-events-auto mt-12 cursor-pointer border border-champagne/40 px-10 py-4 text-[11px] tracking-[0.4em] text-champagne uppercase transition-all duration-500 hover:border-champagne hover:bg-champagne/10"
        >
          Discover the Collection
          <span className="ml-3 inline-block transition-transform duration-500 group-hover:translate-x-1.5">
            →
          </span>
        </button>
      </div>

      {/* Mid-scroll interstitial line */}
      <div className="hero-outro pointer-events-none absolute inset-0 z-30 flex items-end justify-center pb-24 opacity-0">
        <p className="font-serif text-2xl font-light italic tracking-wide text-ivory/80 md:text-3xl">
          Every story begins with a circle.
        </p>
      </div>

      {/* Scroll hint */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 z-30 -translate-x-1/2">
        <div className="h-12 w-px animate-pulse bg-linear-to-b from-transparent via-champagne/60 to-transparent" />
      </div>

      {/* Drag affordance */}
      <p className="pointer-events-none absolute right-8 bottom-8 z-30 hidden text-[9px] tracking-[0.4em] text-ivory-dim/50 uppercase md:block">
        Drag to rotate
      </p>
    </section>
  );
}
