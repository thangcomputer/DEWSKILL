'use client';

import { useCallback, useEffect, useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { adminFetch } from './adminFetch';

const STATUS = {
  new: { label: 'Mới', tone: 'bg-amber-50 text-amber-700' },
  contacted: { label: 'Đã gọi', tone: 'bg-sky-50 text-sky-700' },
  done: { label: 'Hoàn tất', tone: 'bg-dew-50 text-dew-700' },
};

function formatTime(value) {
  return new Date(value).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
}

function exportCsv(rows) {
  const head = ['Họ tên', 'Số điện thoại', 'Nhu cầu', 'Trạng thái', 'Thời gian'];
  const lines = rows.map((r) =>
    [r.name, r.phone, r.need, STATUS[r.status]?.label || r.status, formatTime(r.createdAt)]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(','),
  );
  const blob = new Blob([`\uFEFF${[head.join(','), ...lines].join('\n')}`], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'khach-tu-van-dewskill.csv';
  link.click();
  URL.revokeObjectURL(link.href);
}

export default function LeadsTab() {
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    const res = await adminFetch('/api/admin/leads');
    setRows(res.data);
  }, []);

  useEffect(() => {
    load().catch((e) => setMessage(e.message));
  }, [load]);

  async function setStatus(id, status) {
    await adminFetch('/api/admin/leads', { method: 'PATCH', body: { id, status } });
    await load();
  }

  async function remove(id) {
    if (!window.confirm('Xóa liên hệ này?')) return;
    await adminFetch(`/api/admin/leads?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div className="glass rounded-drop p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-black text-ink">Khách để lại thông tin ({rows.length})</h2>
        <button type="button" className="btn-ghost !px-4 !py-2" disabled={!rows.length} onClick={() => exportCsv(rows)}>
          <Download size={14} /> Xuất Excel (CSV)
        </button>
      </div>
      {message ? <p className="text-sm font-bold text-red-600">{message}</p> : null}
      {rows.length === 0 ? <p className="text-sm font-semibold text-slate-500">Chưa có khách nào.</p> : null}
      <ul className="grid gap-2">
        {rows.map((row) => (
          <li key={row.id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-ink">{row.name}</p>
              <p className="text-xs font-semibold text-slate-500">
                <a href={`tel:${row.phone}`} className="text-dew-600">{row.phone}</a> · {row.need || 'Chưa chọn'} · {formatTime(row.createdAt)}
              </p>
            </div>
            <select
              value={row.status}
              onChange={(e) => setStatus(row.id, e.target.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-extrabold outline-none ${STATUS[row.status]?.tone}`}
            >
              {Object.entries(STATUS).map(([value, { label }]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <button type="button" aria-label="Xóa" onClick={() => remove(row.id)} className="rounded-full p-2 text-red-500 hover:bg-red-50">
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

