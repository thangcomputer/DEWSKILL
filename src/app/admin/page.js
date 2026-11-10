import { isAdmin } from '@/lib/auth';
import LoginForm from '@/components/admin/LoginForm';
import AdminPanel from '@/components/admin/AdminPanel';

export const metadata = { title: 'Quản trị DewSkill', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return isAdmin() ? <AdminPanel /> : <LoginForm />;
}

