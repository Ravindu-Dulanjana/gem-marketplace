import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gemmarket.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/seller/dashboard/", "/admin/", "/api/", "/auth/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
