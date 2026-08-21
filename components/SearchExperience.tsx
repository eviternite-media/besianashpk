"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  articleExcerpt,
  articleTags,
  articleTitle,
  normalizeSearchText,
  productCardDescription,
  productSearchText,
  type Product,
} from "../data/products";

function Highlight({ text, query }: { text: string; query: string }) {
  const needle = query.trim();
  if (!needle) return <>{text}</>;
  const viscosity = needle.match(/^(\d+)\s*w\s*-?\s*(\d+)$/i);
  const pattern = viscosity
    ? `${viscosity[1]}\\s*W\\s*-?\\s*${viscosity[2]}`
    : needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${pattern})`, "ig"));
  return <>{parts.map((part, index) => normalizeSearchText(part) === normalizeSearchText(needle)
    ? <mark key={`${part}-${index}`}>{part}</mark>
    : part)}</>;
}

export default function SearchExperience({ products, initialQuery = "" }: { products: Product[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const needle = normalizeSearchText(query);

  const matches = useMemo(() => needle
    ? products.filter((product) => productSearchText(product).includes(needle))
    : [], [needle, products]);
  const suggestions = matches.slice(0, 6);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (query.trim()) url.searchParams.set("q", query.trim());
    else url.searchParams.delete("q");
    window.history.replaceState({}, "", `${url.pathname}${url.search}`);
  }, [query]);

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!suggestions.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSuggestion((value) => Math.min(value + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestion((value) => Math.max(value - 1, 0));
    } else if (event.key === "Enter" && activeSuggestion >= 0) {
      event.preventDefault();
      window.location.href = `/produktet/${suggestions[activeSuggestion].slug}`;
    } else if (event.key === "Escape") {
      setActiveSuggestion(-1);
      inputRef.current?.blur();
    }
  }

  return <div className="searchExperience">
    <div className="searchBox">
      <label htmlFor="site-search">KËRKO NË KATALOG DHE ARTIKUJ</label>
      <div>
        <span aria-hidden="true">⌕</span>
        <input
          ref={inputRef}
          id="site-search"
          type="search"
          value={query}
          onChange={(event) => { setQuery(event.target.value); setActiveSuggestion(-1); }}
          onKeyDown={onKeyDown}
          placeholder="Produkt, 5W-30, VW 507.00, EVO…"
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-activedescendant={activeSuggestion >= 0 ? `suggestion-${activeSuggestion}` : undefined}
        />
        {query && <button type="button" onClick={() => { setQuery(""); inputRef.current?.focus(); }} aria-label="Pastro kërkimin">Pastro</button>}
      </div>
      {needle && suggestions.length > 0 && <div className="searchSuggestions" id="search-suggestions" role="listbox">
        {suggestions.map((product, index) => <Link
          id={`suggestion-${index}`}
          role="option"
          aria-selected={activeSuggestion === index}
          className={activeSuggestion === index ? "isActive" : ""}
          href={`/produktet/${product.slug}`}
          key={product.slug}
        >
          <span>{product.family}</span>
          <strong><Highlight text={product.name} query={query} /></strong>
          <small>{product.grade || product.category}</small>
        </Link>)}
      </div>}
    </div>

    {!needle && <div className="searchWelcome">
      <span>{products.length} PRODUKTE · {products.length} ARTIKUJ · PA GAMËN MARINE</span>
      <h2>Gjeni produktin nga emri, grada ose standardi teknik.</h2>
      <p>Provoni “EVO”, “5W-30”, “ACEA C3” ose një aprovim të listuar nga CYCLON.</p>
    </div>}

    {needle && matches.length > 0 && <div className="searchResults" aria-live="polite">
      <section>
        <div className="resultsHeading"><span>PRODUKTET</span><strong>{matches.length}</strong></div>
        <div className="searchProductGrid">
          {matches.slice(0, 24).map((product) => <article className="searchProductCard" key={product.slug}>
            <Link className="searchProductImage" href={`/produktet/${product.slug}`}>
              {product.image ? <Image src={product.image} alt={product.name} fill unoptimized sizes="240px" /> : <span>CYCLON</span>}
            </Link>
            <small>{product.category} · {product.family}</small>
            <h3><Link href={`/produktet/${product.slug}`}><Highlight text={product.name} query={query} /></Link></h3>
            <p>{productCardDescription(product)}</p>
            <Link className="arrowLink" href={`/produktet/${product.slug}`}>Shiko produktin →</Link>
          </article>)}
        </div>
        {matches.length > 24 && <p className="resultLimit">Po shfaqen 24 rezultatet e para. Përdorni një term më specifik për ta ngushtuar kërkimin.</p>}
      </section>

      <section>
        <div className="resultsHeading"><span>ARTIKUJT E LIDHUR</span><strong>{matches.length}</strong></div>
        <div className="searchArticleList">
          {matches.slice(0, 12).map((product) => <Link href={`/artikuj/${product.slug}`} key={product.slug}>
            <div className="searchArticleThumb">{product.image ? <Image src={product.image} alt="" fill unoptimized sizes="100px" /> : <span>CYCLON</span>}</div>
            <div><small>{articleTags(product).join(" · ")}</small><h3><Highlight text={articleTitle(product)} query={query} /></h3><p>{articleExcerpt(product)}</p></div>
            <span aria-hidden="true">→</span>
          </Link>)}
        </div>
      </section>
    </div>}

    {needle && !matches.length && <div className="searchEmpty" role="status">
      <span>0 REZULTATE</span><h2>Nuk gjetëm përputhje për “{query}”.</h2>
      <p>Kontrolloni shkrimin, provoni vetëm gradën ose një pjesë të emrit, ose kërkoni ndihmë nga BESIANA Sh.P.K.</p>
      <div><button type="button" className="button buttonDark" onClick={() => setQuery("")}>Pastro kërkimin</button><Link className="button buttonOutline" href="/kontakt">Na kontaktoni</Link></div>
    </div>}
  </div>;
}
