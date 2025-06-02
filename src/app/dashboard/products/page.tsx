import { Metadata } from "next";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import ProductsManagement from "@/components/products/products-management";

export const metadata: Metadata = {
  title: "商品管理 | Mahjong Parlor Management",
  description: "管理您的麻将馆商品",
};

export default function ProductsPage() {
  return (
    <div className="dashboard-root">
      <DashboardHeader />
      <main className="dashboard-main">
        <h1 className="dashboard-title">商品管理</h1>
        <ProductsManagement />
      </main>
    </div>
  );
}