import Link from "next/link";
import { ShieldCheck, Truck, Award } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Trust badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: ShieldCheck,
              title: "Verified Sellers",
              desc: "Every seller is vetted and approved by our team before listing",
            },
            {
              icon: Truck,
              title: "Worldwide Shipping",
              desc: "Secure and insured shipping to destinations around the globe",
            },
            {
              icon: Award,
              title: "Certified Quality",
              desc: "Gems with certifications from recognized gemological laboratories",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col items-center text-center p-6 bg-card-bg border border-card-border rounded-xl"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gold/10 mb-4">
                  <Icon className="text-gold" size={24} />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-muted">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Seller CTA */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gold/10 via-card-bg to-gold/10 border border-gold/20 p-8 md:p-12 text-center">
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, #d4af37 1px, transparent 1px)`,
                backgroundSize: "30px 30px",
              }}
            />
          </div>
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-playfair)] text-gold-gradient mb-4">
              Start Selling Your Gems
            </h2>
            <p className="text-muted text-sm mb-6 max-w-lg mx-auto">
              Join our marketplace and reach buyers worldwide. List your gems,
              manage inquiries, and grow your business.
            </p>
            <Link
              href="/seller/register"
              className="inline-block px-8 py-3 bg-gold text-background font-semibold text-sm uppercase tracking-wider rounded hover:bg-gold-light transition-colors"
            >
              Register as Seller
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
