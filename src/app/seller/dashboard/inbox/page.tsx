import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import InboxList from "@/components/InboxList";

export default async function InboxPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/seller/login");

  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("*, gem:gems(id, title, slug, gem_type)")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/seller/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-gold transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-gold-gradient mb-8">
          Inbox
        </h1>

        <InboxList initialInquiries={inquiries || []} sellerId={user.id} />
      </div>
    </div>
  );
}
