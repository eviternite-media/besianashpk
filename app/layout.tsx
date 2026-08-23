import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Barlow_Semi_Condensed, Geist_Mono, Inter } from "next/font/google";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import "./globals.css";

const bodyFont = Inter({ variable: "--font-body", subsets: ["latin"], display: "swap" });
const displayFont = Barlow_Semi_Condensed({ variable: "--font-display", subsets: ["latin"], weight: "800", style: "italic", display: "swap" });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.besianashpk.com"),
  applicationName: "BESIANA Sh.P.K.",
  title: { default: "BESIANA Sh.P.K.", template: "%s | BESIANA Sh.P.K." },
  description: "Lubrifikantë profesionalë CYCLON në Kosovë. Distributor zyrtar: BESIANA Sh.P.K.",
  icons: {
    icon: [{ url: "/favicon-besiana-144.png", type: "image/png", sizes: "144x144" }],
    shortcut: ["/favicon-besiana-144.png"],
    apple: [{ url: "/favicon-besiana-144.png", sizes: "144x144", type: "image/png" }],
  },
  openGraph: { siteName: "BESIANA Sh.P.K.", url: "/", title: "BESIANA Sh.P.K.", description: "Distributor zyrtar i CYCLON Lubricants në Kosovë.", locale: "sq_AL", type: "website", images: [{ url: "/og.png", width: 1200, height: 630, alt: "BESIANA Sh.P.K. — Distributor zyrtar i CYCLON në Kosovë" }] },
  twitter: { card: "summary_large_image", title: "BESIANA Sh.P.K.", description: "Distributor zyrtar i CYCLON Lubricants në Kosovë.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationSchema = { "@context": "https://schema.org", "@graph": [
    { "@type": "WebSite", "@id": "https://www.besianashpk.com/#website", url: "https://www.besianashpk.com/", name: "BESIANA Sh.P.K.", alternateName: "CYCLON Kosovo", publisher: { "@id": "https://www.besianashpk.com/#organization" } },
    { "@type": "Organization", "@id": "https://www.besianashpk.com/#organization", url: "https://www.besianashpk.com/", name: "BESIANA Sh.P.K.", alternateName: "CYCLON Kosovo", logo: { "@type": "ImageObject", url: "https://www.besianashpk.com/images/besiana-logo-2026.png", width: 1254, height: 1254 }, image: "https://www.besianashpk.com/images/besiana-logo-2026.png", email: "besiana.llc@gmail.com", telephone: ["+38344303130", "+38344241118"], description: "Distributor zyrtar i CYCLON Lubricants për Kosovë." },
    { "@type": "LocalBusiness", "@id": "https://www.besianashpk.com/#localbusiness", url: "https://www.besianashpk.com/", name: "BESIANA Sh.P.K.", alternateName: "CYCLON Kosovo", logo: "https://www.besianashpk.com/images/besiana-logo-2026.png", image: "https://www.besianashpk.com/images/besiana-logo-2026.png", email: "besiana.llc@gmail.com", telephone: "+38344303130", areaServed: { "@type": "Country", name: "Kosovë" } },
  ] };
  return <html lang="sq"><body className={`${bodyFont.variable} ${displayFont.variable} ${mono.variable}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
    <SiteHeader />
    {children}
    <footer className="footer"><div className="container footerTop"><div className="footerIdentity"><strong>BESIANA Sh.P.K.</strong><p>Distributor i CYCLON për Kosovë.<br />Produkte profesionale. Mbështetje lokale.</p></div><div className="footerCols"><div><h4>Eksploro</h4><Link href="/produktet">Produktet</Link><Link href="/artikuj">Artikujt</Link><Link href="/rreth-nesh">Rreth nesh</Link><Link href="/kontakt">Kontakti</Link></div><div><h4>Kontakti</h4><a href="tel:+38344303130">+383 44 303 130</a><a href="tel:+38344241118">+383 44 241 118</a><a href="mailto:besiana.llc@gmail.com">besiana.llc@gmail.com</a></div></div></div><div className="container footerBottom"><span>© 2026 BESIANA Sh.P.K.</span><div><Link href="/privatesia">Privatësia</Link><Link href="/cookies">Cookies</Link></div></div></footer>
    <Analytics />
  </body></html>;
}
