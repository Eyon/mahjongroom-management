import { Metadata } from "next";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import BillingManagement from "@/components/billing/billing-management";

export const metadata: Metadata = {
  title: "计费方式 | Mahjong Parlor Management",
  description: "管理您的麻将馆计费方式",
};

export default function BillingPage() {
  return (
    <div className="dashboard-root">
      <DashboardHeader />
      <main className="dashboard-main">
        <h1 className="dashboard-title">计费方式</h1>
        <BillingManagement />
      </main>
    </div>
  );
}