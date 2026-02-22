import { createClient } from "@/lib/supabase/server";
import { getSessionId } from "@/lib/session";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, User, FileText } from "lucide-react";
import ImageGallery from "@/components/ImageGallery";
import InquiryForm from "@/components/InquiryForm";
import SimilarGems from "@/components/SimilarGems";
import WishlistButton from "@/components/WishlistButton";
import ShareButtons from "@/components/ShareButtons";
import TrackView from "@/components/TrackView";
import RecentlyViewed from "@/components/RecentlyViewed";
import { getWishlistIds } from "@/lib/actions/wishlist";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: gem } = await supabase
    .from("gems")
    .select("title, description, gem_type, carat_weight, color")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!gem) return { title: "Gem Not Found" };

  return {
    title: gem.title,
    description:
      gem.description ||
      `${gem.gem_type} - ${gem.carat_weight}ct ${gem.color || ""} gemstone`,
  };
}

export default async function GemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const sessionId = await getSessionId();

  const { data: gem } = await supabase
    .from("gems")
    .select(
      "*, images:gem_images(*), seller:profiles(id, full_name, business_name, bio, avatar_url, created_at)"
    )
    .eq("slug", slug)
    .single();

  if (!gem || (gem.status !== "active" && gem.status !== "pending")) {
    notFound();
  }

  // Increment view count
  await supabase.rpc("increment_view_count", { gem_uuid: gem.id });

  const wishlistIds = await getWishlistIds();
  const isWishlisted = wishlistIds.includes(gem.id);

  const images =
    gem.images?.sort(
      (a: { display_order: number }, b: { display_order: number }) =>
        a.display_order - b.display_order
    ) || [];

  const specs = [
    { label: "Gem Type", value: gem.gem_type },
    { label: "Carat Weight", value: gem.carat_weight ? `${gem.carat_weight} ct` : null },
    { label: "Shape", value: gem.shape },
    { label: "Color", value: gem.color },
    { label: "Clarity", value: gem.clarity },
    { label: "Treatment", value: gem.treatment },
    { label: "Origin", value: gem.origin },
    { label: "Dimensions", value: gem.dimensions },
    { label: "Certification", value: gem.certification },
  ].filter((s) => s.value);

  return (
    <div className="min-h-screen bg-background">
      {/* Track view */}
      <TrackView gemId={gem.id} sessionId={sessionId} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted mb-6">
          <Link href="/shop" className="hover:text-gold transition-colors flex items-center gap-1">
            <ArrowLeft size={14} />
            Shop
          </Link>
          <span>/</span>
          <span className="text-foreground truncate">{gem.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Image Gallery */}
          <ImageGallery images={images} title={gem.title} />

          {/* Right: Details */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-playfair)] text-foreground">
                {gem.title}
              </h1>
              <WishlistButton gemId={gem.id} isWishlisted={isWishlisted} />
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-gold font-medium">{gem.gem_type}</span>
              {gem.carat_weight && (
                <>
                  <span className="text-muted">·</span>
                  <span className="text-sm text-muted">{gem.carat_weight} ct</span>
                </>
              )}
              {gem.shape && (
                <>
                  <span className="text-muted">·</span>
                  <span className="text-sm text-muted">{gem.shape}</span>
                </>
              )}
            </div>

            {/* Price */}
            <div className="mb-6 p-4 bg-card-bg border border-card-border rounded-xl">
              {gem.price_type === "fixed" && gem.price ? (
                <div>
                  <span className="text-xs text-muted uppercase tracking-wider">Price</span>
                  <p className="text-3xl font-bold text-gold mt-1">
                    ${Number(gem.price).toLocaleString()}
                  </p>
                </div>
              ) : (
                <div>
                  <span className="text-xs text-muted uppercase tracking-wider">Pricing</span>
                  <p className="text-lg font-semibold text-foreground mt-1">
                    Contact seller for pricing
                  </p>
                </div>
              )}
            </div>

            {/* Specifications */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                Specifications
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="p-3 bg-card-bg border border-card-border rounded-lg"
                  >
                    <span className="text-[11px] text-muted uppercase tracking-wider block">
                      {spec.label}
                    </span>
                    <span className="text-sm text-foreground font-medium">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificate */}
            {gem.certificate_url && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                  Certificate
                </h3>
                <a
                  href={gem.certificate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-card-bg border border-card-border rounded-lg text-sm text-gold hover:border-gold transition-colors"
                >
                  <FileText size={16} />
                  View Certificate
                </a>
              </div>
            )}

            {/* Description */}
            {gem.description && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                  Description
                </h3>
                <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap">
                  {gem.description}
                </p>
              </div>
            )}

            {/* Share */}
            <div className="mb-6">
              <ShareButtons title={gem.title} slug={gem.slug} />
            </div>

            {/* Seller Info */}
            {gem.seller && (
              <div className="p-4 bg-card-bg border border-card-border rounded-xl mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-3">Seller</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <User className="text-gold" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {gem.seller.business_name || gem.seller.full_name}
                    </p>
                    {gem.seller.created_at && (
                      <p className="text-xs text-muted">
                        Member since{" "}
                        {new Date(gem.seller.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Inquiry Form */}
            <InquiryForm gemId={gem.id} sellerId={gem.seller_id} gemTitle={gem.title} />
          </div>
        </div>

        {/* Similar Gems */}
        <SimilarGems
          currentGemId={gem.id}
          gemType={gem.gem_type}
          color={gem.color}
        />

        {/* Recently Viewed */}
        <RecentlyViewed excludeGemId={gem.id} />
      </div>
    </div>
  );
}
