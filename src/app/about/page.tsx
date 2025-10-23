// app/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | mypurirealty",
  description:
    "Learn more about mypurirealty — a localized, broker-led real estate platform built for buyers, sellers, and partners.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <section className="mx-auto max-w-3xl px-5 py-16">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">About Us</h1>
        </header>

        <p className="mb-6 text-zinc-700">
          Welcome to <span className="font-medium">mypurirealty</span> — a modern, localized real
          estate platform designed to make property discovery and transactions simple, transparent,
          and human-centered.
        </p>

        <h2 className="mt-10 text-xl font-semibold">Our Story</h2>
        <p className="mt-2 text-zinc-700">
          Real estate can feel overwhelming, especially with scattered information and cluttered
          platforms. We built mypurirealty to focus on what matters: trusted listings, easy
          navigation, and a clean, modern interface that respects your time.
        </p>

        <h2 className="mt-10 text-xl font-semibold">What We Do</h2>
        <ul className="mt-2 list-disc space-y-2 pl-6 text-zinc-700">
          <li>Help buyers find the right property in their city with minimal effort.</li>
          <li>
            Enable sellers and brokers to list properties quickly and connect with genuine leads.
          </li>
          <li>Offer partnerships for agents and service providers to grow together.</li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold">Our Values</h2>
        <ul className="mt-2 list-disc space-y-2 pl-6 text-zinc-700">
          <li>
            <span className="font-medium">Simplicity:</span> clean design and straightforward
            workflows.
          </li>
          <li>
            <span className="font-medium">Trust:</span> verified listings and transparent
            communication.
          </li>
          <li>
            <span className="font-medium">Community:</span> a localized focus that connects people
            meaningfully.
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold">Looking Ahead</h2>
        <p className="mt-2 text-zinc-700">
          mypurirealty is more than a listing site — it’s a step toward building a trusted ecosystem
          for real estate in select cities. As we grow, we’ll continue refining the experience,
          adding new features, and staying true to our promise of keeping real estate simple and
          approachable.
        </p>

        <p className="mt-12 text-zinc-700">
          Have questions? Reach us at{" "}
          <a className="underline" href="mailto:mypurirealty@gmail.com">
            support@mypurirealty.com
          </a>
        </p>
      </section>
    </main>
  );
}
