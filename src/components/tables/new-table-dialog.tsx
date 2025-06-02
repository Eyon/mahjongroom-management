"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableStatus } from "@/lib/types";

interface NewTableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (table: any) => void;
}

export default function NewTableDialog({ open, onOpenChange, onSave }: NewTableDialogProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [billingMethod, setBillingMethod] = useState("");
  const [rate, setRate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTable = {
      name,
      location,
      billingMethod,
      rate,
      status: "vacant" as TableStatus,
    };
    
    onSave(newTable);
    
    // Reset form
    setName("");
    setLocation("");
    setBillingMethod("");
    setRate("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>新增台桌</DialogTitle>
            <DialogDescription>
              添加新的台桌信息。创建后，台桌将处于空闲状态。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                名称
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="包间1 / 大厅A"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                位置
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="col-span-3"
                placeholder="一楼 / 二楼"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="billing-method" className="text-right">
                计费方式
              </Label>
              <Select
                value={billingMethod}
                onValueChange={setBillingMethod}
                required
              >
                <SelectTrigger id="billing-method" className="col-span-3">
                  <SelectValue placeholder="选择计费方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="计时">计时</SelectItem>
                  <SelectItem value="计次">计次</SelectItem>
                  <SelectItem value="套餐">套餐</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rate" className="text-right">
                费率
              </Label>
              <Input
                id="rate"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="col-span-3"
                placeholder="30元/小时 或 40元/局"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">保存</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}