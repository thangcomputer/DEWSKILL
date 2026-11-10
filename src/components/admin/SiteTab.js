'use client';

import { useEffect, useState } from 'react';
import { Upload, X, RefreshCw, Globe, Image as ImageIcon, Sparkles, Smartphone, Share2, HelpCircle, Key, Lock, ShieldCheck, Copy, Check, Eye, EyeOff } from 'lucide-react';
import { adminFetch } from './adminFetch';

export default function SiteTab() {
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingShowcase, setUploadingShowcase] = useState({});
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showGoogleSecret, setShowGoogleSecret] = useState(false);
  const [copiedUri, setCopiedUri] = useState(false);
  const [totpSetup, setTotpSetup] = useState(null);
  const [totpCodeInput, setTotpCodeInput] = useState('');
  const [disableCodeInput, setDisableCodeInput] = useState('');
  const [showDisableTotp, setShowDisableTotp] = useState(false);
  const [totpLoading, setTotpLoading] = useState(false);
  const [totpError, setTotpError] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);

  async function startTotpSetup() {
    setTotpLoading(true);
    setTotpError('');
    try {
      const res = await adminFetch('/api/admin/2fa?action=setup');
      setTotpSetup(res.data);
      setTotpCodeInput('');
    } catch (err) {
      setTotpError(err.message);
    } finally {
      setTotpLoading(false);
    }
  }

  async function confirmTotpActivation() {
    if (!totpSetup || !totpCodeInput) return;
    setTotpLoading(true);
    setTotpError('');
    try {
      await adminFetch('/api/admin/2fa', {
        method: 'POST',
        body: { secret: totpSetup.secret, code: totpCodeInput },
      });
      setForm((prev) => ({ ...prev, adminTotpEnabled: true }));
      setTotpSetup(null);
      setMessage('Đã kích hoạt Google Authenticator thành công! Mỗi lần đăng nhập sẽ yêu cầu mã.');
    } catch (err) {
      setTotpError(err.message);
    } finally {
      setTotpLoading(false);
    }
  }

  async function handleDisableTotp() {
    if (!disableCodeInput) return;
    setTotpLoading(true);
    setTotpError('');
    try {
      await adminFetch('/api/admin/2fa', {
        method: 'POST',
        body: { action: 'disable', code: disableCodeInput },
      });
      setForm((prev) => ({ ...prev, adminTotpEnabled: false }));
      setShowDisableTotp(false);
      setDisableCodeInput('');
      setMessage('Đã tắt Google Authenticator.');
    } catch (err) {
      setTotpError(err.message);
    } finally {
      setTotpLoading(false);
    }
  }

  useEffect(() => {
    adminFetch('/api/admin/site')
      .then((res) => setForm(res.data))
      .catch((e) => setMessage(e.message));
  }, []);

  async function handleUpload(file, field, setUploading) {
    if (!file) return;
    setUploading(true);
    setMessage('');
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await adminFetch('/api/admin/upload', { method: 'POST', body: data });
      setForm((prev) => ({ ...prev, [field]: res.url }));
      setMessage(`Đã tải lên ${field === 'logoUrl' ? 'Logo' : 'Favicon'} thành công`);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleShowcaseUpload(file, field) {
    if (!file) return;
    setUploadingShowcase((prev) => ({ ...prev, [field]: true }));
    setMessage('');
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await adminFetch('/api/admin/upload', { method: 'POST', body: data });
      setForm((prev) => ({ ...prev, [field]: res.url }));
      setMessage('Đã tải ảnh lên thành công! Hãy nhấn "Lưu thay đổi" ở dưới cùng để áp dụng lên trang chủ.');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setUploadingShowcase((prev) => ({ ...prev, [field]: false }));
    }
  }

  async function save(event) {
    event.preventDefault();
    setMessage('');
    try {
      const res = await adminFetch('/api/admin/site', { method: 'PUT', body: form });
      if (res?.data) {
        setForm(res.data);
      }
      setMessage('Đã lưu cấu hình thành công! Hãy tải lại trang chủ để xem thay đổi.');
    } catch (err) {
      setMessage(err.message);
    }
  }

  if (!form) return <p className="text-sm font-semibold text-slate-500">{message || 'Đang tải cấu hình...'}</p>;

  return (
    <form onSubmit={save} className="grid gap-6">
      {/* KHỐI 1: NHẬN DIỆN THƯƠNG HIỆU (LOGO, FAVICON, BẢN QUYỀN) */}
      <div className="glass rounded-drop p-6">
        <div className="mb-4 flex items-center gap-2 border-b border-dew-100 pb-3">
          <ImageIcon className="text-dew-700" size={20} />
          <h3 className="text-base font-black text-dew-900">
            1. Nhận diện thương hiệu, Logo & Favicon (Tab trình duyệt)
          </h3>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Logo website */}
          <div className="rounded-2xl border border-dew-200/80 bg-white/70 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-extrabold text-slate-800">Logo website</span>
              {form.logoUrl && form.logoUrl !== '/brand/logo.webp' ? (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, logoUrl: '/brand/logo.webp' })}
                  className="flex items-center gap-1 text-xs font-bold text-dew-700 hover:underline"
                >
                  <RefreshCw size={12} /> Đặt lại logo mặc định
                </button>
              ) : null}
            </div>

            {/* Preview Logo */}
            <div className="mb-3 flex h-20 items-center justify-center rounded-xl bg-dew-50/60 border border-dashed border-dew-200 p-2">
              <img
                src={form.logoUrl || '/brand/logo.webp'}
                alt="Logo preview"
                className="max-h-16 max-w-full object-contain"
              />
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dew-300 bg-dew-50 px-3 py-2 text-xs font-extrabold text-dew-800 hover:bg-dew-100 transition">
                <Upload size={14} />
                <span>{uploadingLogo ? 'Đang tải lên...' : 'Tải ảnh Logo lên (PNG, SVG, JPG)'}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    handleUpload(e.target.files?.[0], 'logoUrl', setUploadingLogo);
                    e.target.value = '';
                  }}
                  disabled={uploadingLogo}
                />
              </label>
              <input
                className="field text-xs"
                placeholder="Hoặc dán URL ảnh logo (/brand/logo.webp hoặc https://...)"
                value={form.logoUrl || ''}
                onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              />
            </div>
          </div>

          {/* Favicon (Icon tab trình duyệt) */}
          <div className="rounded-2xl border border-dew-200/80 bg-white/70 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-extrabold text-slate-800">
                Favicon (Biểu tượng tab trình duyệt)
              </span>
              {form.faviconUrl && form.faviconUrl !== '/brand/favicon.png' ? (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, faviconUrl: '/brand/favicon.png' })}
                  className="flex items-center gap-1 text-xs font-bold text-dew-700 hover:underline"
                >
                  <RefreshCw size={12} /> Đặt lại mặc định
                </button>
              ) : null}
            </div>

            {/* Preview Favicon in mock browser tab */}
            <div className="mb-3 flex h-20 items-center justify-center rounded-xl bg-slate-900 border border-slate-700 p-2">
              <div className="flex items-center gap-2.5 rounded-lg bg-slate-800 px-3 py-2 border border-slate-700 shadow-inner">
                <img
                  src={form.faviconUrl || '/brand/favicon.png'}
                  alt="Favicon preview"
                  className="h-6 w-6 object-contain"
                />
                <span className="text-xs font-bold text-slate-100 max-w-[150px] truncate">
                  {form.brandName || 'DewSkill'} | Tự học tin ho...
                </span>
                <X size={12} className="text-slate-400" />
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dew-300 bg-dew-50 px-3 py-2 text-xs font-extrabold text-dew-800 hover:bg-dew-100 transition">
                <Upload size={14} />
                <span>{uploadingFavicon ? 'Đang tải lên...' : 'Tải icon Favicon (SVG, ICO, PNG)'}</span>
                <input
                  type="file"
                  accept="image/svg+xml,image/x-icon,image/png,image/jpeg,image/webp,image/vnd.microsoft.icon"
                  className="hidden"
                  onChange={(e) => {
                    handleUpload(e.target.files?.[0], 'faviconUrl', setUploadingFavicon);
                    e.target.value = '';
                  }}
                  disabled={uploadingFavicon}
                />
              </label>
              <input
                className="field text-xs"
                placeholder="Hoặc dán URL favicon (/brand/favicon.png hoặc https://...)"
                value={form.faviconUrl || ''}
                onChange={(e) => setForm({ ...form, faviconUrl: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Tên thương hiệu & Copyright */}
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-extrabold text-slate-700">
            Tên thương hiệu
            <input
              className="field"
              value={form.brandName || ''}
              placeholder="DewSkill"
              onChange={(e) => setForm({ ...form, brandName: e.target.value })}
            />
          </label>

          <label className="grid gap-1.5 text-sm font-extrabold text-slate-700">
            Dòng bản quyền chân trang (Copyright)
            <input
              className="field"
              value={form.copyright || ''}
              placeholder="© 2026 DewSkill. Bản quyền thuộc về DewSkill."
              onChange={(e) => setForm({ ...form, copyright: e.target.value })}
            />
          </label>
        </div>
      </div>

      {/* KHỐI 2: HÌNH ẢNH CÁC PHẦN TRÊN TRANG CHỦ (SHOWCASE THỰC TẾ) */}
      <div className="glass rounded-drop p-6">
        <div className="mb-4 flex items-center justify-between border-b border-dew-100 pb-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="text-dew-700" size={20} />
            <h3 className="text-base font-black text-dew-900">
              2. Hình ảnh minh họa các tính năng (Showcase thực tế trên trang chủ)
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
            Khung ảnh hiển thị trong mockup trình duyệt của 3 tab
          </span>
        </div>

        <p className="mb-4 text-xs font-medium text-slate-600 leading-relaxed">
          Tải ảnh chụp màn hình thực tế giao diện học tập để thay thế ảnh minh họa ở phần &quot;Trải nghiệm học tập thực chiến&quot;. Khuyến nghị tỉ lệ 16:10 hoặc 4:3 (kích thước khoảng 1200x800px).
        </p>

        <div className="grid gap-5 md:grid-cols-3">
          {/* Tab 1: Lộ trình từng chặng */}
          <div className="rounded-2xl border border-dew-200/80 bg-white/70 p-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-extrabold text-slate-800">Tab 1: Lộ trình chặng</span>
                {form.showcasePathImage && form.showcasePathImage !== '/screenshots/lo-trinh-chang.png' ? (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, showcasePathImage: '/screenshots/lo-trinh-chang.png' })}
                    className="flex items-center gap-1 text-xs font-bold text-dew-700 hover:underline"
                  >
                    <RefreshCw size={11} /> Mặc định
                  </button>
                ) : null}
              </div>

              {/* Preview */}
              <div className="mb-3 flex h-36 items-center justify-center rounded-xl bg-slate-900/5 border border-dashed border-dew-200 overflow-hidden p-1.5">
                <img
                  src={form.showcasePathImage || '/screenshots/lo-trinh-chang.png'}
                  alt="Lộ trình từng chặng"
                  className="h-full w-full object-cover rounded-lg"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dew-300 bg-dew-50 px-3 py-2 text-xs font-extrabold text-dew-800 hover:bg-dew-100 transition">
                <Upload size={14} />
                <span>{uploadingShowcase.showcasePathImage ? 'Đang tải...' : 'Tải ảnh Lộ trình lên'}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleShowcaseUpload(file, 'showcasePathImage');
                  }}
                />
              </label>
              <input
                className="field text-xs py-1"
                value={form.showcasePathImage || ''}
                placeholder="/screenshots/lo-trinh-chang.png"
                onChange={(e) => setForm({ ...form, showcasePathImage: e.target.value })}
              />
            </div>
          </div>

          {/* Tab 2: Video ngắn có câu hỏi */}
          <div className="rounded-2xl border border-dew-200/80 bg-white/70 p-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-extrabold text-slate-800">Tab 2: Video bài giảng</span>
                {form.showcaseVideoImage && form.showcaseVideoImage !== '/screenshots/video-bai-giang.png' ? (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, showcaseVideoImage: '/screenshots/video-bai-giang.png' })}
                    className="flex items-center gap-1 text-xs font-bold text-dew-700 hover:underline"
                  >
                    <RefreshCw size={11} /> Mặc định
                  </button>
                ) : null}
              </div>

              {/* Preview */}
              <div className="mb-3 flex h-36 items-center justify-center rounded-xl bg-slate-900/5 border border-dashed border-dew-200 overflow-hidden p-1.5">
                <img
                  src={form.showcaseVideoImage || '/screenshots/video-bai-giang.png'}
                  alt="Video bài giảng tương tác"
                  className="h-full w-full object-cover rounded-lg"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dew-300 bg-dew-50 px-3 py-2 text-xs font-extrabold text-dew-800 hover:bg-dew-100 transition">
                <Upload size={14} />
                <span>{uploadingShowcase.showcaseVideoImage ? 'Đang tải...' : 'Tải ảnh Video lên'}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleShowcaseUpload(file, 'showcaseVideoImage');
                  }}
                />
              </label>
              <input
                className="field text-xs py-1"
                value={form.showcaseVideoImage || ''}
                placeholder="/screenshots/video-bai-giang.png"
                onChange={(e) => setForm({ ...form, showcaseVideoImage: e.target.value })}
              />
            </div>
          </div>

          {/* Tab 3: AI chấm điểm & gợi ý */}
          <div className="rounded-2xl border border-dew-200/80 bg-white/70 p-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-extrabold text-slate-800">Tab 3: AI chấm điểm</span>
                {form.showcaseAiImage && form.showcaseAiImage !== '/screenshots/ai-cham-diem.png' ? (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, showcaseAiImage: '/screenshots/ai-cham-diem.png' })}
                    className="flex items-center gap-1 text-xs font-bold text-dew-700 hover:underline"
                  >
                    <RefreshCw size={11} /> Mặc định
                  </button>
                ) : null}
              </div>

              {/* Preview */}
              <div className="mb-3 flex h-36 items-center justify-center rounded-xl bg-slate-900/5 border border-dashed border-dew-200 overflow-hidden p-1.5">
                <img
                  src={form.showcaseAiImage || '/screenshots/ai-cham-diem.png'}
                  alt="AI chấm điểm và gợi ý"
                  className="h-full w-full object-cover rounded-lg"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dew-300 bg-dew-50 px-3 py-2 text-xs font-extrabold text-dew-800 hover:bg-dew-100 transition">
                <Upload size={14} />
                <span>{uploadingShowcase.showcaseAiImage ? 'Đang tải...' : 'Tải ảnh AI lên'}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleShowcaseUpload(file, 'showcaseAiImage');
                  }}
                />
              </label>
              <input
                className="field text-xs py-1"
                value={form.showcaseAiImage || ''}
                placeholder="/screenshots/ai-cham-diem.png"
                onChange={(e) => setForm({ ...form, showcaseAiImage: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* KHỐI 3: ĐỊA CHỈ LMS */}
      <div className="glass rounded-drop p-6">
        <div className="mb-4 flex items-center gap-2 border-b border-dew-100 pb-3">
          <Globe className="text-dew-700" size={20} />
          <h3 className="text-base font-black text-dew-900">3. Kết nối cổng LMS học tập</h3>
        </div>

        <label className="grid gap-1.5 text-sm font-extrabold text-slate-700">
          <span>
            Địa chỉ LMS <span className="font-normal text-slate-500">(Đổi ở đây, toàn bộ nút Đăng nhập & Đăng ký trên web sẽ tự đồng bộ)</span>
          </span>
          <input
            className="field"
            value={form.lmsUrl || ''}
            placeholder="http://localhost:5173 hoặc https://lms.dewskill.vn"
            onChange={(e) => setForm({ ...form, lmsUrl: e.target.value })}
          />
        </label>
      </div>

      {/* KHỐI 4: NỘI DUNG ĐẦU TRANG & GHI CHÚ */}
      <div className="glass rounded-drop p-6">
        <div className="mb-4 flex items-center gap-2 border-b border-dew-100 pb-3">
          <Sparkles className="text-dew-700" size={20} />
          <h3 className="text-base font-black text-dew-900">4. Nội dung trang chủ</h3>
        </div>

        <div className="grid gap-4">
          <label className="grid gap-1.5 text-sm font-extrabold text-slate-700">
            Tiêu đề đầu trang (Hero Title)
            <textarea
              className="field min-h-[70px]"
              value={form.heroTitle || ''}
              onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
            />
          </label>

          <label className="grid gap-1.5 text-sm font-extrabold text-slate-700">
            Mô tả đầu trang (Hero Subtitle)
            <textarea
              className="field min-h-[80px]"
              value={form.heroSubtitle || ''}
              onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
            />
          </label>

          <label className="grid gap-1.5 text-sm font-extrabold text-slate-700">
            Ghi chú chân trang (Footer Bio / Note)
            <textarea
              className="field min-h-[70px]"
              value={form.footerNote || ''}
              onChange={(e) => setForm({ ...form, footerNote: e.target.value })}
            />
          </label>
        </div>
      </div>

      {/* KHỐI 5: MẠNG XÃ HỘI & LIÊN HỆ */}
      <div className="glass rounded-drop p-6">
        <div className="mb-4 flex items-center gap-2 border-b border-dew-100 pb-3">
          <Share2 className="text-dew-700" size={20} />
          <h3 className="text-base font-black text-dew-900">5. Liên hệ & Kênh Mạng xã hội chân trang</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-extrabold text-slate-700">
            Hotline
            <input
              className="field"
              value={form.hotline || ''}
              placeholder="0900 000 000"
              onChange={(e) => setForm({ ...form, hotline: e.target.value })}
            />
          </label>

          <label className="grid gap-1.5 text-sm font-extrabold text-slate-700">
            Link Zalo tư vấn
            <input
              className="field"
              value={form.zaloUrl || ''}
              placeholder="https://zalo.me/..."
              onChange={(e) => setForm({ ...form, zaloUrl: e.target.value })}
            />
          </label>

          <label className="grid gap-1.5 text-sm font-extrabold text-slate-700">
            Link Fanpage Facebook
            <input
              className="field"
              value={form.facebookUrl || ''}
              placeholder="https://facebook.com/..."
              onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })}
            />
          </label>

          <label className="grid gap-1.5 text-sm font-extrabold text-slate-700">
            Link Kênh YouTube
            <input
              className="field"
              value={form.youtubeUrl || ''}
              placeholder="https://youtube.com/@..."
              onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
            />
          </label>

          <label className="grid gap-1.5 text-sm font-extrabold text-slate-700 md:col-span-2">
            Link Kênh TikTok
            <input
              className="field"
              value={form.tiktokUrl || ''}
              placeholder="https://tiktok.com/@..."
              onChange={(e) => setForm({ ...form, tiktokUrl: e.target.value })}
            />
          </label>
        </div>
      </div>

      {/* KHỐI 6: ỨNG DỤNG DI ĐỘNG */}
      <div className="glass rounded-drop p-6">
        <div className="mb-4 flex items-center gap-2 border-b border-dew-100 pb-3">
          <Smartphone className="text-dew-700" size={20} />
          <h3 className="text-base font-black text-dew-900">6. Link ứng dụng di động (Android & iOS)</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-extrabold text-slate-700">
            Link Google Play (Android)
            <input
              className="field"
              value={form.googlePlayUrl || ''}
              placeholder="https://play.google.com/store/apps/..."
              onChange={(e) => setForm({ ...form, googlePlayUrl: e.target.value })}
            />
          </label>

          <label className="grid gap-1.5 text-sm font-extrabold text-slate-700">
            Link App Store (iOS)
            <input
              className="field"
              value={form.appStoreUrl || ''}
              placeholder="https://apps.apple.com/app/..."
              onChange={(e) => setForm({ ...form, appStoreUrl: e.target.value })}
            />
          </label>
        </div>
      </div>

      {/* KHỐI 7: BẢO MẬT & MẬT KHẨU QUẢN TRỊ ADMIN */}
      <div className="glass rounded-drop p-6">
        <div className="mb-4 flex items-center justify-between border-b border-dew-100 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Lock className="text-dew-700" size={20} />
            <h3 className="text-base font-black text-dew-900">
              7. Bảo mật & Mật khẩu Quản trị Admin
            </h3>
          </div>
          {form.hasAdminPassword ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
              <ShieldCheck size={13} className="text-emerald-600" />
              Đang dùng mật khẩu quản trị riêng
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">
              <Key size={13} className="text-amber-600" />
              Đang dùng mật khẩu mặc định (admin123)
            </span>
          )}
        </div>

        <div className="max-w-md">
          <label className="grid gap-1.5 text-sm font-extrabold text-slate-700">
            <span>Đặt mật khẩu Admin mới</span>
            <div className="relative flex items-center">
              <input
                type={showAdminPassword ? 'text' : 'password'}
                className="field pr-10"
                value={form.adminPassword || ''}
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                onChange={(e) => setForm({ ...form, adminPassword: e.target.value })}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowAdminPassword(!showAdminPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showAdminPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showAdminPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              Để trống nếu muốn giữ nguyên mật khẩu hiện tại. Bấm "Lưu toàn bộ cấu hình" bên dưới để áp dụng.
            </span>
          </label>
        </div>

        {/* Sub-card: Google Authenticator (2FA) */}
        <div className="mt-6 pt-5 border-t border-dew-100">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className={form.adminTotpEnabled ? "text-emerald-600" : "text-slate-400"} size={18} />
              <span className="text-sm font-extrabold text-slate-800">
                Xác thực 2 bước Google Authenticator (TOTP)
              </span>
            </div>
            {form.adminTotpEnabled ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                <Check size={12} className="text-emerald-600" />
                Đang bật 2FA (Yêu cầu mã mỗi lần đăng nhập)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 border border-slate-200">
                Chưa bật 2FA
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Bảo vệ tài khoản quản trị tối đa: Mỗi lần đăng nhập, ngoài mật khẩu bạn cần nhập thêm mã 6 chữ số thay đổi mỗi 30 giây từ ứng dụng <strong>Google Authenticator</strong> trên điện thoại.
          </p>

          {!form.adminTotpEnabled && !totpSetup ? (
            <button
              type="button"
              onClick={startTotpSetup}
              disabled={totpLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-dew-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-dew-700 transition cursor-pointer"
            >
              <Key size={14} />
              <span>{totpLoading ? 'Đang tạo mã QR...' : 'Kích hoạt Google Authenticator ngay'}</span>
            </button>
          ) : null}

          {/* Setup Panel */}
          {totpSetup ? (
            <div className="rounded-2xl border border-dew-200 bg-dew-50/60 p-4 sm:p-5 mt-3 max-w-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase text-dew-900 tracking-wider">
                  Quét mã QR vào Google Authenticator
                </span>
                <button
                  type="button"
                  onClick={() => setTotpSetup(null)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Đóng
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                <div className="rounded-xl bg-white p-2.5 shadow-sm border border-dew-200 shrink-0">
                  <img
                    src={totpSetup.qrCodeUrl}
                    alt="Google Authenticator QR Code"
                    className="w-36 h-36 object-contain"
                  />
                </div>
                <div className="flex-1 text-xs text-slate-600 space-y-2">
                  <p><strong>Bước 1:</strong> Mở app <strong>Google Authenticator</strong> trên điện thoại.</p>
                  <p><strong>Bước 2:</strong> Bấm biểu tượng <strong>+</strong> rồi chọn <strong>Quét mã QR</strong>.</p>
                  <p><strong>Bước 3:</strong> Hoặc nhập khóa bí mật thủ công:</p>
                  <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-200">
                    <code className="font-mono font-bold text-dew-800 text-[11px] select-all flex-1 truncate">
                      {totpSetup.secret}
                    </code>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(totpSetup.secret);
                        setCopiedSecret(true);
                        setTimeout(() => setCopiedSecret(false), 2000);
                      }}
                      className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
                    >
                      {copiedSecret ? 'Đã chép' : 'Chép'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-dew-200/70">
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                  Nhập mã 6 chữ số đang hiển thị trên app để xác thực:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={totpCodeInput}
                    onChange={(e) => setTotpCodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="field !w-36 text-center font-mono font-black text-lg tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={confirmTotpActivation}
                    disabled={totpLoading || totpCodeInput.length !== 6}
                    className="btn-primary !py-2 !px-4 text-xs"
                  >
                    {totpLoading ? 'Đang kích hoạt...' : 'Xác thực & Kích hoạt'}
                  </button>
                </div>
                {totpError ? <p className="mt-2 text-xs font-bold text-red-600">{totpError}</p> : null}
              </div>
            </div>
          ) : null}

          {/* Disable Panel if currently enabled */}
          {form.adminTotpEnabled && !totpSetup ? (
            <div className="mt-2">
              {showDisableTotp ? (
                <div className="flex items-center gap-2 flex-wrap bg-red-50/70 p-3 rounded-xl border border-red-200 max-w-md">
                  <span className="text-xs font-bold text-red-800 w-full mb-1">
                    Nhập mã 6 số từ Google Authenticator để xác nhận tắt 2FA:
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={disableCodeInput}
                    onChange={(e) => setDisableCodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="field !w-28 text-center font-mono font-bold text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleDisableTotp}
                    disabled={totpLoading || disableCodeInput.length !== 6}
                    className="rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700 transition cursor-pointer"
                  >
                    Xác nhận tắt 2FA
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowDisableTotp(false); setDisableCodeInput(''); setTotpError(''); }}
                    className="text-xs font-semibold text-slate-500 hover:underline cursor-pointer"
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDisableTotp(true)}
                  className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
                >
                  Tắt bảo mật 2FA (Không khuyến nghị)
                </button>
              )}
            </div>
          ) : null}
          {totpError && !totpSetup ? <p className="mt-2 text-xs font-bold text-red-600">{totpError}</p> : null}
        </div>
      </div>

      {/* KHỐI 8: CẤU HÌNH ĐĂNG NHẬP GOOGLE (GOOGLE AUTHENTICATION) */}
      <div className="glass rounded-drop p-6">
        <div className="mb-4 flex items-center justify-between border-b border-dew-100 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Globe className="text-dew-700" size={20} />
            <h3 className="text-base font-black text-dew-900">
              8. Cấu hình Đăng nhập Google (Google Authentication)
            </h3>
          </div>
          {form.googleClientId && form.googleClientSecret ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
              <ShieldCheck size={13} className="text-emerald-600" />
              Google OAuth sẵn sàng hoạt động
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 border border-rose-200">
              Chưa cấu hình Google OAuth
            </span>
          )}
        </div>

        <p className="mb-4 text-xs font-medium text-slate-600 leading-relaxed">
          Cho phép học viên đăng nhập nhanh bằng tài khoản Google tại trang luyện tập miễn phí. 
          Lấy Client ID và Client Secret từ <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="font-bold text-dew-700 underline">Google Cloud Console</a>.
        </p>

        {/* Authorized Redirect URI */}
        <div className="mb-4 rounded-xl border border-sky-200 bg-sky-50/70 p-3.5">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-extrabold text-sky-900">
              Authorized Redirect URI (URI chuyển hướng hợp lệ dán vào Google Cloud):
            </span>
            <button
              type="button"
              onClick={() => {
                const origin = typeof window !== 'undefined' ? window.location.origin.replace(':3100', ':5000') : 'http://localhost:5000';
                const uri = `${origin}/api/auth/free-portal/google/callback`;
                navigator.clipboard.writeText(uri);
                setCopiedUri(true);
                setTimeout(() => setCopiedUri(false), 2000);
              }}
              className="inline-flex items-center gap-1 rounded-lg bg-sky-100 px-2 py-1 text-[11px] font-bold text-sky-800 hover:bg-sky-200 transition cursor-pointer"
            >
              {copiedUri ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
              <span>{copiedUri ? 'Đã sao chép!' : 'Sao chép URI'}</span>
            </button>
          </div>
          <code className="block rounded-lg bg-white px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800 border border-sky-200 select-all">
            {typeof window !== 'undefined'
              ? `${window.location.origin.replace(':3100', ':5000')}/api/auth/free-portal/google/callback`
              : 'http://localhost:5000/api/auth/free-portal/google/callback'}
          </code>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-extrabold text-slate-700">
            <span>Google Client ID</span>
            <input
              className="field font-mono text-xs"
              value={form.googleClientId || ''}
              placeholder="VD: 123456789-xxx.apps.googleusercontent.com"
              onChange={(e) => setForm({ ...form, googleClientId: e.target.value })}
            />
          </label>

          <label className="grid gap-1.5 text-sm font-extrabold text-slate-700">
            <span>Google Client Secret</span>
            <div className="relative flex items-center">
              <input
                type={showGoogleSecret ? 'text' : 'password'}
                className="field font-mono text-xs pr-10"
                value={form.googleClientSecret || ''}
                placeholder="VD: GOCSPX-xxxxxxxxxxxxxxxxxxxx"
                onChange={(e) => setForm({ ...form, googleClientSecret: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowGoogleSecret(!showGoogleSecret)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showGoogleSecret ? 'Ẩn' : 'Hiện'}
              >
                {showGoogleSecret ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="sticky bottom-4 z-20 flex items-center justify-between gap-4 rounded-2xl bg-white/90 p-4 shadow-xl border border-dew-200 backdrop-blur">
        <div className="flex items-center gap-2">
          <button type="submit" className="btn-primary !px-6 !py-3 text-base">
            Lưu toàn bộ cấu hình
          </button>
          {message ? (
            <span className="text-sm font-bold text-dew-700 bg-dew-50 px-3 py-1.5 rounded-lg border border-dew-200">
              {message}
            </span>
          ) : null}
        </div>
        <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
          Thay đổi sẽ áp dụng ngay tức thì
        </span>
      </div>
    </form>
  );
}
