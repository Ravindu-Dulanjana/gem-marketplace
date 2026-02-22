import Link from "next/link";
import { GEM_COLORS } from "@/lib/constants";

export default function ShopByColor() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-playfair)] text-gold-gradient mb-3">
            Shop by Color
          </h2>
          <p className="text-muted text-sm">
            Explore gems in every color of the spectrum
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {GEM_COLORS.map((color) => (
            <Link
              key={color.slug}
              href={`/shop?color=${color.slug}`}
              className="group flex flex-col items-center gap-2 p-3 w-20 md:w-24 rounded-xl hover:bg-card-bg transition-all"
            >
              <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-card-border group-hover:border-gold/50 transition-all shadow-lg group-hover:scale-110"
                style={{
                  background: `radial-gradient(circle at 35% 35%, ${color.hex}dd, ${color.hex}88)`,
                  boxShadow: `0 4px 15px ${color.hex}33`,
                }}
              />
              <span className="text-xs text-muted group-hover:text-foreground transition-colors text-center">
                {color.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
