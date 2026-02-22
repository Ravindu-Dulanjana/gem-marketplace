"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function generateSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Date.now().toString(36)
  );
}

export async function createGem(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/seller/login");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const gemType = formData.get("gem_type") as string;
  const caratWeight = formData.get("carat_weight") as string;
  const shape = formData.get("shape") as string;
  const color = formData.get("color") as string;
  const clarity = formData.get("clarity") as string;
  const treatment = formData.get("treatment") as string;
  const origin = formData.get("origin") as string;
  const dimensions = formData.get("dimensions") as string;
  const certification = formData.get("certification") as string;
  const priceType = formData.get("price_type") as string;
  const price = formData.get("price") as string;
  const categoryId = formData.get("category_id") as string;
  const status = (formData.get("status") as string) || "pending";

  const slug = generateSlug(title);

  const { data: gem, error } = await supabase
    .from("gems")
    .insert({
      seller_id: user.id,
      title,
      slug,
      description: description || null,
      gem_type: gemType,
      carat_weight: caratWeight ? parseFloat(caratWeight) : null,
      shape: shape || null,
      color: color || null,
      clarity: clarity || null,
      treatment: treatment || null,
      origin: origin || null,
      dimensions: dimensions || null,
      certification: certification || null,
      price_type: priceType || "request",
      price: price ? parseFloat(price) : null,
      category_id: categoryId || null,
      status,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Handle image uploads
  const images = formData.getAll("images") as File[];
  const validImages = images.filter((img) => img.size > 0);

  if (validImages.length > 0) {
    for (let i = 0; i < validImages.length; i++) {
      const file = validImages[i];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${gem.id}/${i}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("gems")
        .upload(filePath, file);

      if (!uploadError) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("gems").getPublicUrl(filePath);

        await supabase.from("gem_images").insert({
          gem_id: gem.id,
          url: publicUrl,
          alt_text: `${title} - Image ${i + 1}`,
          display_order: i,
        });
      }
    }
  }

  revalidatePath("/seller/dashboard/listings");
  revalidatePath("/shop");
  redirect("/seller/dashboard/listings");
}

export async function updateGem(gemId: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/seller/login");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const gemType = formData.get("gem_type") as string;
  const caratWeight = formData.get("carat_weight") as string;
  const shape = formData.get("shape") as string;
  const color = formData.get("color") as string;
  const clarity = formData.get("clarity") as string;
  const treatment = formData.get("treatment") as string;
  const origin = formData.get("origin") as string;
  const dimensions = formData.get("dimensions") as string;
  const certification = formData.get("certification") as string;
  const priceType = formData.get("price_type") as string;
  const price = formData.get("price") as string;
  const categoryId = formData.get("category_id") as string;
  const status = (formData.get("status") as string) || "pending";

  const { error } = await supabase
    .from("gems")
    .update({
      title,
      description: description || null,
      gem_type: gemType,
      carat_weight: caratWeight ? parseFloat(caratWeight) : null,
      shape: shape || null,
      color: color || null,
      clarity: clarity || null,
      treatment: treatment || null,
      origin: origin || null,
      dimensions: dimensions || null,
      certification: certification || null,
      price_type: priceType || "request",
      price: price ? parseFloat(price) : null,
      category_id: categoryId || null,
      status,
    })
    .eq("id", gemId)
    .eq("seller_id", user.id);

  if (error) {
    return { error: error.message };
  }

  // Handle new image uploads
  const images = formData.getAll("images") as File[];
  const validImages = images.filter((img) => img.size > 0);

  if (validImages.length > 0) {
    // Get current max display_order
    const { data: existingImages } = await supabase
      .from("gem_images")
      .select("display_order")
      .eq("gem_id", gemId)
      .order("display_order", { ascending: false })
      .limit(1);

    const startOrder =
      existingImages && existingImages.length > 0
        ? existingImages[0].display_order + 1
        : 0;

    for (let i = 0; i < validImages.length; i++) {
      const file = validImages[i];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${gemId}/${startOrder + i}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("gems")
        .upload(filePath, file);

      if (!uploadError) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("gems").getPublicUrl(filePath);

        await supabase.from("gem_images").insert({
          gem_id: gemId,
          url: publicUrl,
          alt_text: `${title} - Image ${startOrder + i + 1}`,
          display_order: startOrder + i,
        });
      }
    }
  }

  // Handle image deletions
  const deletedImages = formData.get("deleted_images") as string;
  if (deletedImages) {
    const imageIds = JSON.parse(deletedImages) as string[];
    if (imageIds.length > 0) {
      await supabase.from("gem_images").delete().in("id", imageIds);
    }
  }

  revalidatePath("/seller/dashboard/listings");
  revalidatePath("/shop");
  redirect("/seller/dashboard/listings");
}

export async function deleteGem(gemId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/seller/login");

  // Delete images from storage
  const { data: images } = await supabase
    .from("gem_images")
    .select("url")
    .eq("gem_id", gemId);

  if (images) {
    const paths = images
      .map((img) => {
        const url = new URL(img.url);
        const pathParts = url.pathname.split("/storage/v1/object/public/gems/");
        return pathParts[1] || null;
      })
      .filter(Boolean) as string[];

    if (paths.length > 0) {
      await supabase.storage.from("gems").remove(paths);
    }
  }

  const { error } = await supabase
    .from("gems")
    .delete()
    .eq("id", gemId)
    .eq("seller_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/seller/dashboard/listings");
  revalidatePath("/shop");
}
