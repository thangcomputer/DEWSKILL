'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import Mascot from './Mascot';

const NEEDS = ['Word', 'Excel', 'PowerPoint', 'Tin học cơ bản', 'Luyện thi chứng chỉ'];

export default function LeadForm({ site, hotline }) {
  const [form, setForm] = useState({ name: '', phone: '', need: NEEDS[0], website: '' });
  const [state, setState] = useState({ status: 'idle', message: '' });

  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setState({ status: 'loading', message: '' });
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body.message || 'Không gửi được');
      setState({ status: 'done', message: '' });
    } catch (error) {
      setState({ status: 'error', message: error.message });
    }
  }

  return (
    <section id="tu-van" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-10 sm:py-14">
      <div className="reveal-scale glass grid items-center gap-8 rounded-drop p-6 sm:p-10 md:grid-cols-[1fr_1.2fr]">
        <div className="text-center md:text-left">
          {site?.leadImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={site.leadImage}
              alt="Tư vấn học tập"
              className="mx-auto md:mx-0 h-32 w-32 sm:h-36 sm:w-36 object-contain mb-2"
            />
          ) : (
            <Mascot name="y-tuong" size={140} className="mx-auto md:mx-0" />
          )}
          <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">
            {site?.leadTitle || 'Cần bạn đồng hành?'}
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-600">
            {site?.leadSubtitle ||
              'Để lại số điện thoại, chúng tôi sẽ hướng dẫn bạn tạo tài khoản và bắt đầu lộ trình tự học.'}
            {hotline ? ` Hotline: ${hotline}.` : ''}
          </p>
        </div>

        {state.status === 'done' ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <CheckCircle2 size={44} className="text-dew-500" />
            <p className="text-lg font-black text-ink">Đã nhận thông tin của bạn</p>
            <p className="text-sm font-medium text-slate-600">Chúng tôi sẽ liên hệ sớm nhất có thể.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-3">
            {/* Ô ẩn chống bot, người thật không thấy */}
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={set('website')}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />
            <input className="field" placeholder="Họ và tên" value={form.name} onChange={set('name')} required />
            <input
              className="field"
              placeholder="Số điện thoại"
              inputMode="tel"
              value={form.phone}
              onChange={set('phone')}
              required
            />
            <select className="field" value={form.need} onChange={set('need')}>
              {NEEDS.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
            {state.status === 'error' ? (
              <p className="text-sm font-bold text-red-600">{state.message}</p>
            ) : null}
            <button type="submit" disabled={state.status === 'loading'} className="btn-primary disabled:opacity-60">
              {state.status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : null}
              Gửi thông tin
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

