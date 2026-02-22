import { createClient } from "@/lib/supabase/server";
import {
  Users,
  Gem,
  MessageCircle,
  Eye,
  Clock,
  CheckCircle,
  TrendingUp,
  Star,
} from "lucide-react";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  // Fetch stats in parallel
  const [
    { count: totalSellers },
    { count: pendingSellers },
    { count: totalGems },
    { count: activeGems },
    { count: pendingGems },
    { count: totalInquiries },
    { count: unreadInquiries },
    { data: topGems },
    { data: recentSellers },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "seller"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("approval_status", "pending"),
    supabase.from("gems").select("*", { count: "exact", head: true }),
    supabase.from("gems").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("gems").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("inquiries").select("*", { count: "exact", head: true }),
    supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("is_read", false),
    supabase.from("gems").select("id, title, view_count, slug").order("view_count", { ascending: false }).limit(5),
    supabase.from("profiles").select("id, full_name, business_name, email, approval_status, created_at").eq("role", "seller").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: "Total Sellers", value: totalSellers || 0, icon: Users, color: "text-blue-400" },
    { label: "Pending Approval", value: pendingSellers || 0, icon: Clock, color: "text-yellow-400" },
    { label: "Total Gems", value: totalGems || 0, icon: Gem, color: "text-purple-400" },
    { label: "Active Listings", value: activeGems || 0, icon: CheckCircle, color: "text-green-400" },
    { label: "Pending Review", value: pendingGems || 0, icon: Clock, color: "text-orange-400" },
    { label: "Total Inquiries", value: totalInquiries || 0, icon: MessageCircle, color: "text-gold" },
    { label: "Unread Inquiries", value: unreadInquiries || 0, icon: MessageCircle, color: "text-red-400" },
    { label: "Total Views", value: topGems?.reduce((sum, g) => sum + (g.view_count || 0), 0) || 0, icon: Eye, color: "text-teal-400" },
  ];

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-card-bg border border-card-border rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-muted uppercase tracking-wider">
                  {stat.label}
                </span>
                <Icon className={stat.color} size={16} />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Viewed Gems */}
        <div className="bg-card-bg border border-card-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="text-gold" size={16} />
            Most Viewed Gems
          </h3>
          {topGems && topGems.length > 0 ? (
            <div className="space-y-3">
              {topGems.map((gem, i) => (
                <div key={gem.id} className="flex items-center gap-3">
                  <span className="text-xs text-muted w-5">{i + 1}.</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{gem.title}</p>
                  </div>
                  <span className="text-xs text-muted flex items-center gap-1">
                    <Eye size={12} />
                    {gem.view_count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No gems yet</p>
          )}
        </div>

        {/* Recent Sellers */}
        <div className="bg-card-bg border border-card-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Star className="text-gold" size={16} />
            Recent Sellers
          </h3>
          {recentSellers && recentSellers.length > 0 ? (
            <div className="space-y-3">
              {recentSellers.map((seller) => (
                <div key={seller.id} className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm text-foreground truncate">
                      {seller.business_name || seller.full_name}
                    </p>
                    <p className="text-xs text-muted">{seller.email}</p>
                  </div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full border capitalize ${
                      seller.approval_status === "approved"
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : seller.approval_status === "rejected"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    }`}
                  >
                    {seller.approval_status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No sellers yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
