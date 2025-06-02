"use client";

import "./tables-list.css";
import { TableStatus } from "../../lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, PlusCircle, Settings } from "lucide-react";
import { toast } from "sonner";

interface TablesListProps {
  tables: {
    id: string;
    name: string;
    status: TableStatus;
    location: string;
    billingMethod: string;
    rate: string;
  }[];
}

export default function TablesList({ tables }: TablesListProps) {
  // Function to get status badge color
  const getStatusBadge = (status: TableStatus) => {
    switch (status) {
      case "occupied":
        return <Badge className="bg-red-500">使用中</Badge>;
      case "vacant":
        return <Badge className="bg-green-500">空闲</Badge>;
      case "reserved":
        return <Badge className="bg-yellow-500">已预订</Badge>;
      case "maintenance":
        return <Badge className="bg-gray-500">维修中</Badge>;
      default:
        return <Badge>未知</Badge>;
    }
  };

  const handleOpenTable = (tableId: string, tableName: string) => {
    toast.success(`${tableName} 已开台`);
  };

  const handleAddProducts = (tableId: string, tableName: string) => {
    toast.info(`为 ${tableName} 添加商品`);
  };

  const handleCheckout = (tableId: string, tableName: string) => {
    toast.success(`${tableName} 结账完成`);
  };

  return (
    <div className="tables-grid">
      {tables.map((table) => (
        <Card key={table.id} className="table-card">
          <div className={`table-header ${
            table.status === "occupied" ? "table-header-occupied" : 
            table.status === "vacant" ? "table-header-vacant" : 
            table.status === "reserved" ? "table-header-reserved" : 
            "table-header-maintenance"
          }`}>
            <div className="table-header-content">
              <div>
                <h3 className="table-title">{table.name}</h3>
                <p className="table-location">{table.location}</p>
              </div>
              <div className="table-actions">
                {getStatusBadge(table.status)}
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="table-info">
              <div className="table-billing">{table.billingMethod}</div>
              <div className="table-rate">{table.rate}</div>
            </div>
            <div className="table-buttons">
              {table.status === "vacant" && (
                <Button 
                  size="sm" 
                  className="table-button"
                  onClick={() => handleOpenTable(table.id, table.name)}
                >
                  开台
                </Button>
              )}
              {table.status === "occupied" && (
                <>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="table-button"
                    onClick={() => handleAddProducts(table.id, table.name)}
                  >
                    <PlusCircle className="table-button-icon" />
                    添加商品
                  </Button>
                  <Button 
                    size="sm" 
                    variant="default" 
                    className="table-button"
                    onClick={() => handleCheckout(table.id, table.name)}
                  >
                    <DollarSign className="table-button-icon" />
                    结账
                  </Button>
                </>
              )}
              {table.status === "reserved" && (
                <Button 
                  size="sm" 
                  className="table-button"
                  onClick={() => handleOpenTable(table.id, table.name)}
                >
                  确认开台
                </Button>
              )}
              {table.status === "maintenance" && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="table-button"
                >
                  标记为可用
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      {tables.length === 0 && (
        <div className="empty-tables">
          <p className="empty-tables-text">没有找到符合条件的台桌</p>
        </div>
      )}
    </div>
  );
}