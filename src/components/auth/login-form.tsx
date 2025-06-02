"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
    <form onSubmit={handleSubmit} className="login-form">
      <div className="login-form-group">
        <label htmlFor="username" className="login-label">用户名</label>
        <input id="username" className="login-input" placeholder="请输入用户名" required />
      </div>
      <div className="login-form-group">
        <label htmlFor="password" className="login-label">密码</label>
        <input id="password" type="password" className="login-input" placeholder="请输入密码" required />
      </div>
      <button type="submit" className="login-btn" disabled={isLoading}>
        {isLoading ? "登录中..." : "登录"}
      </button>
    </form>
  );
}