import { Metadata } from "next";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardStats from "@/components/dashboard/dashboard-stats";
import ActiveTables from "@/components/dashboard/active-tables";
import RecentTransactions from "@/components/dashboard/recent-transactions";

export const metadata: Metadata = {
  title: "Dashboard | Mahjong Parlor Management",
  description: "Overview of your mahjong parlor's performance",
};

export default function DashboardPage() {
  return (
    <div className="dashboard-root">
      <DashboardHeader />
      <main className="dashboard-main">
        <h1 className="dashboard-title">控制面板</h1>
        <DashboardStats />
        <div className="dashboard-content">
          <div className="dashboard-tables">
            <ActiveTables />
          </div>
          <div className="dashboard-transactions">
            <RecentTransactions />
          </div>
        </div>
      </main>
    </div>
  );
}