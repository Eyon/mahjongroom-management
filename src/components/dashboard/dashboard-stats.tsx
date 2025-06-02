"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Activity, 
  CreditCard, 
  DollarSign, 
  Users 
} from "lucide-react";
import "./dashboard-stats.css";

// In a real application, this would be fetched from the API
const stats = [
  {
    title: "今日营业额",
    value: "¥2,860",
    description: "较昨日 +15%",
    icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "开台数",
    value: "12",
    description: "8个包间, 4个大厅",
    icon: <Users className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "商品销售",
    value: "¥860",
    description: "较昨日 +20%",
    icon: <CreditCard className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "平均开台时间",
    value: "2.5小时",
    description: "较昨日 +30分钟",
    icon: <Activity className="h-4 w-4 text-muted-foreground" />,
  },
];

export default function DashboardStats() {
  return (
    <div className="dashboard-stats-grid">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="dashboard-stats-header">
            <CardTitle className="dashboard-stats-title">
              {stat.title}
            </CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="dashboard-stats-value">{stat.value}</div>
            <p className="dashboard-stats-description">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}