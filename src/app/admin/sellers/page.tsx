import { createClient } from "@/lib/supabase/server";
import { approveSeller, rejectSeller } from "@/lib/actions/admin";
import { CheckCircle, XCircle, Clock, Mail, User } from "lucide-react";

export default async function AdminSellersPage() {
  const supabase = await createClient();

  const { data: sellers } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "seller")
    .order("created_at", { ascending: false });

  const pending = sellers?.filter((s) => s.approval_status === "pending") || [];
  const approved = sellers?.filter((s) => s.approval_status === "approved") || [];
  const rejected = sellers?.filter((s) => s.approval_status === "rejected") || [];

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-6">Manage Sellers</h2>

      {/* Pending Sellers */}
      {pending.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">
            <Clock size={14} />
            Pending Approval ({pending.length})
          </h3>
          <div className="space-y-3">
            {pending.map((seller) => (
              <div
                key={seller.id}
                className="bg-card-bg border border-yellow-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
                  <User className="text-yellow-400" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {seller.full_name}
                  </p>
                  {seller.business_name && (
                    <p className="text-xs text-muted">{seller.business_name}</p>
                  )}
                  <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                    <Mail size={11} />
                    {seller.email}
                  </p>
                  <p className="text-[11px] text-muted mt-1">
                    Registered {new Date(seller.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <form
                    action={async () => {
                      "use server";
                      await approveSeller(seller.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white text-xs rounded-lg hover:bg-green-500 transition-colors font-semibold"
                    >
                      <CheckCircle size={14} />
                      Approve
                    </button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await rejectSeller(seller.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white text-xs rounded-lg hover:bg-red-500 transition-colors font-semibold"
                    >
                      <XCircle size={14} />
                      Reject
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Sellers */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
          <CheckCircle size={14} />
          Approved ({approved.length})
        </h3>
        {approved.length === 0 ? (
          <p className="text-sm text-muted bg-card-bg border border-card-border rounded-xl p-6 text-center">
            No approved sellers yet
          </p>
        ) : (
          <div className="space-y-2">
            {approved.map((seller) => (
              <div
                key={seller.id}
                className="bg-card-bg border border-card-border rounded-xl p-4 flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {seller.business_name || seller.full_name}
                  </p>
                  <p className="text-xs text-muted">{seller.email}</p>
                </div>
                <form
                  action={async () => {
                    "use server";
                    await rejectSeller(seller.id);
                  }}
                >
                  <button
                    type="submit"
                    className="text-xs px-3 py-1.5 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    Revoke
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejected Sellers */}
      {rejected.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
            <XCircle size={14} />
            Rejected ({rejected.length})
          </h3>
          <div className="space-y-2">
            {rejected.map((seller) => (
              <div
                key={seller.id}
                className="bg-card-bg border border-card-border rounded-xl p-4 flex items-center gap-4 opacity-60"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {seller.business_name || seller.full_name}
                  </p>
                  <p className="text-xs text-muted">{seller.email}</p>
                </div>
                <form
                  action={async () => {
                    "use server";
                    await approveSeller(seller.id);
                  }}
                >
                  <button
                    type="submit"
                    className="text-xs px-3 py-1.5 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/10 transition-colors"
                  >
                    Approve
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
