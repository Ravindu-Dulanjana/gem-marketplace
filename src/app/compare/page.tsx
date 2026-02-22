import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { GitCompareArrows, ImageIcon, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Compare Gems",
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const params = await searchParams;
  const ids = params.ids?.split(",").filter(Boolean) || [];

  if (ids.length < 2) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <GitCompareArrows className="text-muted mx-auto mb-4" size={48} />
          <h1 className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-foreground mb-2">
            Compare Gems
          </h1>
          <p className="text-sm text-muted mb-6">
            Select at least 2 gems from the shop to compare them side by side
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 bg-gold text-background font-semibold text-sm rounded-lg hover:bg-gold-light transition-colors"
          >
            Browse Gems
          </Link>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: gems } = await supabase
    .from("gems")
    .select("*, images:gem_images(*)")
    .in("id", ids);

  if (!gems || gems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-muted">Gems not found</p>
        </div>
      </div>
    );
  }

  const specRows = [
    { label: "Type", key: "gem_type" },
    { label: "Carat", key: "carat_weight", format: (v: number | null) => v ? `${v} ct` : "—" },
    { label: "Shape", key: "shape" },
    { label: "Color", key: "color" },
    { label: "Clarity", key: "clarity" },
    { label: "Treatment", key: "treatment" },
    { label: "Origin", key: "origin" },
    { label: "Dimensions", key: "dimensions" },
    { label: "Certification", key: "certification" },
    {
      label: "Price",
      key: "price",
      format: (v: number | null, gem: Record<string, unknown>) =>
        gem.price_type === "fixed" && v
          ? `$${Number(v).toLocaleString()}`
          : "Request Price",
    },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-gold transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Shop
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <GitCompareArrows className="text-gold" size={24} />
          <h1 className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-gold-gradient">
            Compare Gems
          </h1>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            {/* Header: Images + Names */}
            <thead>
              <tr>
                <th className="w-40" />
                {gems.map((gem) => {
                  const primaryImage = gem.images?.sort(
                    (a: { display_order: number }, b: { display_order: number }) =>
                      a.display_order - b.display_order
                  )[0];

                  return (
                    <th
                      key={gem.id}
                      className="px-3 pb-4 text-center align-bottom"
                    >
                      <Link href={`/shop/${gem.slug}`} className="group block">
                        <div className="w-32 h-32 mx-auto bg-card-bg border border-card-border rounded-xl overflow-hidden mb-3 relative">
                          {primaryImage ? (
                            <Image
                              src={primaryImage.url}
                              alt={gem.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <ImageIcon className="text-card-border" size={32} />
                            </div>
                          )}
                        </div>
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-gold transition-colors line-clamp-2">
                          {gem.title}
                        </h3>
                      </Link>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Spec Rows */}
            <tbody>
              {specRows.map((row, i) => (
                <tr
                  key={row.label}
                  className={i % 2 === 0 ? "bg-card-bg/50" : ""}
                >
                  <td className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap">
                    {row.label}
                  </td>
                  {gems.map((gem) => {
                    const gemRecord = gem as unknown as Record<string, unknown>;
                    const value = gemRecord[row.key];
                    const formatted =
                      "format" in row && row.format
                        ? (row.format as (v: unknown, g: Record<string, unknown>) => string)(value, gemRecord)
                        : (value as string) || "—";

                    return (
                      <td
                        key={gem.id}
                        className="px-3 py-3 text-sm text-foreground text-center"
                      >
                        {formatted}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
