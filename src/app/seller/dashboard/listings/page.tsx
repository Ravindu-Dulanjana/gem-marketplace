import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  ImageIcon,
  ArrowLeft,
} from "lucide-react";
import { deleteGem } from "@/lib/actions/gems";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-green-500/10 text-green-400 border-green-500/20",
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    draft: "bg-muted/10 text-muted border-card-border",
    sold: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    removed: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span
      className={`text-[11px] px-2 py-0.5 rounded-full border capitalize ${styles[status] || styles.draft}`}
    >
      {status}
    </span>
  );
}

export default async function SellerListingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/seller/login");

  const { data: gems } = await supabase
    .from("gems")
    .select("*, images:gem_images(*)")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link
          href="/seller/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-gold transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-gold-gradient">
            My Listings
          </h1>
          <Link
            href="/seller/dashboard/listings/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold text-background font-semibold text-sm rounded-lg hover:bg-gold-light transition-colors"
          >
            <Plus size={16} />
            New Listing
          </Link>
        </div>

        {!gems || gems.length === 0 ? (
          <div className="bg-card-bg border border-card-border rounded-xl p-12 text-center">
            <ImageIcon className="text-muted mx-auto mb-4" size={48} />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No listings yet
            </h3>
            <p className="text-sm text-muted mb-6">
              Create your first gem listing to start selling
            </p>
            <Link
              href="/seller/dashboard/listings/new"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold text-background font-semibold text-sm rounded-lg hover:bg-gold-light transition-colors"
            >
              <Plus size={16} />
              Create Listing
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {gems.map((gem) => {
              const primaryImage = gem.images?.sort(
                (a: { display_order: number }, b: { display_order: number }) =>
                  a.display_order - b.display_order
              )[0];

              return (
                <div
                  key={gem.id}
                  className="bg-card-bg border border-card-border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                  {/* Image */}
                  <div className="w-full sm:w-20 h-20 rounded-lg overflow-hidden bg-background flex items-center justify-center shrink-0">
                    {primaryImage ? (
                      <Image
                        src={primaryImage.url}
                        alt={gem.title}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="text-card-border" size={24} />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-foreground truncate">
                        {gem.title}
                      </h3>
                      <StatusBadge status={gem.status} />
                    </div>
                    <p className="text-xs text-muted">
                      {gem.gem_type} &middot;{" "}
                      {gem.carat_weight ? `${gem.carat_weight}ct` : "—"} &middot;{" "}
                      {gem.shape || "—"} &middot; {gem.color || "—"}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted flex items-center gap-1">
                        <Eye size={12} />
                        {gem.view_count} views
                      </span>
                      {gem.price_type === "fixed" && gem.price ? (
                        <span className="text-xs font-semibold text-gold">
                          ${gem.price.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-xs text-muted italic">
                          Request Price
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/shop/${gem.slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted hover:text-foreground border border-card-border rounded-lg transition-colors"
                    >
                      <Eye size={14} />
                      View
                    </Link>
                    <Link
                      href={`/seller/dashboard/listings/${gem.id}/edit`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gold border border-gold/30 rounded-lg hover:bg-gold/10 transition-colors"
                    >
                      <Edit size={14} />
                      Edit
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteGem(gem.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted hover:text-red-400 border border-card-border hover:border-red-400/30 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
