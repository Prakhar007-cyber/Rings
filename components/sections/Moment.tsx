"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { IMG, BLUR } from "@/lib/images";

const MOMENTS = [
  { src: IMG.handsRaised, alt: "Hands wearing gold rings, raised in soft light" },
  { src: IMG.ringBox, alt: "An engagement ring waiting in its box" },
  { src: IMG.coupleHands, alt: "Two hands, two rings, one promise" },
];

export default function Moment() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(section);
      const frames = q(".moment-frame");

      gsap.set(frames, { opacity: 0, scale: 1.08 });
      gsap.set(frames[0], { opacity: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: `+=${MOMENTS.length * 100}%`,
          pin: true,
          scrub: 0.8,
        },
        defaults: { ease: "power1.inOut" },
      });

      // Slow drift on the first frame, then dissolve between frames
      tl.to(frames[0], { scale: 1, duration: 1 }, 0);
      MOMENTS.forEach((_, i) => {
        if (i === 0) return;
        const at = i * 1.1;
        tl.to(frames[i - 1], { opacity: 0, duration: 0.7 }, at)
          .to(frames[i], { opacity: 1, duration: 0.7 }, at)
          .to(frames[i], { scale: 1, duration: 1.1 }, at);
      });

      // Heading: one slow rise, stays
      tl.fromTo(
        q(".moment-heading"),
        { opacity: 0, y: 70 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" },
        0.15
      );
    },
    { scope: section }
  );

  return (
    <section ref={section} className="relative h-screen overflow-hidden bg-noir">
      {MOMENTS.map((m, i) => (
        <div key={m.alt} className="moment-frame absolute inset-0 will-change-transform">
          <Image
            src={m.src}
            alt={m.alt}
            fill
            sizes="100vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL={BLUR}
          />
        </div>
      ))}

      {/* Cinematic grade */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-noir/60 via-noir/10 to-noir/70" />

      <div className="moment-heading absolute inset-x-0 bottom-0 z-10 pb-20 text-center opacity-0">
        <p className="mb-5 text-[10px] tracking-[0.5em] text-champagne uppercase">
          Chapter IV — The Moment
        </p>
        <h2 className="font-serif text-5xl leading-tight font-light text-ivory md:text-7xl">
          SOME MOMENTS
          <br />
          <span className="italic">deserve forever.</span>
        </h2>
      </div>
    </section>
  );
}
