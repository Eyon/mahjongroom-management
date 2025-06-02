"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BillingMethod } from "@/lib/types";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import NewBillingMethodDialog from "@/components/billing/new-billing-method-dialog";
import "./billing-management.css";

// Mock data for billing methods
const mockBillingMethods = [
  {
    id: "1",
    name: "标准计时",
    method: "hourly" as BillingMethod,
    rate: 30,
    packageHours: null,
    overageRate: null,
    description: "按照使用时间计费，适用于大多数台桌",
  },
  {
    id: "2",
    name: "大厅计次",
    method: "session" as BillingMethod,
    rate: 40,
    packageHours: null,
    overageRate: null,
    description: "按照游戏局数计费，不限制时间",
  },
  {
    id: "3",
    name: "包间套餐4小时",
    method: "package" as BillingMethod,
    rate: 80,
    packageHours: 4,
    overageRate: 20,
    description: "包间4小时套餐，超出后按每小时20元计费",
  },
  {
    id: "4",
    name: "会员计时",
    method: "hourly" as BillingMethod,
    rate: 25,
    packageHours: null,
    overageRate: null,
    description: "会员专享优惠计时价格",
  },
  {
    id: "5",
    name: "午市套餐",
    method: "package" as BillingMethod,
    rate: 60,
    packageHours: 3,
    overageRate: 25,
    description: "中午12点-15点特惠套餐",
  },
];

export default function BillingManagement() {
  const [billingMethods, setBillingMethods] = useState(mockBillingMethods);
  const [isNewMethodDialogOpen, setIsNewMethodDialogOpen] = useState(false);

  const handleAddBillingMethod = (newMethod: any) => {
    setBillingMethods([...billingMethods, { ...newMethod, id: String(billingMethods.length + 1) }]);
    setIsNewMethodDialogOpen(false);
    toast.success("计费方式添加成功");
  };

  const handleDeleteBillingMethod = (id: string) => {
    setBillingMethods(billingMethods.filter(method => method.id !== id));
    toast.success("计费方式删除成功");
  };

  return (
    <>
      <div className="billing-header">
        <div>
          <h2 className="billing-title">计费方式管理</h2>
          <p className="billing-subtitle">创建和管理不同的计费方式，应用于不同的台桌</p>
        </div>
        <Button onClick={() => setIsNewMethodDialogOpen(true)}>
          <PlusCircle className="add-icon" />
          新增计费方式
        </Button>
      </div>

      <div className="billing-grid">
        {billingMethods.map((method) => (
          <Card key={method.id}>
            <CardHeader className="billing-card-header">
              <div className="billing-card-title-row">
                <CardTitle>{method.name}</CardTitle>
                <div className="billing-card-actions">
                  <Button variant="ghost" size="icon" className="action-button">
                    <Pencil className="action-icon" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="action-button delete"
                    onClick={() => handleDeleteBillingMethod(method.id)}
                  >
                    <Trash2 className="action-icon" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                {method.method === "hourly" && "按时计费"}
                {method.method === "session" && "按次计费"}
                {method.method === "package" && "套餐计费"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="billing-details">
                <div className="billing-detail-row">
                  <span className="detail-label">基础费率</span>
                  <span className="detail-value">
                    {method.rate}元
                    {method.method === "hourly" && "/小时"}
                    {method.method === "session" && "/局"}
                    {method.method === "package" && "/套餐"}
                  </span>
                </div>
                
                {method.method === "package" && (
                  <>
                    <div className="billing-detail-row">
                      <span className="detail-label">套餐时长</span>
                      <span className="detail-value">{method.packageHours}小时</span>
                    </div>
                    <div className="billing-detail-row">
                      <span className="detail-label">超时费率</span>
                      <span className="detail-value">{method.overageRate}元/小时</span>
                    </div>
                  </>
                )}
                
                <div className="billing-description">
                  {method.description}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <NewBillingMethodDialog
        open={isNewMethodDialogOpen}
        onOpenChange={setIsNewMethodDialogOpen}
        onSave={handleAddBillingMethod}
      />
    </>
  );
}