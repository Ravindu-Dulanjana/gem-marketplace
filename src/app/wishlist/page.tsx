import { createClient } from "@/lib/supabase/server";
import { getSessionId } from "@/lib/session";
import Link from "next/link";
import Image from "next/image";
import { Heart, ImageIcon, MessageCircle, Trash2 } from "lucide-react";
import { removeFromWishlist } from "@/lib/actions/wishlist";

export const metadata = {
  title: "Wishlist",
};

export default async function WishlistPage() {
  const supabase = await createClient();
  const sessionId = await getSessionId();

  const { data: wishlistItems } = await supabase
    .from("wishlist")
    .select("*, gem:gems(*, images:gem_images(*))")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="text-gold" size={24} />
          <h1 className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-gold-gradient">
            My Wishlist
          </h1>
          {wishlistItems && wishlistItems.length > 0 && (
            <span className="text-sm text-muted">
              ({wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""})
            </span>
          )}
        </div>

        {!wishlistItems || wishlistItems.length === 0 ? (
          <div className="bg-card-bg border border-card-border rounded-xl p-12 text-center">
            <Heart className="text-muted mx-auto mb-4" size={48} />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-sm text-muted mb-6">
              Browse our collection and save gems you love
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-2.5 bg-gold text-background font-semibold text-sm rounded-lg hover:bg-gold-light transition-colors"
            >
              Browse Gems
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {wishlistItems.map((item) => {
              const gem = item.gem;
              if (!gem) return null;

              const primaryImage = gem.images?.sort(
                (a: { display_order: number }, b: { display_order: number }) =>
                  a.display_order - b.display_order
              )[0];

              return (
                <div
                  key={item.id}
                  className="gem-card group bg-card-bg border border-card-border rounded-xl overflow-hidden relative"
                >
                  {/* Remove button */}
                  <form
                    action={async () => {
                      "use server";
                      await removeFromWishlist(gem.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="absolute top-3 right-3 z-10 p-2 bg-background/80 rounded-full text-red-500 hover:bg-red-500/20 transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={14} />
                    </button>
                  </form>

                  <Link href={`/shop/${gem.slug}`}>
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
                        <ImageIcon className="text-card-border" size={40} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-gold transition-colors">
                        {gem.title}
                      </h3>
                      <p className="text-xs text-muted mb-2">
                        {gem.gem_type} &middot;{" "}
                        {gem.carat_weight ? `${gem.carat_weight}ct` : "—"} &middot;{" "}
                        {gem.shape || "—"}
                      </p>

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
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
