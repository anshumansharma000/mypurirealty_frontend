"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/listings", label: "Listings" },
  { href: "/about", label: "About Us" },
  { href: "/partners", label: "Partner with Us" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-gold-300 backdrop-blur-md opacity-95">
      <Container className="flex h-16 items-center justify-between">
        {/* Brand */}
        <Link href="/" className="text-xl font-bold text-ink">
          mypurirealty
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition ${
                    isActive
                      ? "text-gold-600 underline underline-offset-4 decoration-gold-strong"
                      : "text-white/90 hover:text-gold-600"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <Button
            size="sm"
            variant="primary"
            className="bg-gold-600 text-ink hover:bg-white/90 cursor-pointer"
          >
            Get Started
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-ink/90 hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-strong"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle menu</span>
          {/* Icon: hamburger → X */}
          <div className="relative h-5 w-6">
            <span
              className={`absolute left-0 top-0 block h-0.5 w-6 bg-ink transition-transform ${
                open ? "translate-y-2.5 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-2.5 block h-0.5 w-6 bg-ink transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 bottom-0 block h-0.5 w-6 bg-ink transition-transform ${
                open ? "-translate-y-2.5 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </Container>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="border-t border-white/30 bg-gold-300">
          <Container className="py-3">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                        isActive
                          ? "bg-white/20 text-ink underline underline-offset-4 decoration-gold-strong"
                          : "text-white hover:bg-white/10"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className="pt-2">
                <Button size="md" className="w-full bg-gold-600 text-ink hover:bg-white/90">
                  Get Started
                </Button>
              </li>
            </ul>
          </Container>
        </nav>
      </div>
    </header>
  );
}
