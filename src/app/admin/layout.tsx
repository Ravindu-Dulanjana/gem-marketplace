import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Gem,
  FolderOpen,
  ArrowLeft,
} from "lucide-react";

const adminNav = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Sellers", href: "/admin/sellers", icon: Users },
  { label: "Listings", href: "/admin/listings", icon: Gem },
  { label: "Categories", href: "/admin/categories", icon: FolderOpen },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-muted hover:text-gold transition-colors mb-2"
            >
              <ArrowLeft size={12} />
              Back to site
            </Link>
            <h1 className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-gold-gradient">
              Admin Dashboard
            </h1>
          </div>
        </div>

        {/* Nav tabs */}
        <nav className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-muted hover:text-foreground hover:bg-card-bg border border-transparent hover:border-card-border transition-all whitespace-nowrap"
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {children}
      </div>
    </div>
  );
}
