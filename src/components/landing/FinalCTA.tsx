// src/components/landing/FinalCTA.tsx
"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useToast } from "@/shared/ui/toast";
import Link from "next/link";
import { useCallback } from "react";

export default function FinalCTA() {
  const { showToast } = useToast();
  const handleComingSoon = useCallback(() => {
    showToast({ message: "Feature in progress—rolling out soon.", type: "info" });
  }, [showToast]);
  return (
    <section id="final-cta" className="py-10 md:py-12 bg-gold/10 border-t border-muted-2/60">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-ink">
              Ready to explore homes in Puri?
            </h3>
            <p className="mt-1 text-muted-1">
              Start your search now or list your property with a trusted local team.
            </p>
          </div>

          <div className="flex gap-3">
            <Link href="/listings">
              <Button>Start your search</Button>
            </Link>
            {/* <Link href="/list-property"> */}
            <Button variant="outline" onClick={handleComingSoon}>
              List a property
            </Button>
            {/* </Link> */}
          </div>
        </div>
      </Container>
    </section>
  );
}
