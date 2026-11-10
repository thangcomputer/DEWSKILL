'use client';

import { useEffect, useState } from 'react';
import { Upload, X, RefreshCw, Globe, Image as ImageIcon, Sparkles, Smartphone, Share2, HelpCircle, Key, Lock, ShieldCheck, Copy, Check, Eye, EyeOff, Layers, Map, Compass, Newspaper, MessageSquare, ChevronRight, CheckCircle2 } from 'lucide-react';
import { adminFetch } from './adminFetch';
import { DEFAULT_FEATURES_DATA, DEFAULT_JOURNEY_DATA, DEFAULT_SHOWCASE_DATA } from '@/lib/landingDefaults';

function isVideoMedia(url) {
  if (!url || typeof url !== 'string') return false;
  const clean = url.split('?')[0].toLowerCase();
  return (
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.ogv') ||
    clean.endsWith('.mov') ||
    clean.includes('youtube.com') ||
    clean.includes('youtu.be') ||
    clean.includes('vimeo.com')
  );
}

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
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);
  const [activeJourneyTab, setActiveJourneyTab] = useState(0);
  const [activeShowcaseTab, setActiveShowcaseTab] = useState(0);

  function updateFeatureCard(idx, key, value) {
    setForm((prev) => {
      const cards = prev.featuresCards && prev.featuresCards.length > 0 ? [...prev.featuresCards] : [...DEFAULT_FEATURES_DATA];
      cards[idx] = { ...cards[idx], [key]: value };
      return { ...prev, featuresCards: cards };
    });
  }

  function updateFeaturePoint(cardIdx, pointIdx, value) {
    setForm((prev) => {
      const cards = prev.featuresCards && prev.featuresCards.length > 0 ? [...prev.featuresCards] : [...DEFAULT_FEATURES_DATA];
      const points = Array.isArray(cards[cardIdx].points) ? [...cards[cardIdx].points] : ['', '', ''];
      points[pointIdx] = value;
      cards[cardIdx] = { ...cards[cardIdx], points };
      return { ...prev, featuresCards: cards };
    });
  }

  function updateJourneyStep(idx, key, value) {
    setForm((prev) => {
      const steps = prev.journeySteps && prev.journeySteps.length > 0 ? [...prev.journeySteps] : [...DEFAULT_JOURNEY_DATA];
      steps[idx] = { ...steps[idx], [key]: value };
      return { ...prev, journeySteps: steps };
    });
  }

  function updateShowcaseTab(idx, key, value) {
    setForm((prev) => {
      const tabs = prev.showcaseTabs && prev.showcaseTabs.length > 0 ? [...prev.showcaseTabs] : [...DEFAULT_SHOWCASE_DATA];
      tabs[idx] = { ...tabs[idx], [key]: value };
      return { ...prev, showcaseTabs: tabs };
    });
  }

  function updateShowcasePoint(tabIdx, pointIdx, value) {
    setForm((prev) => {
      const tabs = prev.showcaseTabs && prev.showcaseTabs.length > 0 ? [...prev.showcaseTabs] : [...DEFAULT_SHOWCASE_DATA];
      const points = Array.isArray(tabs[tabIdx].points) ? [...tabs[tabIdx].points] : ['', '', ''];
      points[pointIdx] = value;
      tabs[tabIdx] = { ...tabs[tabIdx], points };
      return { ...prev, showcaseTabs: tabs };
    });
  }

  function updateCtaPoint(pointIdx, value) {
    setForm((prev) => {
      const points = Array.isArray(prev.ctaPoints) && prev.ctaPoints.length > 0 ? [...prev.ctaPoints] : [
        'Miễn phí 100% tài khoản học thử',
        'Tự do luyện tập câu hỏi mỗi ngày',
        'Tích XP và duy trì ngọn lửa Streak'
      ];
      points[pointIdx] = value;
      return { ...prev, ctaPoints: points };
    });
  }

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

  async function handleGenericUpload(file, onSuccess) {
    if (!file) return;
    setMessage('');
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await adminFetch('/api/admin/upload', { method: 'POST', body: data });
      onSuccess(res.url);
      setMessage('Đã tải ảnh lên thành công! Hãy nhấn "Lưu thay đổi" ở dưới cùng để áp dụng lên trang chủ.');
    } catch (err) {
      setMessage(err.message);
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

      {/* KHỐI 2: NỘI DUNG VÀ HÌNH ẢNH TỪNG SECTION MENU TRÊN TRANG CHỦ */}
      <div className="glass rounded-drop p-6 space-y-8">
        <div className="border-b border-dew-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="text-dew-700" size={22} />
            <h3 className="text-base font-black text-dew-900">
              2. Quản lý nội dung &amp; hình ảnh từng Section Menu trên trang chủ
            </h3>
          </div>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Tùy biến tiêu đề, mô tả và tải lên hình ảnh/video cho đầy đủ 5 mục trên thanh điều hướng Menu (Trải nghiệm, Tính năng, Lộ trình, Poster, Nhận tư vấn).
          </p>
        </div>

        {/* SECTION 1: TRẢI NGHIỆM (#trai-nghiem) */}
        <div className="rounded-2xl border-2 border-dew-200 bg-white/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-dew-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-dew-600 text-xs font-black text-white">1</span>
              <h4 className="text-sm font-black text-dew-950 uppercase tracking-wide">
                Menu #1: Mục &quot;Trải nghiệm&quot; (#trai-nghiem)
              </h4>
            </div>
            <span className="text-[11px] font-bold text-dew-700 bg-dew-50 border border-dew-200 px-2.5 py-0.5 rounded-full">
              Mockup 3 Tab &amp; Banner CTA học thử
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-xs font-bold text-slate-700">
              Tiêu đề mục Trải nghiệm
              <input
                className="field text-xs py-1.5"
                value={form.showcaseTitle || ''}
                placeholder="Học tin học như chơi game, tiến bộ thấy rõ từng ngày"
                onChange={(e) => setForm({ ...form, showcaseTitle: e.target.value })}
              />
            </label>
            <label className="grid gap-1 text-xs font-bold text-slate-700">
              Mô tả mục Trải nghiệm
              <input
                className="field text-xs py-1.5"
                value={form.showcaseSubtitle || ''}
                placeholder="Ảnh chụp thực tế từ hệ sinh thái học tập: Chặng học rõ ràng, bài giảng video ngắn và AI chấm điểm tức thì."
                onChange={(e) => setForm({ ...form, showcaseSubtitle: e.target.value })}
              />
            </label>
          </div>

          {/* 3 Tabs Media Box */}
          <div className="pt-2">
            <p className="text-xs font-extrabold text-slate-800 mb-2">
              Hình ảnh hoặc Video hiển thị trong khung trình duyệt của 3 Tab:
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {/* Tab 1: Lộ trình từng chặng */}
              <div className="rounded-xl border border-dew-200/80 bg-dew-50/40 p-3 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold text-slate-800">Tab 1: Lộ trình chặng</span>
                    {form.showcasePathImage && form.showcasePathImage !== '/screenshots/lo-trinh-chang.png' ? (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, showcasePathImage: '/screenshots/lo-trinh-chang.png' })}
                        className="flex items-center gap-1 text-[11px] font-bold text-dew-700 hover:underline"
                      >
                        <RefreshCw size={10} /> Mặc định
                      </button>
                    ) : null}
                  </div>

                  <div className="relative mb-2.5 flex h-28 items-center justify-center rounded-lg bg-slate-950 border border-dashed border-dew-200 overflow-hidden p-1">
                    {isVideoMedia(form.showcasePathImage || '/screenshots/lo-trinh-chang.png') ? (
                      <video
                        src={form.showcasePathImage || '/screenshots/lo-trinh-chang.png'}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-full w-full object-cover rounded"
                      />
                    ) : (
                      <img
                        src={form.showcasePathImage || '/screenshots/lo-trinh-chang.png'}
                        alt="Lộ trình từng chặng"
                        className="h-full w-full object-cover rounded"
                      />
                    )}
                    <span className="absolute bottom-1.5 left-1.5 rounded bg-black/75 px-1 py-0.5 text-[9px] font-bold text-white">
                      {isVideoMedia(form.showcasePathImage || '/screenshots/lo-trinh-chang.png') ? '📹 Video' : '🖼️ Ảnh'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dew-300 bg-dew-50 px-2 py-1.5 text-[11px] font-extrabold text-dew-800 hover:bg-dew-100 transition">
                    <Upload size={12} />
                    <span>{uploadingShowcase.showcasePathImage ? 'Đang tải...' : 'Tải Ảnh / Video'}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleShowcaseUpload(file, 'showcasePathImage');
                      }}
                    />
                  </label>
                  <input
                    className="field text-[11px] py-1"
                    value={form.showcasePathImage || ''}
                    placeholder="URL ảnh hoặc link video"
                    onChange={(e) => setForm({ ...form, showcasePathImage: e.target.value })}
                  />
                </div>
              </div>

              {/* Tab 2: Video ngắn có câu hỏi */}
              <div className="rounded-xl border border-dew-200/80 bg-dew-50/40 p-3 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold text-slate-800">Tab 2: Video bài giảng</span>
                    {form.showcaseVideoImage && form.showcaseVideoImage !== '/screenshots/video-bai-giang.png' ? (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, showcaseVideoImage: '/screenshots/video-bai-giang.png' })}
                        className="flex items-center gap-1 text-[11px] font-bold text-dew-700 hover:underline"
                      >
                        <RefreshCw size={10} /> Mặc định
                      </button>
                    ) : null}
                  </div>

                  <div className="relative mb-2.5 flex h-28 items-center justify-center rounded-lg bg-slate-950 border border-dashed border-dew-200 overflow-hidden p-1">
                    {isVideoMedia(form.showcaseVideoImage || '/screenshots/video-bai-giang.png') ? (
                      <video
                        src={form.showcaseVideoImage || '/screenshots/video-bai-giang.png'}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-full w-full object-cover rounded"
                      />
                    ) : (
                      <img
                        src={form.showcaseVideoImage || '/screenshots/video-bai-giang.png'}
                        alt="Video bài giảng tương tác"
                        className="h-full w-full object-cover rounded"
                      />
                    )}
                    <span className="absolute bottom-1.5 left-1.5 rounded bg-black/75 px-1 py-0.5 text-[9px] font-bold text-white">
                      {isVideoMedia(form.showcaseVideoImage || '/screenshots/video-bai-giang.png') ? '📹 Video' : '🖼️ Ảnh'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dew-300 bg-dew-50 px-2 py-1.5 text-[11px] font-extrabold text-dew-800 hover:bg-dew-100 transition">
                    <Upload size={12} />
                    <span>{uploadingShowcase.showcaseVideoImage ? 'Đang tải...' : 'Tải Ảnh / Video'}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleShowcaseUpload(file, 'showcaseVideoImage');
                      }}
                    />
                  </label>
                  <input
                    className="field text-[11px] py-1"
                    value={form.showcaseVideoImage || ''}
                    placeholder="URL ảnh hoặc link video"
                    onChange={(e) => setForm({ ...form, showcaseVideoImage: e.target.value })}
                  />
                </div>
              </div>

              {/* Tab 3: AI chấm điểm & gợi ý */}
              <div className="rounded-xl border border-dew-200/80 bg-dew-50/40 p-3 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold text-slate-800">Tab 3: AI chấm điểm</span>
                    {form.showcaseAiImage && form.showcaseAiImage !== '/screenshots/ai-cham-diem.png' ? (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, showcaseAiImage: '/screenshots/ai-cham-diem.png' })}
                        className="flex items-center gap-1 text-[11px] font-bold text-dew-700 hover:underline"
                      >
                        <RefreshCw size={10} /> Mặc định
                      </button>
                    ) : null}
                  </div>

                  <div className="relative mb-2.5 flex h-28 items-center justify-center rounded-lg bg-slate-950 border border-dashed border-dew-200 overflow-hidden p-1">
                    {isVideoMedia(form.showcaseAiImage || '/screenshots/ai-cham-diem.png') ? (
                      <video
                        src={form.showcaseAiImage || '/screenshots/ai-cham-diem.png'}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-full w-full object-cover rounded"
                      />
                    ) : (
                      <img
                        src={form.showcaseAiImage || '/screenshots/ai-cham-diem.png'}
                        alt="AI chấm điểm và gợi ý"
                        className="h-full w-full object-cover rounded"
                      />
                    )}
                    <span className="absolute bottom-1.5 left-1.5 rounded bg-black/75 px-1 py-0.5 text-[9px] font-bold text-white">
                      {isVideoMedia(form.showcaseAiImage || '/screenshots/ai-cham-diem.png') ? '📹 Video' : '🖼️ Ảnh'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dew-300 bg-dew-50 px-2 py-1.5 text-[11px] font-extrabold text-dew-800 hover:bg-dew-100 transition">
                    <Upload size={12} />
                    <span>{uploadingShowcase.showcaseAiImage ? 'Đang tải...' : 'Tải Ảnh / Video'}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleShowcaseUpload(file, 'showcaseAiImage');
                      }}
                    />
                  </label>
                  <input
                    className="field text-[11px] py-1"
                    value={form.showcaseAiImage || ''}
                    placeholder="URL ảnh hoặc link video"
                    onChange={(e) => setForm({ ...form, showcaseAiImage: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Banner Thẻ "Học thử miễn phí ngay hôm nay!" */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" /> Thẻ kêu gọi &quot;Học thử miễn phí ngay hôm nay!&quot; (Banner màu xanh lá)
              </span>
              {form.ctaMascotImage ? (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, ctaMascotImage: '' })}
                  className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:underline"
                >
                  <RefreshCw size={10} /> Linh vật mặc định
                </button>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <label className="grid gap-1 text-xs font-bold text-slate-700">
                Huy hiệu thẻ (Badge)
                <input
                  className="field text-xs py-1.5"
                  value={form.ctaBadge || ''}
                  placeholder="⚡ Bắt đầu không rủi ro"
                  onChange={(e) => setForm({ ...form, ctaBadge: e.target.value })}
                />
              </label>
              <label className="grid gap-1 text-xs font-bold text-slate-700">
                Tiêu đề banner CTA
                <input
                  className="field text-xs py-1.5"
                  value={form.ctaTitle || ''}
                  placeholder="Học thử miễn phí ngay hôm nay!"
                  onChange={(e) => setForm({ ...form, ctaTitle: e.target.value })}
                />
              </label>
              <label className="grid gap-1 text-xs font-bold text-slate-700">
                Mô tả banner CTA
                <input
                  className="field text-xs py-1.5"
                  value={form.ctaSubtitle || ''}
                  placeholder="Tạo tài khoản nhanh chóng chỉ với số điện thoại để vào luyện tập..."
                  onChange={(e) => setForm({ ...form, ctaSubtitle: e.target.value })}
                />
              </label>
            </div>

            {/* 3 Cam kết / Gạch đầu dòng banner CTA */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-extrabold text-slate-700">
                3 Dòng cam kết gạch đầu dòng trên banner:
              </span>
              <div className="grid gap-2 sm:grid-cols-3">
                <input
                  className="field text-xs py-1"
                  value={(form.ctaPoints && form.ctaPoints[0]) || ''}
                  placeholder="Miễn phí 100% tài khoản học thử"
                  onChange={(e) => updateCtaPoint(0, e.target.value)}
                />
                <input
                  className="field text-xs py-1"
                  value={(form.ctaPoints && form.ctaPoints[1]) || ''}
                  placeholder="Tự do luyện tập câu hỏi mỗi ngày"
                  onChange={(e) => updateCtaPoint(1, e.target.value)}
                />
                <input
                  className="field text-xs py-1"
                  value={(form.ctaPoints && form.ctaPoints[2]) || ''}
                  placeholder="Tích XP và duy trì ngọn lửa Streak"
                  onChange={(e) => updateCtaPoint(2, e.target.value)}
                />
              </div>
            </div>

            {/* 2 Nút hành động */}
            <div className="grid gap-3 sm:grid-cols-2 pt-1">
              <label className="grid gap-1 text-xs font-bold text-slate-700">
                Chữ trên Nút Đăng ký (Nút trắng chính)
                <input
                  className="field text-xs py-1.5"
                  value={form.ctaPrimaryText || ''}
                  placeholder="Đăng ký học miễn phí ngay"
                  onChange={(e) => setForm({ ...form, ctaPrimaryText: e.target.value })}
                />
              </label>
              <label className="grid gap-1 text-xs font-bold text-slate-700">
                Chữ trên Nút Đăng nhập (Nút viền mờ)
                <input
                  className="field text-xs py-1.5"
                  value={form.ctaSecondaryText || ''}
                  placeholder="Đã có tài khoản? Đăng nhập"
                  onChange={(e) => setForm({ ...form, ctaSecondaryText: e.target.value })}
                />
              </label>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
              <div className="h-20 w-20 shrink-0 rounded-xl border border-emerald-300 bg-white flex items-center justify-center p-1 overflow-hidden shadow-2xs">
                {form.ctaMascotImage ? (
                  <img src={form.ctaMascotImage} alt="Mascot CTA" className="h-full w-full object-contain" />
                ) : (
                  <span className="text-[10px] text-center font-bold text-emerald-700">Linh vật quyết tâm mặc định</span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1.5 w-full">
                <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-extrabold text-emerald-800 hover:bg-emerald-100/60 transition">
                  <Upload size={13} />
                  <span>{uploadingShowcase.ctaMascotImage ? 'Đang tải...' : 'Tải ảnh linh vật / banner tùy chọn lên'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleShowcaseUpload(file, 'ctaMascotImage');
                    }}
                  />
                </label>
                <input
                  className="field text-xs py-1"
                  value={form.ctaMascotImage || ''}
                  placeholder="Hoặc dán URL ảnh linh vật / hình minh họa tại đây"
                  onChange={(e) => setForm({ ...form, ctaMascotImage: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: TÍNH NĂNG (#tinh-nang) */}
        <div className="rounded-2xl border-2 border-dew-200 bg-white/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-dew-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-dew-600 text-xs font-black text-white">2</span>
              <h4 className="text-sm font-black text-dew-950 uppercase tracking-wide">
                Menu #2: Mục &quot;Tính năng&quot; (#tinh-nang)
              </h4>
            </div>
            <span className="text-[11px] font-bold text-dew-700 bg-dew-50 border border-dew-200 px-2.5 py-0.5 rounded-full">
              4 Thẻ phương pháp EdTech 4.0
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1 text-xs font-bold text-slate-700">
              Huy hiệu mục (Badge)
              <input
                className="field text-xs py-1.5"
                value={form.featuresBadge || ''}
                placeholder="Phương pháp giáo dục tương tác 4.0"
                onChange={(e) => setForm({ ...form, featuresBadge: e.target.value })}
              />
            </label>
            <label className="grid gap-1 text-xs font-bold text-slate-700">
              Tiêu đề mục Tính năng
              <input
                className="field text-xs py-1.5"
                value={form.featuresTitle || ''}
                placeholder="Tự học mà vẫn có động lực"
                onChange={(e) => setForm({ ...form, featuresTitle: e.target.value })}
              />
            </label>
            <label className="grid gap-1 text-xs font-bold text-slate-700">
              Mô tả mục Tính năng
              <input
                className="field text-xs py-1.5"
                value={form.featuresSubtitle || ''}
                placeholder="Mỗi ngày 10 đến 15 phút là đủ để tiến bộ đều đặn với phương pháp sư phạm số thông minh."
                onChange={(e) => setForm({ ...form, featuresSubtitle: e.target.value })}
              />
            </label>
          </div>

          {/* Sub-tabs chọn từng Card trong 4 cards */}
          <div className="pt-2 border-t border-dew-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800">
                Chỉnh sửa chi tiết từng Thẻ tính năng (Chữ, 3 Gạch đầu dòng &amp; Icon/Ảnh):
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">
                Chọn thẻ bên dưới để sửa
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { idx: 0, label: 'Thẻ 1: Lộ trình từng chặng' },
                { idx: 1, label: 'Thẻ 2: XP & Chuỗi ngày' },
                { idx: 2, label: 'Thẻ 3: Video có câu hỏi' },
                { idx: 3, label: 'Thẻ 4: AI chấm điểm' },
              ].map(({ idx, label }) => {
                const isSelected = activeFeatureTab === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveFeatureTab(idx)}
                    className={`rounded-xl px-3 py-2 text-xs font-black transition-all border ${
                      isSelected
                        ? 'bg-dew-600 text-white border-dew-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-dew-50 hover:border-dew-300'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Chi tiết thẻ đang chọn */}
            {(() => {
              const cards = form.featuresCards && form.featuresCards.length > 0 ? form.featuresCards : DEFAULT_FEATURES_DATA;
              const card = cards[activeFeatureTab] || DEFAULT_FEATURES_DATA[activeFeatureTab] || DEFAULT_FEATURES_DATA[0];
              const points = Array.isArray(card.points) && card.points.length > 0 ? card.points : ['', '', ''];

              return (
                <div className="rounded-xl border border-dew-200/90 bg-dew-50/50 p-4 space-y-3 mt-3">
                  <div className="flex items-center justify-between border-b border-dew-100 pb-2">
                    <span className="text-xs font-black text-dew-900">
                      Đang chỉnh sửa: <span className="text-dew-700 font-bold">{card.title || `Thẻ #${activeFeatureTab + 1}`}</span>
                    </span>
                    {card.iconUrl ? (
                      <button
                        type="button"
                        onClick={() => updateFeatureCard(activeFeatureTab, 'iconUrl', '')}
                        className="flex items-center gap-1 text-[11px] font-bold text-dew-700 hover:underline"
                      >
                        <RefreshCw size={10} /> Dùng Icon mặc định
                      </button>
                    ) : null}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-1 text-xs font-bold text-slate-700">
                      Tiêu đề thẻ
                      <input
                        className="field text-xs py-1.5"
                        value={card.title || ''}
                        placeholder="Tiêu đề thẻ"
                        onChange={(e) => updateFeatureCard(activeFeatureTab, 'title', e.target.value)}
                      />
                    </label>
                    <label className="grid gap-1 text-xs font-bold text-slate-700">
                      Huy hiệu danh mục
                      <input
                        className="field text-xs py-1.5"
                        value={card.category || ''}
                        placeholder="Danh mục thẻ"
                        onChange={(e) => updateFeatureCard(activeFeatureTab, 'category', e.target.value)}
                      />
                    </label>
                  </div>

                  <label className="grid gap-1 text-xs font-bold text-slate-700">
                    Mô tả ngắn của thẻ
                    <textarea
                      className="field text-xs min-h-[60px]"
                      value={card.text || ''}
                      placeholder="Mô tả chi tiết"
                      onChange={(e) => updateFeatureCard(activeFeatureTab, 'text', e.target.value)}
                    />
                  </label>

                  {/* 3 Tiêu chí / Gạch đầu dòng */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-extrabold text-slate-700">
                      3 Gạch đầu dòng tiêu chí sư phạm:
                    </span>
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-dew-600 font-bold text-xs shrink-0">①</span>
                        <input
                          className="field text-xs py-1 flex-1"
                          value={points[0] || ''}
                          placeholder="Gạch đầu dòng 1"
                          onChange={(e) => updateFeaturePoint(activeFeatureTab, 0, e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-dew-600 font-bold text-xs shrink-0">②</span>
                        <input
                          className="field text-xs py-1 flex-1"
                          value={points[1] || ''}
                          placeholder="Gạch đầu dòng 2"
                          onChange={(e) => updateFeaturePoint(activeFeatureTab, 1, e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-dew-600 font-bold text-xs shrink-0">③</span>
                        <input
                          className="field text-xs py-1 flex-1"
                          value={points[2] || ''}
                          placeholder="Gạch đầu dòng 3"
                          onChange={(e) => updateFeaturePoint(activeFeatureTab, 2, e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <label className="grid gap-1 text-xs font-bold text-slate-700">
                    Ghi chú chất lượng chân thẻ (Meta Footer)
                    <input
                      className="field text-xs py-1.5"
                      value={card.meta || ''}
                      placeholder="Ví dụ: Chuẩn sư phạm thực chiến"
                      onChange={(e) => updateFeatureCard(activeFeatureTab, 'meta', e.target.value)}
                    />
                  </label>

                  {/* Upload Icon/Ảnh tùy chọn */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-dew-100">
                    <div className="h-14 w-14 shrink-0 rounded-xl border border-dew-300 bg-white flex items-center justify-center p-1 overflow-hidden shadow-2xs">
                      {card.iconUrl ? (
                        <img src={card.iconUrl} alt={card.title} className="h-full w-full object-contain" />
                      ) : (
                        <span className="text-[10px] text-center font-bold text-dew-700">Icon mặc định</span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5 w-full">
                      <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dew-300 bg-white px-3 py-1.5 text-xs font-extrabold text-dew-800 hover:bg-dew-100/60 transition">
                        <Upload size={13} />
                        <span>Tải ảnh / icon riêng cho thẻ này</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleGenericUpload(file, (url) => updateFeatureCard(activeFeatureTab, 'iconUrl', url));
                            }
                          }}
                        />
                      </label>
                      <input
                        className="field text-xs py-1"
                        value={card.iconUrl || ''}
                        placeholder="Hoặc dán URL ảnh / icon tùy chọn tại đây"
                        onChange={(e) => updateFeatureCard(activeFeatureTab, 'iconUrl', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* SECTION 3: LỘ TRÌNH (#lo-trinh) */}
        <div className="rounded-2xl border-2 border-dew-200 bg-white/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-dew-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-dew-600 text-xs font-black text-white">3</span>
              <h4 className="text-sm font-black text-dew-950 uppercase tracking-wide">
                Menu #3: Mục &quot;Lộ trình&quot; (#lo-trinh)
              </h4>
            </div>
            <span className="text-[11px] font-bold text-dew-700 bg-dew-50 border border-dew-200 px-2.5 py-0.5 rounded-full">
              4 Bước hành trình giọt nước
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-xs font-bold text-slate-700">
              Tiêu đề mục Lộ trình
              <input
                className="field text-xs py-1.5"
                value={form.journeyTitle || ''}
                placeholder="Hành trình của bạn cùng DewSkill"
                onChange={(e) => setForm({ ...form, journeyTitle: e.target.value })}
              />
            </label>
            <label className="grid gap-1 text-xs font-bold text-slate-700">
              Mô tả mục Lộ trình
              <input
                className="field text-xs py-1.5"
                value={form.journeySubtitle || ''}
                placeholder="Lộ trình 4 bước đơn giản từ người mới bắt đầu đến thành thạo tin học văn phòng."
                onChange={(e) => setForm({ ...form, journeySubtitle: e.target.value })}
              />
            </label>
          </div>

          {/* Sub-tabs chọn 4 bước hành trình */}
          <div className="pt-2 border-t border-dew-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800">
                Chỉnh sửa chi tiết từng Bước (Tiêu đề, Mô tả, Linh vật / Ảnh):
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">
                Chọn bước bên dưới để sửa
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { idx: 0, label: 'Bước 1: Tạo tài khoản' },
                { idx: 1, label: 'Bước 2: Học theo chặng' },
                { idx: 2, label: 'Bước 3: Luyện tập mỗi ngày' },
                { idx: 3, label: 'Bước 4: Vượt chặng' },
              ].map(({ idx, label }) => {
                const isSelected = activeJourneyTab === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveJourneyTab(idx)}
                    className={`rounded-xl px-3 py-2 text-xs font-black transition-all border ${
                      isSelected
                        ? 'bg-dew-600 text-white border-dew-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-dew-50 hover:border-dew-300'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Chi tiết bước đang chọn */}
            {(() => {
              const steps = form.journeySteps && form.journeySteps.length > 0 ? form.journeySteps : DEFAULT_JOURNEY_DATA;
              const step = steps[activeJourneyTab] || DEFAULT_JOURNEY_DATA[activeJourneyTab] || DEFAULT_JOURNEY_DATA[0];

              return (
                <div className="rounded-xl border border-dew-200/90 bg-dew-50/50 p-4 space-y-3 mt-3">
                  <div className="flex items-center justify-between border-b border-dew-100 pb-2">
                    <span className="text-xs font-black text-dew-900">
                      Đang chỉnh sửa: <span className="text-dew-700 font-bold">{step.title || `Bước #${activeJourneyTab + 1}`}</span>
                    </span>
                    {step.image ? (
                      <button
                        type="button"
                        onClick={() => updateJourneyStep(activeJourneyTab, 'image', '')}
                        className="flex items-center gap-1 text-[11px] font-bold text-dew-700 hover:underline"
                      >
                        <RefreshCw size={10} /> Dùng linh vật mặc định
                      </button>
                    ) : null}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-1 text-xs font-bold text-slate-700">
                      Tiêu đề bước
                      <input
                        className="field text-xs py-1.5"
                        value={step.title || ''}
                        placeholder="Tiêu đề bước"
                        onChange={(e) => updateJourneyStep(activeJourneyTab, 'title', e.target.value)}
                      />
                    </label>
                    <label className="grid gap-1 text-xs font-bold text-slate-700">
                      Số thứ tự bước
                      <input
                        type="number"
                        className="field text-xs py-1.5"
                        value={step.n || activeJourneyTab + 1}
                        onChange={(e) => updateJourneyStep(activeJourneyTab, 'n', parseInt(e.target.value, 10) || activeJourneyTab + 1)}
                      />
                    </label>
                  </div>

                  <label className="grid gap-1 text-xs font-bold text-slate-700">
                    Mô tả chi tiết bước học
                    <textarea
                      className="field text-xs min-h-[60px]"
                      value={step.text || ''}
                      placeholder="Mô tả bước học"
                      onChange={(e) => updateJourneyStep(activeJourneyTab, 'text', e.target.value)}
                    />
                  </label>

                  {/* Ảnh minh họa hoặc Linh vật của bước */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 border-t border-dew-100">
                    <div className="h-16 w-16 shrink-0 rounded-xl border border-dew-300 bg-white flex items-center justify-center p-1 overflow-hidden shadow-2xs">
                      {step.image ? (
                        <img src={step.image} alt={step.title} className="h-full w-full object-contain" />
                      ) : (
                        <span className="text-[10px] text-center font-bold text-dew-700">
                          {step.mascot || 'cam-xuc-hoc-bai'}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5 w-full">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <label className="grid gap-1 text-[11px] font-bold text-slate-700">
                          Chọn linh vật có sẵn:
                          <select
                            className="field text-xs py-1"
                            value={step.mascot || 'cam-xuc-hoc-bai'}
                            onChange={(e) => updateJourneyStep(activeJourneyTab, 'mascot', e.target.value)}
                          >
                            <option value="cam-xuc-hoc-bai">Cảm xúc học bài (Đội mũ cử nhân + laptop)</option>
                            <option value="doc-sach">Đọc sách (Đội mũ cử nhân + ôm sách)</option>
                            <option value="nang-dong">Năng động (Đội mũ cử nhân + laptop bánh răng)</option>
                            <option value="tot-nghiep-vui-ve">Tốt nghiệp vui vẻ (Giơ tay mừng tốt nghiệp)</option>
                            <option value="cam-xuc-vui">Cảm xúc vui tươi</option>
                            <option value="quyet-tam">Quyết tâm tập trung</option>
                            <option value="y-tuong">Ý tưởng sáng tạo</option>
                          </select>
                        </label>
                        <div className="flex flex-col justify-end">
                          <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dew-300 bg-white px-3 py-1.5 text-xs font-extrabold text-dew-800 hover:bg-dew-100/60 transition">
                            <Upload size={13} />
                            <span>Tải ảnh riêng cho bước này</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleGenericUpload(file, (url) => updateJourneyStep(activeJourneyTab, 'image', url));
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                      <input
                        className="field text-xs py-1"
                        value={step.image || ''}
                        placeholder="Hoặc dán URL ảnh riêng cho bước này tại đây"
                        onChange={(e) => updateJourneyStep(activeJourneyTab, 'image', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* SECTION 4: POSTER & TIN (#poster) */}
        <div className="rounded-2xl border-2 border-dew-200 bg-white/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-dew-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-dew-600 text-xs font-black text-white">4</span>
              <h4 className="text-sm font-black text-dew-950 uppercase tracking-wide">
                Menu #4: Mục &quot;Poster &amp; Tin&quot; (#poster)
              </h4>
            </div>
            <span className="text-[11px] font-bold text-dew-700 bg-dew-50 border border-dew-200 px-2.5 py-0.5 rounded-full">
              Slider Carousel Poster &amp; Tin tức
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-xs font-bold text-slate-700">
              Tiêu đề mục Poster
              <input
                className="field text-xs py-1.5"
                value={form.postersTitle || ''}
                placeholder="Poster và tin mới"
                onChange={(e) => setForm({ ...form, postersTitle: e.target.value })}
              />
            </label>
            <label className="grid gap-1 text-xs font-bold text-slate-700">
              Mô tả mục Poster
              <input
                className="field text-xs py-1.5"
                value={form.postersSubtitle || ''}
                placeholder="Ưu đãi, mẹo học và thông báo mới nhất."
                onChange={(e) => setForm({ ...form, postersSubtitle: e.target.value })}
              />
            </label>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-dew-50/70 p-3 border border-dew-200/80">
            <span className="text-xs font-bold text-slate-700">
              🖼️ Thêm, sửa, đổi hình ảnh poster &amp; bài viết chi tiết:
            </span>
            <span className="text-xs font-bold text-dew-700">
              Vào tab &quot;Poster &amp; bài viết&quot; ở trên menu trang quản trị
            </span>
          </div>
        </div>

        {/* SECTION 5: NHẬN TƯ VẤN (#tu-van) */}
        <div className="rounded-2xl border-2 border-dew-200 bg-white/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-dew-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-dew-600 text-xs font-black text-white">5</span>
              <h4 className="text-sm font-black text-dew-950 uppercase tracking-wide">
                Menu #5: Mục &quot;Nhận tư vấn&quot; (#tu-van)
              </h4>
            </div>
            <span className="text-[11px] font-bold text-dew-700 bg-dew-50 border border-dew-200 px-2.5 py-0.5 rounded-full">
              Form tư vấn &amp; Hình ảnh đại diện
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-xs font-bold text-slate-700">
              Tiêu đề mục Tư vấn
              <input
                className="field text-xs py-1.5"
                value={form.leadTitle || ''}
                placeholder="Cần bạn đồng hành?"
                onChange={(e) => setForm({ ...form, leadTitle: e.target.value })}
              />
            </label>
            <label className="grid gap-1 text-xs font-bold text-slate-700">
              Mô tả mục Tư vấn
              <input
                className="field text-xs py-1.5"
                value={form.leadSubtitle || ''}
                placeholder="Để lại số điện thoại, chúng tôi sẽ hướng dẫn bạn tạo tài khoản..."
                onChange={(e) => setForm({ ...form, leadSubtitle: e.target.value })}
              />
            </label>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
            <div className="h-20 w-20 shrink-0 rounded-xl border border-dew-300 bg-white flex items-center justify-center p-1 overflow-hidden shadow-2xs">
              {form.leadImage ? (
                <img src={form.leadImage} alt="Ảnh tư vấn" className="h-full w-full object-contain" />
              ) : (
                <span className="text-[10px] text-center font-bold text-dew-700">Linh vật tư vấn mặc định</span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1.5 w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Hình ảnh minh họa / Linh vật cạnh form tư vấn</span>
                {form.leadImage ? (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, leadImage: '' })}
                    className="flex items-center gap-1 text-[11px] font-bold text-dew-700 hover:underline"
                  >
                    <RefreshCw size={10} /> Mặc định
                  </button>
                ) : null}
              </div>
              <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dew-300 bg-white px-3 py-1.5 text-xs font-extrabold text-dew-800 hover:bg-dew-50 transition">
                <Upload size={13} />
                <span>{uploadingShowcase.leadImage ? 'Đang tải...' : 'Tải ảnh tư vấn viên / linh vật mới lên'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleShowcaseUpload(file, 'leadImage');
                  }}
                />
              </label>
              <input
                className="field text-xs py-1"
                value={form.leadImage || ''}
                placeholder="Hoặc dán URL ảnh tại đây"
                onChange={(e) => setForm({ ...form, leadImage: e.target.value })}
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

      {/* KHỐI 4: NỘI DUNG ĐẦU TRANG (HERO) & GHI CHÚ CHÂN TRANG */}
      <div className="glass rounded-drop p-6 space-y-4">
        <div className="mb-2 flex items-center justify-between border-b border-dew-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="text-dew-700" size={20} />
            <h3 className="text-base font-black text-dew-900">4. Nội dung phần đầu trang (Hero Banner)</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">Khu vực chào mừng đầu trang chủ</span>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-extrabold text-slate-700">
              Huy hiệu đầu trang (Hero Badge)
              <input
                className="field"
                value={form.heroBadge || ''}
                placeholder="Tự học tin học có lộ trình"
                onChange={(e) => setForm({ ...form, heroBadge: e.target.value })}
              />
            </label>
            <label className="grid gap-1.5 text-sm font-extrabold text-slate-700">
              Tiêu đề lớn đầu trang (Hero Title)
              <input
                className="field"
                value={form.heroTitle || ''}
                placeholder="Học tin học như chơi game cùng DewSkill"
                onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
              />
            </label>
          </div>

          <label className="grid gap-1.5 text-sm font-extrabold text-slate-700">
            Mô tả đầu trang (Hero Subtitle)
            <textarea
              className="field min-h-[70px]"
              value={form.heroSubtitle || ''}
              placeholder="Lộ trình rõ ràng, tích XP mỗi ngày, video ngắn có câu hỏi ngay trong bài..."
              onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-extrabold text-slate-700">
              Chữ nút chính (Primary CTA)
              <input
                className="field"
                value={form.heroCtaPrimary || ''}
                placeholder="Vào luyện tập ngay"
                onChange={(e) => setForm({ ...form, heroCtaPrimary: e.target.value })}
              />
            </label>
            <label className="grid gap-1.5 text-sm font-extrabold text-slate-700">
              Chữ nút phụ (Secondary CTA)
              <input
                className="field"
                value={form.heroCtaSecondary || ''}
                placeholder="Xem giao diện thực tế"
                onChange={(e) => setForm({ ...form, heroCtaSecondary: e.target.value })}
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-extrabold text-slate-700">
              Huy hiệu động lực 1
              <input
                className="field"
                value={form.heroTag1 || ''}
                placeholder="⚡ Tích XP mỗi ngày"
                onChange={(e) => setForm({ ...form, heroTag1: e.target.value })}
              />
            </label>
            <label className="grid gap-1.5 text-sm font-extrabold text-slate-700">
              Huy hiệu động lực 2
              <input
                className="field"
                value={form.heroTag2 || ''}
                placeholder="🔥 Giữ chuỗi ngày học"
                onChange={(e) => setForm({ ...form, heroTag2: e.target.value })}
              />
            </label>
          </div>

          {/* Tải ảnh linh vật / banner minh họa lớn bên phải Hero */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 border-t border-dew-100">
            <div className="h-20 w-20 shrink-0 rounded-2xl border border-dew-300 bg-white flex items-center justify-center p-2 overflow-hidden shadow-2xs">
              {form.heroMascotImage ? (
                <img src={form.heroMascotImage} alt="Hero Mascot" className="h-full w-full object-contain" />
              ) : (
                <span className="text-[10px] text-center font-bold text-dew-700">Linh vật đọc sách mặc định</span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1.5 w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Hình ảnh linh vật / Banner minh họa đầu trang</span>
                {form.heroMascotImage ? (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, heroMascotImage: '' })}
                    className="flex items-center gap-1 text-[11px] font-bold text-dew-700 hover:underline"
                  >
                    <RefreshCw size={10} /> Dùng mặc định
                  </button>
                ) : null}
              </div>
              <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dew-300 bg-white px-3 py-1.5 text-xs font-extrabold text-dew-800 hover:bg-dew-50 transition">
                <Upload size={13} />
                <span>Tải ảnh linh vật / banner tùy chọn lên</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleGenericUpload(file, (url) => setForm({ ...form, heroMascotImage: url }));
                    }
                  }}
                />
              </label>
              <input
                className="field text-xs py-1"
                value={form.heroMascotImage || ''}
                placeholder="Hoặc dán URL ảnh linh vật tại đây"
                onChange={(e) => setForm({ ...form, heroMascotImage: e.target.value })}
              />
            </div>
          </div>

          <label className="grid gap-1.5 text-sm font-extrabold text-slate-700 pt-2 border-t border-dew-100">
            Ghi chú chân trang (Footer Bio / Note)
            <textarea
              className="field min-h-[70px]"
              value={form.footerNote || ''}
              placeholder="DewSkill là nền tảng tự học tin học thế hệ mới..."
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
