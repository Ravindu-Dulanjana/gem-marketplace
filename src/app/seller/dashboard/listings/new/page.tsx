import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import GemForm from "@/components/GemForm";
import { createGem } from "@/lib/actions/gems";

export default async function NewListingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/seller/login");

  // Check approval status
  const { data: profile } = await supabase
    .from("profiles")
    .select("approval_status")
    .eq("id", user.id)
    .single();

  if (profile?.approval_status !== "approved") {
    redirect("/seller/dashboard");
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/seller/dashboard/listings"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-gold transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Listings
        </Link>

        <h1 className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-gold-gradient mb-8">
          Create New Listing
        </h1>

        <GemForm
          categories={categories || []}
          action={createGem}
          submitLabel="Create Listing"
        />
      </div>
    </div>
  );
}
