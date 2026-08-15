"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { IMG, BLUR } from "@/lib/images";

const PIECES = [
  {
    src: IMG.bands,
    title: "The Classic Band",
    note: "Polished 18k yellow gold, mirror finish",
  },
  {
    src: IMG.sculptural,
    title: "Sculptural Forms",
    note: "Hand-carved silhouettes, cabochon stones",
  },
  {
    src: IMG.heritage,
    title: "Textured Heritage",
    note: "Milgrain detail, morganite cluster",
  },
  {
    src: IMG.ruby,
    title: "A Statement in Warmth",
    note: "Antique setting, Burmese ruby",
    pos: "object-[50%_75%]",
  },
];

export default function Gold() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(section);
      const slides = q(".gold-slide");
      const counters = q(".gold-counter");
      const captions = q(".gold-caption");

      gsap.set(slides, { clipPath: "inset(100% 0% 0% 0%)", scale: 1.12 });
      gsap.set(slides[0], { clipPath: "inset(0% 0% 0% 0%)", scale: 1 });
      gsap.set(counters, { yPercent: 100, opacity: 0 });
      gsap.set(counters[0], { yPercent: 0, opacity: 1 });
      gsap.set(captions, { opacity: 0, y: 24 });
      gsap.set(captions[0], { opacity: 1, y: 0 });

      // Heading reveal as the section approaches — before the pin engages
      gsap.from(q(".gold-heading .reveal-line"), {
        yPercent: 110,
        duration: 1.3,
        ease: "power4.out",
        stagger: 0.12,
        scrollTrigger: { trigger: section.current, start: "top 65%" },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: `+=${PIECES.length * 90}%`,
          pin: true,
          scrub: 0.6,
        },
        defaults: { ease: "power2.inOut" },
      });

      PIECES.forEach((_, i) => {
        if (i === 0) return;
        const pos = `step${i}`;
        tl.addLabel(pos, "+=0.35")
          .to(
            slides[i],
            { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1 },
            pos
          )
          .to(slides[i - 1], { scale: 1.06, duration: 1 }, pos)
          .to(counters[i - 1], { yPercent: -100, opacity: 0, duration: 0.5 }, pos)
          .to(counters[i], { yPercent: 0, opacity: 1, duration: 0.5 }, `${pos}+=0.1`)
          .to(captions[i - 1], { opacity: 0, y: -24, duration: 0.4 }, pos)
          .to(captions[i], { opacity: 1, y: 0, duration: 0.4 }, `${pos}+=0.15`);
      });

      tl.to({}, { duration: 0.4 });
    },
    { scope: section }
  );

  return (
    <section
      ref={section}
      id="gold"
      className="relative h-screen overflow-hidden bg-ivory text-noir"
    >
      <div className="mx-auto flex h-full max-w-375 flex-col justify-center gap-8 px-6 md:flex-row md:items-center md:gap-16 md:px-12">
        {/* Left — editorial copy */}
        <div className="gold-heading relative z-10 pt-24 md:w-[42%] md:pt-0">
          <p className="mb-6 text-[10px] font-normal tracking-[0.5em] text-gold-deep uppercase">
            Chapter I — Material
          </p>
          <h2 className="font-serif text-6xl leading-[0.92] font-light md:text-[6.5vw]">
            <span className="block overflow-hidden">
              <span className="reveal-line block">SHAPED</span>
            </span>
            <span className="block overflow-hidden">
              <span className="reveal-line block italic">in gold.</span>
            </span>
          </h2>
          <p className="mt-8 max-w-sm text-sm font-light leading-loose tracking-wide text-noir/60">
            Sculpted from precious metal.
            <br />
            Refined until nothing remains but form.
          </p>

          {/* Captions — swapped by the timeline */}
          <div className="relative mt-12 h-16">
            {PIECES.map((p) => (
              <div key={p.title} className="gold-caption absolute inset-0">
                <p className="font-serif text-2xl font-light italic">{p.title}</p>
                <p className="mt-1 text-[11px] tracking-[0.25em] text-noir/50 uppercase">
                  {p.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — pinned image stack */}
        <div className="relative aspect-4/5 w-full max-h-[62vh] overflow-hidden md:max-h-[78vh] md:w-[46%]">
          {PIECES.map((p, i) => (
            <div key={p.title} className="gold-slide absolute inset-0 will-change-transform">
              <Image
                src={p.src}
                alt={p.title}
                fill
                sizes="(max-width: 768px) 100vw, 46vw"
                className={`object-cover ${p.pos ?? ""}`}
                placeholder="blur"
                blurDataURL={BLUR}
                priority={i === 0}
              />
            </div>
          ))}
          {/* Counter */}
          <div className="absolute bottom-6 left-6 z-10 flex items-baseline gap-2 text-ivory mix-blend-difference">
            <div className="relative h-10 w-12 overflow-hidden">
              {PIECES.map((_, i) => (
                <span
                  key={i}
                  className="gold-counter absolute inset-0 font-serif text-4xl font-light"
                >
                  0{i + 1}
                </span>
              ))}
            </div>
            <span className="text-sm opacity-60">/ 0{PIECES.length}</span>
          </div>
        </div>
      </div>

      {/* Oversized ghost word */}
      <div className="pointer-events-none absolute -bottom-6 left-0 select-none">
        <span className="font-serif text-[24vw] leading-none font-light text-noir/4">
          AURUM
        </span>
      </div>
    </section>
  );
}
