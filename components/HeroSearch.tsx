"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { articleTitle, normalizeSearchText, productSearchText, type Product } from "../data/products";

type Suggestion = { id: string; label: string; meta: string; href: string; kind: "Produkt" | "Artikull" };

export default function HeroSearch({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const needle = normalizeSearchText(query);
  const matches = useMemo(() => needle ? products.filter((product) => productSearchText(product).includes(needle)).slice(0, 4) : [], [needle, products]);
  const suggestions = useMemo<Suggestion[]>(() => [
    ...matches.map((product) => ({ id: `p-${product.slug}`, label: product.name, meta: product.grade || product.category, href: `/produktet/${product.slug}`, kind: "Produkt" as const })),
    ...matches.slice(0, 2).map((product) => ({ id: `a-${product.slug}`, label: articleTitle(product), meta: product.family, href: `/artikuj/${product.slug}`, kind: "Artikull" as const })),
  ], [matches]);

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && suggestions.length) { event.preventDefault(); setActive((value) => Math.min(value + 1, suggestions.length - 1)); }
    if (event.key === "ArrowUp" && suggestions.length) { event.preventDefault(); setActive((value) => Math.max(value - 1, 0)); }
    if (event.key === "Escape") { setActive(-1); input.current?.blur(); }
    if (event.key === "Enter" && active >= 0) { event.preventDefault(); window.location.href = suggestions[active].href; }
  }

  return <div className="heroSearchShell">
    <form className="heroSearch" action="/kerko" role="search">
      <label className="srOnly" htmlFor="hero-search">Kërko produkt ose artikull</label>
      <span className="heroSearchIcon" aria-hidden="true" />
      <input ref={input} id="hero-search" name="q" type="search" role="combobox" value={query} onChange={(event) => { setQuery(event.target.value); setActive(-1); }} onKeyDown={onKeyDown} placeholder="Kërko produkt, viskozitet ose aprovim..." autoComplete="off" aria-autocomplete="list" aria-expanded={Boolean(needle && suggestions.length)} aria-controls="hero-search-suggestions" aria-activedescendant={active >= 0 ? suggestions[active]?.id : undefined} />
      {query && <button className="heroSearchClear" type="button" onClick={() => { setQuery(""); setActive(-1); input.current?.focus(); }}>Pastro</button>}
      <button className="heroSearchSubmit" type="submit" aria-label="Shfaq rezultatet">→</button>
    </form>
    {needle && <div className="heroSuggestions" id="hero-search-suggestions" role="listbox">
      {suggestions.length ? suggestions.map((item, index) => <Link id={item.id} role="option" aria-selected={active === index} className={active === index ? "isActive" : ""} href={item.href} key={item.id}><span>{item.kind}</span><strong>{item.label}</strong><small>{item.meta}</small><i aria-hidden="true">→</i></Link>) : <div className="heroSuggestionEmpty"><strong>Nuk u gjet rezultat.</strong><span>Provoni një emër, gradë ose specifikim tjetër.</span></div>}
    </div>}
  </div>;
}
