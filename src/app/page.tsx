import LoginForm from '@/components/auth/login-form';
import { ChinaMapIcon } from '@/components/ui/icons';

export default function Home() {
  return (
    <div className="home-bg">
      <div className="home-card">
        <div className="home-header">
          <ChinaMapIcon className="home-icon" />
          <h1 className="home-title">麻将馆管理系统</h1>
          <p className="home-desc">
            专业的麻将馆后台管理解决方案
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}