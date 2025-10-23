// src/components/landing/ValueSection.tsx
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BadgeCheck, Building2, Workflow } from "lucide-react";
import Link from "next/link";

export default function ValueSection() {
  return (
    <section id="value" className="py-12 md:py-16">
      <Container>
        <SectionHeading
          eyebrow="Overview"
          title="Why choose mypurirealty, what we offer, and how it works"
          subtitle="Local expertise, verified listings, and a smooth path from search to keys."
          center
        />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex items-center gap-3">
              <BadgeCheck className="h-5 w-5 text-gold-strong" aria-hidden />
              <CardTitle>Why choose us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-1">
                We’re local to Puri. Listings, photos, and partners are verified—so you can decide
                faster with confidence.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-gold-strong" aria-hidden />
              <CardTitle>What we offer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-1">
                A curated marketplace for homes, rentals, and plots—clear details, no clutter,
                locality-first search.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center gap-3">
              <Workflow className="h-5 w-5 text-gold-strong" aria-hidden />
              <CardTitle>How it works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 space-y-1 text-muted-1">
                <li>Search and shortlist</li>
                <li>Schedule visits with partners</li>
                <li>Close confidently with local support</li>
              </ol>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/listings">
            <Button>Start your search</Button>
          </Link>
          <a href="tel:+919438141111">
            <Button variant="outline">Talk to us</Button>
          </a>
        </div>
      </Container>
    </section>
  );
}
