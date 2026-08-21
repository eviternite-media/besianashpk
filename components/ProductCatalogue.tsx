"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { approvedSpecifications, families as selectableFamilies, normalizeSearchText, productCardDescription, productSearchText, type Product } from "../data/products";

const PAGE_SIZE = 36;

export default function ProductCatalogue({
  products,
  initialFamily = "Të gjitha",
  initialCategory = "Të gjitha",
  initialGrade = "Të gjitha",
  initialQuery = "",
}: {
  products: Product[];
  initialFamily?: string;
  initialCategory?: string;
  initialGrade?: string;
  initialQuery?: string;
}) {
  const initialFamilyIsAvailable = initialFamily === "Të gjitha" || (
    selectableFamilies.includes(initialFamily)
    && products.some((product) => product.family === initialFamily && (initialCategory === "Të gjitha" || product.category === initialCategory))
  );
  const safeInitialFamily = initialFamilyIsAvailable ? initialFamily : "Të gjitha";
  const initialGradeIsAvailable = initialGrade === "Të gjitha" || products.some((product) =>
    product.grade === initialGrade
    && (initialCategory === "Të gjitha" || product.category === initialCategory)
    && (safeInitialFamily === "Të gjitha" || product.family === safeInitialFamily),
  );
  const [query, setQuery] = useState(initialQuery);
  const [family, setFamily] = useState(safeInitialFamily);
  const [grade, setGrade] = useState(initialGradeIsAvailable ? initialGrade : "Të gjitha");
  const [category, setCategory] = useState(initialCategory);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const categories = ["Të gjitha", ...Array.from(new Set(products.map((product) => product.category))).sort()];
  const families = useMemo(() => [
    "Të gjitha",
    ...selectableFamilies.filter((value) => products.some((product) =>
      product.family === value && (category === "Të gjitha" || product.category === category),
    )),
  ], [products, category]);
  const grades = useMemo(() => [
    "Të gjitha",
    ...Array.from(new Set(products
      .filter((product) =>
        (category === "Të gjitha" || product.category === category)
        && (family === "Të gjitha" || product.family === family),
      )
      .map((product) => product.grade)
      .filter(Boolean) as string[]))
      .sort((left, right) => left.localeCompare(right, undefined, { numeric: true })),
  ], [products, category, family]);

  const filtered = useMemo(() => {
    const needle = normalizeSearchText(query);
    return products.filter((product) =>
      (family === "Të gjitha" || product.family === family)
      && (grade === "Të gjitha" || product.grade === grade)
      && (category === "Të gjitha" || product.category === category)
      && (!needle || productSearchText(product).includes(needle)),
    );
  }, [products, query, family, grade, category]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const set = (key: string, value: string) => value === "Të gjitha" || !value ? url.searchParams.delete(key) : url.searchParams.set(key, value);
    set("q", query.trim()); set("family", family); set("grade", grade); set("category", category);
    window.history.replaceState({}, "", `${url.pathname}${url.search}`);
  }, [query, family, grade, category]);

  const clear = () => { setQuery(""); setFamily("Të gjitha"); setGrade("Të gjitha"); setCategory("Të gjitha"); };

  return <div className="catalogue">
    <div className="catalogueToolbar">
      <label className="catalogueSearch" htmlFor="catalogue-search"><span>KËRKO PRODUKT, GRADË OSE SPECIFIKIM</span><div><i aria-hidden="true">⌕</i><input id="catalogue-search" type="search" value={query} onChange={(event) => { setQuery(event.target.value); setVisible(PAGE_SIZE); }} placeholder="p.sh. 5W-30, HLP ose VW 507.00" />{query && <button type="button" onClick={() => { setQuery(""); setVisible(PAGE_SIZE); }}>Pastro</button>}</div></label>
      <div className="catalogueFilters">
        <label>KATEGORIA<select value={category} onChange={(event) => {
          const nextCategory = event.target.value;
          const familyStillExists = family === "Të gjitha" || products.some((product) => product.category === nextCategory && product.family === family);
          setCategory(nextCategory);
          if (nextCategory !== "Të gjitha" && !familyStillExists) setFamily("Të gjitha");
          setGrade("Të gjitha");
          setVisible(PAGE_SIZE);
        }}>{categories.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>GAMA<select value={family} onChange={(event) => { setFamily(event.target.value); setGrade("Të gjitha"); setVisible(PAGE_SIZE); }}>{families.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>GRADA<select value={grade} onChange={(event) => { setGrade(event.target.value); setVisible(PAGE_SIZE); }}>{grades.map((value) => <option key={value}>{value}</option>)}</select></label>
      </div>
    </div>

    <div className="catalogueMeta"><span><strong>{filtered.length}</strong> produkte të gjetura · pa produkte marine</span><button type="button" onClick={clear}>Pastro të gjithë filtrat</button></div>

    <div className="productCardGrid">
      {filtered.slice(0, visible).map((product) => {
        const approvals = approvedSpecifications(product);
        const preview = (approvals.length ? approvals : product.specifications).slice(0, 3);
        return <article className="productCard" key={product.slug}>
          <Link className="productCardImage" href={`/produktet/${product.slug}`} aria-label={`Shiko ${product.name}`}>
            <span>{product.family}</span>
            {product.image ? <Image src={product.image} alt={product.name} fill unoptimized sizes="(max-width: 600px) 45vw, (max-width: 1100px) 30vw, 300px" /> : <div className="imageMissing"><b>CYCLON</b><small>Imazhi zyrtar nuk u gjet</small></div>}
          </Link>
          <div className="productCardBody">
            <div className="productCardMeta"><span>{product.category}</span>{product.grade && <strong>{product.grade}</strong>}</div>
            <h2><Link href={`/produktet/${product.slug}`}>{product.name}</Link></h2>
            <p>{productCardDescription(product)}</p>
            <div className="productCardSpecs">{preview.length ? preview.map((specification) => <span key={specification}>{specification}</span>) : <span>Nuk ka specifikime të publikuara</span>}</div>
            <div className="productCardLinks"><Link href={`/produktet/${product.slug}`}>Detajet e produktit →</Link><Link href={`/artikuj/${product.slug}`}>Artikulli →</Link></div>
          </div>
        </article>;
      })}
    </div>

    {visible < filtered.length && <div className="loadMore"><button className="button buttonOutline" type="button" onClick={() => setVisible((value) => value + PAGE_SIZE)}>Shfaq edhe {Math.min(PAGE_SIZE, filtered.length - visible)} produkte</button><span>{visible} nga {filtered.length}</span></div>}
    {!filtered.length && <div className="emptyState"><span>0 REZULTATE</span><h2>Nuk u gjet asnjë produkt.</h2><p>Ndryshoni filtrat ose kontaktoni BESIANA Sh.P.K. për ndihmë.</p><button className="button buttonDark" type="button" onClick={clear}>Pastro filtrat</button></div>}
  </div>;
}
