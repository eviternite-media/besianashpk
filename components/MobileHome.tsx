import Image from "next/image";
import Link from "next/link";
import { MobileIcon } from "./MobileIcon";
import { products } from "../data/products";

const categories = [
  ["Automjete personale", "Vetura dhe automjete të lehta", "car"],
  ["Transport i rëndë", "Kamionë dhe automjete të rënda", "truck"],
  ["Industri", "Industri", "industry"],
  ["Motoçikleta", "Motoçikleta", "bike"],
];
const series = [
  ["EVO", "Performancë maksimale.", "cyclon-evo-v1-ll-0w-30"],
  ["ECO", "Zgjedhje efikase.", "cyclon-eco-r-2-ultra-s-0w-20"],
  ["PRO", "Besueshmëri profesionale.", "cyclon-pro-v1-ll-5w-30"],
  ["MAX", "Teknologji ekstreme.", "cyclon-max-x-100-5w-40"],
];


export default function MobileHome() {
  return <div className="phoneHome">
    <section className="phoneIntro" aria-labelledby="phone-intro-title">
      <div className="phoneRibbon" aria-hidden="true" />
      <p className="phoneIntroEyebrow">LUBRIFIKANTË<br/>QË LËVIZIN<br/>BOTËN PËRPARA.</p>
      <h1 id="phone-intro-title">KRIJUAR<br/>PËR<br/>PERFORMANCË.</h1>
      <p className="phoneIntroText">Cilësi ndërkombëtare.<br/>Besim në çdo kilometër.</p>
      <a className="phonePrimary" href="#mobile-collections">FILLO TANI <span aria-hidden="true">→</span></a>
      <div className="phoneIntroFoot"><span><strong>CYCLON</strong> LUBRIFIKANTË PROFESIONALË</span><span>DISTRIBUTOR ZYRTAR<br/><strong>BESIANA Sh.P.K.</strong></span></div>
    </section>
    <section className="phoneShop" id="mobile-collections" aria-labelledby="phone-shop-title">
      <div className="phoneShopTop">
        <h2 id="phone-shop-title">Zgjidh<br/>performancën<br/>tënde<span>.</span></h2>
        <p>Lubrifikantë profesionalë<br/>për çdo rrugëtim.</p>
        <form action="/produktet" className="phoneSearch" role="search"><MobileIcon name="search"/><input type="search" name="q" aria-label="Kërko produkte, viskozitet ose kategori" placeholder="Kërko produkte, viskozitet, ose kategori…"/><button type="submit" aria-label="Kërko">→</button></form>
        <nav className="phoneCategories" aria-label="Kategoritë e produkteve">{categories.map(([label, category, icon], index) => <Link key={category} href={`/produktet?category=${encodeURIComponent(category)}`}><span className={index === 0 ? "isPrimary" : ""}><MobileIcon name={icon}/></span><strong>{label}</strong></Link>)}</nav>
      </div>
      <div className="phoneCollections"><div className="phoneSectionTitle"><h3>Seri Profesionale</h3><Link href="/produktet">Shiko të gjitha →</Link></div>
        <div className="phoneSeriesGrid">{series.map(([family, copy, slug]) => {
          const product = products.find((item) => item.slug === slug);
          return <Link key={family} className={`phoneSeries phoneSeries${family}`} href={`/produktet?family=${family}`}><div><h4>{family}</h4><p>{copy}</p><span aria-hidden="true">→</span></div>{product?.image && <Image src={product.image} alt={product.name} fill unoptimized sizes="(max-width: 640px) 25vw, 150px"/>}</Link>;
        })}</div>
        <Link className="phoneHelp" href="/kontakt"><span>Nuk je i sigurt cilin produkt të zgjedhësh?<strong>Këshillohu me BESIANA Sh.P.K.</strong></span><span aria-hidden="true">→</span></Link>
      </div>
    </section>
  </div>;
}
