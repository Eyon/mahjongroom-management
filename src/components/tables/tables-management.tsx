"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TableStatus } from "@/lib/types";
import TablesList from "@/components/tables/tables-list";
import NewTableDialog from "@/components/tables/new-table-dialog";
import "./tables-management.css";

// Mock data for tables
const mockTables = [
  {
    id: "1",
    name: "包间 1",
    status: "occupied" as TableStatus,
    location: "二楼",
    billingMethod: "计时",
    rate: "30元/小时",
  },
  {
    id: "2",
    name: "包间 2",
    status: "occupied" as TableStatus,
    location: "二楼",
    billingMethod: "套餐",
    rate: "80元/4小时",
  },
  {
    id: "3",
    name: "包间 3",
    status: "vacant" as TableStatus,
    location: "二楼",
    billingMethod: "计时",
    rate: "30元/小时",
  },
  {
    id: "4",
    name: "包间 4",
    status: "maintenance" as TableStatus,
    location: "二楼",
    billingMethod: "计时",
    rate: "30元/小时",
  },
  {
    id: "5",
    name: "大厅 A",
    status: "vacant" as TableStatus,
    location: "一楼",
    billingMethod: "计次",
    rate: "40元/局",
  },
  {
    id: "6",
    name: "大厅 B",
    status: "reserved" as TableStatus,
    location: "一楼",
    billingMethod: "计时",
    rate: "25元/小时",
  },
  {
    id: "7",
    name: "大厅 C",
    status: "vacant" as TableStatus,
    location: "一楼",
    billingMethod: "计次",
    rate: "40元/局",
  },
  {
    id: "8",
    name: "大厅 D",
    status: "vacant" as TableStatus,
    location: "一楼",
    billingMethod: "计次",
    rate: "40元/局",
  },
];

export default function TablesManagement() {
  const [tables, setTables] = useState(mockTables);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewTableDialogOpen, setIsNewTableDialogOpen] = useState(false);

  const getFilteredTables = (status?: TableStatus) => {
    return tables
      .filter((table) => 
        (status ? table.status === status : true) &&
        table.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  };

  const handleAddTable = (newTable: any) => {
    setTables([...tables, { ...newTable, id: String(tables.length + 1) }]);
    setIsNewTableDialogOpen(false);
  };

  return (
    <>
      <div className="tables-header">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <Input
            type="search"
            placeholder="搜索台桌..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsNewTableDialogOpen(true)}>
          <PlusCircle className="add-icon" />
          新增台桌
        </Button>
      </div>

      <Tabs defaultValue="all" className="tables-tabs">
        <TabsList>
          <TabsTrigger value="all">所有台桌 ({tables.length})</TabsTrigger>
          <TabsTrigger value="occupied">使用中 ({getFilteredTables("occupied").length})</TabsTrigger>
          <TabsTrigger value="vacant">空闲 ({getFilteredTables("vacant").length})</TabsTrigger>
          <TabsTrigger value="reserved">已预订 ({getFilteredTables("reserved").length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="tabs-content">
          <TablesList tables={getFilteredTables()} />
        </TabsContent>
        
        <TabsContent value="occupied" className="tabs-content">
          <TablesList tables={getFilteredTables("occupied")} />
        </TabsContent>
        
        <TabsContent value="vacant" className="tabs-content">
          <TablesList tables={getFilteredTables("vacant")} />
        </TabsContent>
        
        <TabsContent value="reserved" className="tabs-content">
          <TablesList tables={getFilteredTables("reserved")} />
        </TabsContent>
      </Tabs>

      <NewTableDialog 
        open={isNewTableDialogOpen} 
        onOpenChange={setIsNewTableDialogOpen}
        onSave={handleAddTable}
      />
    </>
  );
}