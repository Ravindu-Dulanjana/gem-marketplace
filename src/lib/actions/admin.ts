"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Not authorized");
  return { supabase, user };
}

export async function approveSeller(sellerId: string) {
  const { supabase, user } = await requireAdmin();

  const { error } = await supabase
    .from("profiles")
    .update({ approval_status: "approved" })
    .eq("id", sellerId);

  if (error) return { error: error.message };

  await supabase.from("admin_logs").insert({
    admin_id: user.id,
    action: "approve_seller",
    target_type: "profile",
    target_id: sellerId,
  });

  revalidatePath("/admin/sellers");
  return { success: true };
}

export async function rejectSeller(sellerId: string) {
  const { supabase, user } = await requireAdmin();

  const { error } = await supabase
    .from("profiles")
    .update({ approval_status: "rejected" })
    .eq("id", sellerId);

  if (error) return { error: error.message };

  await supabase.from("admin_logs").insert({
    admin_id: user.id,
    action: "reject_seller",
    target_type: "profile",
    target_id: sellerId,
  });

  revalidatePath("/admin/sellers");
  return { success: true };
}

export async function approveGem(gemId: string) {
  const { supabase, user } = await requireAdmin();

  const { error } = await supabase
    .from("gems")
    .update({ status: "active" })
    .eq("id", gemId);

  if (error) return { error: error.message };

  await supabase.from("admin_logs").insert({
    admin_id: user.id,
    action: "approve_gem",
    target_type: "gem",
    target_id: gemId,
  });

  revalidatePath("/admin/listings");
  revalidatePath("/shop");
  return { success: true };
}

export async function removeGem(gemId: string) {
  const { supabase, user } = await requireAdmin();

  const { error } = await supabase
    .from("gems")
    .update({ status: "removed" })
    .eq("id", gemId);

  if (error) return { error: error.message };

  await supabase.from("admin_logs").insert({
    admin_id: user.id,
    action: "remove_gem",
    target_type: "gem",
    target_id: gemId,
  });

  revalidatePath("/admin/listings");
  revalidatePath("/shop");
  return { success: true };
}

export async function approveReview(reviewId: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("reviews")
    .update({ is_approved: true })
    .eq("id", reviewId);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { success: true };
}

export async function deleteReview(reviewId: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { success: true };
}
