import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, ImageIcon, Gem } from "lucide-react";

export default async function FeaturedGems() {
  const supabase = await createClient();

  const { data: gems } = await supabase
    .from("gems")
    .select("*, images:gem_images(*)")
    .eq("status", "active")
    .order("view_count", { ascending: false })
    .limit(10);

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

        {!gems || gems.length === 0 ? (
          <div className="text-center py-12">
            <Gem className="text-card-border mx-auto mb-4" size={48} />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No gems listed yet
            </h3>
            <p className="text-sm text-muted mb-6">
              Be the first seller to list gems on GemMarket
            </p>
            <Link
              href="/seller/register"
              className="inline-block px-6 py-2.5 bg-gold text-background font-semibold text-sm rounded-lg hover:bg-gold-light transition-colors"
            >
              Start Selling
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
              {gems.map((gem) => {
                const primaryImage = gem.images?.sort(
                  (a: { display_order: number }, b: { display_order: number }) =>
                    a.display_order - b.display_order
                )[0];

                return (
                  <Link
                    key={gem.id}
                    href={`/shop/${gem.slug}`}
                    className="gem-card group bg-card-bg border border-card-border rounded-xl overflow-hidden"
                  >
                    {/* Image */}
                    <div className="aspect-square bg-background flex items-center justify-center relative overflow-hidden">
                      {primaryImage ? (
                        <Image
                          src={primaryImage.url}
                          alt={gem.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <ImageIcon className="text-card-border" size={48} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-card-bg/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-gold transition-colors">
                        {gem.title}
                      </h3>
                      <p className="text-xs text-muted mb-2">
                        {gem.carat_weight ? `${gem.carat_weight} ct` : ""}{" "}
                        {gem.shape ? `· ${gem.shape}` : ""}{" "}
                        {gem.color ? `· ${gem.color}` : ""}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {gem.treatment && (
                          <span className="text-[10px] px-2 py-0.5 bg-gold/10 text-gold rounded-full">
                            {gem.treatment}
                          </span>
                        )}
                        {gem.clarity && (
                          <span className="text-[10px] px-2 py-0.5 bg-card-border text-muted rounded-full">
                            {gem.clarity}
                          </span>
                        )}
                      </div>

                      {/* Price / CTA */}
                      <div className="flex items-center justify-between">
                        {gem.price_type === "fixed" && gem.price ? (
                          <span className="text-sm font-bold text-gold">
                            ${Number(gem.price).toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-xs text-muted italic flex items-center gap-1">
                            <MessageCircle size={12} />
                            Request Price
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/shop"
                className="inline-block px-8 py-3 border border-gold text-gold text-sm uppercase tracking-wider rounded hover:bg-gold hover:text-background transition-all"
              >
                View All Gems
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
