"use client";
import Link from "next/link";
import { useState } from "react";
export default function MobileProductBar({ name }: { name: string }) {
  const [message, setMessage] = useState("");
  async function share() {
    try {
      if (navigator.share) await navigator.share({ title: name, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); setMessage("Lidhja u kopjua"); }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setMessage("Kopjo lidhjen nga shiriti i adresës.");
    }
  }
  return <div className="phoneProductBar"><Link href="/produktet" aria-label="Kthehu te produktet">←</Link><span>CYCLON <b> / </b> BESIANA</span><button type="button" onClick={share} aria-label="Shpërndaje produktin"><svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 15V3m-4 4 4-4 4 4M5 11v10h14V11"/></svg></button><small role="status">{message}</small></div>;
}
