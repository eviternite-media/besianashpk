import type { Metadata } from "next";
import SearchExperience from "../../components/SearchExperience";
import { products } from "../../data/products";

export const metadata: Metadata = {
  title: "Kërko produkte dhe artikuj",
  description: "Kërkoni në produktet, gradat, aprovimet, specifikimet dhe artikujt CYCLON të BESIANA Sh.P.K.",
  alternates: { canonical: "/kerko" },
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const query = await searchParams;
  return <main className="searchPage">
    <header className="searchPageHeader"><div className="container"><span>KËRKIMI I PLOTË</span><h1>Produktet dhe artikujt, në një kërkim.</h1></div></header>
    <section className="container searchPageBody"><SearchExperience products={products} initialQuery={query.q || ""} /></section>
  </main>;
}
