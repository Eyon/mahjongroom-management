"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, DollarSign, ShoppingBag } from "lucide-react";
import "./recent-transactions.css";

// Mock data for recent transactions
const recentTransactions = [
  {
    id: "1",
    type: "income",
    source: "包间 1",
    amount: 240,
    time: "10:30",
    description: "2小时 + 红牛2瓶",
  },
  {
    id: "2",
    type: "income",
    source: "大厅 A",
    amount: 120,
    time: "11:45",
    description: "3局麻将",
  },
  {
    id: "3",
    type: "expense",
    source: "进货",
    amount: -500,
    time: "09:15",
    description: "红牛一箱、矿泉水两箱",
  },
  {
    id: "4",
    type: "income",
    source: "包间 3",
    amount: 350,
    time: "14:20",
    description: "套餐4小时 + 超时1小时",
  },
  {
    id: "5",
    type: "expense",
    source: "水电费",
    amount: -800,
    time: "昨天",
    description: "本月水电费",
  },
];

export default function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>近期交易</CardTitle>
        <CardDescription>今日收支情况</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="transactions-list">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="transaction-item"
            >
              <div className="transaction-info">
                <div className={`transaction-icon ${transaction.type === "income" ? "income" : "expense"}`}>
                  {transaction.type === "income" ? (
                    <DollarSign className="icon" />
                  ) : transaction.source === "进货" ? (
                    <ShoppingBag className="icon" />
                  ) : (
                    <Clock className="icon" />
                  )}
                </div>
                <div>
                  <p className="transaction-source">{transaction.source}</p>
                  <p className="transaction-description">{transaction.description}</p>
                </div>
              </div>
              <div className="transaction-amount">
                <p className={`amount ${transaction.type === "income" ? "income" : "expense"}`}>
                  {transaction.type === "income" ? "+" : ""}{transaction.amount}元
                </p>
                <p className="transaction-time">{transaction.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}