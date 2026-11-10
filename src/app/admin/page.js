import { isAdmin } from '@/lib/auth';
import LoginForm from '@/components/admin/LoginForm';
import AdminPanel from '@/components/admin/AdminPanel';
import { getSite } from '@/lib/store';

export async function generateMetadata() {
  const site = await getSite();
  const favicon = site.faviconUrl || '/brand/favicon.png';
  const v = site.updatedAt || '1';
  const faviconWithVersion = `${favicon}?v=${v}`;
  return {
    title: `Quản trị ${site.brandName || 'DewSkill'}`,
    robots: { index: false, follow: false },
    icons: {
      icon: [
        { url: faviconWithVersion },
        { url: `/favicon.png?v=${v}` },
        { url: `/favicon.ico?v=${v}` },
      ],
      shortcut: faviconWithVersion,
      apple: faviconWithVersion,
    },
  };
}

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return isAdmin() ? <AdminPanel /> : <LoginForm />;
}

