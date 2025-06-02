"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Calendar, Filter, ArrowDown, ArrowUp, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import NewTransactionDialog from "@/components/finances/new-transaction-dialog";

// Mock data for transactions
const mockTransactions = [
  {
    id: "1",
    type: "income",
    category: "台桌收入",
    description: "包间 1 消费",
    amount: 240,
    date: new Date(2025, 2, 28, 10, 30),
  },
  {
    id: "2",
    type: "income",
    category: "台桌收入",
    description: "大厅 A 消费",
    amount: 120,
    date: new Date(2025, 2, 28, 11, 45),
  },
  {
    id: "3",
    type: "expense",
    category: "进货支出",
    description: "红牛一箱、矿泉水两箱",
    amount: 500,
    date: new Date(2025, 2, 28, 9, 15),
  },
  {
    id: "4",
    type: "income",
    category: "台桌收入",
    description: "包间 3 消费",
    amount: 350,
    date: new Date(2025, 2, 28, 14, 20),
  },
  {
    id: "5",
    type: "expense",
    category: "水电费",
    description: "本月水电费",
    amount: 800,
    date: new Date(2025, 2, 27, 15, 0),
  },
  {
    id: "6",
    type: "expense",
    category: "房租",
    description: "三月份房租",
    amount: 5000,
    date: new Date(2025, 2, 26, 11, 0),
  },
  {
    id: "7",
    type: "income",
    category: "台桌收入",
    description: "包间 2 消费",
    amount: 280,
    date: new Date(2025, 2, 27, 18, 30),
  },
  {
    id: "8",
    type: "expense",
    category: "员工工资",
    description: "服务员小李工资",
    amount: 3000,
    date: new Date(2025, 2, 25, 10, 0),
  },
];

// Prepare data for chart
const prepareChartData = (transactions: any[]) => {
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    return {
      date: format(date, "MM-dd"),
      income: 0,
      expense: 0,
    };
  }).reverse();

  transactions.forEach(transaction => {
    const transactionDate = format(transaction.date, "MM-dd");
    const dayData = last7Days.find(day => day.date === transactionDate);
    if (dayData) {
      if (transaction.type === "income") {
        dayData.income += transaction.amount;
      } else {
        dayData.expense += transaction.amount;
      }
    }
  });

  return last7Days;
};

export default function FinancesManagement() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isNewTransactionDialogOpen, setIsNewTransactionDialogOpen] = useState(false);

  // Get unique categories
  const incomeCategories = Array.from(
    new Set(transactions.filter(t => t.type === "income").map(t => t.category))
  );
  
  const expenseCategories = Array.from(
    new Set(transactions.filter(t => t.type === "expense").map(t => t.category))
  );

  // Filter transactions based on type and category
  const filteredTransactions = transactions.filter(
    (transaction) =>
      (typeFilter === "all" || transaction.type === typeFilter) &&
      (categoryFilter === "all" || transaction.category === categoryFilter)
  ).sort((a, b) => b.date.getTime() - a.date.getTime());

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netProfit = totalIncome - totalExpense;

  const chartData = prepareChartData(transactions);

  const handleAddTransaction = (newTransaction: any) => {
    setTransactions([
      ...transactions,
      { 
        ...newTransaction, 
        id: String(transactions.length + 1),
        date: new Date(),
      },
    ]);
    setIsNewTransactionDialogOpen(false);
    toast.success("交易记录添加成功");
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>总收入</CardDescription>
            <CardTitle className="text-2xl text-green-600 dark:text-green-400">
              ¥{totalIncome.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <ArrowUp className="inline h-4 w-4 mr-1 text-green-600 dark:text-green-400" />
              主要来源于台桌收入
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>总支出</CardDescription>
            <CardTitle className="text-2xl text-red-600 dark:text-red-400">
              ¥{totalExpense.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <ArrowDown className="inline h-4 w-4 mr-1 text-red-600 dark:text-red-400" />
              主要用于房租和员工工资
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>净利润</CardDescription>
            <CardTitle className={`text-2xl ${
              netProfit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}>
              ¥{netProfit.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <DollarSign className={`inline h-4 w-4 mr-1 ${
                netProfit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`} />
              {netProfit >= 0 ? "盈利中" : "亏损中"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>近7天收支趋势</CardTitle>
          <CardDescription>查看每日收入和支出情况</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" name="收入" fill="hsl(var(--chart-2))" />
                <Bar dataKey="expense" name="支出" fill="hsl(var(--chart-1))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <div className="flex flex-1 items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="所有类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有类型</SelectItem>
              <SelectItem value="income">收入</SelectItem>
              <SelectItem value="expense">支出</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={categoryFilter} 
            onValueChange={setCategoryFilter}
            disabled={!typeFilter}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="所有分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有分类</SelectItem>
              {typeFilter === "income" && 
                incomeCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))
              }
              {typeFilter === "expense" && 
                expenseCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsNewTransactionDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          记录交易
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>交易记录</CardTitle>
          <CardDescription>
            查看所有收入和支出明细
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>日期</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>分类</TableHead>
                <TableHead>描述</TableHead>
                <TableHead className="text-right">金额 (元)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{format(transaction.date, "yyyy-MM-dd HH:mm")}</TableCell>
                  <TableCell>
                    {transaction.type === "income" ? (
                      <span className="flex items-center text-green-600 dark:text-green-400">
                        <ArrowUp className="mr-1 h-4 w-4" />
                        收入
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600 dark:text-red-400">
                        <ArrowDown className="mr-1 h-4 w-4" />
                        支出
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className={`text-right font-medium ${
                    transaction.type === "income" 
                      ? "text-green-600 dark:text-green-400" 
                      : "text-red-600 dark:text-red-400"
                  }`}>
                    {transaction.type === "income" ? "+" : "-"}
                    {transaction.amount}
                  </TableCell>
                </TableRow>
              ))}
              {filteredTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    没有找到交易记录
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <NewTransactionDialog
        open={isNewTransactionDialogOpen}
        onOpenChange={setIsNewTransactionDialogOpen}
        onSave={handleAddTransaction}
        incomeCategories={incomeCategories}
        expenseCategories={expenseCategories}
      />
    </>
  );
}