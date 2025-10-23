import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3,
  Building2,
  CalendarDays,
  Check,
  Handshake,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Partners Program | mypurirealty",
  description:
    "Get early access to the mypurirealty Partners Program—built for property owners and brokers to list, collaborate, and grow together.",
};

const highlightFeatures = [
  {
    title: "List as an owner or broker",
    description:
      "Switch between owner-managed listings and broker portfolios with a verified workflow that keeps listings clear, compliant, and easy to update.",
    icon: Building2,
  },
  {
    title: "Partner workspace",
    description:
      "Track leads, coordinate visits, and share shortlists from a single dashboard that is shaped around how local partners already work.",
    icon: LayoutDashboard,
  },
  {
    title: "Launch-ready marketing",
    description:
      "From polished property profiles to spotlight placements, we help your inventory look its best across every buyer touchpoint.",
    icon: Sparkles,
  },
];

const partnerTracks = [
  {
    title: "Built for property owners",
    description:
      "Ideal if you want to manage your own property listing but still lean on trusted support when you need it.",
    icon: Handshake,
    bullets: [
      "Guided onboarding that captures the details buyers search for most.",
      "Assisted visit scheduling with vetted local coordinators.",
      "Transparent tracking for interest, enquiries, and offers.",
    ],
  },
  {
    title: "Supercharging brokers & agencies",
    description:
      "Designed for partners handling multiple mandates who need clarity, speed, and a premium digital storefront.",
    icon: BarChart3,
    bullets: [
      "Bulk upload workflows and dedicated support to keep listings current.",
      "Curated collections for clients that are easy to share and revisit.",
      "Performance insights so you can focus on the hottest demand pockets.",
    ],
  },
];

const rolloutMilestones = [
  {
    title: "Early access cohort",
    description:
      "We are onboarding a small group of owners and brokers to refine the experience together and align on local processes.",
    icon: CalendarDays,
    timeline: "Rolling out now",
  },
  {
    title: "Public waitlist",
    description:
      "Register interest and tell us about your portfolio. We will match you with the right access wave as we expand coverage.",
    icon: Handshake,
    timeline: "Invites opening soon",
  },
  {
    title: "Full partner launch",
    description:
      "A complete partner workspace with marketing add-ons, analytics, and concierge support for every active listing.",
    icon: Sparkles,
    timeline: "Coming later this year",
  },
];

export default function PartnersPage() {
  return (
    <main className="bg-white text-ink">
      <section className="bg-ink text-white">
        <Container className="py-20 md:py-24">
          <div className="flex flex-col items-center text-center gap-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80">
              <Badge tone="warning" className="bg-white/20 text-white">
                Coming soon
              </Badge>
              Partners Program
            </span>
            <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
              Grow with mypurirealty as a trusted property partner
            </h1>
            <p className="max-w-2xl text-base text-white/80 md:text-lg">
              We are building a partner-first platform where owners and brokers can list confidently,
              tap into verified buyer demand, and co-create a transparent real estate experience for
              Puri.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="mailto:partners@mypurirealty.com">
                <Button size="lg" className="bg-white text-ink hover:bg-white/90">
                  Join the waitlist
                </Button>
              </Link>
              <Link href="/listings">
                <Button
                  size="lg"
                  variant="ghost"
                  className="border border-white/30 bg-transparent text-white/85 hover:bg-white/10 hover:text-white"
                >
                  Explore current listings
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <SectionHeading
            center
            eyebrow="Why join"
            title="A partner experience built around how you already work"
            subtitle="Purpose-built tools and support that respect your time, credibility, and local expertise."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {highlightFeatures.map(({ title, description, icon: Icon }) => (
              <Card key={title} className="h-full">
                <CardHeader className="flex items-start gap-4">
                  <span className="rounded-xl bg-gold-500/15 p-3 text-gold-600">
                    <Icon className="h-6 w-6" />
                  </span>
                  <CardTitle className="leading-tight">{title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-sm text-muted-1">{description}</CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-gold-500/5 py-16 md:py-20">
        <Container>
          <SectionHeading
            center
            eyebrow="Who it's for"
            title="Owners and brokers get dedicated flows"
            subtitle="Choose the path that fits how you manage properties today—our team helps with the rest."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {partnerTracks.map(({ title, description, bullets, icon: Icon }) => (
              <Card key={title} className="h-full border-gold-500/20">
                <CardHeader>
                  <span className="inline-flex items-center gap-2 rounded-full bg-gold-500/10 px-3 py-1 text-sm font-medium text-gold-600">
                    <Icon className="h-4 w-4" />
                    {title}
                  </span>
                  <CardTitle className="mt-4 text-xl">{description}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-3 text-sm text-muted-1">
                    {bullets.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <span className="mt-0.5 rounded-full bg-gold-500/20 p-1 text-gold-600">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <SectionHeading
            center
            eyebrow="Timeline"
            title="We are opening access in focused waves"
            subtitle="Tell us how you plan to partner and we will keep you updated as new slots open up."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {rolloutMilestones.map(({ title, description, timeline, icon: Icon }) => (
              <Card key={title} className="h-full">
                <CardHeader className="space-y-3">
                  <span className="inline-flex items-center justify-center rounded-xl bg-gold-500/15 p-3 text-gold-600">
                    <Icon className="h-6 w-6" />
                  </span>
                  <CardTitle className="text-lg">{title}</CardTitle>
                  <p className="text-sm font-medium text-gold-600">{timeline}</p>
                </CardHeader>
                <CardContent className="pt-0 text-sm text-muted-1">{description}</CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-muted-2/60 bg-gold-500/10 py-16">
        <Container className="flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Be first in line when partners go live
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-1 md:text-base">
              Share a few details with us and a member of the mypurirealty team will reach out with
              next steps and early-access timelines tailored to your profile.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="mailto:partners@mypurirealty.com">
              <Button size="lg">Introduce your portfolio</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" size="lg" className="text-ink/80 hover:text-ink">
                Learn about mypurirealty
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}

