"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BillingMethod } from "@/lib/types";
import "./new-billing-method-dialog.css";

interface NewBillingMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (method: any) => void;
}

export default function NewBillingMethodDialog({
  open,
  onOpenChange,
  onSave,
}: NewBillingMethodDialogProps) {
  const [name, setName] = useState("");
  const [method, setMethod] = useState<BillingMethod | "">("");
  const [rate, setRate] = useState("");
  const [packageHours, setPackageHours] = useState("");
  const [overageRate, setOverageRate] = useState("");
  const [description, setDescription] = useState("");

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setName("");
      setMethod("");
      setRate("");
      setPackageHours("");
      setOverageRate("");
      setDescription("");
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newMethod = {
      name,
      method,
      rate: parseFloat(rate),
      packageHours: method === "package" ? parseFloat(packageHours) : null,
      overageRate: method === "package" ? parseFloat(overageRate) : null,
      description,
    };

    onSave(newMethod);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="billing-dialog">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>新增计费方式</DialogTitle>
            <DialogDescription>
              创建新的计费方式，可以应用于不同的台桌。
            </DialogDescription>
          </DialogHeader>
          <div className="billing-form">
            <div className="form-row">
              <Label htmlFor="name" className="form-label">
                名称
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                placeholder="标准计时 / 大厅计次"
                required
              />
            </div>
            
            <div className="form-row">
              <Label htmlFor="method" className="form-label">
                计费类型
              </Label>
              <Select
                value={method}
                onValueChange={(value) => setMethod(value as BillingMethod)}
                required
              >
                <SelectTrigger id="method" className="form-input">
                  <SelectValue placeholder="选择计费类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">按时计费</SelectItem>
                  <SelectItem value="session">按次计费</SelectItem>
                  <SelectItem value="package">套餐计费</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="form-row">
              <Label htmlFor="rate" className="form-label">
                基础费率
              </Label>
              <div className="form-input-group">
                <Input
                  id="rate"
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="30"
                  required
                  min="0"
                  step="0.01"
                />
                <span className="form-unit">
                  元
                  {method === "hourly" && "/小时"}
                  {method === "session" && "/局"}
                  {method === "package" && "/套餐"}
                </span>
              </div>
            </div>
            
            {method === "package" && (
              <>
                <div className="form-row">
                  <Label htmlFor="package-hours" className="form-label">
                    套餐时长
                  </Label>
                  <div className="form-input-group">
                    <Input
                      id="package-hours"
                      type="number"
                      value={packageHours}
                      onChange={(e) => setPackageHours(e.target.value)}
                      placeholder="4"
                      required
                      min="0"
                      step="0.5"
                    />
                    <span className="form-unit">小时</span>
                  </div>
                </div>
                
                <div className="form-row">
                  <Label htmlFor="overage-rate" className="form-label">
                    超时费率
                  </Label>
                  <div className="form-input-group">
                    <Input
                      id="overage-rate"
                      type="number"
                      value={overageRate}
                      onChange={(e) => setOverageRate(e.target.value)}
                      placeholder="20"
                      required
                      min="0"
                      step="0.01"
                    />
                    <span className="form-unit">元/小时</span>
                  </div>
                </div>
              </>
            )}
            
            <div className="form-row">
              <Label htmlFor="description" className="form-label description-label">
                描述
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea"
                placeholder="填写计费方式的详细说明"
                rows={3}
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