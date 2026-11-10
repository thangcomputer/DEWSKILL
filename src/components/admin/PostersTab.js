'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  Pencil,
  Pin,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { adminFetch } from './adminFetch';
import AiSeoWriterModal from './AiSeoWriterModal';

const EMPTY = {
  title: '',
  summary: '',
  category: 'Mẹo học',
  image: '',
  link: '',
  slug: '',
  content: '',
  keywords: [],
  seoScore: null,
  pinned: false,
  published: true,
};

const CATEGORIES = ['Ưu đãi', 'Mẹo học', 'Hướng dẫn', 'Thông báo', 'Sự kiện'];

export default function PostersTab() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

  const load = useCallback(async () => {
    const res = await adminFetch('/api/admin/posters');
    setRows(res.data);
  }, []);

  useEffect(() => {
    load().catch((e) => setMessage(e.message));
  }, [load]);

  const set = (key) => (event) =>
    setForm((prev) => ({
      ...prev,
      [key]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
    }));

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
      setShowFullContent(false);
      await load();
      setMessage('Đã lưu bài viết thành công!');
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function remove(id) {
    if (!window.confirm('Xóa poster / bài viết này?')) return;
    await adminFetch(`/api/admin/posters?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    await load();
  }

  function handleApplyAiArticle(aiData) {
    setForm((prev) => ({
      ...prev,
      title: aiData.title || prev.title,
      summary: aiData.summary || prev.summary,
      category: aiData.category || prev.category,
      slug: aiData.slug || prev.slug,
      content: aiData.content || prev.content,
      keywords: aiData.keywords || prev.keywords,
      seoScore: aiData.seoScore || prev.seoScore,
      published: true,
    }));
    setShowFullContent(true);
    setMessage('Đã nạp nội dung chuẩn SEO vào form! Bạn có thể chỉnh sửa thêm và bấm Lưu.');
  }

  async function handleDirectSaveAiArticle(aiData) {
    const payload = {
      title: aiData.title,
      summary: aiData.summary,
      category: aiData.category || 'Mẹo học',
      slug: aiData.slug,
      content: aiData.content,
      keywords: aiData.keywords || [],
      seoScore: aiData.seoScore,
      published: true,
      pinned: false,
    };
    await adminFetch('/api/admin/posters', { method: 'POST', body: payload });
    await load();
    setMessage('Đã xuất bản bài viết chuẩn SEO thành công!');
  }

  return (
    <div className="space-y-6">
      {/* Banner AI Viết bài Chuẩn SEO Google */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-dew-800 via-dew-700 to-cyan-700 p-5 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400 text-slate-950 font-black shadow">
                <Sparkles size={16} />
              </span>
              <h3 className="text-base font-black sm:text-lg">
                AI Viết Bài Chuẩn SEO Lên Top Google
              </h3>
            </div>
            <p className="text-xs text-dew-100 max-w-xl font-medium">
              Tự động phân tích từ khóa, cấu trúc tiêu đề H1/H2/H3, thẻ Meta Description, LSI keywords và CTA chuyển đổi giúp bài viết leo top 1 Google.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setAiModalOpen(true)}
            className="shrink-0 inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-2.5 text-xs font-black text-slate-950 shadow-lg hover:bg-amber-300 hover:scale-105 transition"
          >
            <Sparkles size={15} /> Bật AI Viết bài SEO ngay
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Form nhập / sửa poster */}
        <form onSubmit={save} className="glass grid h-fit gap-3 rounded-drop p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-ink">
              {form.id ? 'Sửa bài viết / poster' : 'Thêm poster / bài viết'}
            </h2>
            {form.seoScore ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-black text-emerald-800 border border-emerald-300">
                <CheckCircle2 size={13} /> Điểm SEO: {form.seoScore}/100
              </span>
            ) : null}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Tiêu đề (H1 - Chuẩn SEO 50-65 ký tự) <span className="text-red-500">*</span>
            </label>
            <input
              className="field"
              placeholder="Tiêu đề bài viết..."
              value={form.title}
              onChange={set('title')}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Mô tả ngắn (Meta Description SERP Snippet)
            </label>
            <textarea
              className="field min-h-[75px]"
              placeholder="Mô tả tóm tắt 140-160 ký tự kích thích click trên kết quả tìm kiếm Google..."
              value={form.summary}
              onChange={set('summary')}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Danh mục</label>
              <select className="field" value={form.category} onChange={set('category')}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Slug (Đường dẫn thân thiện SEO)
              </label>
              <input
                className="field !text-xs font-mono"
                placeholder="tu-dong-sinh-tu-tieu-de"
                value={form.slug || ''}
                onChange={set('slug')}
              />
            </div>
          </div>

          {/* Toggle mở rộng nội dung chi tiết bài viết */}
          <div className="rounded-2xl border border-dew-100 bg-dew-50/50 p-3">
            <button
              type="button"
              onClick={() => setShowFullContent(!showFullContent)}
              className="flex w-full items-center justify-between text-xs font-extrabold text-dew-800 hover:text-dew-950"
            >
              <span className="flex items-center gap-1.5">
                <FileText size={14} /> Nội dung bài viết chi tiết (Markdown Chuẩn SEO)
                {form.content ? <span className="text-dew-600 font-normal">({form.content.split(/\s+/).length} từ)</span> : null}
              </span>
              <span>{showFullContent ? 'Thu gọn ▲' : 'Mở rộng ▼'}</span>
            </button>

            {showFullContent ? (
              <div className="mt-3 space-y-2">
                <textarea
                  className="field min-h-[180px] !text-xs font-mono leading-relaxed"
                  placeholder="Nhập nội dung bài viết định dạng Markdown (hỗ trợ ## H2, ### H3, bảng, danh sách, công thức, FAQ...)"
                  value={form.content || ''}
                  onChange={set('content')}
                />
                <p className="text-[11px] font-semibold text-slate-500">
                  💡 Hỗ trợ đầy đủ cú pháp Markdown: <code className="font-bold">## Tiêu đề H2</code>, <code className="font-bold">### Tiêu đề H3</code>, <code className="font-bold">**chữ đậm**</code>, bảng biểu và đường link.
                </p>
              </div>
            ) : null}
          </div>

          {/* Tải ảnh poster / banner */}
          <div className="flex items-center gap-3">
            <label className="btn-ghost cursor-pointer !px-4 !py-2 text-xs font-bold">
              <Upload size={14} /> {uploading ? 'Đang tải...' : 'Tải ảnh poster / banner'}
              <input type="file" accept="image/*" className="hidden" onChange={upload} />
            </label>
            {form.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.image} alt="" className="h-12 w-16 rounded-xl object-cover border border-dew-200" />
            ) : null}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Link tùy chỉnh khi bấm vào (để trống sẽ tự dẫn đến trang bài viết <code className="font-mono text-dew-700">/bai-viet/...</code>)
            </label>
            <input
              className="field !text-xs"
              placeholder="Để trống nếu muốn mở trang bài viết chi tiết, hoặc nhập link LMS /... hoặc link ngoài"
              value={form.link || ''}
              onChange={set('link')}
            />
          </div>

          <div className="flex gap-5 text-sm font-extrabold text-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.published} onChange={set('published')} /> Hiển thị công khai
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.pinned} onChange={set('pinned')} /> Ghim lên đầu
            </label>
          </div>

          {/* Link xem bài viết nếu đã có id hoặc slug */}
          {(form.id || form.slug) ? (
            <div className="rounded-xl bg-dew-100/60 p-2.5 text-xs font-bold text-dew-900 flex items-center justify-between">
              <span>Đường dẫn bài viết: <code className="font-mono text-dew-700">/bai-viet/{form.slug || form.id}</code></span>
              <a
                href={`/bai-viet/${form.slug || form.id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-dew-700 hover:underline"
              >
                <ExternalLink size={12} /> Xem thực tế
              </a>
            </div>
          ) : null}

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="btn-primary !px-6">
              {form.id ? 'Cập nhật bài viết' : 'Thêm mới bài viết'}
            </button>
            {form.id ? (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setForm(EMPTY);
                  setShowFullContent(false);
                }}
              >
                Hủy sửa
              </button>
            ) : null}
            {message ? <span className="text-sm font-bold text-dew-700">{message}</span> : null}
          </div>
        </form>

        {/* Danh sách các poster & bài viết */}
        <div className="space-y-3">
          <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">
            Danh sách bài viết & poster ({rows.length})
          </h3>

          <ul className="grid h-fit gap-3">
            {rows.length === 0 ? (
              <li className="glass rounded-2xl p-6 text-center text-sm font-semibold text-slate-500">
                Chưa có poster hoặc bài viết nào. Hãy bấm nút <span className="font-bold text-dew-700">AI Viết Bài Chuẩn SEO</span> để tạo bài đầu tiên!
              </li>
            ) : null}

            {rows.map((row) => (
              <li key={row.id} className="glass flex items-center gap-3 rounded-2xl p-3 hover:border-dew-300 transition">
                <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-dew-100 flex items-center justify-center">
                  {row.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={row.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <FileText size={22} className="text-dew-400" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate text-sm font-black text-ink">
                    {row.pinned ? <Pin size={12} className="text-amber-500 shrink-0" /> : null}
                    {row.title}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                    <span className="rounded-md bg-dew-50 px-2 py-0.5 text-dew-700">{row.category}</span>
                    <span>·</span>
                    <span className={row.published ? 'text-emerald-600' : 'text-slate-400'}>
                      {row.published ? 'Đang hiển thị' : 'Đang ẩn'}
                    </span>
                    {row.seoScore ? (
                      <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-black text-emerald-700 border border-emerald-200">
                        SEO {row.seoScore}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Nút xem trực tiếp bài viết */}
                <a
                  href={`/bai-viet/${row.slug || row.id}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Xem trang bài viết trên web"
                  className="rounded-full p-2 text-slate-400 hover:bg-dew-50 hover:text-dew-700 transition"
                >
                  <ExternalLink size={16} />
                </a>

                {/* Sửa */}
                <button
                  type="button"
                  aria-label="Sửa"
                  onClick={() => {
                    setForm(row);
                    if (row.content) setShowFullContent(true);
                  }}
                  className="rounded-full p-2 hover:bg-dew-50 text-slate-600 transition"
                >
                  <Pencil size={16} />
                </button>

                {/* Xóa */}
                <button
                  type="button"
                  aria-label="Xóa"
                  onClick={() => remove(row.id)}
                  className="rounded-full p-2 text-red-500 hover:bg-red-50 transition"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal AI Viết bài SEO */}
      <AiSeoWriterModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onApply={handleApplyAiArticle}
        onSaveDirect={handleDirectSaveAiArticle}
      />
    </div>
  );
}
