import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import GemForm from "@/components/GemForm";
import { updateGem } from "@/lib/actions/gems";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/seller/login");

  const { data: gem } = await supabase
    .from("gems")
    .select("*, images:gem_images(*)")
    .eq("id", id)
    .eq("seller_id", user.id)
    .single();

  if (!gem) notFound();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");

  const updateGemWithId = async (formData: FormData) => {
    "use server";
    return updateGem(id, formData);
  };

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
          Edit Listing
        </h1>

        <GemForm
          gem={gem}
          categories={categories || []}
          action={updateGemWithId}
          submitLabel="Update Listing"
        />
      </div>
    </div>
  );
}
