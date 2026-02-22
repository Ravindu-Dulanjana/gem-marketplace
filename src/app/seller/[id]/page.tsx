import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { User, Calendar, Gem, Star, ImageIcon, MessageCircle } from "lucide-react";
import ReviewForm from "@/components/ReviewForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: seller } = await supabase
    .from("profiles")
    .select("full_name, business_name")
    .eq("id", id)
    .single();

  if (!seller) return { title: "Seller Not Found" };
  return { title: seller.business_name || seller.full_name };
}

export default async function SellerStorefrontPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: seller } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("approval_status", "approved")
    .single();

  if (!seller) notFound();

  const [{ data: gems }, { data: reviews }] = await Promise.all([
    supabase
      .from("gems")
      .select("*, images:gem_images(*)")
      .eq("seller_id", id)
      .eq("status", "active")
      .order("created_at", { ascending: false }),
    supabase
      .from("reviews")
      .select("*")
      .eq("seller_id", id)
      .eq("is_approved", true)
      .order("created_at", { ascending: false }),
  ]);

  const avgRating =
    reviews && reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Seller Header */}
        <div className="bg-card-bg border border-card-border rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
              {seller.avatar_url ? (
                <Image
                  src={seller.avatar_url}
                  alt={seller.full_name}
                  width={80}
                  height={80}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="text-gold" size={32} />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-foreground">
                {seller.business_name || seller.full_name}
              </h1>
              {seller.business_name && (
                <p className="text-sm text-muted">{seller.full_name}</p>
              )}
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs text-muted flex items-center gap-1">
                  <Calendar size={12} />
                  Member since{" "}
                  {new Date(seller.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="text-xs text-muted flex items-center gap-1">
                  <Gem size={12} />
                  {gems?.length || 0} listing{gems?.length !== 1 ? "s" : ""}
                </span>
                {avgRating && (
                  <span className="text-xs text-gold flex items-center gap-1">
                    <Star size={12} fill="currentColor" />
                    {avgRating} ({reviews?.length} review{reviews?.length !== 1 ? "s" : ""})
                  </span>
                )}
              </div>
              {seller.bio && (
                <p className="text-sm text-muted mt-3 leading-relaxed">
                  {seller.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Gems Grid */}
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Listings
        </h2>

        {!gems || gems.length === 0 ? (
          <p className="text-sm text-muted bg-card-bg border border-card-border rounded-xl p-8 text-center">
            No active listings
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
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
                    <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-gold transition-colors">
                      {gem.title}
                    </h3>
                    <p className="text-xs text-muted mt-0.5">
                      {gem.gem_type} &middot; {gem.carat_weight ? `${gem.carat_weight}ct` : "—"}
                    </p>
                    {gem.price_type === "fixed" && gem.price ? (
                      <p className="text-sm font-bold text-gold mt-1">
                        ${Number(gem.price).toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-xs text-muted italic mt-1 flex items-center gap-1">
                        <MessageCircle size={10} /> Request Price
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Existing Reviews */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Star className="text-gold" size={18} />
              Reviews
            </h2>
            {!reviews || reviews.length === 0 ? (
              <p className="text-sm text-muted bg-card-bg border border-card-border rounded-xl p-6 text-center">
                No reviews yet. Be the first!
              </p>
            ) : (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-card-bg border border-card-border rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {review.buyer_name}
                      </span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < review.rating
                                ? "text-gold fill-gold"
                                : "text-card-border"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted">{review.comment}</p>
                    )}
                    <p className="text-[11px] text-muted/60 mt-2">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Review Form */}
          <ReviewForm sellerId={id} />
        </div>
      </div>
    </div>
  );
}
