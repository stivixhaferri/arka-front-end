import { domain } from "@/lib/consts";
import { current } from "@/lib/consts";

export default async function sitemap() {
  const baseUrl = current;
  let propertyUrls = [];

  try {
    const res = await fetch(`${domain}property`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        const properties = data?.properties || [];

        propertyUrls = properties.map((property) => ({
          url: `${baseUrl}properties/${property.titleEn}_${property.city}_${property.category}_${property.propertyType}/${property.id}`,
          lastModified: property.updatedAt
            ? new Date(property.updatedAt).toISOString()
            : new Date().toISOString(),
          changeFrequency: "weekly",
          priority: 0.8,
        }));
      } else {
        console.error("Sitemap fetch did not return JSON:", contentType);
      }
    } else {
      console.error("Sitemap fetch failed:", res.status, res.statusText);
    }
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }

  const staticUrls = [
    {
      url: `${baseUrl}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}about`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  return [...staticUrls, ...propertyUrls];
}
