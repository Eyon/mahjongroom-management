import { Metadata } from "next";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import FinancesManagement from "@/components/finances/finances-management";

export const metadata: Metadata = {
  title: "收支管理 | Mahjong Parlor Management",
  description: "管理您的麻将馆收支",
};

export default function FinancesPage() {
  return (
    <div className="dashboard-root">
      <DashboardHeader />
      <main className="dashboard-main">
        <h1 className="dashboard-title">收支管理</h1>
        <FinancesManagement />
      </main>
    </div>
  );
}