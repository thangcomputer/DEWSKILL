'use client';

import { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Copy,
  ExternalLink,
  Flame,
  Globe,
  Loader2,
  Save,
  Search,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import { adminFetch } from './adminFetch';
import MarkdownView from '../common/MarkdownView';

const PRESET_TOPICS = [
  'Hàm VLOOKUP trong Excel cho người mới bắt đầu từ A-Z',
  '15 Phím tắt Excel dân văn phòng nhất định phải biết',
  'Cách tạo mục lục tự động trong Word 2016-2024 chỉ trong 1 phút',
  'Bí quyết thiết kế slide PowerPoint thuyết trình đẹp mắt',
  'Kinh nghiệm luyện thi chứng chỉ tin học MOS Excel đạt điểm 1000',
  'Cách sửa lỗi #N/A, #VALUE! trong Excel nhanh chóng',
];

const CATEGORIES = ['Mẹo học', 'Hướng dẫn', 'Ưu đãi', 'Thông báo', 'Sự kiện'];

const TONES = [
  'Thực chiến & dễ hiểu (Cho người mới)',
  'Chuyên sâu cho dân văn phòng & kế toán',
  'Chuẩn đề thi quốc tế MOS / IC3',
  'Súc tích, ngắn gọn & thực tế',
];

export default function AiSeoWriterModal({ isOpen, onClose, onApply, onSaveDirect }) {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('Mẹo học');
  const [targetAudience, setTargetAudience] = useState('Dân văn phòng, kế toán, sinh viên, người ôn thi tin học');
  const [tone, setTone] = useState(TONES[0]);
  const [customNotes, setCustomNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [savingDirect, setSavingDirect] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  async function handleGenerate(e) {
    if (e) e.preventDefault();
    if (!topic.trim()) {
      setError('Vui lòng nhập chủ đề hoặc từ khóa bài viết');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await adminFetch('/api/admin/ai-seo', {
        method: 'POST',
        body: {
          topic: topic.trim(),
          category,
          targetAudience,
          tone,
          customNotes,
        },
      });

      setResult(res.data);
    } catch (err) {
      setError(err.message || 'Không thể tạo bài viết với AI');
    } finally {
      setLoading(false);
    }
  }

  function handleApply() {
    if (!result) return;
    onApply(result);
    onClose();
  }

  async function handleDirectSave() {
    if (!result) return;
    setSavingDirect(true);
    try {
      await onSaveDirect(result);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingDirect(false);
    }
  }

  function handleCopyContent() {
    if (!result?.content) return;
    navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-dew-200">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-dew-100 bg-gradient-to-r from-dew-50 via-white to-cyan-50/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-dew-500 text-white shadow-md">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-ink sm:text-lg">
                AI Viết Bài Chuẩn SEO Lên Top Google
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Tự động tối ưu Title SERP, Meta Description, thẻ H2/H3, LSI keywords & CTA chuyển đổi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Cấu hình đầu vào */}
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Chủ đề hoặc từ khóa chính cần SEO lên Top Google <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="field !pl-10 !text-sm font-semibold"
                  placeholder="Ví dụ: Cách dùng hàm VLOOKUP trong Excel cho người mới bắt đầu..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={loading}
                  required
                />
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Gợi ý chủ đề nhanh */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-dew-800 mb-1.5">
                <Flame size={13} className="text-amber-500" /> Gợi ý chủ đề Hot tìm kiếm nhiều trên Google:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_TOPICS.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTopic(t)}
                    className="rounded-lg bg-dew-50 px-2.5 py-1 text-xs font-semibold text-dew-700 hover:bg-dew-100 border border-dew-200/60 transition"
                  >
                    + {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Tùy chọn chi tiết */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Danh mục bài viết
                </label>
                <select
                  className="field !text-xs font-semibold"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={loading}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Đối tượng độc giả
                </label>
                <input
                  type="text"
                  className="field !text-xs font-semibold"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Phong cách & Giọng văn
                </label>
                <select
                  className="field !text-xs font-semibold"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  disabled={loading}
                >
                  {TONES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Nút kích hoạt AI */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary !px-6 !py-3 flex items-center gap-2 text-sm shadow-lg shadow-dew-500/20"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    AI đang nghiên cứu từ khóa & viết bài chuẩn SEO...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Bắt đầu tạo bài viết chuẩn SEO Top Google
                  </>
                )}
              </button>

              {error ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-600">
                  <AlertCircle size={14} /> {error}
                </div>
              ) : null}
            </div>
          </form>

          {/* Kết quả bài viết sau khi sinh */}
          {result ? (
            <div className="space-y-5 rounded-2xl border border-dew-200 bg-dew-50/40 p-5 animate-fadeIn">
              {/* Điểm SEO và Checklist */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-dew-200/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 font-black text-white shadow-md text-lg">
                    {result.seoScore || 98}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-ink">
                      Điểm Đánh Giá Chuẩn SEO Google
                    </h4>
                    <p className="text-xs font-semibold text-emerald-700">
                      Tối ưu SERP Snippet · Cấu trúc H2/H3 · Mật độ LSI · Call-to-action
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyContent}
                    className="btn-ghost !px-3 !py-1.5 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Copy size={13} /> {copied ? 'Đã sao chép!' : 'Sao chép Markdown'}
                  </button>
                </div>
              </div>

              {/* Checklist các tiêu chuẩn SEO */}
              {Array.isArray(result.checklist) && result.checklist.length > 0 ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {result.checklist.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-xl border border-dew-100 shadow-2xs"
                    >
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>{item.rule || item}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Mô phỏng SERP trên Google */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Globe size={13} className="text-dew-600" />
                  <span>dewskill.vn &gt; bai-viet &gt; {result.slug || 'bai-viet'}</span>
                </div>
                <h5 className="text-base font-bold text-blue-700 hover:underline cursor-pointer">
                  {result.title}
                </h5>
                <p className="text-xs font-normal text-slate-600 leading-relaxed">
                  {result.summary}
                </p>
              </div>

              {/* Từ khóa LSI */}
              {Array.isArray(result.keywords) && result.keywords.length > 0 ? (
                <div className="space-y-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <Tag size={12} /> Mạng lưới từ khóa LSI phủ sóng Google:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.keywords.map((kw, i) => (
                      <span key={i} className="rounded-md bg-dew-100 px-2 py-0.5 text-xs font-semibold text-dew-800">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Xem trước nội dung bài viết */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Nội dung chi tiết (Đã định dạng chuẩn Markdown & H2/H3):
                </span>
                <div className="max-h-72 overflow-y-auto rounded-xl border border-dew-200 bg-white p-4 text-xs">
                  <MarkdownView content={result.content} />
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-dew-100 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost !px-4 !py-2 text-xs font-bold"
          >
            Đóng
          </button>

          {result ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleApply}
                className="btn-ghost !bg-dew-100 !text-dew-800 hover:!bg-dew-200 !px-4 !py-2 text-xs font-black flex items-center gap-1.5"
              >
                <ArrowRight size={14} /> Áp dụng vào Form bên ngoài
              </button>

              <button
                type="button"
                onClick={handleDirectSave}
                disabled={savingDirect}
                className="btn-primary !px-5 !py-2 text-xs font-black flex items-center gap-1.5 shadow-md shadow-dew-500/20"
              >
                {savingDirect ? (
                  <>
                    <Loader2 size={13} className="animate-spin" /> Đang lưu...
                  </>
                ) : (
                  <>
                    <Save size={13} /> Lưu & Xuất bản bài viết ngay
                  </>
                )}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
