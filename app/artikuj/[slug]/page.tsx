import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  approvedSpecifications,
  articleExcerpt,
  articleKeywords,
  productArticleCopy,
  articleTags,
  articleTitle,
  performanceSpecifications,
  productBySlug,
  products,
} from "../../../data/products";

export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = productBySlug((await params).slug);
  if (!product) return {};
  const socialImage = product.image ? new URL(product.image, "https://www.besianashpk.com").toString() : null;
  return {
    title: articleTitle(product),
    description: articleExcerpt(product),
    keywords: articleKeywords(product),
    alternates: { canonical: `/artikuj/${product.slug}` },
    openGraph: { title: articleTitle(product), description: articleExcerpt(product), type: "article", url: `/artikuj/${product.slug}`, images: socialImage ? [{ url: socialImage, alt: product.name }] : [] },
    twitter: { card: socialImage ? "summary_large_image" : "summary", title: articleTitle(product), description: articleExcerpt(product), images: socialImage ? [socialImage] : [] },
  };
}

export default async function ProductArticle({ params }: { params: Promise<{ slug: string }> }) {
  const product = productBySlug((await params).slug);
  if (!product) notFound();
  const copy = productArticleCopy(product);
  const approvals = approvedSpecifications(product);
  const specifications = performanceSpecifications(product);
  const keywords = articleKeywords(product);
  const related = products.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 3);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: articleTitle(product),
        description: articleExcerpt(product),
        inLanguage: "sq",
        mainEntityOfPage: `https://www.besianashpk.com/artikuj/${product.slug}`,
        image: product.image ? new URL(product.image, "https://www.besianashpk.com").toString() : undefined,
        about: {
          "@type": "Thing",
          name: product.name,
          description: articleExcerpt(product),
          url: `https://www.besianashpk.com/produktet/${product.slug}`,
          image: product.image ? new URL(product.image, "https://www.besianashpk.com").toString() : undefined,
        },
        author: { "@type": "Organization", name: "BESIANA Sh.P.K.", url: "https://www.besianashpk.com/besiana" },
        publisher: { "@type": "Organization", name: "BESIANA Sh.P.K.", url: "https://www.besianashpk.com" },
        keywords: keywords.join(", "),
      },
      {
        "@type": "FAQPage",
        mainEntity: copy.faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
      },
    ],
  };

  return <main className="articlePage">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <article>
      <header className="articleDetailHero"><div className="container articleDetailHeroGrid">
        <div className="articleDetailCopy">
          <nav className="breadcrumbs darkBreadcrumbs" aria-label="Gjurmët e faqes"><Link href="/">Ballina</Link><span>/</span><Link href="/artikuj">Artikujt</Link><span>/</span><span>{product.shortName}</span></nav>
          <div className="articleDetailTags">{articleTags(product).map((tag) => <span key={tag}>{tag}</span>)}</div>
          <h1>{articleTitle(product)}</h1><p>{articleExcerpt(product)}</p>
          <div className="articleHeroContact"><span>KËSHILLË DHE DISPONUESHMËRI</span><a href="tel:+38344303130">+383 44 303 130 →</a></div>
        </div>
        <div className="articleDetailImage">{product.image ? <Image src={product.image} alt={product.name} fill priority unoptimized sizes="(max-width: 850px) 90vw, 42vw" /> : <span>CYCLON</span>}<small>{product.name}</small></div>
      </div></header>

      <div className="container articleReadingLayout">
        <aside className="articleReadingAside"><span>PËRMBLEDHJA</span><dl><div><dt>Produkti</dt><dd>{product.name}</dd></div><div><dt>Kategoria</dt><dd>{product.category}</dd></div><div><dt>Gama</dt><dd>{product.family}</dd></div>{product.grade && <div><dt>Grada</dt><dd>{product.grade}</dd></div>}<div><dt>Burimi</dt><dd>CYCLON LPC</dd></div></dl><Link href={`/produktet/${product.slug}`}>Faqja e produktit →</Link></aside>
        <div className="articleReadingContent">
          <section><span className="articleSectionNo">01 · HYRJE</span><h2>Çfarë është {product.name}?</h2>{copy.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>

          <section><span className="articleSectionNo">02 · FUNKSIONI</span><h2>Çfarë pune kryen?</h2>{copy.job.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>

          <section><span className="articleSectionNo">03 · RËNDËSIA</span><h2>Pse nevojitet?</h2>{copy.need.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>

          <section><span className="articleSectionNo">04 · AVANTAZHET</span><h2>Pse është zgjedhje e mirë?</h2><p>{copy.whyGood}</p><ul className="articleBenefitList">{copy.strengths.map((strength) => <li key={strength}>{strength}</li>)}</ul><p>{copy.specificationProfile}</p></section>

          <section><span className="articleSectionNo">05 · VERIFIKIMI</span><h2>Si kontrollohet përputhshmëria?</h2><p>Emri tregtar dhe grada nuk janë të mjaftueshme për të konfirmuar përdorimin. Krahasoni manualin e automjetit ose pajisjes me specifikimet e listuara nga CYCLON.</p><ol><li>Identifikoni sistemin dhe gradën e kërkuar nga prodhuesi.</li><li>Krahasoni standardin e manualit me listën zyrtare të produktit.</li>{approvals.length > 0 && <li>Dalloni aprovimin nga një nivel performance ose rekomandim.</li>}<li>Kontrolloni fletën teknike më të fundit para përdorimit.</li></ol></section>

          <section><span className="articleSectionNo">06 · TË DHËNAT TEKNIKE</span><h2>{approvals.length > 0 ? "Aprovimet dhe specifikimet e publikuara" : "Specifikimet e publikuara"}</h2>{approvals.length > 0 && <><h3>Aprovimet e publikuara</h3><div className="articleSpecTable">{approvals.map((item) => <div key={item}><span>APROVIM</span><strong>{item}</strong></div>)}</div></>}{specifications.length > 0 && <><h3>Standarde dhe nivele performance</h3><div className="articleSpecTable">{specifications.map((item) => <div key={item}><span>SPECIFIKIM</span><strong>{item}</strong></div>)}</div></>}{!product.specifications.length && <div className="missingData">CYCLON nuk ka publikuar një listë të strukturuar specifikimesh në burimin e aksesuar.</div>}{approvals.length > 0 && <p className="technicalCaution">Mos i interpretoni automatikisht të gjitha specifikimet si aprovime OEM. Statusi duhet lexuar saktë në dokumentacionin zyrtar.</p>}</section>

          <section><span className="articleSectionNo">07 · PAKETIMI</span><h2>Paketimet dhe dokumentacioni</h2>{product.packaging.length ? <table><thead><tr><th>Formati i publikuar</th><th>Disponueshmëria në Kosovë</th></tr></thead><tbody>{product.packaging.map((size) => <tr key={size}><td>{size}</td><td>Konfirmohet me BESIANA Sh.P.K.</td></tr>)}</tbody></table> : <div className="missingData">Paketimet nuk janë publikuar në burimin zyrtar.</div>}<div className="articleOfficialLinks">{product.tds && <a href={product.tds}>Hap fletën teknike zyrtare →</a>}<a href={product.officialUrl}>Hap faqen zyrtare të produktit →</a></div></section>

          <section><span className="articleSectionNo">08 · BLERJA NË KOSOVË</span><h2>Ku mund ta blini?</h2>{copy.buying.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>

          <section className="articleFaq"><span className="articleSectionNo">09 · PYETJE TË SHPESHTA</span><h2>Pyetje për {product.shortName}</h2>{copy.faq.map((item) => <div key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></div>)}</section>
        </div>
      </div>

      <section className="articleRecommendations"><div className="container"><div className="relatedHeading"><span>ARTIKUJ TË LIDHUR</span><Link href="/artikuj">Të gjithë artikujt →</Link></div><div className="articleRecommendationGrid">{related.map((item) => <Link href={`/artikuj/${item.slug}`} key={item.slug}><div>{item.image ? <Image src={item.image} alt={item.name} fill unoptimized sizes="320px" /> : <span>CYCLON</span>}</div><small>{item.category} · {item.family}</small><h3>{articleTitle(item)}</h3><strong>Lexo artikullin →</strong></Link>)}</div></div></section>

      <section className="articleFinalRecommendation"><div className="container"><span>REKOMANDIMI PËRFUNDIMTAR</span><h2>BESIANA Sh.P.K. · CYCLON KOSOVË</h2><p>{copy.recommendation}</p><div><a href="tel:+38344303130">+383 44 303 130 →</a><Link href={`/kontakt?product=${encodeURIComponent(product.name)}`}>Kërko {product.shortName} →</Link></div></div></section>
    </article>
  </main>;
}
