export default function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return <section className="pageHero"><div className="container"><span className="kicker gold">{eyebrow}</span><h1>{title}</h1><p>{intro}</p></div></section>;
}
