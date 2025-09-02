import { domain } from "@/lib/consts";
import { current } from "@/lib/consts";

export default async function sitemap() {
  const res = await fetch(`${domain}property`, {
    next: { revalidate: 60 } 
  });
  const data = await res.json();
  const baseUrl = current;

  const propertyUrls = data.properties.map((property) => ({
    url: `${baseUrl}properties/${property.titleEn}_${property.city}_${property.category}_${property.propertyType}/${property.id}`,
    lastModified: property.updatedAt
      ? new Date(property.updatedAt).toISOString()
      : new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.8
  }));

  const staticUrls = [
    {
      url: `${baseUrl}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${baseUrl}about`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.7
    }
  ];

  return [...staticUrls, ...propertyUrls];
}
