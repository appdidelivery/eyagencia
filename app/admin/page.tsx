import type { Metadata } from "next";
import Crm from "./Crm";
export const metadata: Metadata = {
  title: "Gestão interna | EYAGENCIA",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};
export const dynamic = "force-dynamic";
export default function AdminPage() { return <Crm />; }
