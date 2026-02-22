import Link from "next/link";
import { Grid3X3, Layers, Circle, Copy, Diamond, MessageSquare } from "lucide-react";

const categories = [
  { name: "Loose Stones", slug: "loose-stones", icon: Diamond },
  { name: "Layouts", slug: "layouts", icon: Grid3X3 },
  { name: "Cabochons", slug: "cabochons", icon: Circle },
  { name: "Pairs", slug: "pairs", icon: Copy },
  { name: "Calibrated", slug: "calibrated-sapphires", icon: Layers },
  { name: "Request Gems", slug: "custom-request", icon: MessageSquare },
];

export default function CategoryGrid() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-playfair)] text-gold-gradient mb-3">
            Browse by Category
          </h2>
          <p className="text-muted text-sm">Find the perfect gemstone for your needs</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-6 bg-card-bg border border-card-border rounded-xl hover:border-gold/50 transition-all hover:bg-card-bg/80"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gold/10 group-hover:bg-gold/20 transition-colors">
                  <Icon className="text-gold" size={24} />
                </div>
                <span className="text-sm font-medium text-foreground text-center">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
