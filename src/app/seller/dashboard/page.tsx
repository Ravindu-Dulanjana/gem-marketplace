import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Gem,
  Package,
  MessageCircle,
  BarChart3,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut,
} from "lucide-react";

export default async function SellerDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/seller/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const approvalStatus = profile?.approval_status || "pending";

  // Fetch real stats
  const [
    { count: totalListings },
    { count: activeListings },
    { count: totalInquiries },
    { data: viewData },
  ] = await Promise.all([
    supabase.from("gems").select("*", { count: "exact", head: true }).eq("seller_id", user.id),
    supabase.from("gems").select("*", { count: "exact", head: true }).eq("seller_id", user.id).eq("status", "active"),
    supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("seller_id", user.id),
    supabase.from("gems").select("view_count").eq("seller_id", user.id),
  ]);

  const totalViews = viewData?.reduce((sum, g) => sum + (g.view_count || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <div className="bg-card-bg border-b border-card-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Gem className="text-gold" size={24} />
              <span className="text-lg font-bold font-[family-name:var(--font-playfair)] text-gold-gradient">
                GemMarket
              </span>
            </Link>
            <span className="text-muted text-sm">/</span>
            <span className="text-sm text-foreground">Seller Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">{profile?.full_name || user.email}</span>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="text-muted hover:text-red-400 transition-colors"
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Approval Status Banner */}
        {approvalStatus === "pending" && (
          <div className="mb-8 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3">
            <Clock className="text-yellow-500 mt-0.5 shrink-0" size={20} />
            <div>
              <h3 className="text-sm font-semibold text-yellow-500">
                Account Pending Approval
              </h3>
              <p className="text-xs text-muted mt-1">
                Your seller account is currently under review. An admin will
                approve your account shortly. You&apos;ll be able to create
                listings once approved.
              </p>
            </div>
          </div>
        )}

        {approvalStatus === "rejected" && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertCircle className="text-red-400 mt-0.5 shrink-0" size={20} />
            <div>
              <h3 className="text-sm font-semibold text-red-400">
                Account Rejected
              </h3>
              <p className="text-xs text-muted mt-1">
                Your seller account application was not approved. Please contact
                support for more information.
              </p>
            </div>
          </div>
        )}

        {approvalStatus === "approved" && (
          <div className="mb-8 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-3">
            <CheckCircle className="text-green-500 mt-0.5 shrink-0" size={20} />
            <div>
              <h3 className="text-sm font-semibold text-green-500">
                Account Approved
              </h3>
              <p className="text-xs text-muted mt-1">
                Your seller account is active. You can create and manage gem
                listings.
              </p>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Listings", value: String(totalListings || 0), icon: Package, color: "text-blue-400" },
            { label: "Active Listings", value: String(activeListings || 0), icon: Gem, color: "text-green-400" },
            { label: "Total Inquiries", value: String(totalInquiries || 0), icon: MessageCircle, color: "text-gold" },
            { label: "Total Views", value: String(totalViews), icon: BarChart3, color: "text-purple-400" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-card-bg border border-card-border rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <Icon className={stat.color} size={18} />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/seller/dashboard/listings"
            className="flex items-center gap-4 p-6 bg-card-bg border border-card-border rounded-xl hover:border-gold/50 transition-all"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gold/10">
              <Package className="text-gold" size={22} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                My Listings
              </h3>
              <p className="text-xs text-muted mt-0.5">
                View, edit & manage your gems
              </p>
            </div>
          </Link>

          <Link
            href={approvalStatus === "approved" ? "/seller/dashboard/listings/new" : "#"}
            className={`flex items-center gap-4 p-6 bg-card-bg border border-card-border rounded-xl transition-all ${
              approvalStatus === "approved"
                ? "hover:border-gold/50 cursor-pointer"
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gold/10">
              <Plus className="text-gold" size={22} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Create New Listing
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Add a new gem to your store
              </p>
            </div>
          </Link>

          <Link
            href="/seller/dashboard/inbox"
            className="flex items-center gap-4 p-6 bg-card-bg border border-card-border rounded-xl hover:border-gold/50 transition-all"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gold/10">
              <MessageCircle className="text-gold" size={22} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                View Inquiries
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Check messages from buyers
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
