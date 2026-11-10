'use client';

import { useState } from 'react';
import { Lock, ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';
import { adminFetch } from './adminFetch';

export default function LoginForm() {
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [require2FA, setRequire2FA] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    if (event) event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminFetch('/api/admin/session', {
        method: 'POST',
        body: { password, totpCode: require2FA ? totpCode : undefined },
      });
      if (res?.require2FA) {
        setRequire2FA(true);
        setLoading(false);
        return;
      }
      window.location.reload();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 bg-gradient-to-br from-dew-50/50 via-white to-dew-50/30">
      <form onSubmit={submit} className="glass w-full max-w-sm rounded-drop p-8 shadow-xl border border-dew-100">
        <div className="flex items-center justify-center mb-2">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-dew-100 text-dew-700 shadow-inner">
            {require2FA ? <ShieldCheck size={28} className="text-emerald-600 animate-pulse" /> : <Lock size={26} />}
          </span>
        </div>

        <h1 className="mt-2 text-2xl font-black text-center text-slate-900">
          {require2FA ? 'Xác thực 2 bước' : 'Quản trị DewSkill'}
        </h1>
        <p className="mt-1 text-xs text-center font-medium text-slate-500">
          {require2FA
            ? 'Nhập mã 6 chữ số từ ứng dụng Google Authenticator trên điện thoại'
            : 'Đăng nhập vào bảng điều khiển hệ thống'}
        </p>

        {!require2FA ? (
          <>
            <div className="mt-5">
              <label className="block text-xs font-bold text-slate-600 mb-1">MẬT KHẨU QUẢN TRỊ</label>
              <input
                type="password"
                className="field"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
              />
            </div>
            {error ? <p className="mt-2.5 text-xs font-bold text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">{error}</p> : null}
            <button type="submit" disabled={loading} className="btn-primary mt-5 w-full !py-3">
              {loading ? 'Đang kiểm tra...' : 'Tiếp tục'}
            </button>
          </>
        ) : (
          <>
            <div className="mt-5">
              <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center justify-between">
                <span>MÃ XÁC THỰC GOOGLE (6 SỐ)</span>
                <KeyRound size={13} className="text-dew-600" />
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                className="field text-center font-mono text-2xl tracking-[0.4em] font-extrabold text-slate-800"
                placeholder="••••••"
                value={totpCode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setTotpCode(val);
                }}
                autoFocus
                required
              />
            </div>
            {error ? <p className="mt-2.5 text-xs font-bold text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">{error}</p> : null}
            <button type="submit" disabled={loading || totpCode.length !== 6} className="btn-primary mt-5 w-full !py-3">
              {loading ? 'Đang xác thực...' : 'Xác nhận & Vào quản trị'}
            </button>
            <button
              type="button"
              onClick={() => {
                setRequire2FA(false);
                setTotpCode('');
                setError('');
              }}
              className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition py-1"
            >
              <ArrowLeft size={13} />
              <span>Quay lại nhập mật khẩu</span>
            </button>
          </>
        )}
      </form>
    </main>
  );
}

