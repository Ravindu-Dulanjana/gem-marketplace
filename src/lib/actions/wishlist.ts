"use server";

import { createClient } from "@/lib/supabase/server";
import { getSessionId } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function addToWishlist(gemId: string) {
  const supabase = await createClient();
  const sessionId = await getSessionId();

  const { error } = await supabase
    .from("wishlist")
    .upsert(
      { session_id: sessionId, gem_id: gemId },
      { onConflict: "session_id,gem_id" }
    );

  if (error) return { error: error.message };

  revalidatePath("/wishlist");
  return { success: true };
}

export async function removeFromWishlist(gemId: string) {
  const supabase = await createClient();
  const sessionId = await getSessionId();

  const { error } = await supabase
    .from("wishlist")
    .delete()
    .eq("session_id", sessionId)
    .eq("gem_id", gemId);

  if (error) return { error: error.message };

  revalidatePath("/wishlist");
  return { success: true };
}

export async function getWishlistIds(): Promise<string[]> {
  const supabase = await createClient();
  const sessionId = await getSessionId();

  const { data } = await supabase
    .from("wishlist")
    .select("gem_id")
    .eq("session_id", sessionId);

  return data?.map((w) => w.gem_id) || [];
}
