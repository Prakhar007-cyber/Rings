"use client";

import { useState } from "react";
import { InstagramIcon, PinterestIcon, FacebookIcon } from "./SocialIcons";

const COLUMNS = [
  {
    title: "Collections",
    links: ["The Signature", "Solitaires", "Bands", "High Jewelry"],
  },
  {
    title: "Maison",
    links: ["Our Story", "The Atelier", "Appointments", "Journal"],
  },
  {
    title: "Care",
    links: ["Sizing Guide", "Lifetime Service", "Certificates", "Contact"],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <footer className="relative bg-noir-soft">
      <div className="hairline" />
      <div className="mx-auto max-w-[1500px] px-6 pt-20 pb-10 md:px-12 md:pt-28">
        <div className="flex flex-col gap-16 md:flex-row md:justify-between">
          {/* Wordmark + newsletter */}
          <div className="max-w-sm">
            <p className="font-serif text-3xl font-medium tracking-[0.3em] text-ivory">
              AURELLE
            </p>
            <p className="mt-2 text-[9px] tracking-[0.5em] text-champagne/80 uppercase">
              Maison de Joaillerie
            </p>
            <p className="mt-8 text-sm font-light leading-loose text-ivory-dim/80">
              Quiet news from the atelier — new pieces, private viewings,
              nothing more.
            </p>
            <form
              className="mt-6"
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setSent(true);
              }}
            >
              {sent ? (
                <p className="py-3 font-serif text-lg font-light italic text-champagne">
                  Welcome to the Maison.
                </p>
              ) : (
                <div className="flex items-center gap-4 border-b border-ivory/20 transition-colors duration-500 focus-within:border-champagne">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    aria-label="Email address"
                    className="w-full bg-transparent py-3 text-sm font-light text-ivory placeholder:text-ivory-dim/40 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="cursor-pointer pb-0.5 text-[10px] tracking-[0.35em] whitespace-nowrap text-champagne uppercase transition-opacity duration-300 hover:opacity-70"
                  >
                    Join
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-12 md:grid-cols-3 md:gap-20">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="mb-6 text-[10px] tracking-[0.4em] text-champagne uppercase">
                  {col.title}
                </p>
                <ul className="space-y-4">
                  {col.links.map((link) => (
                    <li key={link}>
                      <button className="cursor-pointer text-sm font-light text-ivory-dim/70 transition-colors duration-400 hover:text-ivory">
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-ivory/10 pt-8 md:flex-row">
          <p className="text-[10px] tracking-[0.3em] text-ivory-dim/50 uppercase">
            © {new Date().getFullYear()} Maison Aurelle. A fictional house.
          </p>
          <div className="flex items-center gap-7 text-ivory-dim/60">
            <a
              href="#"
              aria-label="Instagram"
              className="transition-colors duration-400 hover:text-champagne"
            >
              <InstagramIcon />
            </a>
            <a
              href="#"
              aria-label="Pinterest"
              className="transition-colors duration-400 hover:text-champagne"
            >
              <PinterestIcon />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="transition-colors duration-400 hover:text-champagne"
            >
              <FacebookIcon />
            </a>
          </div>
          <p className="text-[10px] tracking-[0.3em] text-ivory-dim/50 uppercase">
            Paris — est. 1987
          </p>
        </div>
      </div>
    </footer>
  );
}
