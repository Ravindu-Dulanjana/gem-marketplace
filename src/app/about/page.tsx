import { Gem, ShieldCheck, Globe, Users } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-playfair)] text-gold-gradient mb-4">
            About GemMarket
          </h1>
          <p className="text-muted text-base max-w-2xl mx-auto leading-relaxed">
            The premier marketplace connecting gemstone sellers with buyers worldwide.
            We believe in transparency, quality, and the timeless beauty of natural gemstones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            {
              icon: Gem,
              title: "Curated Selection",
              desc: "Every gem listed on our platform is carefully described with accurate specifications. From sapphires to emeralds, we offer a wide range of natural gemstones.",
            },
            {
              icon: ShieldCheck,
              title: "Verified Sellers",
              desc: "All sellers go through an approval process before listing gems. We verify credentials and monitor listings to maintain marketplace integrity.",
            },
            {
              icon: Globe,
              title: "Global Reach",
              desc: "Connect with sellers and buyers from around the world. Our platform supports international transactions and secure shipping arrangements.",
            },
            {
              icon: Users,
              title: "Community Trust",
              desc: "Our review system and transparent communication tools help build trust between buyers and sellers for confident transactions.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-card-bg border border-card-border rounded-xl p-6"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gold/10 mb-4">
                  <Icon className="text-gold" size={22} />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center bg-card-bg border border-card-border rounded-2xl p-8">
          <h2 className="text-xl font-bold font-[family-name:var(--font-playfair)] text-foreground mb-3">
            Ready to get started?
          </h2>
          <p className="text-sm text-muted mb-6">
            Whether you&apos;re buying or selling, GemMarket is the place for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="px-6 py-2.5 bg-gold text-background font-semibold text-sm rounded-lg hover:bg-gold-light transition-colors"
            >
              Browse Gems
            </Link>
            <Link
              href="/seller/register"
              className="px-6 py-2.5 border border-gold text-gold text-sm rounded-lg hover:bg-gold hover:text-background transition-all"
            >
              Become a Seller
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
