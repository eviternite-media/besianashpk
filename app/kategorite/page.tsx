import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "../../components/PageHero";
import { categories, products } from "../../data/products";

export const metadata: Metadata = {
  title: "Kategoritë e produkteve CYCLON",
  description: "Eksploroni 11 kategoritë dhe 307 produktet jo-detare CYCLON që BESIANA Sh.P.K. distribuuon në Kosovë.",
  alternates: { canonical: "/kategorite" },
};

export default function CategoriesPage() {
  return <main className="innerPage categoriesPage">
    <PageHero eyebrow="11 KATEGORI · 307 PRODUKTE · PA GAMËN DETARE" title="Zgjidhni sipas aplikimit." intro="Çdo kategori hap katalogun e plotë të filtruar. Prej aty mund ta ngushtoni zgjedhjen sipas gamës, gradës ose specifikimit." />
    <section className="categoriesDirectory"><div className="container categoryDirectoryGrid">
      {categories.map((category, index) => {
        const categoryProducts = products.filter((product) => product.category === category);
        const representative = categoryProducts.find((product) => product.image);
        const families = Array.from(new Set(categoryProducts.map((product) => product.family)));
        return <Link href={`/produktet?category=${encodeURIComponent(category)}`} className="categoryDirectoryCard" key={category}>
          <div className="categoryDirectoryImage">{representative?.image ? <Image src={representative.image} alt={representative.name} fill unoptimized sizes="(max-width: 700px) 90vw, 360px" /> : <span>CYCLON</span>}</div>
          <div><span>{String(index + 1).padStart(2, "0")}</span><small>{categoryProducts.length} produkte</small></div>
          <h2>{category}</h2><p>{families.join(" · ")}</p><strong>Hap kategorinë →</strong>
        </Link>;
      })}
    </div></section>
  </main>;
}
