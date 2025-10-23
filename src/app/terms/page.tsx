// app/(legal)/terms/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | mypurirealty",
  description:
    "Terms and conditions for using mypurirealty — our localized real-estate listing platform for buyers, sellers, and partners.",
};

const UPDATED_ON = "October 1, 2025";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <section className="mx-auto max-w-3xl px-5 py-12">
        <header className="mb-8 mt-4">
          <h1 className="text-3xl font-semibold tracking-tight">Terms & Conditions</h1>
          <p className="mt-2 text-sm text-zinc-600">Last updated: {UPDATED_ON}</p>
        </header>

        <p className="mb-6 text-zinc-700">
          Welcome to <span className="font-medium">mypurirealty</span> (“we”, “us”, “our”). By
          accessing or using our website and services (collectively, the “Platform”), you agree to
          these Terms & Conditions (“Terms”). If you do not agree, please do not use the Platform.
        </p>

        <h2 className="mt-10 text-xl font-semibold">1. About the Platform</h2>
        <p className="mt-2 text-zinc-700">
          mypurirealty is a localized, broker-led real-estate listing Platform that helps users
          discover properties, express interest, connect with sellers/agents, and explore
          partnerships. We focus on simplicity, convenience, and a clean, modern experience.
        </p>

        <h2 className="mt-10 text-xl font-semibold">2. Eligibility</h2>
        <p className="mt-2 text-zinc-700">
          You must be at least 18 years old and capable of entering into a legally binding agreement
          under applicable laws to use the Platform.
        </p>

        <h2 className="mt-10 text-xl font-semibold">3. Accounts & Security</h2>
        <ul className="mt-2 list-disc space-y-2 pl-6 text-zinc-700">
          <li>You are responsible for the accuracy of information provided during registration.</li>
          <li>Keep your login credentials confidential and notify us of any unauthorized use.</li>
          <li>
            We may suspend or terminate accounts for suspected misuse or violations of these Terms.
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold">4. Listings & User Content</h2>
        <ul className="mt-2 list-disc space-y-2 pl-6 text-zinc-700">
          <li>
            You represent that you have the right to post listings, images, prices, and related
            content (“Content”) and that such Content is accurate, lawful, and does not infringe
            third-party rights.
          </li>
          <li>
            You grant us a non-exclusive, worldwide, royalty-free license to host, display, and
            distribute your Content as necessary to operate the Platform.
          </li>
          <li>
            We may moderate, edit, or remove Content that violates these Terms or applicable law at
            our discretion.
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold">5. Interactions & Transactions</h2>
        <p className="mt-2 text-zinc-700">
          The Platform facilitates discovery and communication. Unless explicitly stated, we are not
          a party to property transactions and do not guarantee the performance of buyers, sellers,
          or partners. Conduct due diligence and obtain independent professional advice where
          necessary.
        </p>

        <h2 className="mt-10 text-xl font-semibold">6. Fees</h2>
        <p className="mt-2 text-zinc-700">
          We may introduce or modify service fees, promotional fees, or partner fees. Any applicable
          fees and taxes will be disclosed prior to purchase or use. Fees are generally
          non-refundable unless required by law or expressly stated.
        </p>

        <h2 className="mt-10 text-xl font-semibold">7. Acceptable Use</h2>
        <ul className="mt-2 list-disc space-y-2 pl-6 text-zinc-700">
          <li>No scraping, reverse engineering, or interfering with Platform operations.</li>
          <li>No posting of misleading, fraudulent, defamatory, obscene, or illegal Content.</li>
          <li>No attempts to bypass security, rate limits, or access controls.</li>
          <li>No spam, phishing, or unauthorized commercial communications.</li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold">8. Third-Party Services</h2>
        <p className="mt-2 text-zinc-700">
          We may integrate maps, analytics, payments, communications, or other third-party services.
          Your use of such services may be subject to their separate terms and privacy practices.
        </p>

        <h2 className="mt-10 text-xl font-semibold">9. Intellectual Property</h2>
        <p className="mt-2 text-zinc-700">
          The Platform, including logos, branding, code, and design elements, is owned by us or our
          licensors and protected by intellectual property laws. Except as permitted by these Terms,
          you may not copy, modify, distribute, or create derivative works.
        </p>

        <h2 className="mt-10 text-xl font-semibold">10. Disclaimers</h2>
        <p className="mt-2 text-zinc-700">
          The Platform is provided on an “as is” and “as available” basis. We disclaim warranties of
          merchantability, fitness for a particular purpose, and non-infringement to the fullest
          extent permitted by law. We do not warrant that the Platform will be uninterrupted,
          secure, or error-free, or that Content will be accurate or complete.
        </p>

        <h2 className="mt-10 text-xl font-semibold">11. Limitation of Liability</h2>
        <p className="mt-2 text-zinc-700">
          To the maximum extent permitted by law, we will not be liable for indirect, incidental,
          consequential, special, or exemplary damages, or for loss of profits, data, goodwill, or
          business interruption arising from your use of the Platform.
        </p>

        <h2 className="mt-10 text-xl font-semibold">12. Indemnity</h2>
        <p className="mt-2 text-zinc-700">
          You agree to indemnify and hold us harmless from claims, liabilities, damages, losses, and
          expenses (including legal fees) arising out of or related to your use of the Platform or
          violation of these Terms.
        </p>

        <h2 className="mt-10 text-xl font-semibold">13. Termination</h2>
        <p className="mt-2 text-zinc-700">
          We may suspend or terminate access at any time for any violation of these Terms or to
          comply with legal obligations. Upon termination, your right to use the Platform ceases
          immediately.
        </p>

        <h2 className="mt-10 text-xl font-semibold">14. Governing Law & Dispute Resolution</h2>
        <p className="mt-2 text-zinc-700">
          These Terms are governed by the laws of India. Courts located in our principal place of
          business shall have exclusive jurisdiction, subject to applicable dispute-resolution
          requirements.
        </p>

        <h2 className="mt-10 text-xl font-semibold">15. Changes to Terms</h2>
        <p className="mt-2 text-zinc-700">
          We may update these Terms from time to time. Continued use of the Platform after changes
          become effective constitutes acceptance of the revised Terms.
        </p>

        <h2 className="mt-10 text-xl font-semibold">16. Contact</h2>
        <p className="mt-2 text-zinc-700">
          Questions? Reach us at{" "}
          <a className="underline" href="mailto:mypurirealty@gmail.com">
            support@mypurirealty.com
          </a>
          .
        </p>

        <p className="mt-10 text-xs text-zinc-500">
          This document is a generic template provided for convenience and does not constitute legal
          advice. Please consult a qualified professional for guidance specific to your
          circumstances.
        </p>
      </section>
    </main>
  );
}
