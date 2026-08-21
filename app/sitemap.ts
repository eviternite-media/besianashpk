import type { MetadataRoute } from "next";
import { products } from "../data/products";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://besianashpk.com";
  const pages = ["", "/produktet", "/artikuj", "/teknologjia", "/aprovimet", "/rreth-nesh", "/besiana", "/biznese", "/kontakt", "/privatesia", "/cookies"];
  return [
    ...pages.map((url) => ({ url: base + url, lastModified: new Date(), changeFrequency: "monthly" as const, priority: url === "" ? 1 : .7 })),
    ...products.map((product) => ({ url: `${base}/produktet/${product.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: .6 })),
    ...products.map((product) => ({ url: `${base}/artikuj/${product.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: .6 })),
  ];
}
