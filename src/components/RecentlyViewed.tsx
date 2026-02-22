import { createClient } from "@/lib/supabase/server";
import { getSessionId } from "@/lib/session";
import Link from "next/link";
import Image from "next/image";
import { ImageIcon, Clock } from "lucide-react";

interface RecentlyViewedProps {
  excludeGemId?: string;
}

export default async function RecentlyViewed({ excludeGemId }: RecentlyViewedProps) {
  const supabase = await createClient();
  const sessionId = await getSessionId();

  let query = supabase
    .from("recently_viewed")
    .select("*, gem:gems(*, images:gem_images(*))")
    .eq("session_id", sessionId)
    .order("viewed_at", { ascending: false })
    .limit(6);

  const { data: items } = await query;

  const filtered = items?.filter((item) => item.gem?.id !== excludeGemId && item.gem?.status === "active") || [];

  if (filtered.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-lg font-bold font-[family-name:var(--font-playfair)] text-foreground mb-4 flex items-center gap-2">
        <Clock className="text-gold" size={18} />
        Recently Viewed
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {filtered.slice(0, 6).map((item) => {
          const gem = item.gem;
          if (!gem) return null;

          const primaryImage = gem.images?.sort(
            (a: { display_order: number }, b: { display_order: number }) =>
              a.display_order - b.display_order
          )[0];

          return (
            <Link
              key={item.id}
              href={`/shop/${gem.slug}`}
              className="group bg-card-bg border border-card-border rounded-lg overflow-hidden hover:border-gold/30 transition-colors"
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
                  <ImageIcon className="text-card-border" size={24} />
                )}
              </div>
              <div className="p-2">
                <h3 className="text-[11px] font-medium text-foreground line-clamp-1 group-hover:text-gold transition-colors">
                  {gem.title}
                </h3>
                <p className="text-[10px] text-muted">
                  {gem.carat_weight ? `${gem.carat_weight}ct` : gem.gem_type}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
