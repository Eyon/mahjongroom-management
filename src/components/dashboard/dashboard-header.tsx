"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TableIcon, BillingIcon, ProductIcon, ExpenseIcon } from "@/components/ui/icons";
import { MoonIcon, SunIcon, ChevronsUpDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import "./dashboard-header.css";

export default function DashboardHeader() {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navItems = [
    {
      name: "控制面板",
      href: "/dashboard",
      icon: <ChevronsUpDown className="h-4 w-4 mr-2" />,
    },
    {
      name: "台桌管理",
      href: "/dashboard/tables",
      icon: <TableIcon className="h-4 w-4 mr-2" />,
    },
    {
      name: "计费方式",
      href: "/dashboard/billing",
      icon: <BillingIcon className="h-4 w-4 mr-2" />,
    },
    {
      name: "商品管理",
      href: "/dashboard/products",
      icon: <ProductIcon className="h-4 w-4 mr-2" />,
    },
    {
      name: "收支管理",
      href: "/dashboard/finances",
      icon: <ExpenseIcon className="h-4 w-4 mr-2" />,
    },
  ];

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-container">
        <div className="dashboard-header-left">
          <Link href="/dashboard" className="dashboard-logo">
            <span className="dashboard-logo-text">麻将管家</span>
          </Link>
          <nav className="dashboard-nav">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                size="sm"
                asChild
              >
                <Link href={item.href} className="dashboard-nav-item">
                  {item.icon}
                  {item.name}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
        <div className="dashboard-header-right">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {mounted && theme === "dark" ? (
              <SunIcon className="theme-icon" />
            ) : (
              <MoonIcon className="theme-icon" />
            )}
          </Button>
          <Button variant="ghost" size="sm">
            退出登录
          </Button>
        </div>
      </div>
    </header>
  );
}