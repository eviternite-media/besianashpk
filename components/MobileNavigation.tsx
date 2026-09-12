"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileIcon } from "./MobileIcon";
const links = [["/", "Kryefaqja", "home"], ["/produktet", "Produkte", "grid"], ["/kontakt", "Kontakti", "phone"], ["/rreth-nesh", "Rreth nesh", "info"]];
export default function MobileNavigation() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/produktet/")) return null;
  return <nav className="phoneBottomNav" aria-label="Navigimi në telefon">{links.map(([href, label, icon]) => <Link key={href} href={href} aria-current={pathname === href || (href === "/produktet" && pathname === "/kerko") ? "page" : undefined}><MobileIcon name={icon}/><span>{label}</span></Link>)}</nav>;
}
