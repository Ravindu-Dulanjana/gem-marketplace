import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { ImageIcon, MessageCircle } from "lucide-react";

interface SimilarGemsProps {
  currentGemId: string;
  gemType: string;
  color: string | null;
}

export default async function SimilarGems({
  currentGemId,
  gemType,
  color,
}: SimilarGemsProps) {
  const supabase = await createClient();

  // Find gems of same type or color, excluding current
  let query = supabase
    .from("gems")
    .select("*, images:gem_images(*)")
    .eq("status", "active")
    .neq("id", currentGemId)
    .limit(4);

  if (color) {
    query = query.or(`gem_type.eq.${gemType},color.eq.${color}`);
  } else {
    query = query.eq("gem_type", gemType);
  }

  const { data: gems } = await query;

  if (!gems || gems.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-xl font-bold font-[family-name:var(--font-playfair)] text-gold-gradient mb-6">
        Similar Gems
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <div className="aspect-square bg-background flex items-center justify-center relative overflow-hidden">
                {primaryImage ? (
                  <Image
                    src={primaryImage.url}
                    alt={gem.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <ImageIcon className="text-card-border" size={32} />
                )}
              </div>
              <div className="p-3">
                <h3 className="text-xs font-semibold text-foreground line-clamp-1 group-hover:text-gold transition-colors">
                  {gem.title}
                </h3>
                <p className="text-[11px] text-muted mt-0.5">
                  {gem.carat_weight ? `${gem.carat_weight}ct` : ""} {gem.shape || ""}
                </p>
                {gem.price_type === "fixed" && gem.price ? (
                  <p className="text-xs font-bold text-gold mt-1">
                    ${Number(gem.price).toLocaleString()}
                  </p>
                ) : (
                  <p className="text-[11px] text-muted italic mt-1 flex items-center gap-1">
                    <MessageCircle size={10} />
                    Request Price
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
