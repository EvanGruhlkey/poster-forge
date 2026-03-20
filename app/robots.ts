import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://posterarmory.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/app/", "/api/", "/auth/", "/download/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
