"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export type CategorySeries = {
  name: string;
  description: string;
  image: string | null;
  productName: string;
  href: string;
};

export type CategoryExplorerItem = {
  name: string;
  count: number;
  href: string;
  description: string;
  series: CategorySeries[];
};

export default function CategoryExplorer({ items }: { items: CategoryExplorerItem[] }) {
  const [active, setActive] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(0);
  const selected = items[active];

  return <div className="categoryExplorer">
    <div className="categoryRail" role="tablist" aria-label="Kategoritë e produkteve">
      {items.map((item, index) => <div className="categoryRailItem" key={item.name}>
        <button
          type="button"
          role="tab"
          aria-selected={active === index}
          aria-controls="category-series-panel"
          className={active === index ? "isActive" : ""}
          onMouseEnter={() => setActive(index)}
          onFocus={() => setActive(index)}
          onClick={() => { setActive(index); setMobileOpen(mobileOpen === index ? -1 : index); }}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{item.name}</strong>
          <small>{item.count} produkte</small>
          <i aria-hidden="true">→</i>
        </button>
        {mobileOpen === index && <div className="categoryMobilePanel">
          <p>{item.description}</p>
          <Link className="categoryAllLink" href={item.href}>Shiko të gjitha {item.count} produktet <span>→</span></Link>
          <SeriesGrid series={item.series} />
        </div>}
      </div>)}
    </div>

    <section className="categorySeriesPanel" id="category-series-panel" role="tabpanel" aria-label={selected.name}>
      <div className="categoryPanelHead" key={selected.name}>
        <div><span>ZGJEDHJA SIPAS KATEGORISË</span><h3>{selected.name}</h3><Link className="categoryAllLink" href={selected.href}>Shiko të gjitha {selected.count} produktet <span>→</span></Link></div>
        <p>{selected.description}</p>
      </div>
      <SeriesGrid series={selected.series} />
    </section>
  </div>;
}

function SeriesGrid({ series }: { series: CategorySeries[] }) {
  return <div className="seriesGrid">
    {series.map((item, index) => <Link className={`seriesCard${index === 0 ? " seriesPrimary" : ""}`} href={item.href} key={item.name}>
      <div className="seriesImage">
        {item.image
          ? <Image src={item.image} alt={item.productName} fill unoptimized sizes="(max-width: 760px) 44vw, 220px" />
          : <span>CYCLON</span>}
      </div>
      <div className="seriesCopy">
        <small>{index === 0 ? "ZGJEDHJA KRYESORE" : "GAMA"}</small>
        <strong>{item.name}</strong>
        <p>{item.description}</p>
        <span>Shiko koleksionin →</span>
      </div>
    </Link>)}
  </div>;
}
