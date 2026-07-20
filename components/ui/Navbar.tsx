"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LINKS = [
  { label: "Collection", href: "#collection" },
  { label: "Gold", href: "#gold" },
  { label: "Diamonds", href: "#diamonds" },
  { label: "Atelier", href: "#atelier" },
];

const EASE = [0.19, 1, 0.22, 1] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-noir/70 backdrop-blur-md [box-shadow:0_1px_0_rgba(198,161,91,0.15)]"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto grid max-w-[1500px] grid-cols-3 items-center px-6 py-5 md:px-12">
          {/* Left links */}
          <div className="hidden items-center gap-8 md:flex">
            {LINKS.slice(0, 2).map((l) => (
              <button
                key={l.label}
                onClick={() => go(l.href)}
                className="group relative cursor-pointer text-[10px] tracking-[0.35em] text-ivory/70 uppercase transition-colors duration-500 hover:text-ivory"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-champagne transition-transform duration-500 ease-out group-hover:scale-x-100" />
              </button>
            ))}
          </div>

          {/* Mobile burger */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 cursor-pointer flex-col items-start justify-center gap-1.5 md:hidden"
          >
            <span
              className={`h-px bg-ivory transition-all duration-500 ${
                open ? "w-6 translate-y-[3.5px] rotate-45" : "w-6"
              }`}
            />
            <span
              className={`h-px bg-ivory transition-all duration-500 ${
                open ? "w-6 -translate-y-[3.5px] -rotate-45" : "w-4"
              }`}
            />
          </button>

          {/* Wordmark */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="cursor-pointer text-center"
          >
            <span className="font-serif text-xl font-medium tracking-[0.35em] text-ivory md:text-2xl">
              AURELLE
            </span>
            <span className="mt-0.5 hidden text-[8px] tracking-[0.6em] text-champagne/80 uppercase md:block">
              Maison de Joaillerie
            </span>
          </button>

          {/* Right links + appointment */}
          <div className="flex items-center justify-end gap-8">
            {LINKS.slice(2).map((l) => (
              <button
                key={l.label}
                onClick={() => go(l.href)}
                className="group relative hidden cursor-pointer text-[10px] tracking-[0.35em] text-ivory/70 uppercase transition-colors duration-500 hover:text-ivory md:block"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-champagne transition-transform duration-500 ease-out group-hover:scale-x-100" />
              </button>
            ))}
            <button className="hidden cursor-pointer border border-champagne/40 px-5 py-2.5 text-[9px] tracking-[0.3em] text-champagne uppercase transition-all duration-500 hover:border-champagne hover:bg-champagne/10 lg:block">
              Book an Appointment
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-noir-soft md:hidden"
          >
            {LINKS.map((l, i) => (
              <motion.button
                key={l.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.08, duration: 0.7, ease: EASE }}
                onClick={() => go(l.href)}
                className="cursor-pointer py-3 font-serif text-5xl font-light text-ivory transition-colors duration-500 hover:text-champagne"
              >
                {l.label}
              </motion.button>
            ))}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-10 text-[9px] tracking-[0.5em] text-champagne/70 uppercase"
            >
              Paris — est. 1987
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
