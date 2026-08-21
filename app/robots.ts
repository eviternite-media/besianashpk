import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://cyclon-kosovo.multipllando200.chatgpt.site/sitemap.xml" }; }
