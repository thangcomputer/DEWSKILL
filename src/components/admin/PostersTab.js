'use client';

import { useCallback, useEffect, useState } from 'react';
import { Pencil, Pin, Trash2, Upload } from 'lucide-react';
import { adminFetch } from './adminFetch';

const EMPTY = { title: '', summary: '', category: 'Thông báo', image: '', link: '', pinned: false, published: true };
const CATEGORIES = ['Ưu đãi', 'Mẹo học', 'Thông báo', 'Sự kiện'];

export default function PostersTab() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const res = await adminFetch('/api/admin/posters');
    setRows(res.data);
  }, []);

  useEffect(() => {
    load().catch((e) => setMessage(e.message));
  }, [load]);

  const set = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }));

  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage('');
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await adminFetch('/api/admin/upload', { method: 'POST', body: data });
      setForm((prev) => ({ ...prev, image: res.url }));
    } catch (err) {
      setMessage(err.message);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  async function save(event) {
    event.preventDefault();
    setMessage('');
    try {
      await adminFetch('/api/admin/posters', { method: 'POST', body: form });
      setForm(EMPTY);
      await load();
      setMessage('Đã lưu');
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function remove(id) {
    if (!window.confirm('Xóa poster này?')) return;
    await adminFetch(`/api/admin/posters?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <form onSubmit={save} className="glass grid h-fit gap-3 rounded-drop p-5">
        <h2 className="font-black text-ink">{form.id ? 'Sửa poster' : 'Thêm poster / bài viết'}</h2>
        <input className="field" placeholder="Tiêu đề" value={form.title} onChange={set('title')} required />
        <textarea className="field min-h-[80px]" placeholder="Mô tả ngắn" value={form.summary} onChange={set('summary')} />
        <select className="field" value={form.category} onChange={set('category')}>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <div className="flex items-center gap-3">
          <label className="btn-ghost cursor-pointer !px-4 !py-2">
            <Upload size={14} /> {uploading ? 'Đang tải...' : 'Tải ảnh poster'}
            <input type="file" accept="image/*" className="hidden" onChange={upload} />
          </label>
          {form.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.image} alt="" className="h-12 w-16 rounded-lg object-cover" />
          ) : null}
        </div>
        <input
          className="field"
          placeholder="Link khi bấm vào (để trống nếu không cần, đường dẫn bắt đầu bằng / sẽ nối vào địa chỉ LMS)"
          value={form.link}
          onChange={set('link')}
        />
        <div className="flex gap-5 text-sm font-extrabold text-slate-700">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.published} onChange={set('published')} /> Hiển thị
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.pinned} onChange={set('pinned')} /> Ghim lên đầu
          </label>
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary">
            {form.id ? 'Cập nhật' : 'Thêm mới'}
          </button>
          {form.id ? (
            <button type="button" className="btn-ghost" onClick={() => setForm(EMPTY)}>
              Hủy sửa
            </button>
          ) : null}
          {message ? <span className="text-sm font-bold text-dew-700">{message}</span> : null}
        </div>
      </form>

      <ul className="grid h-fit gap-3">
        {rows.length === 0 ? <li className="text-sm font-semibold text-slate-500">Chưa có poster nào.</li> : null}
        {rows.map((row) => (
          <li key={row.id} className="glass flex items-center gap-3 rounded-2xl p-3">
            <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-dew-100">
              {row.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={row.image} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1 truncate text-sm font-black text-ink">
                {row.pinned ? <Pin size={12} className="text-amber-500" /> : null}
                {row.title}
              </p>
              <p className="text-xs font-semibold text-slate-500">
                {row.category} · {row.published ? 'Đang hiển thị' : 'Đang ẩn'}
              </p>
            </div>
            <button type="button" aria-label="Sửa" onClick={() => setForm(row)} className="rounded-full p-2 hover:bg-dew-50">
              <Pencil size={16} />
            </button>
            <button type="button" aria-label="Xóa" onClick={() => remove(row.id)} className="rounded-full p-2 text-red-500 hover:bg-red-50">
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

