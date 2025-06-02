"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real application, we would authenticate with the backend
    // For demo purposes, we'll just redirect to the dashboard
    setTimeout(() => {
      setIsLoading(false);
      toast.success("登录成功");
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-gray-300">用户名</Label>
        <Input 
          id="username" 
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          placeholder="请输入用户名" 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-300">密码</Label>
        <Input 
          id="password" 
          type="password" 
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          placeholder="请输入密码" 
          required 
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-colors"
        disabled={isLoading}
      >
        {isLoading ? "登录中..." : "登录"}
      </Button>
    </form>
  );
}