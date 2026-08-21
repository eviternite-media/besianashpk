"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { articleExcerpt, articleTags, articleTitle, normalizeSearchText, productSearchText, type Product } from "../data/products";

const PAGE_SIZE = 24;

export default function ArticleDirectory({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Të gjitha");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const categories = ["Të gjitha", ...Array.from(new Set(products.map((product) => product.category))).sort()];
  const filtered = useMemo(() => {
    const needle = normalizeSearchText(query);
    return products.filter((product) => (category === "Të gjitha" || product.category === category) && (!needle || productSearchText(product).includes(needle)));
  }, [products, query, category]);

  function reset() { setQuery(""); setCategory("Të gjitha"); setVisible(PAGE_SIZE); }

  return <div className="articlesIndex">
    <div className="articleFilters">
      <label><span>KËRKO ARTIKULL</span><div><i aria-hidden="true">⌕</i><input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setVisible(PAGE_SIZE); }} placeholder="Emri, grada, specifikimi ose tema" />{query && <button type="button" onClick={() => setQuery("")}>Pastro</button>}</div></label>
      <label><span>KATEGORIA</span><select value={category} onChange={(event) => { setCategory(event.target.value); setVisible(PAGE_SIZE); }}>{categories.map((value) => <option key={value}>{value}</option>)}</select></label>
    </div>
    <div className="catalogueMeta"><span><strong>{filtered.length}</strong> artikuj produktesh · vetëm për gamën jo-detare</span><button type="button" onClick={reset}>Pastro filtrat</button></div>
    <div className="articleCardGrid">
      {filtered.slice(0, visible).map((product) => <Link className="articleCard" href={`/artikuj/${product.slug}`} key={product.slug}>
        <article>
          <div className="articleCardImage">{product.image ? <Image src={product.image} alt={product.name} fill unoptimized sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 400px" /> : <span>CYCLON</span>}<b>{product.category}</b></div>
          <div className="articleCardBody"><div className="articleCardTags">{articleTags(product).slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div><h2>{articleTitle(product)}</h2><p>{articleExcerpt(product)}</p><strong>Lexo artikullin <span>→</span></strong></div>
        </article>
      </Link>)}
    </div>
    {visible < filtered.length && <div className="loadMore"><button className="button buttonOutline" type="button" onClick={() => setVisible((value) => value + PAGE_SIZE)}>Shfaq edhe {Math.min(PAGE_SIZE, filtered.length - visible)} artikuj</button><span>{visible} nga {filtered.length}</span></div>}
    {!filtered.length && <div className="emptyState"><span>0 REZULTATE</span><h2>Nuk u gjet asnjë artikull.</h2><p>Provoni një emër produkti, gradë tjetër ose hiqni filtrin e kategorisë.</p><button className="button buttonDark" type="button" onClick={reset}>Pastro filtrat</button></div>}
  </div>;
}
