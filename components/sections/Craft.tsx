"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { IMG, BLUR } from "@/lib/images";

const SPECS = [
  { label: "Alloy", value: "18k gold — cast, forged, hand-finished" },
  { label: "Setting", value: "Each stone seated by a single master" },
  { label: "Tolerance", value: "Measured to a tenth of a millimeter" },
  { label: "Polish", value: "Mirror grade, twelve passes" },
];

export default function Craft() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(section);

      // Heading mask reveal
      gsap.from(q(".craft-line"), {
        yPercent: 110,
        duration: 1.4,
        ease: "power4.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: q(".craft-heading")[0],
          start: "top 80%",
        },
      });

      // Main image — curtain reveal + inner slow zoom
      gsap.fromTo(
        q(".craft-img-main"),
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.6,
          ease: "power3.inOut",
          scrollTrigger: { trigger: q(".craft-img-main")[0], start: "top 78%" },
        }
      );
      gsap.fromTo(
        q(".craft-img-main img"),
        { scale: 1.25 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: q(".craft-img-main")[0],
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // Secondary image — vertical parallax drift
      gsap.fromTo(
        q(".craft-img-side"),
        { yPercent: 14 },
        {
          yPercent: -14,
          ease: "none",
          scrollTrigger: {
            trigger: q(".craft-img-side")[0],
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // Spec rows
      gsap.from(q(".craft-spec"), {
        opacity: 0,
        y: 28,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: q(".craft-specs")[0], start: "top 80%" },
      });
    },
    { scope: section }
  );

  return (
    <section
      ref={section}
      id="atelier"
      className="relative overflow-hidden bg-noir-warm py-32 md:py-48"
    >
      <div className="mx-auto max-w-375 px-6 md:px-12">
        {/* Heading */}
        <div className="craft-heading relative z-10 md:max-w-[60%]">
          <p className="mb-6 text-[10px] tracking-[0.5em] text-champagne uppercase">
            Chapter III — Craft
          </p>
          <h2 className="font-serif text-6xl leading-[0.92] font-light text-ivory md:text-[7vw]">
            <span className="block overflow-hidden">
              <span className="craft-line block">MADE</span>
            </span>
            <span className="block overflow-hidden">
              <span className="craft-line block italic">by detail.</span>
            </span>
          </h2>
          <p className="mt-8 max-w-sm text-sm font-light leading-loose tracking-wide text-ivory-dim">
            Measured in millimeters.
            <br />
            Remembered for generations.
          </p>
        </div>

        {/* Editorial image composition */}
        <div className="relative mt-20 grid grid-cols-12 gap-6 md:mt-8">
          <div className="craft-img-main relative col-span-12 aspect-4/3 overflow-hidden will-change-[clip-path] md:col-span-6 md:col-start-6">
            <Image
              src={IMG.paveDetail}
              alt="Pavé diamond setting, macro detail"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-[50%_62%] will-change-transform"
              placeholder="blur"
              blurDataURL={BLUR}
            />
          </div>
          <div className="craft-img-side relative col-span-8 col-start-3 -mt-10 aspect-square overflow-hidden will-change-transform md:col-span-3 md:col-start-2 md:-mt-40">
            <Image
              src={IMG.heritage}
              alt="Milgrain gold ring, hand-set stones"
              fill
              sizes="(max-width: 768px) 66vw, 25vw"
              className="object-cover"
              placeholder="blur"
              blurDataURL={BLUR}
            />
          </div>

          {/* Floating annotation */}
          <div className="col-span-12 mt-6 md:col-span-3 md:col-start-10 md:mt-10">
            <p className="border-l border-champagne/30 pl-5 font-serif text-xl font-light italic leading-relaxed text-ivory/70">
              “A ring is finished when there is nothing left to remove.”
            </p>
            <p className="mt-4 pl-5 text-[10px] tracking-[0.35em] text-ivory-dim/60 uppercase">
              Atelier Aurelle, Paris
            </p>
          </div>
        </div>

        {/* Specs */}
        <div className="craft-specs mt-28 md:mt-40 md:max-w-[70%]">
          {SPECS.map((s) => (
            <div
              key={s.label}
              className="craft-spec flex flex-col gap-1 border-b border-ivory/10 py-6 md:flex-row md:items-baseline md:gap-12"
            >
              <span className="w-32 shrink-0 text-[10px] tracking-[0.4em] text-champagne uppercase">
                {s.label}
              </span>
              <span className="font-serif text-2xl font-light text-ivory/85 md:text-3xl">
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Ghost word */}
      <div className="pointer-events-none absolute top-10 right-0 select-none">
        <span className="font-serif text-[20vw] leading-none font-light text-ivory/2.5">
          MAIN
        </span>
      </div>
    </section>
  );
}
