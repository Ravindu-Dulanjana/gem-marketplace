import Link from "next/link";
import { GEM_SHAPES } from "@/lib/constants";
import {
  Diamond,
  Circle,
  Hexagon,
  Heart,
  Octagon,
  Pentagon,
  Square,
  Triangle,
  Star,
  Gem,
} from "lucide-react";

const shapeIcons: Record<string, React.ElementType> = {
  round: Circle,
  oval: Hexagon,
  pear: Triangle,
  cushion: Square,
  heart: Heart,
  marquise: Diamond,
  "emerald-cut": Octagon,
  octagonal: Pentagon,
  cabochon: Star,
  sugarloaf: Gem,
};

export default function ShopByShape() {
  return (
    <section className="py-16 md:py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-playfair)] text-gold-gradient mb-3">
            Shop by Shape
          </h2>
          <p className="text-muted text-sm">
            Find gems in your preferred cut and shape
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {GEM_SHAPES.map((shape) => {
            const Icon = shapeIcons[shape.slug] || Diamond;
            return (
              <Link
                key={shape.slug}
                href={`/shop?shape=${shape.slug}`}
                className="group flex flex-col items-center gap-2 p-4 w-24 md:w-28 rounded-xl hover:bg-card-bg border border-transparent hover:border-card-border transition-all"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full border border-gold/30 group-hover:border-gold group-hover:bg-gold/10 transition-all">
                  <Icon className="text-gold/70 group-hover:text-gold transition-colors" size={20} />
                </div>
                <span className="text-xs text-muted group-hover:text-foreground transition-colors text-center">
                  {shape.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
