// src/components/landing/Features.tsx
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CalendarCheck, Heart, IndianRupee, ListChecks, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Verified listings & photos",
    desc: "Every property is verified locally to ensure trust and transparency.",
    Icon: ShieldCheck,
  },
  {
    title: "Locality-first search",
    desc: "Search by neighbourhoods and landmarks familiar to you.",
    Icon: MapPin,
  },
  {
    title: "Accurate pricing ranges",
    desc: "Up-to-date, realistic pricing so you can compare confidently.",
    Icon: IndianRupee,
  },
  {
    title: "Clear amenities & specs",
    desc: "From furnishing to parking, every detail is presented upfront.",
    Icon: ListChecks,
  },
  {
    title: "Shortlist & compare easily",
    desc: "Save your favourites and compare them side by side.",
    Icon: Heart,
  },
  {
    title: "Easy visit scheduling",
    desc: "Book property visits directly with trusted partners.",
    Icon: CalendarCheck,
  },
];

export default function Features() {
  return (
    <section id="features" className="py-12 md:py-16 bg-gold-300/75">
      <Container>
        <SectionHeading
          eyebrow="Features"
          title="Everything you need, nothing you don’t"
          subtitle="Simple tools to explore, compare, and decide faster."
          center
        />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ title, desc, Icon }, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-start gap-2">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gold/20">
                  <Icon className="h-5 w-5 text-gold-strong" aria-hidden />
                </div>
                <CardTitle className="leading-tight">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-1">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link href="/listings">
            <Button>Explore Listings</Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
