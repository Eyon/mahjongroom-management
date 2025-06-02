import LoginForm from '@/components/auth/login-form';
import { ChinaMapIcon } from '@/components/ui/icons';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-xl">
        <div className="flex flex-col items-center gap-4 mb-8">
          <ChinaMapIcon className="w-16 h-16 text-blue-500" />
          <h1 className="text-3xl font-bold text-white">麻将馆管理系统</h1>
          <p className="text-gray-400 text-center">
            专业的麻将馆后台管理解决方案
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}