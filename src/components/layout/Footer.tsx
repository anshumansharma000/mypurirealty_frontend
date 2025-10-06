// src/components/layout/Footer.tsx
import { Container } from "@/components/ui/Container";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gold-500 text-white mt-12">
      <Container className="py-10">
        <div className="flex flex-col md:flex-row md:justify-between gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="text-lg font-bold text-gold">
              mypurirealty
            </Link>
            <p className="mt-2 text-sm text-white/80 max-w-sm">
              Localized listings for Puri. Simple, verified, and trusted.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-semibold mb-3 text-gold">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-gold-strong">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/partners" className="hover:text-gold-strong">
                    Partner with Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3 text-gold">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-gold-strong">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-gold-strong">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-white/70">
          © {new Date().getFullYear()} mypurirealty. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
