import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { ImageIcon, MessageCircle, Eye, SlidersHorizontal } from "lucide-react";
import ShopFilters from "@/components/ShopFilters";
import WishlistButton from "@/components/WishlistButton";
import CompareButton from "@/components/CompareButton";
import { getWishlistIds } from "@/lib/actions/wishlist";

const ITEMS_PER_PAGE = 20;

interface SearchParams {
  q?: string;
  category?: string;
  shape?: string;
  color?: string;
  type?: string;
  treatment?: string;
  price_type?: string;
  min_carat?: string;
  max_carat?: string;
  min_price?: string;
  max_price?: string;
  sort?: string;
  page?: string;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const page = parseInt(params.page || "1");
  const offset = (page - 1) * ITEMS_PER_PAGE;

  // Build query
  let query = supabase
    .from("gems")
    .select("*, images:gem_images(*), seller:profiles(full_name, business_name)", {
      count: "exact",
    })
    .eq("status", "active");

  // Search
  if (params.q) {
    query = query.or(
      `title.ilike.%${params.q}%,description.ilike.%${params.q}%,gem_type.ilike.%${params.q}%`
    );
  }

  // Filters
  if (params.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.category)
      .single();
    if (cat) query = query.eq("category_id", cat.id);
  }
  if (params.shape) query = query.ilike("shape", params.shape.replace(/-/g, " "));
  if (params.color) query = query.ilike("color", params.color);
  if (params.type) query = query.ilike("gem_type", params.type);
  if (params.treatment) query = query.ilike("treatment", `%${params.treatment}%`);
  if (params.price_type) query = query.eq("price_type", params.price_type);
  if (params.min_carat) query = query.gte("carat_weight", parseFloat(params.min_carat));
  if (params.max_carat) query = query.lte("carat_weight", parseFloat(params.max_carat));
  if (params.min_price) query = query.gte("price", parseFloat(params.min_price));
  if (params.max_price) query = query.lte("price", parseFloat(params.max_price));

  // Sorting
  switch (params.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true, nullsFirst: false });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false, nullsFirst: false });
      break;
    case "popular":
      query = query.order("view_count", { ascending: false });
      break;
    case "carat-desc":
      query = query.order("carat_weight", { ascending: false, nullsFirst: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  // Pagination
  query = query.range(offset, offset + ITEMS_PER_PAGE - 1);

  const { data: gems, count } = await query;

  // Get categories for filter
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);
  const wishlistIds = await getWishlistIds();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-gold-gradient mb-2">
            {params.q
              ? `Search: "${params.q}"`
              : params.category
                ? categories?.find((c) => c.slug === params.category)?.name || "Shop"
                : params.color
                  ? `${params.color.charAt(0).toUpperCase() + params.color.slice(1)} Gems`
                  : params.shape
                    ? `${params.shape.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Gems`
                    : "All Gems"}
          </h1>
          <p className="text-sm text-muted">
            {count || 0} gem{count !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <ShopFilters
            categories={categories || []}
            currentParams={params as Record<string, string | undefined>}
          />

          {/* Gems Grid */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-card-border">
              <div className="flex items-center gap-2 text-sm text-muted">
                <SlidersHorizontal size={16} />
                <span>Sort by:</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: "Newest", value: "newest" },
                  { label: "Price: Low", value: "price-asc" },
                  { label: "Price: High", value: "price-desc" },
                  { label: "Most Viewed", value: "popular" },
                  { label: "Carat: High", value: "carat-desc" },
                ].map((opt) => {
                  const isActive =
                    params.sort === opt.value ||
                    (!params.sort && opt.value === "newest");
                  const newParams = new URLSearchParams();
                  Object.entries(params).forEach(([k, v]) => {
                    if (v && k !== "sort" && k !== "page") newParams.set(k, v);
                  });
                  newParams.set("sort", opt.value);

                  return (
                    <Link
                      key={opt.value}
                      href={`/shop?${newParams.toString()}`}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        isActive
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-card-border text-muted hover:border-gold/50 hover:text-foreground"
                      }`}
                    >
                      {opt.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Grid */}
            {!gems || gems.length === 0 ? (
              <div className="text-center py-16">
                <ImageIcon className="text-card-border mx-auto mb-4" size={48} />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No gems found
                </h3>
                <p className="text-sm text-muted mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Link
                  href="/shop"
                  className="text-sm text-gold hover:text-gold-light transition-colors"
                >
                  Clear all filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {gems.map((gem) => {
                  const primaryImage = gem.images?.sort(
                    (a: { display_order: number }, b: { display_order: number }) =>
                      a.display_order - b.display_order
                  )[0];

                  return (
                    <div
                      key={gem.id}
                      className="gem-card group bg-card-bg border border-card-border rounded-xl overflow-hidden relative"
                    >
                      {/* Quick actions */}
                      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
                        <WishlistButton gemId={gem.id} isWishlisted={wishlistIds.includes(gem.id)} size="sm" />
                        <CompareButton gemId={gem.id} />
                      </div>

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

                        <div className="flex flex-wrap gap-1 mb-3">
                          {gem.color && (
                            <span className="text-[10px] px-2 py-0.5 bg-gold/10 text-gold rounded-full">
                              {gem.color}
                            </span>
                          )}
                          {gem.treatment && (
                            <span className="text-[10px] px-2 py-0.5 bg-card-border text-muted rounded-full">
                              {gem.treatment}
                            </span>
                          )}
                        </div>

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
                          <span className="text-xs text-muted flex items-center gap-1">
                            <Eye size={12} />
                            {gem.view_count}
                          </span>
                        </div>
                      </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const newParams = new URLSearchParams();
                  Object.entries(params).forEach(([k, v]) => {
                    if (v && k !== "page") newParams.set(k, v);
                  });
                  newParams.set("page", p.toString());

                  return (
                    <Link
                      key={p}
                      href={`/shop?${newParams.toString()}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm transition-colors ${
                        p === page
                          ? "bg-gold text-background font-semibold"
                          : "bg-card-bg border border-card-border text-muted hover:border-gold/50 hover:text-foreground"
                      }`}
                    >
                      {p}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
