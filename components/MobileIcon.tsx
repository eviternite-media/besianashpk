import type { ReactNode } from "react";
export function MobileIcon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    car: <><path d="m5 7 2-4h10l2 4 2 3v8h-3v-3H6v3H3v-8Z"/><path d="M5 8h14M6 12h2m8 0h2"/></>,
    truck: <><path d="M2 4h12v12H2Zm12 5h4l4 4v3h-8"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>,
    industry: <><path d="M4 21V10l6 3V8l6 4V3h4v18ZM8 17h1m4 0h1m4 0h1"/></>,
    bike: <><circle cx="5" cy="17" r="4"/><circle cx="19" cy="17" r="4"/><path d="m5 17 5-9 5 9H5m4-12h4m-3 3h7l2 9m-3-14h3"/></>,
    home: <><path d="m3 10 9-7 9 7v11h-6v-7H9v7H3Z"/></>,
    grid: <><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/></>,
    phone: <path d="M6 3H3c-1 10 8 19 18 18v-4l-5-2-2 3-8-8 3-2Z"/>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-11v2"/></>,
    search: <><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></>,
  };
  return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.info}</svg>;
}
