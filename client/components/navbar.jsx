"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import logo from "@/public/assets/logo.png";
import { WEBSITE_LOGIN, WEBSITE_Register } from "@/routes/WebsiteRoutes";
const LINKS = [
  { label: "Bots", href: "#bots" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Performance", href: "#performance" },
  { label: "Pricing", href: "#pricing" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
         <Image
          src={logo}
          alt="Bullish Pixel"
          width={logo.width}
          height={logo.height}
          className=" w-28"
        />

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <a href={WEBSITE_LOGIN} className="text-sm font-medium text-muted transition-colors hover:text-ink">
            Log in
          </a>
          <a
            href={WEBSITE_Register}
            className="rounded-md bg-signal px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Start free trial
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-ink"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-bg px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-muted hover:text-ink"
              >
                {link.label}
              </a>
            ))}
            <a href={WEBSITE_LOGIN} className="text-sm font-medium text-muted hover:text-ink">
              Log in
            </a>
            <a
              href={WEBSITE_Register}
              onClick={() => setOpen(false)}
              className="rounded-md bg-signal px-4 py-2 text-center text-sm font-semibold text-white"
            >
              Start free trial
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
