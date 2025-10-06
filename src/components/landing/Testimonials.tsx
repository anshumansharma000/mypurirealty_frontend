// src/components/landing/Testimonials.tsx
import { Card, CardContent } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Quote } from "lucide-react";

type Testimonial = {
  quote: string;
  name: string;
  area: string;
};

const testimonials: Testimonial[] = [
  { quote: "Smooth experience from search to keys.", name: "R. Mishra", area: "Baliapanda" },
  { quote: "Verified photos saved us a trip.", name: "S. Patnaik", area: "Sea Beach" },
  { quote: "Scheduling visits was effortless.", name: "A. Mohanty", area: "Gopal Ballav Rd" },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-12 md:py-16">
      <Container>
        <SectionHeading
          eyebrow="Social Proof"
          title="What locals say"
          subtitle="Short, real quotes that build trust without the noise."
          center
        />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Quote className="h-5 w-5 text-gold-strong" aria-hidden />
                <p className="mt-3 text-ink">&ldquo;{t.quote}&rdquo;</p>

                <div className="mt-4 flex items-center gap-3">
                  {/* Circle avatar with first letter */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-600 text-white font-semibold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">{t.name}</p>
                    <p className="text-xs text-muted-1">{t.area}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
