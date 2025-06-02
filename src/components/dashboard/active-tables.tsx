"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 类型定义
interface Table {
  id: number;
  name: string;
  type: 'private_room' | 'hall';
  status: 'idle' | 'in_use';
  session_id?: number;
  start_time?: string;
  billing_method_name?: string;
  billing_method_type?: 'hourly' | 'fixed' | 'package';
  base_price?: number;
  package_hours?: number;
  package_price?: number;
  extra_hour_price?: number;
  consumptions: Array<{
    id: number;
    product_name: string;
    quantity: number;
    price: number;
  }>;
}

interface BillingMethod {
  id: number;
  name: string;
  type: 'hourly' | 'fixed' | 'package';
  base_price: number;
  package_hours?: number;
  package_price?: number;
  extra_hour_price?: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

export default function ActiveTables() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingMethods, setBillingMethods] = useState<BillingMethod[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedBillingMethod, setSelectedBillingMethod] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [productQuantity, setProductQuantity] = useState(1);

  // 加载数据
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const tenantId = 1; // TODO: 从认证信息中获取
      const response = await fetch('/api/tables/active');
      const data = await response.json();
      // 确保 data 是数组
      setTables(Array.isArray(data) ? data : []);

      const billingResponse = await fetch('/api/billing-methods');
      const billingData = await billingResponse.json();
      setBillingMethods(Array.isArray(billingData) ? billingData : []);

      const productsResponse = await fetch('/api/products');
      const productsData = await productsResponse.json();
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error('加载数据失败:', error);
      toast.error('加载数据失败');
      // 发生错误时设置为空数组
      setTables([]);
      setBillingMethods([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  // 计算使用时长
  const getDuration = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}小时${minutes}分钟`;
  };

  // 获取状态标签
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_use':
        return <Badge className="bg-red-500">使用中</Badge>;
      case 'idle':
        return <Badge className="bg-green-500">空闲</Badge>;
      default:
        return <Badge>未知</Badge>;
    }
  };

  // 开台
  async function handleStartTable(table: Table) {
    if (!selectedBillingMethod) {
      toast.error('请选择计费方式');
      return;
    }

    try {
      const response = await fetch('/api/tables/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: table.id,
          billingMethodId: selectedBillingMethod,
        }),
      });

      if (!response.ok) throw new Error('开台失败');

      toast.success('开台成功');
      loadData(); // 重新加载数据
    } catch (error) {
      toast.error('开台失败');
    }
  }

  // 添加商品
  async function handleAddProduct(table: Table) {
    if (!selectedProduct || !table.session_id) {
      toast.error('请选择商品');
      return;
    }

    try {
      const response = await fetch('/api/tables/add-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableSessionId: table.session_id,
          productId: selectedProduct,
          quantity: productQuantity,
        }),
      });

      if (!response.ok) throw new Error('添加商品失败');

      toast.success('添加商品成功');
      loadData(); // 重新加载数据
    } catch (error) {
      toast.error('添加商品失败');
    }
  }

  // 结账
  async function handleEndSession(table: Table) {
    if (!table.session_id) return;

    try {
      const response = await fetch(`/api/tables/end/${table.session_id}`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('结账失败');

      const bill = await response.json();
      toast.success(`结账成功，总金额：¥${bill.total_amount}`);
      loadData(); // 重新加载数据
    } catch (error) {
      toast.error('结账失败');
    }
  }

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>台桌状态</CardTitle>
          <CardDescription>管理当前台桌的使用情况</CardDescription>
        </div>
        <Button size="sm" asChild>
          <Link href="/dashboard/tables">
            <PlusCircle className="h-4 w-4 mr-2" />
            新增台桌
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tables.map((table) => (
            <Card key={table.id} className="overflow-hidden">
              <div className={`p-4 ${
                table.status === 'in_use' ? 'bg-red-50 dark:bg-red-900/20' : 
                'bg-green-50 dark:bg-green-900/20'
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{table.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {table.type === 'private_room' ? '包间' : '大厅'}
                    </p>
                  </div>
                  <div>{getStatusBadge(table.status)}</div>
                </div>
              </div>
              <CardContent className="p-4">
                {table.status === 'in_use' && table.start_time && (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm">已开: {getDuration(table.start_time)}</span>
                      </div>
                      <div className="text-sm font-medium">
                        {table.billing_method_name}: {
                          table.billing_method_type === 'hourly' ? `${table.base_price}元/小时` :
                          table.billing_method_type === 'fixed' ? `${table.base_price}元/次` :
                          `${table.package_price}元/${table.package_hours}小时`
                        }
                      </div>
                    </div>
                    {table.consumptions.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium mb-1">消费商品:</h4>
                        <ul className="text-sm">
                          {table.consumptions.map((consumption) => (
                            <li key={consumption.id} className="flex justify-between">
                              <span>{consumption.product_name} x{consumption.quantity}</span>
                              <span>¥{consumption.price * consumption.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
                <div className="flex gap-2 mt-3">
                  {table.status === 'idle' && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="w-full">开台</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>选择计费方式</DialogTitle>
                          <DialogDescription>
                            请为 {table.name} 选择计费方式
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Select
                            onValueChange={(value) => setSelectedBillingMethod(Number(value))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="选择计费方式" />
                            </SelectTrigger>
                            <SelectContent>
                              {billingMethods.map((method) => (
                                <SelectItem key={method.id} value={method.id.toString()}>
                                  {method.name} - {
                                    method.type === 'hourly' ? `${method.base_price}元/小时` :
                                    method.type === 'fixed' ? `${method.base_price}元/次` :
                                    `${method.package_price}元/${method.package_hours}小时`
                                  }
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            className="w-full"
                            onClick={() => handleStartTable(table)}
                          >
                            确认开台
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  {table.status === 'in_use' && (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="flex-1">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            添加商品
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>添加商品</DialogTitle>
                            <DialogDescription>
                              为 {table.name} 添加消费商品
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Select
                              onValueChange={(value) => setSelectedProduct(Number(value))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="选择商品" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map((product) => (
                                  <SelectItem key={product.id} value={product.id.toString()}>
                                    {product.name} - ¥{product.price}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="space-y-2">
                              <Label>数量</Label>
                              <Input
                                type="number"
                                min="1"
                                value={productQuantity}
                                onChange={(e) => setProductQuantity(Number(e.target.value))}
                              />
                            </div>
                            <Button
                              className="w-full"
                              onClick={() => handleAddProduct(table)}
                            >
                              确认添加
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="default"
                        className="flex-1"
                        onClick={() => handleEndSession(table)}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        结账
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}