"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import "./new-product-dialog.css";

interface NewProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (product: any) => void;
  existingCategories: string[];
}

export default function NewProductDialog({
  open,
  onOpenChange,
  onSave,
  existingCategories,
}: NewProductDialogProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [stock, setStock] = useState("");
  const [useNewCategory, setUseNewCategory] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setName("");
      setCategory("");
      setNewCategory("");
      setPrice("");
      setCost("");
      setStock("");
      setUseNewCategory(false);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategory = useNewCategory ? newCategory : category;

    const newProduct = {
      name,
      category: finalCategory,
      price: parseFloat(price),
      cost: parseFloat(cost),
      stock: parseInt(stock, 10),
    };

    onSave(newProduct);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="product-dialog">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>新增商品</DialogTitle>
            <DialogDescription>
              添加新的商品及其价格和库存信息。
            </DialogDescription>
          </DialogHeader>
          <div className="product-form">
            <div className="form-row">
              <Label htmlFor="name" className="form-label">
                商品名称
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                placeholder="红牛 / 华子"
                required
              />
            </div>
            
            <div className="form-row">
              <Label htmlFor="category" className="form-label">
                商品分类
              </Label>
              {!useNewCategory ? (
                <div className="category-input-group">
                  <Select
                    value={category}
                    onValueChange={setCategory}
                    required={!useNewCategory}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      {existingCategories.map((cat) => (
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
                <div className="category-input-group">
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
            
            <div className="form-row">
              <Label htmlFor="price" className="form-label">
                售价
              </Label>
              <div className="form-input-group">
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="15"
                  required
                  min="0"
                  step="0.01"
                />
                <span className="form-unit">元</span>
              </div>
            </div>
            
            <div className="form-row">
              <Label htmlFor="cost" className="form-label">
                成本
              </Label>
              <div className="form-input-group">
                <Input
                  id="cost"
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="10"
                  required
                  min="0"
                  step="0.01"
                />
                <span className="form-unit">元</span>
              </div>
            </div>
            
            <div className="form-row">
              <Label htmlFor="stock" className="form-label">
                库存
              </Label>
              <div className="form-input-group">
                <Input
                  id="stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="50"
                  required
                  min="0"
                  step="1"
                />
                <span className="form-unit">件</span>
              </div>
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