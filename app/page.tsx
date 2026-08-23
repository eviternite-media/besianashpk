import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import CategoryExplorer, { type CategoryExplorerItem } from "../components/CategoryExplorer";
import ScrollReveal from "../components/ScrollReveal";
import { articleExcerpt, articleTags, articleTitle, categories, products } from "../data/products";

export const metadata: Metadata = {
  title: { absolute: "BESIANA Sh.P.K." },
  description: "Katalogu CYCLON për Kosovë me produkte jo-detare, të dhëna teknike, artikuj dhe kontakt të drejtpërdrejtë me BESIANA Sh.P.K.",
  alternates: { canonical: "/" },
};

const categoryDescriptions: Record<string, string> = {
  "Vetura dhe automjete të lehta": "Vajra motori për vetura moderne, hibride dhe automjete të lehta, të ndara sipas gamës dhe gradës.",
  "Kamionë dhe automjete të rënda": "Lubrifikantë për motorë komercialë, flota dhe punë të rëndë me specifikime të verifikueshme.",
  Motoçikleta: "Vajra për motorë 2T dhe 4T, përdorim rrugor, sportiv dhe profesional.",
  Transmision: "Vajra transmisioni, ATF dhe lëngje për kuti e diferenciale sipas kërkesës së prodhuesit.",
  Bujqësi: "Zgjidhje për traktorë, korrëse dhe sisteme të makinerive bujqësore.",
  Kopshtari: "Lubrifikantë për motorë të vegjël, zinxhirë dhe pajisje të kopshtit.",
  Ndërtimtari: "Produkte për pajisje jashtë rruge dhe makineri që punojnë nën ngarkesë.",
  "Prodhim energjie": "Lubrifikantë për gjeneratorë dhe njësi të prodhimit të energjisë.",
  Industri: "Portofol industrial për hidraulikë, kompresorë, ingranazhe dhe procese prodhuese.",
  Graso: "Graso të klasave dhe formulimeve të ndryshme për kushineta, nyje dhe mekanizma.",
  "Lëngje teknike": "Lëngje frenash, ftohës, pastrues dhe produkte të tjera teknike për mirëmbajtje.",
};

const seriesDescriptions: Record<string, string> = {
  EVO: "Performancë maksimale. Mbrojtje e avancuar.",
  ECO: "Zgjedhje efikase. Kosto e optimizuar.",
  PRO: "Besueshmëri profesionale. Për çdo ditë.",
  MAX: "Teknologji maksimale. Mbrojtje ekstreme.",
  CYCLON: "Gama e specializuar CYCLON për aplikime teknike dhe industriale.",
};

function buildCategoryItems(): CategoryExplorerItem[] {
  return categories.map((category) => {
    const categoryProducts = products.filter((product) => product.category === category);
    const availableFamilies = ["EVO", "ECO", "PRO", "MAX", "CYCLON"].filter((family) => categoryProducts.some((product) => product.family === family));
    return {
      name: category,
      count: categoryProducts.length,
      href: `/produktet?category=${encodeURIComponent(category)}`,
      description: categoryDescriptions[category] || "Produkte CYCLON të organizuara sipas aplikimit dhe dokumentacionit teknik.",
      series: availableFamilies.slice(0, 4).map((family) => {
        const representative = categoryProducts.find((product) => product.family === family && product.image) || categoryProducts.find((product) => product.family === family)!;
        return { name: family, description: seriesDescriptions[family], image: representative.image || null, productName: representative.name, href: `/produktet?category=${encodeURIComponent(category)}&family=${encodeURIComponent(family)}` };
      }),
    };
  });
}

export default function Home() {
  const heroProduct = products.find((product) => product.slug === "cyclon-evo-v1-ll-0w-30")!;
  const spotlightProduct = products.find((product) => product.slug === "cyclon-pro-v1-ll-5w-30")!;
  const featuredSlugs = ["cyclon-evo-v1-ll-0w-30", "cyclon-eco-r-2-ultra-s-0w-20", "cyclon-pro-v1-ll-5w-30", "cyclon-max-x-100-5w-40"];
  const featured = featuredSlugs.map((slug) => products.find((product) => product.slug === slug)).filter(Boolean) as typeof products;
  const articles = featured.slice(0, 3);
  const quickGrades = ["0W-20", "0W-30", "5W-30", "5W-40"];
  const mobileCategories = [
    ["01", "Vajra për vetura", "Vetura dhe automjete të lehta"],
    ["02", "Vajra industriale", "Industri"],
    ["03", "Vajra për kamionë", "Kamionë dhe automjete të rënda"],
    ["04", "Graso", "Graso"],
    ["05", "Fluide", "Lëngje teknike"],
  ];

  return <main className="homePage automotiveHome">
    <ScrollReveal />
    <div className="mobileLanding">
      <section className="mobileHero" aria-labelledby="mobile-hero-title">
        <div className="mobileHeroCopy" data-reveal>
          <span>DISTRIBUTOR ZYRTAR I CYCLON · KOSOVË</span>
          <h1 id="mobile-hero-title">Krijuar për<br />performancë.</h1>
          <p>Lubrifikantë profesionalë për performancë pa kompromis.</p>
        </div>
        <Link className="mobileHeroProduct" data-reveal style={{ "--reveal-delay": "80ms" } as CSSProperties} href={`/produktet/${heroProduct.slug}`} aria-label={`Shiko ${heroProduct.name}`}>
          <span className="mobileProductBadge">ZGJEDHJA KRYESORE</span>
          {heroProduct.image && <Image src={heroProduct.image} alt={heroProduct.name} fill priority unoptimized sizes="330px" />}
          <div><strong>EVO V1 LL</strong><span>0W-30</span></div>
        </Link>
        <div className="mobileHeroActions" data-reveal style={{ "--reveal-delay": "140ms" } as CSSProperties}>
          <Link href="/produktet">Shiko produktet <span>→</span></Link>
          <Link href="/kontakt">Kontakto <span>→</span></Link>
        </div>
      </section>

      <section className="mobileSpotlight" aria-labelledby="mobile-spotlight-title">
        <div className="mobileSectionHeading" data-reveal><span>PRODUKT I PËRZGJEDHUR</span><h2 id="mobile-spotlight-title">Performancë e verifikuar.</h2></div>
        <Link className="mobileSpotlightCard" href={`/produktet/${spotlightProduct.slug}`} data-reveal>
          <div className="mobileSpotlightStage">{spotlightProduct.image && <Image src={spotlightProduct.image} alt={spotlightProduct.name} fill unoptimized sizes="310px" />}</div>
          <div className="mobileSpotlightInfo"><span>CYCLON · {spotlightProduct.family}</span><h3>{spotlightProduct.name.replace("CYCLON ", "")}</h3><div><strong>5W-30</strong><small>VAJ MOTORIK</small></div><b>Shiko më shumë <span>→</span></b></div>
        </Link>
      </section>

      <section className="mobileCategoryLinks" aria-labelledby="mobile-categories-title">
        <div className="mobileSectionHeading" data-reveal><span>ZGJIDH SIPAS APLIKIMIT</span><h2 id="mobile-categories-title">Çfarë po kërkoni?</h2></div>
        <nav aria-label="Kategoritë kryesore" data-reveal>{mobileCategories.map(([number, label, category]) => <Link href={`/produktet?category=${encodeURIComponent(category)}`} key={category}><span>{number}</span><strong>{label}</strong><i>→</i></Link>)}</nav>
        <Link className="mobileAllProducts" href="/kategorite">Të gjitha 11 kategoritë <span>→</span></Link>
      </section>

      <section className="mobileFinalCta" data-reveal>
        <span>BESIANA Sh.P.K. · CYCLON KOSOVO</span>
        <h2>Produkti i duhur nis me këshillën e duhur.</h2>
        <p>Na tregoni automjetin ose pajisjen. Ne ju ndihmojmë të gjeni produktin e përshtatshëm.</p>
        <Link href="/kontakt">Na kontaktoni <span>→</span></Link>
        <a href="tel:+38344303130">+383 44 303 130</a>
      </section>
    </div>

    <section className="performanceHero" aria-labelledby="performance-title">
      <div className="performanceHeroInner container">
        <div className="performanceCopy" data-reveal><span className="performanceKicker">DISTRIBUTOR ZYRTAR I CYCLON · KOSOVË</span><h1 id="performance-title">KRIJUAR PËR<br />PERFORMANCË.</h1><p>Lubrifikantë profesionalë<br />për performancë pa kompromis.</p><div className="performanceActions"><Link className="performanceButton isLight" href="/produktet">SHIKO PRODUKTET <span>→</span></Link><Link className="performanceButton" href="/kontakt">KONTAKTO <span>→</span></Link></div></div>
        <Link className="performanceProduct" data-reveal style={{ "--reveal-delay": "100ms" } as CSSProperties} href={`/produktet/${heroProduct.slug}`} aria-label={`Shiko ${heroProduct.name}`}><div className="studioLines" aria-hidden="true"/><div className="performanceProductImage">{heroProduct.image && <Image src={heroProduct.image} alt={heroProduct.name} fill priority unoptimized sizes="(max-width: 800px) 78vw, 42vw" />}</div><div className="productReflection" aria-hidden="true"/><div className="performanceProductLabel"><strong>EVO V1 LL</strong><span>0W-30</span></div></Link>
      </div>
    </section>

    <section className="quickFinder" aria-label="Kërkim i shpejtë sipas viskozitetit"><div className="container quickFinderInner" data-reveal><div><span>GJEJ MË SHPEJT</span><strong>Kërko sipas viskozitetit</strong></div><nav aria-label="Gradat më të kërkuara">{quickGrades.map((grade) => <Link href={`/produktet?q=${encodeURIComponent(grade)}`} key={grade}>{grade}<span>→</span></Link>)}</nav><Link className="quickFinderSearch" href="/kerko">KËRKIM I PLOTË <span>⌕</span></Link></div></section>

    <section className="professionalSeries"><div className="container seriesHeading" data-reveal><span>SERI PROFESIONALE</span><i aria-hidden="true"/></div><div className="container professionalSeriesGrid">{featured.map((product, index) => <Link data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties} className={`professionalSeriesCard${index === 0 ? " isPrimary" : ""}`} href={`/produktet?category=${encodeURIComponent(product.category)}&family=${product.family}`} key={product.slug}><div className="professionalSeriesCopy"><strong>{product.family}</strong><p>{seriesDescriptions[product.family].split(". ").map((line) => <span key={line}>{line.replace(/\.$/, "")}.</span>)}</p></div><div className="professionalSeriesImage">{product.image && <Image src={product.image} alt={product.name} fill unoptimized sizes={index === 0 ? "360px" : "230px"}/>}</div><span className="seriesArrow" aria-hidden="true">→</span></Link>)}</div></section>

    <section className="categorySection"><div className="container sectionIntro" data-reveal><div><span className="sectionLabel">11 KATEGORI · {products.length} PRODUKTE JO-DETARE</span><h2>Zgjidhni sipas aplikimit.</h2></div><p>Të gjitha kategoritë jo-detare janë të listuara. Zgjidhni një kategori për gamat kryesore ose hapni koleksionin e plotë të saj.</p></div><div className="container" data-reveal><CategoryExplorer items={buildCategoryItems()}/></div></section>

    <section className="homeArticlesSection"><div className="container sectionIntro" data-reveal><div><span className="sectionLabel lightLabel">QENDRA E NJOHURIVE</span><h2>Artikuj teknikë. Zgjedhje më e saktë.</h2></div><Link className="arrowLink lightArrow" href="/artikuj">TË GJITHË ARTIKUJT →</Link></div><div className="container homeArticleGrid">{articles.map((product, index) => <Link data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties} className="homeArticleCard" href={`/artikuj/${product.slug}`} key={product.slug}><div className="homeArticleThumb">{product.image ? <Image src={product.image} alt={product.name} fill unoptimized sizes="(max-width: 760px) 90vw, 400px" /> : <span>CYCLON</span>}<b>{product.category}</b></div><div className="homeArticleTags">{articleTags(product).slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}</div><h3>{articleTitle(product)}</h3><p>{articleExcerpt(product)}</p><strong>LEXO ARTIKULLIN →</strong></Link>)}</div></section>

    <section className="homeDistributor"><div className="container homeDistributorGrid" data-reveal><div><span>BESIANA Sh.P.K.</span><strong>DISTRIBUTOR I CYCLON NË KOSOVË</strong></div><div><h2>Produkti i duhur nis me një kërkesë të saktë.</h2><p>Na tregoni automjetin, pajisjen, sistemin dhe specifikimin. Ekipi ynë ju ndihmon me informacionin dhe disponueshmërinë.</p><div className="homeDistributorActions"><Link href="/kontakt">LËR INFORMATAT <span>→</span></Link><a href="tel:+38344303130">+383 44 303 130 <span>↗</span></a></div></div></div></section>
  </main>;
}
