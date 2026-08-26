import type { Metadata } from "next";
import AdminDashboard from "../../components/AdminDashboard";

export const metadata: Metadata = {
  title: "Paneli administrativ",
  description: "Panel privat për kërkesat e klientëve të BESIANA Sh.P.K.",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
