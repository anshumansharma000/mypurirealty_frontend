'use client';

// src/components/landing/SellersPartners.tsx
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Home, Users } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";
import { useToast } from "@/shared/ui/toast";

export default function SellersPartners() {
  const { showToast } = useToast();
  const handleComingSoon = useCallback(() => {
    showToast({ message: "Feature in progress—rolling out soon.", type: "info" });
  }, [showToast]);

  return (
    <section id="sellers-partners" className="py-12 md:py-16">
      <Container>
        {/* Sellers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
          <div>
            <SectionHeading
              eyebrow="For Sellers"
              title="List your property with confidence"
              subtitle="We help you present your property clearly and reach serious buyers quickly."
            />
            <ul className="mt-4 space-y-2 text-muted-1">
              <li className="flex items-start gap-2">
                <Home className="h-5 w-5 text-gold-strong mt-0.5" />
                Guided listing process with required details
              </li>
              <li className="flex items-start gap-2">
                <Home className="h-5 w-5 text-gold-strong mt-0.5" />
                Verified photos to build buyer trust
              </li>
              <li className="flex items-start gap-2">
                <Home className="h-5 w-5 text-gold-strong mt-0.5" />
                Local partner support for visits and paperwork
              </li>
            </ul>
            <div className="mt-6 flex gap-3">
              <Button onClick={handleComingSoon}>List your property</Button>
              <Button variant="ghost" onClick={handleComingSoon}>
                Know more
              </Button>
            </div>
          </div>

          {/* <Card className="flex items-center justify-center"> */}
          {/* <CardContent className="p-0"> */}
          <Image
            src="/houseils.png" // TODO: replace with a real property image in /public
            alt="Illustration of seller property listing"
            width={600}
            height={400}
            className="rounded-2xl object-cover"
          />
          {/* </CardContent> */}
          {/* </Card> */}
        </div>

        {/* Partners */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* <Card className="order-1 lg:order-none flex items-center justify-center"> */}
          {/* <CardContent className="p-6 flex items-center justify-center"> */}
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="/partnerils.png" // add logos under /public
              alt="Partner logo 1"
              width={320}
              height={190}
              className="object-contain"
            />
            {/* <Image
                  src="/partner2.png"
                  alt="Partner logo 2"
                  width={160}
                  height={80}
                  className="object-contain"
                />
                <Image
                  src="/partner3.png"
                  alt="Partner logo 3"
                  width={160}
                  height={80}
                  className="object-contain"
                />
                <Image
                  src="/partner4.png"
                  alt="Partner logo 4"
                  width={160}
                  height={80}
                  className="object-contain"
                /> */}
          </div>
          {/* </CardContent> */}
          {/* </Card> */}

          <div>
            <SectionHeading
              eyebrow="For Partners"
              title="Grow with us as a trusted local partner"
              subtitle="Join a transparent, high-trust network that values local expertise."
            />
            <ul className="mt-4 space-y-2 text-muted-1">
              <li className="flex items-start gap-2">
                <Users className="h-5 w-5 text-gold-strong mt-0.5" />
                Qualified leads in your locality
              </li>
              <li className="flex items-start gap-2">
                <Users className="h-5 w-5 text-gold-strong mt-0.5" />
                Simple workflow and scheduling tools
              </li>
              <li className="flex items-start gap-2">
                <Users className="h-5 w-5 text-gold-strong mt-0.5" />
                Clear expectations and fair standards
              </li>
            </ul>
            <div className="mt-6 flex gap-3">
              <Button onClick={handleComingSoon}>Become a partner</Button>
              <Button variant="ghost" onClick={handleComingSoon}>
                Talk to our team
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
