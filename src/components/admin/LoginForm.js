'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { adminFetch } from './adminFetch';

export default function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      await adminFetch('/api/admin/session', { method: 'POST', body: { password } });
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="glass w-full max-w-sm rounded-drop p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-drop bg-dew-50 text-dew-600">
          <Lock size={22} />
        </span>
        <h1 className="mt-4 text-2xl font-black text-ink">Quản trị DewSkill</h1>
        <input
          type="password"
          className="field mt-5"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          required
        />
        {error ? <p className="mt-2 text-sm font-bold text-red-600">{error}</p> : null}
        <button type="submit" className="btn-primary mt-4 w-full">
          Đăng nhập
        </button>
      </form>
    </main>
  );
}

