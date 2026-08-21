import type { Metadata } from "next";
import PageHero from "../../components/PageHero";
import ArticleDirectory from "../../components/ArticleDirectory";
import { products } from "../../data/products";

export const metadata: Metadata = {
  title: "Artikujt për produktet CYCLON",
  description: "Artikuj në shqip për çdo produkt CYCLON jo-marin, me udhëzime për përdorim, specifikime dhe kontaktin e BESIANA Sh.P.K.",
  alternates: { canonical: "/artikuj" },
};

export default function ArticlesPage() {
  return <main className="innerPage">
    <PageHero eyebrow="Qendra e njohurive" title="Një artikull për çdo produkt." intro={`${products.length} artikuj në shqip për gamën CYCLON që shpërndahet përmes BESIANA Sh.P.K. në Kosovë. Çdo faqe ka fokus të veçantë, specifikime të lidhura me produktin dhe thirrje të drejtpërdrejtë për kontakt.`} />
    <section className="articlesIndexSection"><div className="container"><ArticleDirectory products={products} /></div></section>
  </main>;
}
