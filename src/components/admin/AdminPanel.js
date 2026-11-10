'use client';

import { useState } from 'react';
import { Bot, LogOut, Megaphone, Settings, Users } from 'lucide-react';
import { adminFetch } from './adminFetch';
import SiteTab from './SiteTab';
import PostersTab from './PostersTab';
import LeadsTab from './LeadsTab';
import AiTrainingTab from './AiTrainingTab';

const TABS = [
  { id: 'posters', label: 'Poster & bài viết', icon: Megaphone },
  { id: 'ai', label: 'Huấn luyện AI tư vấn', icon: Bot },
  { id: 'leads', label: 'Khách tư vấn', icon: Users },
  { id: 'site', label: 'Cấu hình', icon: Settings },
];

export default function AdminPanel() {
  const [tab, setTab] = useState('posters');

  async function logout() {
    await adminFetch('/api/admin/session', { method: 'DELETE' });
    window.location.reload();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-ink">Quản trị DewSkill</h1>
        <div className="flex gap-2">
          <a href="/" target="_blank" className="btn-ghost !px-4 !py-2">
            Xem trang
          </a>
          <button type="button" onClick={logout} className="btn-ghost !px-4 !py-2">
            <LogOut size={14} /> Thoát
          </button>
        </div>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-extrabold transition ${
              tab === id ? 'bg-dew-500 text-white shadow-md shadow-dew-500/30' : 'bg-white text-slate-600 hover:bg-dew-50'
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'posters' && <PostersTab />}
        {tab === 'ai' && <AiTrainingTab />}
        {tab === 'leads' && <LeadsTab />}
        {tab === 'site' && <SiteTab />}
      </div>
    </main>
  );
}

