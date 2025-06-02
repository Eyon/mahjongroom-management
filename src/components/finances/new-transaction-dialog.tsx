"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface NewTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (transaction: any) => void;
  incomeCategories: string[];
  expenseCategories: string[];
}

export default function NewTransactionDialog({
  open,
  onOpenChange,
  onSave,
  incomeCategories,
  expenseCategories,
}: NewTransactionDialogProps) {
  const [type, setType] = useState<"income" | "expense" | "">("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [useNewCategory, setUseNewCategory] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setType("");
      setCategory("");
      setNewCategory("");
      setDescription("");
      setAmount("");
      setUseNewCategory(false);
    }
  }, [open]);

  // Reset category when type changes
  useEffect(() => {
    setCategory("");
    setUseNewCategory(false);
  }, [type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategory = useNewCategory ? newCategory : category;

    const newTransaction = {
      type,
      category: finalCategory,
      description,
      amount: parseFloat(amount),
    };

    onSave(newTransaction);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>记录交易</DialogTitle>
            <DialogDescription>
              添加新的收支记录。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                交易类型
              </Label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as "income" | "expense")}
                required
              >
                <SelectTrigger id="type" className="col-span-3">
                  <SelectValue placeholder="选择交易类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">收入</SelectItem>
                  <SelectItem value="expense">支出</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {type && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  交易分类
                </Label>
                {!useNewCategory ? (
                  <div className="col-span-3 flex gap-2">
                    <Select
                      value={category}
                      onValueChange={setCategory}
                      required={!useNewCategory}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="选择分类" />
                      </SelectTrigger>
                      <SelectContent>
                        {type === "income" && incomeCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                        {type === "expense" && expenseCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setUseNewCategory(true)}
                    >
                      新建分类
                    </Button>
                  </div>
                ) : (
                  <div className="col-span-3 flex gap-2">
                    <Input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="输入新分类名称"
                      required={useNewCategory}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setUseNewCategory(false)}
                    >
                      选择已有
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                金额
              </Label>
              <div className="col-span-3 flex items-center">
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="100"
                  required
                  min="0"
                  step="0.01"
                />
                <span className="ml-2">元</span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                描述
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                placeholder="填写交易详情"
                rows={3}
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