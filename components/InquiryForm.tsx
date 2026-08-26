"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

const SITES_ORIGIN = "https://cyclon-kosovo.multipllando200.chatgpt.site";

type Challenge = { question: string; token: string };

function apiOrigin() {
  if (typeof window !== "undefined" && (window.location.hostname.endsWith("chatgpt.site") || ["localhost", "127.0.0.1"].includes(window.location.hostname))) return "";
  return SITES_ORIGIN;
}

export default function InquiryForm({ initialProduct = "", initialType = "Produkt" }: { initialProduct?: string; initialType?: string }) {
  const [data, setData] = useState({ name: "", company: "", phone: "", email: "", city: "", type: initialType, product: initialProduct, message: "", consent: false, website: "", humanAnswer: "" });
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function loadChallenge() {
    setChallenge(null);
    setData((current) => ({ ...current, humanAnswer: "" }));
    try {
      const response = await fetch(`${apiOrigin()}/api/inquiries/challenge`, { cache: "no-store" });
      const body = await response.json() as Challenge & { error?: string };
      if (!response.ok) throw new Error(body.error || "Verifikimi nuk u ngarkua.");
      setChallenge(body);
    } catch {
      setFeedback("Verifikimi nuk u ngarkua. Provoni përsëri.");
      setState("error");
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void loadChallenge(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function update(name: string, value: string | boolean) {
    setState("idle");
    setFeedback("");
    setData((current) => ({ ...current, [name]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (data.website || !challenge) return;
    setState("sending");
    setFeedback("");
    try {
      const response = await fetch(`${apiOrigin()}/api/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, challengeToken: challenge.token }),
      });
      const body = await response.json() as { error?: string; message?: string };
      if (!response.ok) throw new Error(body.error || "Kërkesa nuk u dërgua.");
      setFeedback(body.message || "Kërkesa u dërgua me sukses.");
      setData((current) => ({ ...current, message: "", consent: false, humanAnswer: "", website: "" }));
      await loadChallenge();
      setState("sent");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Kërkesa nuk u dërgua. Provoni përsëri.");
      await loadChallenge();
      setState("error");
    }
  }

  const backupText = useMemo(() => encodeURIComponent(`Përshëndetje, jam ${data.name}${data.company ? ` nga ${data.company}` : ""}.\nLloji: ${data.type}\nProdukti: ${data.product || "Nuk është zgjedhur"}\nQyteti: ${data.city}\nTelefoni: ${data.phone}\n${data.message}`), [data]);

  return <form className="inquiryForm" onSubmit={submit}>
    <div className="formGrid">
      <label>Emri dhe mbiemri *<input required maxLength={100} value={data.name} onChange={(event) => update("name", event.target.value)} placeholder="Shkruani emrin" /></label>
      <label>Kompania<input maxLength={120} value={data.company} onChange={(event) => update("company", event.target.value)} placeholder="Emri i kompanisë" /></label>
      <label>Telefoni *<input required maxLength={40} type="tel" value={data.phone} onChange={(event) => update("phone", event.target.value)} placeholder="+383 ..." /></label>
      <label>Email<input maxLength={160} type="email" value={data.email} onChange={(event) => update("email", event.target.value)} placeholder="email@kompania.com" /></label>
      <label>Qyteti *<input required maxLength={80} value={data.city} onChange={(event) => update("city", event.target.value)} placeholder="Qyteti" /></label>
      <label>Lloji i kërkesës<select value={data.type} onChange={(event) => update("type", event.target.value)}><option>Produkt</option><option>Ofertë biznesi</option><option>Dokumentacion teknik</option><option>Tjetër</option></select></label>
      <label className="full">Produkti<input maxLength={200} value={data.product} onChange={(event) => update("product", event.target.value)} placeholder="Emri ose grada e produktit — opsionale" /></label>
      <label className="full">Mesazhi *<textarea required minLength={10} maxLength={3000} rows={5} value={data.message} onChange={(event) => update("message", event.target.value)} placeholder="Na tregoni automjetin, pajisjen ose specifikimin që kërkoni" /></label>
      <label className="honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={data.website} onChange={(event) => update("website", event.target.value)} /></label>
    </div>
    <div className="humanCheck">
      <div><strong>Verifiko që je njeri</strong><span>Përgjigju pyetjes së thjeshtë para dërgimit.</span></div>
      <label>{challenge ? `${challenge.question} =` : "Duke ngarkuar…"}<input required inputMode="numeric" pattern="[0-9]*" aria-label="Përgjigjja e verifikimit njerëzor" disabled={!challenge} value={data.humanAnswer} onChange={(event) => update("humanAnswer", event.target.value)} /></label>
      <button type="button" onClick={() => void loadChallenge()} aria-label="Ngarko pyetje të re">↻</button>
    </div>
    <label className="consent"><input required type="checkbox" checked={data.consent} onChange={(event) => update("consent", event.target.checked)} /> Pajtohem që të dhënat e mia të ruhen dhe të përdoren vetëm për trajtimin e kësaj kërkese.</label>
    <button className="button primary submitButton" disabled={state === "sending" || !challenge} type="submit">{state === "sending" ? "Duke dërguar…" : "Dërgo kërkesën"} <span>→</span></button>
    {feedback && <div className={`formFeedback ${state}`} role={state === "error" ? "alert" : "status"}><strong>{feedback}</strong>{state === "sent" && <p>Ekipi i BESIANA Sh.P.K. është njoftuar. Për kërkesa urgjente mund të përdorni edhe <a href={`https://wa.me/38344303130?text=${backupText}`}>WhatsApp</a>.</p>}</div>}
  </form>;
}
