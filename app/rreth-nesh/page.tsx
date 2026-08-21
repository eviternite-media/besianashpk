import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "../../components/PageHero";
import { products } from "../../data/products";

export const metadata: Metadata = {
  title: "BESIANA dhe historia e CYCLON",
  description: "BESIANA Sh.P.K. është distributor i produkteve CYCLON në tërë Kosovën. Njihuni me CYCLON, historinë dhe zhvillimin e markës.",
};

const history = [
  ["1981", "LPC fillon investimet në inovacion teknologjik dhe kërkim për produkte të avancuara me ndikim më të ulët mjedisor."],
  ["1987", "Lansohet marka CYCLON dhe nis rrugëtimi i saj në lubrifikantët me performancë të lartë."],
  ["1988–1993", "CYCLON Voyager merr aprovim nga Mercedes-Benz; më pas kompania certifikon sistemin e cilësisë me ISO 9002."],
  ["2015", "Lansohet teknologjia TriboACT® dhe realizohet një etapë e re e identitetit të CYCLON."],
  ["2020–2024", "Nis punën impianti modern i prodhimit të grasove; zgjerohen eksportet dhe vihet në funksion edhe impianti i ri AdBlue."],
  ["2025–Sot", "CYCLON prezanton logon dhe paketimet e reja. Sot marka operon me rrjet shpërndarjeje në mbi 60 shtete."],
];

export default function AboutPage() {
  const featured = ["cyclon-evo-v1-ll-0w-30", "cyclon-pro-v1-ll-5w-30", "cyclon-max-x-100-5w-40"]
    .map((slug) => products.find((product) => product.slug === slug))
    .filter(Boolean);

  return <main className="innerPage aboutPage">
    <PageHero eyebrow="BESIANA × CYCLON" title="CYCLON në gjithë Kosovën." intro="BESIANA Sh.P.K. është distributor i produkteve CYCLON në tërë territorin e Kosovës—me informacion teknik dhe shërbim për biznese e profesionistë." />

    <section className="editorialSection aboutDistribution"><div className="container editorialGrid"><div><span className="kicker">Roli ynë</span><h2>BESIANA e sjell CYCLON më afër tregut të Kosovës.</h2><p>Si distributor në tërë Kosovën, BESIANA Sh.P.K. lidh gamën ndërkombëtare të CYCLON me nevojat e serviseve, dyqaneve, flotave, industrisë, bujqësisë dhe përdoruesve profesionistë.</p><p>Ne ndihmojmë në identifikimin e produktit sipas aplikimit, viskozitetit, aprovimit dhe specifikimit të kërkuar. Qëllimi është furnizim i organizuar dhe informacion i qartë—jo zgjedhje me hamendje.</p><Link className="button primary" href="/kontakt">Kontakto BESIANA <span>→</span></Link></div><div className="aboutProductStage" aria-label="Produkte profesionale CYCLON">{featured.map((product,index)=>product?.image&&<div className={`aboutProduct aboutProduct${index+1}`} key={product.slug}><Image src={product.image} alt={product.name} fill unoptimized sizes="220px"/></div>)}</div></div></section>

    <section className="brandHistory"><div className="container"><div className="historyIntro"><span className="kicker">Historia e markës</span><h2>Kush është CYCLON?</h2><p>CYCLON është marka kryesore e LPC, kompani anëtare e Motor Oil Hellas Group. Historia zyrtare e markës nis në vitin 1987, ndërsa baza e investimeve të LPC në teknologji dhe kërkim daton nga viti 1981. Marka është zhvilluar përmes inovacionit, aprovimeve, certifikimeve, prodhimit modern dhe një rrjeti ndërkombëtar që sot shtrihet në mbi 60 shtete.</p></div><ol className="historyTimeline">{history.map(([year,text])=><li key={year}><span>{year}</span><p>{text}</p></li>)}</ol><a className="historySource" href="https://www.cyclon-lpc.com/brand/">Burimi: historia zyrtare e CYCLON <span>↗</span></a></div></section>

  </main>;
}
