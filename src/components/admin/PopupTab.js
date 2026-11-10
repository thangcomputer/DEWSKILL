'use client';

import { useState, useEffect } from 'react';
import {
  Bell,
  Sparkles,
  Upload,
  Link as LinkIcon,
  Clock,
  Timer,
  Eye,
  Check,
  RefreshCw,
  Trash2,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  X,
} from 'lucide-react';
import { adminFetch } from './adminFetch';
import { DEFAULT_POPUP_DATA } from '@/lib/landingDefaults';

export default function PopupTab() {
  const [popup, setPopup] = useState(DEFAULT_POPUP_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [sessionCleared, setSessionCleared] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const res = await adminFetch('/api/admin/site');
      if (res?.data?.popup) {
        setPopup({ ...DEFAULT_POPUP_DATA, ...res.data.popup });
      }
    } catch (err) {
      setMessage('Lỗi tải dữ liệu: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  function updateField(key, value) {
    setPopup((prev) => ({ ...prev, [key]: value }));
  }

  async function handleBannerUpload(file) {
    if (!file) return;
    try {
      setUploading(true);
      setMessage('');
      const data = new FormData();
      data.append('file', file);
      const res = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: data,
      });
      if (res?.url) {
        updateField('imageUrl', res.url);
        setMessage('Đã tải ảnh banner lên thành công! Nhấn "Lưu cấu hình Popup" để áp dụng.');
      }
    } catch (err) {
      setMessage('Lỗi tải ảnh banner: ' + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e) {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      setMessage('');

      // Gửi patch popup vào /api/admin/site
      await adminFetch('/api/admin/site', {
        method: 'PUT',
        body: JSON.stringify({ popup }),
      });

      setMessage('Đã lưu cấu hình Popup quảng cáo thành công!');
    } catch (err) {
      setMessage('Lỗi lưu cấu hình: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  function clearTestSession() {
    try {
      sessionStorage.removeItem('dewskill_promo_popup_seen');
      localStorage.removeItem('dewskill_promo_popup_seen');
      setSessionCleared(true);
      setTimeout(() => setSessionCleared(false), 3000);
    } catch {}
  }

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center text-sm font-bold text-slate-500 shadow-sm border border-dew-100">
        Đang tải thông tin cấu hình Popup quảng cáo...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header Giới thiệu */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-600 to-dew-600 p-6 text-white shadow-lg shadow-emerald-500/15">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
            <Bell size={26} className="text-white animate-bounce" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Cấu hình Popup Quảng cáo & Banner Trang chủ</h2>
            <p className="text-xs text-white/90">
              Quản lý banner khuyến mãi, đặt thời gian xuất hiện, thời gian tự đóng và liên kết đăng ký ngay.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-black text-emerald-800 shadow-md hover:bg-emerald-50 transition active:scale-95"
          >
            <Eye size={14} /> Xem thử Popup
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 rounded-2xl p-4 text-xs font-bold ${
            message.includes('thành công')
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {message.includes('thành công') ? <Check size={16} /> : <X size={16} />}
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* CARD 1: Trạng thái & Tần suất hiển thị */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-dew-100 flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-dew-100 pb-3">
            <Sparkles size={18} className="text-dew-600" />
            <h3 className="font-extrabold text-ink text-base">Trạng thái & Tần suất hiển thị</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Toggle bật/tắt popup */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 bg-slate-50/50">
              <div>
                <span className="block text-sm font-extrabold text-slate-900">Bật Popup quảng cáo</span>
                <span className="text-xs text-slate-500">
                  {popup.enabled ? (
                    <span className="text-emerald-600 font-bold">● Đang hoạt động trên trang chủ</span>
                  ) : (
                    <span className="text-slate-400">○ Đang tắt, không hiển thị cho khách</span>
                  )}
                </span>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={Boolean(popup.enabled)}
                  onChange={(e) => updateField('enabled', e.target.checked)}
                  className="peer sr-only"
                />
                <div className="peer h-7 w-12 rounded-full bg-slate-300 after:absolute after:top-[2px] after:left-[2px] after:h-6 after:w-6 after:rounded-full after:bg-white after:transition-all peer-checked:bg-emerald-600 peer-checked:after:translate-x-full" />
              </label>
            </div>

            {/* Toggle chỉ hiển thị 1 lần khi truy cập */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 bg-slate-50/50">
              <div>
                <span className="block text-sm font-extrabold text-slate-900">Chỉ hiển thị 1 lần khi truy cập</span>
                <span className="text-xs text-slate-500">
                  {popup.showOncePerSession ? (
                    <span className="text-emerald-700 font-semibold">Hiện 1 lần mỗi phiên (Session)</span>
                  ) : (
                    <span className="text-amber-600 font-semibold">Hiện mỗi lần tải lại trang</span>
                  )}
                </span>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={Boolean(popup.showOncePerSession)}
                  onChange={(e) => updateField('showOncePerSession', e.target.checked)}
                  className="peer sr-only"
                />
                <div className="peer h-7 w-12 rounded-full bg-slate-300 after:absolute after:top-[2px] after:left-[2px] after:h-6 after:w-6 after:rounded-full after:bg-white after:transition-all peer-checked:bg-emerald-600 peer-checked:after:translate-x-full" />
              </label>
            </div>
          </div>

          {/* Nút reset session cho admin test */}
          <div className="flex items-center justify-between rounded-xl bg-amber-50/70 p-3 border border-amber-200/70 text-xs">
            <span className="text-amber-900 font-medium">
              💡 Để kiểm tra popup hiển thị lại trên trình duyệt của bạn sau khi đã xem 1 lần:
            </span>
            <button
              type="button"
              onClick={clearTestSession}
              className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1.5 font-bold text-white shadow-xs hover:bg-amber-700 transition"
            >
              <RefreshCw size={12} className={sessionCleared ? 'animate-spin' : ''} />
              {sessionCleared ? 'Đã xóa bộ nhớ phiên!' : 'Xóa bộ nhớ phiên test'}
            </button>
          </div>
        </div>

        {/* CARD 2: Cài đặt thời gian xuất hiện & Biến mất */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-dew-100 flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-dew-100 pb-3">
            <Clock size={18} className="text-dew-600" />
            <h3 className="font-extrabold text-ink text-base">Thời gian xuất hiện & Tự động biến mất</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thời gian xuất hiện (Delay) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-extrabold text-slate-800 flex items-center justify-between">
                <span>Xuất hiện sau bao lâu (giây):</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black">
                  {popup.delaySeconds || 0} giây
                </span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="60"
                  step="1"
                  className="field !w-32 text-center text-base font-black text-slate-800"
                  value={popup.delaySeconds !== undefined ? popup.delaySeconds : 2}
                  onChange={(e) => updateField('delaySeconds', Math.max(0, parseInt(e.target.value, 10) || 0))}
                />
                <div className="flex gap-1.5 flex-wrap">
                  {[0, 1, 2, 3, 5].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => updateField('delaySeconds', sec)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                        popup.delaySeconds === sec
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {sec === 0 ? 'Hiện ngay' : `${sec}s`}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Thời gian chờ từ lúc khách mở trang web trước khi popup bật lên. (Mặc định 2s để tạo cảm giác tự nhiên).
              </p>
            </div>

            {/* Thời gian biến mất (Auto-close) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-extrabold text-slate-800 flex items-center justify-between">
                <span>Tự động biến mất sau bao lâu (giây):</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-black">
                  {Number(popup.autoCloseSeconds) > 0 ? `${popup.autoCloseSeconds} giây` : 'Không tự tắt'}
                </span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="120"
                  step="1"
                  className="field !w-32 text-center text-base font-black text-slate-800"
                  value={popup.autoCloseSeconds !== undefined ? popup.autoCloseSeconds : 0}
                  onChange={(e) => updateField('autoCloseSeconds', Math.max(0, parseInt(e.target.value, 10) || 0))}
                />
                <div className="flex gap-1.5 flex-wrap">
                  {[0, 10, 15, 20, 30].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => updateField('autoCloseSeconds', sec)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                        popup.autoCloseSeconds === sec
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {sec === 0 ? 'Không tự tắt' : `${sec}s`}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Nhập 0 nếu muốn người dùng tự bấm nút đóng [X]. Nếu &gt; 0, popup sẽ hiển thị thanh đếm ngược và tự động đóng.
              </p>
            </div>
          </div>
        </div>

        {/* CARD 3: Hình ảnh Banner & Liên kết ảnh */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-dew-100 flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-dew-100 pb-3">
            <Upload size={18} className="text-dew-600" />
            <h3 className="font-extrabold text-ink text-base">Hình ảnh Banner & Liên kết khi bấm vào ảnh</h3>
          </div>

          {/* Tải lên ảnh banner */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-extrabold text-slate-800">
              Ảnh Banner Popup (Hỗ trợ JPG, PNG, WebP, GIF)
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-dew-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-dew-700 transition active:scale-95">
                <Upload size={14} />
                {uploading ? 'Đang tải ảnh lên...' : 'Tải ảnh Banner lên từ máy tính'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleBannerUpload(f);
                  }}
                />
              </label>

              <span className="text-xs text-slate-400 font-bold">HOẶC dán link ảnh:</span>

              <input
                type="text"
                placeholder="https://... hoặc /api/uploads/..."
                value={popup.imageUrl || ''}
                onChange={(e) => updateField('imageUrl', e.target.value)}
                className="field flex-1 text-xs py-2"
              />

              {popup.imageUrl && (
                <button
                  type="button"
                  onClick={() => updateField('imageUrl', '')}
                  className="inline-flex items-center gap-1 rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100 transition"
                  title="Xóa banner hiện tại"
                >
                  <Trash2 size={13} /> Xóa ảnh
                </button>
              )}
            </div>

            {/* Xem trước khung ảnh banner */}
            {popup.imageUrl ? (
              <div className="relative mt-2 rounded-2xl border-2 border-dashed border-dew-200 bg-slate-50 p-3 max-w-md">
                <span className="text-[10px] font-black uppercase text-dew-700 mb-1 block">
                  Ảnh Banner đang chọn:
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={popup.imageUrl}
                  alt="Banner preview"
                  className="w-full max-h-52 object-contain rounded-xl bg-white shadow-sm"
                />
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-6 text-center text-xs text-slate-400">
                Chưa có ảnh banner. Bạn có thể tải ảnh lên từ máy tính hoặc dán link ảnh tại đây.
              </div>
            )}
          </div>

          {/* Link khi bấm vào ảnh banner */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
            <label className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
              <LinkIcon size={14} className="text-dew-600" />
              Link khi bấm vào hình ảnh banner:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ví dụ: /#tu-van hoặc https://zalo.me/... hoặc link khóa học"
                value={popup.linkUrl || ''}
                onChange={(e) => updateField('linkUrl', e.target.value)}
                className="field text-sm"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Khi khách bấm vào ảnh banner trên trang chủ, họ sẽ được chuyển đến liên kết này. (Nhập{' '}
              <code className="bg-slate-100 px-1 rounded font-bold">/#tu-van</code> để tự động cuộn xuống form tư vấn).
            </p>
          </div>
        </div>

        {/* CARD 4: Tiêu đề, Mô tả & Nút Đăng ký ngay */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-dew-100 flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-dew-100 pb-3">
            <ArrowRight size={18} className="text-dew-600" />
            <h3 className="font-extrabold text-ink text-base">Tiêu đề, Mô tả & Nút bấm Đăng ký ngay</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Tiêu đề Popup (Tùy chọn)</label>
              <input
                type="text"
                placeholder="Ví dụ: Ưu đãi học thử miễn phí hôm nay!"
                value={popup.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                className="field text-sm font-bold"
              />
              <span className="text-[10px] text-slate-400">Có thể để trống nếu ảnh banner đã có chữ</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Mô tả / Phụ đề ngắn (Tùy chọn)</label>
              <textarea
                rows={2}
                placeholder="Đăng ký tài khoản ngay để nhận trọn bộ bài giảng và luyện tập cùng AI chấm điểm tức thì."
                value={popup.subtitle || ''}
                onChange={(e) => updateField('subtitle', e.target.value)}
                className="field text-xs"
              />
            </div>
          </div>

          {/* Cấu hình nút CTA "Đăng ký ngay" */}
          <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-sm font-extrabold text-slate-900">
                  Hiển thị nút Đăng ký ngay bên dưới banner
                </span>
                <span className="text-xs text-slate-500">Nút kêu gọi hành động to đẹp, dễ bấm</span>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={popup.buttonEnabled !== false}
                  onChange={(e) => updateField('buttonEnabled', e.target.checked)}
                  className="peer sr-only"
                />
                <div className="peer h-7 w-12 rounded-full bg-slate-300 after:absolute after:top-[2px] after:left-[2px] after:h-6 after:w-6 after:rounded-full after:bg-white after:transition-all peer-checked:bg-emerald-600 peer-checked:after:translate-x-full" />
              </label>
            </div>

            {popup.buttonEnabled !== false && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Chữ hiển thị trên nút</label>
                  <input
                    type="text"
                    value={popup.buttonText || 'Đăng ký ngay'}
                    onChange={(e) => updateField('buttonText', e.target.value)}
                    placeholder="Đăng ký ngay"
                    className="field text-sm font-black text-emerald-800"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Link khi bấm nút</label>
                  <input
                    type="text"
                    value={popup.buttonLink || ''}
                    onChange={(e) => updateField('buttonLink', e.target.value)}
                    placeholder="/#tu-van hoặc link đăng ký LMS"
                    className="field text-sm"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(popup.openNewTab)}
                  onChange={(e) => updateField('openNewTab', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Mở liên kết trong tab mới (target=&quot;_blank&quot;)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Nút lưu cấu hình */}
        <div className="flex items-center justify-between gap-4 sticky bottom-4 z-10 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-dew-200">
          <div className="text-xs text-slate-500 font-medium">
            * Sau khi lưu, cấu hình sẽ được áp dụng trực tiếp lên trang chủ.
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="btn-ghost !px-5 !py-2.5 text-xs font-bold"
            >
              <Eye size={14} /> Xem thử Popup
            </button>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary !px-7 !py-2.5 text-xs font-black shadow-lg shadow-emerald-500/25 flex items-center gap-1.5"
            >
              <Check size={16} />
              {saving ? 'Đang lưu cấu hình...' : 'Lưu cấu hình Popup'}
            </button>
          </div>
        </div>
      </form>

      {/* MODAL XEM TRƯỚC POPUP (Live Preview Test) */}
      {previewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-emerald-100 overflow-hidden animate-scaleUp">
            {/* Thanh thông báo chế độ xem thử */}
            <div className="bg-emerald-600 px-4 py-2 text-center text-xs font-bold text-white flex items-center justify-between">
              <span>👀 Đang ở chế độ Xem trước (Preview)</span>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="text-white/80 hover:text-white"
              >
                Đóng xem thử
              </button>
            </div>

            {/* Nút đóng [X] */}
            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              className="absolute top-10 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/70 text-white backdrop-blur-md transition hover:bg-slate-900"
            >
              <X size={18} />
            </button>

            <div className="overflow-y-auto max-h-[80vh] p-0 flex flex-col">
              {popup.imageUrl ? (
                <div className="relative overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={popup.imageUrl}
                    alt={popup.title || 'Banner'}
                    className="w-full h-auto max-h-[50vh] object-contain sm:object-cover"
                  />
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 text-slate-400 text-sm">
                  (Chưa có ảnh banner - Popup sẽ hiển thị khung chữ)
                </div>
              )}

              {(popup.title || popup.subtitle || popup.buttonEnabled !== false) && (
                <div className="p-6 flex flex-col gap-3 text-center bg-white">
                  {popup.title && (
                    <div className="flex items-center justify-center gap-1.5">
                      <Sparkles size={18} className="text-amber-500 shrink-0" />
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                        {popup.title}
                      </h3>
                    </div>
                  )}

                  {popup.subtitle && (
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                      {popup.subtitle}
                    </p>
                  )}

                  {popup.buttonEnabled !== false && (
                    <div className="pt-2">
                      <div className="btn-primary !w-full !py-3.5 !text-base shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer">
                        <span>{popup.buttonText || 'Đăng ký ngay'}</span>
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

