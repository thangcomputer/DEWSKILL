'use client';

import { useEffect, useState } from 'react';
import { Upload, X, RefreshCw, Globe, Image as ImageIcon, Sparkles, Smartphone, Share2, HelpCircle } from 'lucide-react';
import { adminFetch } from './adminFetch';

export default function SiteTab() {
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

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

  async function save(event) {
    event.preventDefault();
    setMessage('');
    try {
      await adminFetch('/api/admin/site', { method: 'PUT', body: form });
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

      {/* KHỐI 2: ĐỊA CHỈ LMS */}
      <div className="glass rounded-drop p-6">
        <div className="mb-4 flex items-center gap-2 border-b border-dew-100 pb-3">
          <Globe className="text-dew-700" size={20} />
          <h3 className="text-base font-black text-dew-900">2. Kết nối cổng LMS học tập</h3>
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

      {/* KHỐI 3: NỘI DUNG ĐẦU TRANG & GHI CHÚ */}
      <div className="glass rounded-drop p-6">
        <div className="mb-4 flex items-center gap-2 border-b border-dew-100 pb-3">
          <Sparkles className="text-dew-700" size={20} />
          <h3 className="text-base font-black text-dew-900">3. Nội dung trang chủ</h3>
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

      {/* KHỐI 4: MẠNG XÃ HỘI & LIÊN HỆ */}
      <div className="glass rounded-drop p-6">
        <div className="mb-4 flex items-center gap-2 border-b border-dew-100 pb-3">
          <Share2 className="text-dew-700" size={20} />
          <h3 className="text-base font-black text-dew-900">4. Liên hệ & Kênh Mạng xã hội chân trang</h3>
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

      {/* KHỐI 5: ỨNG DỤNG DI ĐỘNG */}
      <div className="glass rounded-drop p-6">
        <div className="mb-4 flex items-center gap-2 border-b border-dew-100 pb-3">
          <Smartphone className="text-dew-700" size={20} />
          <h3 className="text-base font-black text-dew-900">5. Link ứng dụng di động (Android & iOS)</h3>
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
