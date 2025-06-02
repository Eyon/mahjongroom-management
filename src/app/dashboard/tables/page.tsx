import { Metadata } from "next";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import TablesManagement from "@/components/tables/tables-management";

export const metadata: Metadata = {
  title: "台桌管理 | Mahjong Parlor Management",
  description: "管理您的麻将馆台桌",
};

export default function TablesPage() {
  return (
    <div className="dashboard-root">
      <DashboardHeader />
      <main className="dashboard-main">
        <h1 className="dashboard-title">台桌管理</h1>
        <TablesManagement />
      </main>
    </div>
  );
}