// src/components/landing/Hero.tsx
"use client";

import { Input } from "@/components/form/Input";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// src/components/landing/Hero.tsx

// src/components/landing/Hero.tsx

export default function Hero() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/listings?q=${encodeURIComponent(query)}` : "/listings");
  }

  return (
    <section id="hero" className="relative">
      {/* Background image */}
      <div className="relative h-[62vh] min-h-[460px] w-full overflow-hidden">
        <Image
          src="/puritemp.webp" // TODO: replace with your image in /public
          alt="Coastal homes and skyline in Puri"
          fill
          priority
          className="object-cover"
        />
        {/* Readability overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/10" />
      </div>

      {/* Foreground content */}
      <div className="absolute inset-0 flex items-center">
        <Container>
          <div className="max-w-2xl text-white">
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
              Find your home in Puri—simple, local, verified.
            </h1>
            <p className="mt-3 text-base md:text-lg text-white/90">
              mypurirealty brings curated listings, trusted partners, and easy scheduling—all in one
              place.
            </p>

            {/* Inline search bar + buttons */}
            <form
              onSubmit={handleSubmit}
              className="mt-6 flex w-full flex-col gap-3 sm:flex-row"
              aria-label="Quick search"
            >
              <div className="flex-1">
                <Input
                  id="hero-search"
                  name="q"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by area, landmark, or listing ID"
                  autoComplete="off"
                  inputMode="text"
                  aria-label="Search listings"
                  className="bg-white/95 backdrop-blur-md placeholder:text-ink/60"
                />
              </div>

              <Button type="submit" className="h-11 px-5">
                Search
              </Button>

              <Link href="/listings" className="sm:ml-1">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 px-5 bg-white/10 text-white border-white/50 hover:bg-white/20"
                >
                  Browse all listings
                </Button>
              </Link>
            </form>
          </div>
        </Container>
      </div>
    </section>
  );
}
