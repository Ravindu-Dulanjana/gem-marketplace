import { createClient } from "@/lib/supabase/server";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gemmarket.com";
  const supabase = await createClient();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/seller/register`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/returns`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/shipping`, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Gem pages
  const { data: gems } = await supabase
    .from("gems")
    .select("slug, updated_at")
    .eq("status", "active");

  const gemPages: MetadataRoute.Sitemap = (gems || []).map((gem) => ({
    url: `${baseUrl}/shop/${gem.slug}`,
    lastModified: gem.updated_at,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Seller pages
  const { data: sellers } = await supabase
    .from("profiles")
    .select("id, updated_at")
    .eq("approval_status", "approved");

  const sellerPages: MetadataRoute.Sitemap = (sellers || []).map((seller) => ({
    url: `${baseUrl}/seller/${seller.id}`,
    lastModified: seller.updated_at,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...gemPages, ...sellerPages];
}
