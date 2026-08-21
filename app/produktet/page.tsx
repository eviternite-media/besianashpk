import type { Metadata } from "next";
import PageHero from "../../components/PageHero";
import ProductCatalogue from "../../components/ProductCatalogue";
import { categories, families, products } from "../../data/products";

export const metadata: Metadata = {
  title: "Të gjitha produktet CYCLON",
  description: "Katalogu i plotë në shqip me produktet CYCLON për Kosovë, pa gamën marine. Distributor: BESIANA Sh.P.K.",
};

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ family?: string; category?: string; grade?: string; q?: string }> }) {
  const query = await searchParams;
  const initialFamily = families.includes(query.family || "") ? query.family! : "Të gjitha";
  const initialCategory = categories.includes(query.category || "") ? query.category! : "Të gjitha";
  const availableGrades = Array.from(new Set(products.map((product) => product.grade).filter(Boolean)));
  const initialGrade = availableGrades.includes(query.grade || "") ? query.grade! : "Të gjitha";
  return <main className="innerPage">
    <PageHero eyebrow="Katalogu CYCLON · Kosovë" title="Të gjitha produktet. Në një vend." intro={`${products.length} produkte për vetura, kamionë, motoçikleta, transmisione, bujqësi, industri, ndërtimtari, gjeneratorë dhe mirëmbajtje. Produktet marine dhe për përdorim në ujë nuk përfshihen.`} />
    <section className="catalogueSection"><div className="container"><ProductCatalogue products={products} initialFamily={initialFamily} initialCategory={initialCategory} initialGrade={initialGrade} initialQuery={query.q || ""} /></div></section>
  </main>;
}
