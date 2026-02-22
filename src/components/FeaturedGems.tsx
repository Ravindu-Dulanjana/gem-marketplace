import Link from "next/link";
import { Eye, MessageCircle, ImageIcon } from "lucide-react";

// Placeholder data — will be replaced with Supabase queries
const placeholderGems = [
  {
    id: "1",
    title: "Natural Blue Sapphire",
    slug: "natural-blue-sapphire-1",
    gem_type: "Sapphire",
    carat_weight: 3.52,
    shape: "Oval",
    color: "Blue",
    treatment: "No Treatment (Natural)",
    clarity: "Eye Clean",
    price_type: "request" as const,
    price: null,
  },
  {
    id: "2",
    title: "Vivid Pink Spinel",
    slug: "vivid-pink-spinel-2",
    gem_type: "Spinel",
    carat_weight: 2.18,
    shape: "Cushion",
    color: "Pink",
    treatment: "Unheated",
    clarity: "Loupe Clean",
    price_type: "fixed" as const,
    price: 4500,
  },
  {
    id: "3",
    title: "Padparadscha Sapphire",
    slug: "padparadscha-sapphire-3",
    gem_type: "Sapphire",
    carat_weight: 1.95,
    shape: "Oval",
    color: "Padparadscha",
    treatment: "Heated",
    clarity: "Eye Clean",
    price_type: "request" as const,
    price: null,
  },
  {
    id: "4",
    title: "Colombian Emerald",
    slug: "colombian-emerald-4",
    gem_type: "Emerald",
    carat_weight: 4.1,
    shape: "Emerald Cut",
    color: "Green",
    treatment: "Minor Oiled",
    clarity: "Slightly Included",
    price_type: "fixed" as const,
    price: 12000,
  },
  {
    id: "5",
    title: "Burmese Ruby",
    slug: "burmese-ruby-5",
    gem_type: "Ruby",
    carat_weight: 2.03,
    shape: "Oval",
    color: "Red",
    treatment: "Unheated",
    clarity: "Eye Clean",
    price_type: "request" as const,
    price: null,
  },
];

export default function FeaturedGems() {
  return (
    <section className="py-16 md:py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-playfair)] text-gold-gradient mb-3">
            Featured Gems
          </h2>
          <p className="text-muted text-sm">
            Hand-picked selection of exceptional gemstones
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {placeholderGems.map((gem) => (
            <Link
              key={gem.id}
              href={`/shop/${gem.slug}`}
              className="gem-card group bg-card-bg border border-card-border rounded-xl overflow-hidden"
            >
              {/* Image placeholder */}
              <div className="aspect-square bg-background flex items-center justify-center relative overflow-hidden">
                <ImageIcon className="text-card-border" size={48} />
                <div className="absolute inset-0 bg-gradient-to-t from-card-bg/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-gold transition-colors">
                  {gem.title}
                </h3>
                <p className="text-xs text-muted mb-2">
                  {gem.carat_weight} ct &middot; {gem.shape} &middot; {gem.color}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="text-[10px] px-2 py-0.5 bg-gold/10 text-gold rounded-full">
                    {gem.treatment}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-card-border text-muted rounded-full">
                    {gem.clarity}
                  </span>
                </div>

                {/* Price / CTA */}
                <div className="flex items-center justify-between">
                  {gem.price_type === "fixed" && gem.price ? (
                    <span className="text-sm font-bold text-gold">
                      ${gem.price.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-xs text-muted italic">
                      Request Price
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                <div className="mt-3 flex gap-2">
                  {gem.price_type === "request" ? (
                    <span className="flex-1 text-center text-xs py-2 bg-gold/10 text-gold rounded-lg hover:bg-gold/20 transition-colors flex items-center justify-center gap-1">
                      <MessageCircle size={12} />
                      Request Price
                    </span>
                  ) : (
                    <span className="flex-1 text-center text-xs py-2 bg-gold text-background rounded-lg hover:bg-gold-light transition-colors font-semibold">
                      Add to Cart
                    </span>
                  )}
                  <span className="text-xs py-2 px-3 bg-card-border text-muted rounded-lg hover:text-foreground transition-colors flex items-center gap-1">
                    <Eye size={12} />
                    View
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/shop"
            className="inline-block px-8 py-3 border border-gold text-gold text-sm uppercase tracking-wider rounded hover:bg-gold hover:text-background transition-all"
          >
            View All Gems
          </Link>
        </div>
      </div>
    </section>
  );
}
