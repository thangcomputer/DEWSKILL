'use client';

import { useCallback, useEffect, useState } from 'react';
import { Bot, Key, MessageSquare, Plus, Save, Send, Sparkles, Trash2 } from 'lucide-react';
import { adminFetch } from './adminFetch';

export default function AiTrainingTab() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  // Thử nghiệm câu hỏi ngay trong admin
  const [testInput, setTestInput] = useState('');
  const [testReply, setTestReply] = useState(null);
  const [testLoading, setTestLoading] = useState(false);

  // Form thêm FAQ mới
  const [newFaq, setNewFaq] = useState({ question: '', answer: '', keywords: '' });

  const load = useCallback(async () => {
    try {
      const res = await adminFetch('/api/admin/ai-knowledge');
      setData(res.data);
    } catch (err) {
      setMessage(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSaveAll() {
    if (!data) return;
    setSaving(true);
    setMessage('');
    try {
      await adminFetch('/api/admin/ai-knowledge', {
        method: 'PUT',
        body: data,
      });
      setMessage('✓ Đã lưu toàn bộ dữ liệu huấn luyện cho AI thành công!');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleAddFaq(e) {
    e.preventDefault();
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;

    const keywordsArray = newFaq.keywords
      .split(',')
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);

    const entry = {
      id: `faq-${Date.now()}`,
      question: newFaq.question.trim(),
      answer: newFaq.answer.trim(),
      keywords: keywordsArray,
    };

    setData((prev) => ({
      ...prev,
      faqs: [entry, ...(prev?.faqs || [])],
    }));

    setNewFaq({ question: '', answer: '', keywords: '' });
  }

  function handleRemoveFaq(id) {
    setData((prev) => ({
      ...prev,
      faqs: (prev?.faqs || []).filter((f) => f.id !== id),
    }));
  }

  function handleUpdateFaq(id, field, value) {
    setData((prev) => ({
      ...prev,
      faqs: (prev?.faqs || []).map((f) => {
        if (f.id !== id) return f;
        if (field === 'keywords') {
          return {
            ...f,
            keywords: value.split(',').map((k) => k.trim()).filter(Boolean),
          };
        }
        return { ...f, [field]: value };
      }),
    }));
  }

  async function runTestQuestion(e) {
    e.preventDefault();
    const q = testInput.trim();
    if (!q || testLoading) return;
    setTestLoading(true);
    setTestReply(null);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q }),
      });
      const resData = await res.json();
      if (resData?.success) {
        setTestReply(resData.data);
      } else {
        throw new Error(resData?.message || 'Lỗi');
      }
    } catch (err) {
      setTestReply({ text: `Lỗi: ${err.message}` });
    } finally {
      setTestLoading(false);
    }
  }

  if (!data) return <p className="text-sm font-semibold text-slate-500">Đang tải tri thức AI...</p>;

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-black text-ink">
            <Bot size={22} className="text-dew-600" /> Huấn luyện & Dữ liệu tư vấn AI
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Cấu hình câu hỏi, câu trả lời mẫu về khóa học, học phí, học thử để trợ lý giọt nước tư vấn chuẩn xác.
          </p>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={handleSaveAll}
          className="btn-primary !px-5 !py-2.5 text-xs sm:text-sm"
        >
          <Save size={15} /> {saving ? 'Đang lưu...' : 'Lưu toàn bộ thay đổi'}
        </button>
      </div>

      {message && (
        <div className="rounded-xl border border-dew-200 bg-dew-50 p-3 text-sm font-bold text-dew-800">
          {message}
        </div>
      )}

      {/* Grid: AI Configuration & Test Sandbox */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Left: System Prompt & API Key */}
        <div className="glass space-y-4 rounded-drop p-5">
          <h3 className="flex items-center gap-2 text-sm font-black text-ink">
            <Sparkles size={16} className="text-amber-500" /> Tính cách & Chỉ dẫn hệ thống (Persona)
          </h3>
          <div>
            <textarea
              className="field min-h-[100px] text-xs leading-relaxed"
              value={data.systemPrompt || ''}
              onChange={(e) => setData({ ...data, systemPrompt: e.target.value })}
              placeholder="Chỉ đạo cách xưng hô, thái độ và mục tiêu của trợ lý AI..."
            />
          </div>

          <div className="pt-2">
            <label className="block text-xs font-extrabold text-slate-700">
              Khóa API Gemini (Tùy chọn - nếu muốn AI tự sinh văn bản thông minh hơn):
            </label>
            <div className="mt-1 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Key size={16} />
              </span>
              <input
                type="password"
                className="field flex-1"
                placeholder="AIzaSy..."
                value={data.apiKey || ''}
                onChange={(e) => setData({ ...data, apiKey: e.target.value })}
              />
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-400">
              * Nếu để trống, hệ thống sẽ sử dụng bộ so khớp ngữ nghĩa & tri thức nội bộ miễn phí 100%.
            </p>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-extrabold text-slate-700">
              Ghi chú kiến thức bổ sung (Tự do):
            </label>
            <textarea
              className="field mt-1 min-h-[70px] text-xs"
              value={data.customKnowledge || ''}
              onChange={(e) => setData({ ...data, customKnowledge: e.target.value })}
              placeholder="Nhập thêm thông tin ưu đãi đợt này, hotline, lưu ý tuyển sinh..."
            />
          </div>
        </div>

        {/* Right: Interactive Test Sandbox */}
        <div className="glass flex flex-col justify-between rounded-drop p-5">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-black text-ink">
              <MessageSquare size={16} className="text-dew-600" /> Thử nghiệm câu hỏi ngay
            </h3>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Gõ thử câu hỏi để xem AI trả lời thế nào trước khi khách hỏi.
            </p>

            <form onSubmit={runTestQuestion} className="mt-4 flex gap-2">
              <input
                className="field flex-1 text-xs"
                placeholder="Ví dụ: Học phí bao nhiêu? Có học thử không?"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={testLoading || !testInput.trim()}
                className="btn-primary !px-4 !py-2 text-xs"
              >
                {testLoading ? 'Đang hỏi...' : <Send size={14} />}
              </button>
            </form>

            {testReply && (
              <div className="mt-4 rounded-2xl border border-dew-200 bg-dew-50/70 p-3.5 text-xs text-slate-800">
                <p className="font-black text-dew-800">💧 Phản hồi từ trợ lý:</p>
                <p className="mt-1.5 whitespace-pre-wrap leading-relaxed">{testReply.text}</p>
                {testReply.actionLink && (
                  <p className="mt-2 font-bold text-amber-700">
                    Nút đính kèm: {testReply.actionLabel} ({testReply.actionLink})
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 rounded-xl bg-slate-100/70 p-3 text-[11px] text-slate-500">
            💡 Mẹo: Khi khách hỏi về <b>học thử</b> hoặc <b>đăng ký</b>, AI sẽ tự động sinh nút điều hướng sang cổng LMS.
          </div>
        </div>
      </div>

      {/* Form: Thêm câu hỏi & câu trả lời mẫu */}
      <div className="glass rounded-drop p-5">
        <h3 className="text-sm font-black text-ink">Thêm cặp Câu hỏi - Câu trả lời mới cho AI học</h3>
        <form onSubmit={handleAddFaq} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            className="field col-span-2 text-xs font-bold"
            placeholder="Câu hỏi khách hay hỏi (Ví dụ: Khóa học Excel có cấp chứng chỉ không?)"
            value={newFaq.question}
            onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
            required
          />
          <textarea
            className="field col-span-2 min-h-[70px] text-xs"
            placeholder="Câu trả lời mẫu mà AI nên đưa ra cho khách..."
            value={newFaq.answer}
            onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
            required
          />
          <input
            className="field text-xs"
            placeholder="Từ khóa nhận diện (cách nhau bằng dấu phẩy: chứng chỉ, bằng cấp, mos)"
            value={newFaq.keywords}
            onChange={(e) => setNewFaq({ ...newFaq, keywords: e.target.value })}
          />
          <div className="flex items-center justify-end">
            <button type="submit" className="btn-primary !px-5 !py-2.5 text-xs">
              <Plus size={15} /> Thêm vào danh sách huấn luyện
            </button>
          </div>
        </form>
      </div>

      {/* List: Các bài học / FAQ AI đang nắm */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-black text-ink">
            Bộ tri thức đang được AI áp dụng ({data.faqs?.length || 0} bài học)
          </h3>
          <span className="text-xs font-bold text-slate-500">
            Bấm "Lưu toàn bộ thay đổi" ở góc trên sau khi chỉnh sửa
          </span>
        </div>

        {(!data.faqs || data.faqs.length === 0) && (
          <p className="text-xs font-semibold text-slate-400">Chưa có câu hỏi huấn luyện nào.</p>
        )}

        <div className="grid gap-3">
          {(data.faqs || []).map((faq, index) => (
            <div
              key={faq.id || index}
              className="glass relative grid gap-2.5 rounded-2xl p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <input
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-dew-900 outline-none focus:border-dew-500"
                  value={faq.question || ''}
                  onChange={(e) => handleUpdateFaq(faq.id, 'question', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFaq(faq.id)}
                  className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                  title="Xóa câu hỏi này"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <textarea
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-dew-500"
                rows={2}
                value={faq.answer || ''}
                onChange={(e) => handleUpdateFaq(faq.id, 'answer', e.target.value)}
              />

              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="font-bold">Từ khóa:</span>
                <input
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] outline-none focus:border-dew-500"
                  value={Array.isArray(faq.keywords) ? faq.keywords.join(', ') : faq.keywords || ''}
                  onChange={(e) => handleUpdateFaq(faq.id, 'keywords', e.target.value)}
                  placeholder="học thử, miễn phí, giá..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

