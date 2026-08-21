import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  approvedSpecifications,
  articleKeywords,
  performanceSpecifications,
  productBySlug,
  productCardDescription,
  productDescription,
  products,
} from "../../../data/products";

export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = productBySlug((await params).slug);
  if (!product) return {};
  return {
    title: product.name,
    description: productCardDescription(product),
    keywords: articleKeywords(product),
    alternates: { canonical: `/produktet/${product.slug}` },
    openGraph: { title: product.name, description: productCardDescription(product), images: product.image ? [{ url: product.image, alt: product.name }] : undefined },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = productBySlug((await params).slug);
  if (!product) notFound();
  const description = productDescription(product);
  const approvals = approvedSpecifications(product);
  const specifications = performanceSpecifications(product);
  const specificationIndex = approvals.length ? "03" : "02";
  const packagingIndex = approvals.length ? "04" : "03";
  const sourceIndex = approvals.length ? "05" : "04";
  const related = products.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 4);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image || product.officialImage,
    brand: { "@type": "Brand", name: "CYCLON" },
    description: description || productCardDescription(product),
    category: product.category,
    manufacturer: { "@type": "Organization", name: "LPC S.A." },
    additionalProperty: [
      ...(product.grade ? [{ "@type": "PropertyValue", name: "Grada", value: product.grade }] : []),
      ...product.specifications.slice(0, 20).map((value) => ({ "@type": "PropertyValue", name: "Specifikimi", value })),
    ],
  };

  return <main className="productPage">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <section className="productDetailHero"><div className="container productDetailGrid">
      <div className="productDetailVisual">
        <div className="productDetailBadge"><span>{product.family}</span><small>{product.category}</small></div>
        {product.image ? <Image src={product.image} alt={product.name} fill priority unoptimized sizes="(max-width: 850px) 90vw, 52vw" /> : <div className="imageMissing"><b>CYCLON</b><small>Imazhi zyrtar nuk u gjet</small></div>}
      </div>
      <div className="productDetailCopy">
        <nav className="breadcrumbs" aria-label="Gjurmët e faqes"><Link href="/">Ballina</Link><span>/</span><Link href="/produktet">Produktet</Link><span>/</span><span>{product.shortName}</span></nav>
        <div className="productDetailLabels"><span>{product.family}</span><span>{product.category}</span>{product.grade && <strong>{product.grade}</strong>}</div>
        <h1>{product.name}</h1>
        <p className="productLead">{productCardDescription(product)}</p>
        <dl className="productQuickFacts"><div><dt>Gama</dt><dd>{product.family}</dd></div><div><dt>Grada</dt><dd>{product.grade || "Nuk aplikohet"}</dd></div><div><dt>Paketimet</dt><dd>{product.packaging.length}</dd></div><div><dt>Të dhëna teknike</dt><dd>{product.specifications.length}</dd></div></dl>
        <div className="productDetailActions"><Link className="button buttonDark" href={`/kontakt?product=${encodeURIComponent(product.name)}`}>Kërko disponueshmërinë <span>→</span></Link><Link className="arrowLink" href={`/artikuj/${product.slug}`}>Lexo artikullin →</Link></div>
      </div>
    </div></section>

    <section className="productInformation"><div className="container productInformationGrid">
      <aside className="productInfoNav"><span>INFORMACIONI</span><a href="#pershkrimi">Përshkrimi</a>{approvals.length > 0 && <a href="#aprovimet">Aprovimet</a>}<a href="#specifikimet">Specifikimet</a><a href="#paketimi">Paketimi</a><a href="#burimi">Burimi zyrtar</a></aside>
      <div className="productInfoContent">
        <section id="pershkrimi"><span className="infoIndex">01 · PËRSHKRIMI</span><h2>Informacioni i produktit.</h2><p className="officialCopy">{description}</p></section>
        {approvals.length > 0 && <section id="aprovimet"><span className="infoIndex">02 · APROVIMET</span><h2>Aprovimet e publikuara.</h2><div className="specificationList approvedList">{approvals.map((item) => <span key={item}>{item}</span>)}</div></section>}
        <section id="specifikimet"><span className="infoIndex">{specificationIndex} · SPECIFIKIMET</span><h2>Standardet dhe nivelet e performancës.</h2>{specifications.length ? <div className="specificationList">{specifications.map((item) => <span key={item}>{item}</span>)}</div> : <div className="missingData">Nuk është publikuar listë e strukturuar specifikimesh për këtë produkt.</div>}{approvals.length > 0 && <p className="technicalCaution">Aprovimet, nivelet e performancës dhe rekomandimet nuk janë terma të barasvlershëm. Kontrolloni fletën teknike më të fundit para përdorimit.</p>}</section>
        <section id="paketimi"><span className="infoIndex">{packagingIndex} · PAKETIMI</span><h2>Madhësitë e publikuara.</h2>{product.packaging.length ? <div className="packagingGrid">{product.packaging.map((size) => <span key={size}>{size}</span>)}</div> : <div className="missingData">Paketimet nuk janë publikuar në burimin zyrtar.</div>}</section>
        <section id="burimi"><span className="infoIndex">{sourceIndex} · BURIMI ZYRTAR</span><div className="officialLinks">{product.tds && <a href={product.tds}>Fleta teknike zyrtare (TDS) →</a>}<a href={product.officialUrl}>Faqja zyrtare e produktit në CYCLON LPC →</a></div><p>Burimi i regjistruar për këtë produkt: <code>{product.officialUrl}</code></p></section>
      </div>
    </div></section>

    <section className="productContactBand"><div className="container"><div><span>BESIANA Sh.P.K. · CYCLON KOSOVË</span><h2>Konfirmoni produktin para porosisë.</h2></div><div><a href="tel:+38344303130">+383 44 303 130</a><Link className="button buttonLight" href={`/kontakt?product=${encodeURIComponent(product.name)}`}>Kontaktoni ekipin →</Link></div></div></section>

    <section className="relatedProducts"><div className="container"><div className="relatedHeading"><span>PRODUKTE TË LIDHURA</span><Link href={`/produktet?category=${encodeURIComponent(product.category)}`}>Shiko kategorinë →</Link></div><div className="relatedProductGrid">{related.map((item) => <Link href={`/produktet/${item.slug}`} key={item.slug}><div>{item.image ? <Image src={item.image} alt={item.name} fill unoptimized sizes="260px" /> : <span>CYCLON</span>}</div><small>{item.family} · {item.grade || item.type}</small><strong>{item.name}</strong><span>→</span></Link>)}</div></div></section>
  </main>;
}
