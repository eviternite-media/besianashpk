import type { MetadataRoute } from "next";
import { categories, products } from "../data/products";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.besianashpk.com";
  const pages = ["", "/produktet", "/artikuj", "/kategorite", "/keshilla", "/teknologjia", "/aprovimet", "/rreth-nesh", "/besiana", "/biznese", "/kontakt", "/privatesia", "/cookies"];
  return [
    ...pages.map((url) => ({ url: base + url, lastModified: new Date(), changeFrequency: "monthly" as const, priority: url === "" ? 1 : .7 })),
    ...categories.map((category) => ({ url: `${base}/produktet?category=${encodeURIComponent(category)}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: .7 })),
    ...products.map((product) => ({ url: `${base}/produktet/${product.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: .6 })),
    ...products.map((product) => ({ url: `${base}/artikuj/${product.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: .6 })),
  ];
}
