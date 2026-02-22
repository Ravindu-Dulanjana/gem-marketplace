import Link from "next/link";
import { Gem } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-card-border">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Gem className="text-gold" size={24} />
              <span className="text-xl font-bold font-[family-name:var(--font-playfair)] text-gold-gradient">
                GemMarket
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              Premium gemstone marketplace connecting trusted sellers with
              buyers worldwide. Quality gems, verified sellers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm uppercase tracking-wider text-gold mb-4 font-semibold">
              Shop
            </h4>
            <ul className="space-y-2">
              {[
                { label: "All Gems", href: "/shop" },
                { label: "Sapphires", href: "/shop?type=sapphire" },
                { label: "Rubies", href: "/shop?type=ruby" },
                { label: "Emeralds", href: "/shop?type=emerald" },
                { label: "New Arrivals", href: "/shop?sort=newest" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm uppercase tracking-wider text-gold mb-4 font-semibold">
              Company
            </h4>
            <ul className="space-y-2">
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Sell on GemMarket", href: "/seller/register" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-sm uppercase tracking-wider text-gold mb-4 font-semibold">
              Policies
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Terms & Conditions", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Return Policy", href: "/returns" },
                { label: "Shipping Info", href: "/shipping" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-card-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} GemMarket. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted">We accept:</span>
            <div className="flex gap-2 text-xs text-muted">
              <span className="border border-card-border rounded px-2 py-1">Visa</span>
              <span className="border border-card-border rounded px-2 py-1">Mastercard</span>
              <span className="border border-card-border rounded px-2 py-1">Amex</span>
              <span className="border border-card-border rounded px-2 py-1">PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
