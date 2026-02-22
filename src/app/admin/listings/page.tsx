import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { approveGem, removeGem } from "@/lib/actions/admin";
import { CheckCircle, XCircle, Eye, ImageIcon, ExternalLink } from "lucide-react";

export default async function AdminListingsPage() {
  const supabase = await createClient();

  const { data: gems } = await supabase
    .from("gems")
    .select("*, images:gem_images(*), seller:profiles(full_name, business_name)")
    .order("created_at", { ascending: false });

  const pending = gems?.filter((g) => g.status === "pending") || [];
  const active = gems?.filter((g) => g.status === "active") || [];
  const removed = gems?.filter((g) => g.status === "removed") || [];

  function GemRow({ gem, showActions }: { gem: (typeof gems extends (infer T)[] | null ? T : never); showActions: "approve" | "remove" | "restore" }) {
    const primaryImage = gem.images?.sort(
      (a: { display_order: number }, b: { display_order: number }) =>
        a.display_order - b.display_order
    )[0];

    return (
      <div className="bg-card-bg border border-card-border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-background flex items-center justify-center shrink-0">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={gem.title}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="text-card-border" size={20} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{gem.title}</p>
          <p className="text-xs text-muted">
            {gem.gem_type} &middot; {gem.carat_weight ? `${gem.carat_weight}ct` : "—"} &middot;{" "}
            by {gem.seller?.business_name || gem.seller?.full_name || "Unknown"}
          </p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-muted flex items-center gap-1">
              <Eye size={11} /> {gem.view_count}
            </span>
            {gem.price_type === "fixed" && gem.price ? (
              <span className="text-xs text-gold font-semibold">${Number(gem.price).toLocaleString()}</span>
            ) : (
              <span className="text-xs text-muted italic">Request Price</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/shop/${gem.slug}`}
            className="p-2 text-muted hover:text-foreground transition-colors"
            title="View"
          >
            <ExternalLink size={14} />
          </Link>

          {showActions === "approve" && (
            <>
              <form action={async () => { "use server"; await approveGem(gem.id); }}>
                <button type="submit" className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-500 transition-colors font-semibold">
                  <CheckCircle size={12} /> Approve
                </button>
              </form>
              <form action={async () => { "use server"; await removeGem(gem.id); }}>
                <button type="submit" className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-500 transition-colors font-semibold">
                  <XCircle size={12} /> Reject
                </button>
              </form>
            </>
          )}

          {showActions === "remove" && (
            <form action={async () => { "use server"; await removeGem(gem.id); }}>
              <button type="submit" className="text-xs px-3 py-1.5 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors">
                Remove
              </button>
            </form>
          )}

          {showActions === "restore" && (
            <form action={async () => { "use server"; await approveGem(gem.id); }}>
              <button type="submit" className="text-xs px-3 py-1.5 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/10 transition-colors">
                Restore
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-6">Manage Listings</h2>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-yellow-400 mb-3">
            Pending Review ({pending.length})
          </h3>
          <div className="space-y-3">
            {pending.map((gem) => (
              <GemRow key={gem.id} gem={gem} showActions="approve" />
            ))}
          </div>
        </div>
      )}

      {/* Active */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-green-400 mb-3">
          Active ({active.length})
        </h3>
        {active.length === 0 ? (
          <p className="text-sm text-muted bg-card-bg border border-card-border rounded-xl p-6 text-center">
            No active listings
          </p>
        ) : (
          <div className="space-y-2">
            {active.map((gem) => (
              <GemRow key={gem.id} gem={gem} showActions="remove" />
            ))}
          </div>
        )}
      </div>

      {/* Removed */}
      {removed.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-red-400 mb-3">
            Removed ({removed.length})
          </h3>
          <div className="space-y-2">
            {removed.map((gem) => (
              <GemRow key={gem.id} gem={gem} showActions="restore" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
