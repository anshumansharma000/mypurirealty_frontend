// app/(legal)/privacy/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | mypurirealty",
  description:
    "Privacy practices for mypurirealty — what we collect, how we use it, and your choices.",
};

const UPDATED_ON = "October 1, 2025";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <section className="mx-auto max-w-3xl px-5 py-12">
        <header className="mb-8 mt-4">
          <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-sm text-zinc-600">Last updated: {UPDATED_ON}</p>
        </header>

        <p className="mb-6 text-zinc-700">
          At <span className="font-medium">mypurirealty</span> (“we”, “us”, “our”), we respect your
          privacy and are committed to safeguarding your personal information. This Privacy Policy
          explains what we collect, how we use it, and the choices you have.
        </p>

        <h2 className="mt-10 text-xl font-semibold">1. Information We Collect</h2>
        <ul className="mt-2 list-disc space-y-2 pl-6 text-zinc-700">
          <li>
            <span className="font-medium">Account & Profile:</span> name, email, phone number, city,
            preferences, saved listings, and communication settings.
          </li>
          <li>
            <span className="font-medium">Listings & Transactions:</span> property details, photos,
            pricing, inquiries, messages between buyers/sellers/partners, and related timestamps.
          </li>
          <li>
            <span className="font-medium">Usage & Device:</span> pages viewed, clicks, session
            duration, referrer, approximate location, device type, browser, and OS.
          </li>
          <li>
            <span className="font-medium">Cookies & Similar Tech:</span> to keep you signed in,
            remember preferences, and measure performance. You can manage cookies via your browser
            settings.
          </li>
          <li>
            <span className="font-medium">Third-Party Data:</span> integrations such as maps,
            payments, analytics, chat, or identity providers may share limited data as permitted by
            their policies and your settings.
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold">2. How We Use Your Information</h2>
        <ul className="mt-2 list-disc space-y-2 pl-6 text-zinc-700">
          <li>Provide, maintain, and improve the Platform’s features and performance.</li>
          <li>Enable listing creation, discovery, lead management, and partner workflows.</li>
          <li>Personalize your experience (saved searches, recommendations, recent activity).</li>
          <li>Communicate updates, alerts, and service-related messages.</li>
          <li>Prevent abuse, fraud, and misuse; ensure safety and compliance.</li>
          <li>Analyze aggregated usage trends to improve UX and reliability.</li>
          <li>Comply with applicable laws and enforce our Terms.</li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold">3. Sharing of Information</h2>
        <ul className="mt-2 list-disc space-y-2 pl-6 text-zinc-700">
          <li>
            <span className="font-medium">With Your Direction:</span> sharing contact details
            between buyers, sellers, agents, and partners to facilitate introductions and
            transactions.
          </li>
          <li>
            <span className="font-medium">Service Providers:</span> hosting, analytics,
            communications, payment, and customer-support vendors under appropriate safeguards.
          </li>
          <li>
            <span className="font-medium">Legal & Safety:</span> to comply with applicable law,
            legal process, or to protect rights, property, and safety of users and the public.
          </li>
          <li>
            <span className="font-medium">Business Transfers:</span> as part of a merger,
            acquisition, or asset sale, in which case we will provide notice as required.
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold">4. Your Choices & Controls</h2>
        <ul className="mt-2 list-disc space-y-2 pl-6 text-zinc-700">
          <li>Access, update, or delete certain profile information from your account settings.</li>
          <li>Manage cookie preferences in your browser or device settings.</li>
          <li>Opt out of non-essential marketing emails via the “unsubscribe” link.</li>
          <li>
            Request access, correction, portability, or deletion subject to legal and contractual
            limitations by contacting us at{" "}
            <a className="underline" href="mailto:privacy@mypurirealty.com">
              privacy@mypurirealty.com
            </a>
            .
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold">5. Data Retention</h2>
        <p className="mt-2 text-zinc-700">
          We retain personal data as long as necessary to provide the Platform, comply with legal
          obligations, resolve disputes, and enforce agreements. Retention periods vary by data type
          and context.
        </p>

        <h2 className="mt-10 text-xl font-semibold">6. Security</h2>
        <p className="mt-2 text-zinc-700">
          We use reasonable administrative, technical, and physical safeguards designed to protect
          your information. However, no method of transmission or storage is 100% secure.
        </p>

        <h2 className="mt-10 text-xl font-semibold">7. Children’s Privacy</h2>
        <p className="mt-2 text-zinc-700">
          The Platform is not intended for individuals under 18, and we do not knowingly collect
          personal information from minors.
        </p>

        <h2 className="mt-10 text-xl font-semibold">8. International & Local Considerations</h2>
        <p className="mt-2 text-zinc-700">
          Our services are primarily intended for users within our supported localities. Where
          cross-border processing occurs (e.g., through cloud providers), we take appropriate
          measures consistent with applicable laws.
        </p>

        <h2 className="mt-10 text-xl font-semibold">9. Changes to This Policy</h2>
        <p className="mt-2 text-zinc-700">
          We may update this Privacy Policy from time to time. Material changes will be communicated
          by updating the “Last updated” date and, where appropriate, by additional notice.
        </p>

        <h2 className="mt-10 text-xl font-semibold">10. Contact Us</h2>
        <p className="mt-2 text-zinc-700">
          For questions or requests, contact{" "}
          <a className="underline" href="mailto:privacy@mypurirealty.com">
            privacy@mypurirealty.com
          </a>{" "}
          or{" "}
          <a className="underline" href="mailto:support@mypurirealty.com">
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
