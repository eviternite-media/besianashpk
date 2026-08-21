"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  ["/produktet", "Produktet"],
  ["/artikuj", "Artikujt"],
  ["/rreth-nesh", "Rreth nesh"],
  ["/kontakt", "Kontakti"],
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="siteHeader">
    <Link className="brand" href="/" aria-label="BESIANA Sh.P.K. — Ballina">
      <Image src="/images/besiana-logo-black.png" alt="BESIANA Sh.P.K." width={188} height={75} priority unoptimized />
    </Link>
    <nav aria-label="Navigimi kryesor">{links.map(([href, label]) => <Link className={pathname === href || pathname.startsWith(`${href}/`) ? "isActive" : ""} aria-current={pathname === href ? "page" : undefined} href={href} key={href}>{label}</Link>)}</nav>
    <div className="headerTools">
      <form action="/kerko" className="headerSearch" role="search"><label className="srOnly" htmlFor="header-search">Kërko</label><span aria-hidden="true"/><input id="header-search" name="q" placeholder="Kërko…"/><button type="submit" aria-label="Kërko">→</button></form>
      <Link className="contactPill" href="/kontakt">Kontakti <span>→</span></Link>
      <button className={`mobileMenuButton${menuOpen ? " isOpen" : ""}`} type="button" aria-label={menuOpen ? "Mbyll menynë" : "Hap menynë"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((value) => !value)}><span/><span/></button>
    </div>
    <div className={`mobileMenu${menuOpen ? " isOpen" : ""}`} id="mobile-navigation"><form action="/kerko" role="search"><input name="q" aria-label="Kërko" placeholder="Kërko produkt…"/><button type="submit">→</button></form>{links.map(([href, label]) => <Link onClick={() => setMenuOpen(false)} className={pathname === href ? "isActive" : ""} href={href} key={href}>{label}<span>→</span></Link>)}</div>
  </header>;
}
