"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const ADMIN_ORIGIN = "https://cyclon-kosovo.multipllando200.chatgpt.site";

type Inquiry = {
  id: number;
  created_at: number;
  name: string;
  company: string;
  phone: string;
  email: string;
  city: string;
  request_type: string;
  product: string;
  message: string;
  status: "new" | "contacted" | "archived";
  source: string;
};

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [view, setView] = useState<"loading" | "ready" | "signed-out" | "forbidden" | "error">("loading");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"all" | Inquiry["status"]>("all");
  const [search, setSearch] = useState("");
  const initialized = useRef(false);
  const knownIds = useRef(new Set<number>());

  const load = useCallback(async (notify = false) => {
    try {
      const session = await fetch("/api/admin/session", { cache: "no-store" });
      if (session.status === 401) { setView("signed-out"); return; }
      if (session.status === 403) { setView("forbidden"); return; }
      if (!session.ok) throw new Error("session");
      const sessionBody = await session.json() as { email: string };
      setEmail(sessionBody.email);
      const response = await fetch("/api/admin/inquiries?limit=200", { cache: "no-store" });
      if (!response.ok) throw new Error("inquiries");
      const body = await response.json() as { inquiries: Inquiry[] };
      if (notify && initialized.current && "Notification" in window && Notification.permission === "granted") {
        for (const inquiry of body.inquiries.filter((item) => !knownIds.current.has(item.id))) {
          new Notification("Kërkesë e re — BESIANA", { body: `${inquiry.name} · ${inquiry.city}\n${inquiry.product || inquiry.request_type}`, icon: "/favicon-besiana-144.png", tag: `inquiry-${inquiry.id}` });
        }
      }
      knownIds.current = new Set(body.inquiries.map((item) => item.id));
      initialized.current = true;
      setInquiries(body.inquiries);
      setView("ready");
    } catch {
      setView("error");
    }
  }, []);

  useEffect(() => {
    const host = window.location.hostname;
    if (!host.endsWith("chatgpt.site") && !["localhost", "127.0.0.1"].includes(host)) {
      window.location.replace(`${ADMIN_ORIGIN}/admin`);
      return;
    }
    const initialTimer = window.setTimeout(() => void load(false), 0);
    const timer = window.setInterval(() => void load(true), 15_000);
    return () => { window.clearTimeout(initialTimer); window.clearInterval(timer); };
  }, [load]);

  async function changeStatus(id: number, nextStatus: Inquiry["status"]) {
    const response = await fetch(`/api/admin/inquiries/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: nextStatus }) });
    if (response.ok) setInquiries((current) => current.map((item) => item.id === id ? { ...item, status: nextStatus } : item));
  }

  async function enableNotifications() {
    if ("Notification" in window) await Notification.requestPermission();
  }

  const visible = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase("sq");
    return inquiries.filter((item) => (status === "all" || item.status === status) && (!needle || [item.name, item.company, item.phone, item.email, item.city, item.product, item.message].some((value) => value.toLocaleLowerCase("sq").includes(needle))));
  }, [inquiries, search, status]);
  const counts = useMemo(() => ({ total: inquiries.length, new: inquiries.filter((item) => item.status === "new").length, contacted: inquiries.filter((item) => item.status === "contacted").length }), [inquiries]);

  if (view === "loading") return <main className="adminGate"><div><span>BESIANA ADMIN</span><h1>Duke hapur panelin…</h1></div></main>;
  if (view === "signed-out") return <main className="adminGate"><div><span>PANEL PRIVAT</span><h1>Kyçuni për të vazhduar.</h1><p>Vetëm llogaria e administratorit mund t’i shohë kërkesat e klientëve.</p><a className="button primary" href="/signin-with-chatgpt?return_to=%2Fadmin">Kyçu me ChatGPT →</a></div></main>;
  if (view === "forbidden") return <main className="adminGate"><div><span>QASJA U REFUZUA</span><h1>Kjo llogari nuk është administratori.</h1><a href="/signout-with-chatgpt?return_to=%2Fadmin">Dil nga kjo llogari</a></div></main>;
  if (view === "error") return <main className="adminGate"><div><span>GABIM I PËRKOHSHËM</span><h1>Paneli nuk u ngarkua.</h1><button className="button primary" onClick={() => void load(false)}>Provo përsëri</button></div></main>;

  return <main className="adminPage">
    <header className="adminHeader"><div><span>BESIANA · ADMIN</span><h1>Kërkesat e klientëve</h1><p>{email}</p></div><div><button onClick={enableNotifications}>Aktivizo njoftimet</button><button onClick={() => void load(false)}>Rifresko ↻</button><a href="/signout-with-chatgpt?return_to=%2Fadmin">Dil</a></div></header>
    <section className="adminStats"><button onClick={() => setStatus("all")}><span>Gjithsej</span><strong>{counts.total}</strong></button><button onClick={() => setStatus("new")}><span>Të reja</span><strong>{counts.new}</strong></button><button onClick={() => setStatus("contacted")}><span>Të kontaktuara</span><strong>{counts.contacted}</strong></button></section>
    <section className="adminControls"><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Kërko emër, telefon, qytet ose produkt…" /><select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}><option value="all">Të gjitha</option><option value="new">Të reja</option><option value="contacted">Të kontaktuara</option><option value="archived">Të arkivuara</option></select></section>
    <section className="adminInquiryList">{visible.length ? visible.map((item) => <article className={`adminInquiry ${item.status}`} key={item.id}>
      <div className="adminInquiryTop"><div><span>#{item.id} · {new Date(item.created_at * 1000).toLocaleString("sq-AL")}</span><h2>{item.name}</h2><p>{item.company || "Klient individual"} · {item.city}</p></div><b>{item.status === "new" ? "E RE" : item.status === "contacted" ? "KONTAKTUAR" : "ARKIVUAR"}</b></div>
      <dl><div><dt>Telefon</dt><dd><a href={`tel:${item.phone}`}>{item.phone}</a></dd></div><div><dt>Email</dt><dd>{item.email ? <a href={`mailto:${item.email}`}>{item.email}</a> : "—"}</dd></div><div><dt>Lloji</dt><dd>{item.request_type}</dd></div><div><dt>Produkti</dt><dd>{item.product || "—"}</dd></div></dl>
      <p className="adminMessage">{item.message}</p>
      <div className="adminInquiryActions"><a href={`https://wa.me/${item.phone.replace(/\D/g, "")}`}>WhatsApp ↗</a>{item.status !== "contacted" && <button onClick={() => void changeStatus(item.id, "contacted")}>Shëno si kontaktuar</button>}{item.status !== "archived" && <button onClick={() => void changeStatus(item.id, "archived")}>Arkivo</button>}{item.status === "archived" && <button onClick={() => void changeStatus(item.id, "new")}>Rihap</button>}</div>
    </article>) : <div className="adminEmpty"><h2>Nuk ka kërkesa në këtë pamje.</h2><p>Kërkesat e reja do të shfaqen automatikisht.</p></div>}</section>
  </main>;
}
