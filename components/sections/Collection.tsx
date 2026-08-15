"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { IMG, BLUR } from "@/lib/images";

const RINGS = [
  {
    id: "aurore",
    name: "Aurore",
    material: "18k white gold · brilliant solitaire",
    price: "12,400",
    src: IMG.solitaire,
  },
  {
    id: "lumen",
    name: "Lumen",
    material: "White gold · pavé crossover",
    price: "8,900",
    src: IMG.pave,
  },
  {
    id: "rosace",
    name: "Rosace",
    material: "Rose gold · padparadscha halo",
    price: "9,600",
    src: IMG.rose,
    pos: "object-[50%_30%]",
  },
  {
    id: "eterne",
    name: "Éterne",
    material: "18k yellow gold · matched bands",
    price: "3,200",
    src: IMG.bands,
  },
  {
    id: "heritage",
    name: "Héritage",
    material: "Textured gold · morganite cluster",
    price: "7,800",
    src: IMG.heritage,
  },
  {
    id: "sculpt",
    name: "Sculpt",
    material: "Sculptural gold · cabochon trio",
    price: "5,400",
    src: IMG.sculptural,
  },
];

const EASE = [0.19, 1, 0.22, 1] as const;

export default function Collection() {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const ring = RINGS[active];

  useGSAP(
    () => {
      const q = gsap.utils.selector(section);

      gsap.from(q(".col-line"), {
        yPercent: 110,
        duration: 1.4,
        ease: "power4.out",
        stagger: 0.1,
        scrollTrigger: { trigger: q(".col-heading")[0], start: "top 80%" },
      });

      gsap.from(q(".col-item"), {
        opacity: 0,
        x: -36,
        duration: 1,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: { trigger: q(".col-list")[0], start: "top 78%" },
      });

      gsap.from(q(".col-stage"), {
        opacity: 0,
        scale: 0.96,
        duration: 1.6,
        ease: "power3.out",
        scrollTrigger: { trigger: q(".col-stage")[0], start: "top 80%" },
      });
    },
    { scope: section }
  );

  return (
    <section
      ref={section}
      id="collection"
      className="relative overflow-hidden bg-noir py-32 md:py-44"
    >
      <div className="mx-auto max-w-375 px-6 md:px-12">
        {/* Heading */}
        <div className="col-heading mb-20 md:mb-28">
          <p className="mb-6 text-[10px] tracking-[0.5em] text-champagne uppercase">
            The Signature Collection
          </p>
          <h2 className="font-serif leading-[0.9] font-light text-ivory">
            <span className="block overflow-hidden">
              <span className="col-line block text-[15vw] md:text-[9vw]">FIND</span>
            </span>
            <span className="block overflow-hidden">
              <span className="col-line block text-[15vw] md:text-[9vw]">
                YOUR <span className="italic text-champagne-soft">forever.</span>
              </span>
            </span>
          </h2>
        </div>

        <div className="flex flex-col gap-14 md:flex-row md:items-start md:gap-20">
          {/* Ring index */}
          <div className="col-list order-2 md:order-1 md:w-[38%]">
            {RINGS.map((r, i) => {
              const selected = i === active;
              return (
                <button
                  key={r.id}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={selected}
                  className="col-item group block w-full cursor-pointer border-b border-ivory/10 py-5 text-left transition-colors duration-500"
                >
                  <span className="flex items-baseline gap-5">
                    <span
                      className={`text-[10px] tracking-[0.3em] transition-colors duration-500 ${
                        selected ? "text-champagne" : "text-ivory-dim/40"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className={`font-serif text-3xl font-light transition-all duration-500 md:text-4xl ${
                        selected
                          ? "translate-x-2 text-ivory"
                          : "text-ivory/45 group-hover:text-ivory/80"
                      }`}
                    >
                      {r.name}
                    </span>
                  </span>
                  <motion.span
                    className="mt-3 block h-px origin-left bg-champagne/60"
                    animate={{ scaleX: selected ? 1 : 0 }}
                    transition={{ duration: 0.7, ease: EASE }}
                  />
                </button>
              );
            })}
          </div>

          {/* Featured stage */}
          <div className="col-stage relative order-1 md:order-2 md:w-[62%]">
            <div className="relative aspect-4/5 max-h-[75vh] w-full overflow-hidden md:aspect-5/4">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={ring.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.985 }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  <Image
                    src={ring.src}
                    alt={`${ring.name} — ${ring.material}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 62vw"
                    className={`object-cover ${ring.pos ?? ""}`}
                    placeholder="blur"
                    blurDataURL={BLUR}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-noir/60 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Details overlay */}
              <div className="absolute bottom-0 left-0 z-10 p-7 md:p-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={ring.id}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.55, ease: EASE }}
                  >
                    <p className="font-serif text-4xl font-light italic text-ivory md:text-5xl">
                      {ring.name}
                    </p>
                    <p className="mt-2 text-[10px] tracking-[0.35em] text-ivory-dim uppercase">
                      {ring.material}
                    </p>
                    <p className="mt-4 text-sm font-light tracking-[0.2em] text-champagne">
                      € {ring.price}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <p className="mt-6 text-right text-[10px] tracking-[0.35em] text-ivory-dim/50 uppercase">
              Each piece made to order — Atelier Aurelle, Paris
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
