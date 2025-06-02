"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PlusCircle, 
  Search, 
  Filter,
  Edit,
  Trash2,
  ChevronsUpDown
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NewProductDialog from "@/components/products/new-product-dialog";
import "./products-management.css";

// Mock data for products
const mockProducts = [
  {
    id: "1",
    name: "红牛",
    category: "饮料",
    price: 15,
    cost: 10,
    stock: 48,
  },
  {
    id: "2",
    name: "农夫山泉",
    category: "饮料",
    price: 5,
    cost: 2,
    stock: 100,
  },
  {
    id: "3",
    name: "华子",
    category: "香烟",
    price: 60,
    cost: 52,
    stock: 20,
  },
  {
    id: "4",
    name: "中华",
    category: "香烟",
    price: 100,
    cost: 90,
    stock: 15,
  },
  {
    id: "5",
    name: "大红袍茶",
    category: "茶叶",
    price: 20,
    cost: 8,
    stock: 30,
  },
  {
    id: "6",
    name: "瓜子",
    category: "零食",
    price: 15,
    cost: 8,
    stock: 40,
  },
  {
    id: "7",
    name: "花生",
    category: "零食",
    price: 10,
    cost: 5,
    stock: 50,
  },
];

export default function ProductsManagement() {
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isNewProductDialogOpen, setIsNewProductDialogOpen] = useState(false);

  // Get unique categories
  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );

  // Filter products based on search query and category
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (categoryFilter === "all" || product.category === categoryFilter)
  );

  const handleAddProduct = (newProduct: any) => {
    setProducts([
      ...products,
      { ...newProduct, id: String(products.length + 1) },
    ]);
    setIsNewProductDialogOpen(false);
    toast.success("商品添加成功");
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
    toast.success("商品删除成功");
  };

  return (
    <>
      <div className="products-header">
        <div className="products-search">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <Input
              type="search"
              placeholder="搜索商品..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="category-select">
              <SelectValue placeholder="所有分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有分类</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsNewProductDialogOpen(true)}>
          <PlusCircle className="add-icon" />
          新增商品
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>商品列表</CardTitle>
          <CardDescription>
            管理商品价格、库存和分类
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>商品名称</TableHead>
                <TableHead>分类</TableHead>
                <TableHead className="text-right">售价 (元)</TableHead>
                <TableHead className="text-right">成本 (元)</TableHead>
                <TableHead className="text-right">库存</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="product-name">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">{product.price}</TableCell>
                  <TableCell className="text-right">{product.cost}</TableCell>
                  <TableCell className="text-right">{product.stock}</TableCell>
                  <TableCell className="text-right">
                    <div className="product-actions">
                      <Button variant="ghost" size="icon" className="action-button">
                        <Edit className="action-icon" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="action-button delete"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="action-icon" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="empty-message">
                    没有找到商品
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <NewProductDialog
        open={isNewProductDialogOpen}
        onOpenChange={setIsNewProductDialogOpen}
        onSave={handleAddProduct}
        existingCategories={categories}
      />
    </>
  );
}