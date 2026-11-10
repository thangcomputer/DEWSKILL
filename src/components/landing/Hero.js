import { ArrowRight, Flame, Sparkles, Zap, Laptop, FileSpreadsheet, Bot, Terminal, Award } from 'lucide-react';
import Mascot from './Mascot';
import { lmsLink } from '@/lib/lms';

export default function Hero({ site }) {
  return (
    <section className="relative overflow-hidden">
      {/* ─── Nền Công Nghệ Giáo Dục (EdTech High-Tech Canvas & Ambient Lights) ─── */}
      <div className="pointer-events-none absolute -left-28 -top-28 h-96 w-96 rounded-full bg-dew-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-20 h-96 w-96 rounded-full bg-sky-300/25 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 top-1/2 h-80 w-80 rounded-full bg-amber-200/20 blur-3xl" />

      {/* Đường mạch điện tử công nghệ & Nút mạng dữ liệu (Tech Circuit Lines & Nodes) */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="circuit-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <path d="M-80 180 L220 180 L280 240 L460 240" stroke="url(#circuit-line-grad)" strokeWidth="1.5" fill="none" strokeDasharray="6 6" />
        <path d="M1250 140 L980 140 L910 210 L700 210" stroke="url(#circuit-line-grad)" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
        <path d="M-40 450 L160 450 L220 390 L380 390" stroke="url(#circuit-line-grad)" strokeWidth="1.5" fill="none" />
        <circle cx="280" cy="240" r="4.5" fill="#10b981" className="animate-pulse" />
        <circle cx="910" cy="210" r="4.5" fill="#0ea5e9" className="animate-pulse" />
        <circle cx="220" cy="390" r="4" fill="#10b981" />
      </svg>

      {/* Thẻ Terminal Lập Trình & Tin Học (EdTech Mini IDE Badge - Far Left Margin) */}
      <div className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 hidden 2xl:flex flex-col gap-1 rounded-xl border border-dew-200/60 bg-white/70 p-2.5 shadow-sm backdrop-blur-md font-mono text-[10px] text-dew-900/70" aria-hidden="true">
        <div className="flex items-center gap-1.5 pb-1 border-b border-dew-100">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="h-2 w-2 rounded-full bg-sky-400" />
          <span className="ml-1 text-[9px] font-bold text-dew-800">dewskill_engine.py</span>
        </div>
        <div>&gt; student.learn(&quot;Tin học Văn phòng&quot;)</div>
        <div className="text-emerald-600 font-bold">&gt; status: 100% Thành thạo ✓</div>
      </div>

      {/* ─── Các Thẻ Chip Phím Tắt & Tính Năng Công Nghệ (Floating EdTech Badges) ─── */}
      {/* Chip 1: Ctrl + S (Top Left) */}
      <div
        className="pointer-events-none absolute left-4 lg:left-8 top-10 hidden md:flex items-center gap-2 rounded-2xl border border-white/90 bg-white/80 px-3.5 py-1.5 shadow-lg shadow-dew-900/5 backdrop-blur-md animate-float-soft"
        style={{ animationDuration: '6s' }}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-dew-100 text-xs font-black text-dew-700">⌨</span>
        <div className="flex flex-col">
          <span className="text-xs font-black text-slate-800">Ctrl + S</span>
          <span className="text-[10px] font-semibold text-slate-500">Lưu bài tức thì</span>
        </div>
      </div>

      {/* Chip 2: fx = =SUM(XP) (Bottom Left) */}
      <div
        className="pointer-events-none absolute left-6 lg:left-14 bottom-14 hidden md:flex items-center gap-2 rounded-2xl border border-white/90 bg-white/80 px-3.5 py-1.5 shadow-lg shadow-dew-900/5 backdrop-blur-md animate-float-soft"
        style={{ animationDuration: '7s', animationDelay: '1s' }}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-xs font-black text-emerald-700">fx</span>
        <div className="flex flex-col">
          <span className="font-mono text-xs font-black text-slate-800">=SUM(XP)</span>
          <span className="text-[10px] font-bold text-emerald-600">+100 XP tự động</span>
        </div>
      </div>

      {/* Chip 3: AI Mentor 24/7 (Top Right) */}
      <div
        className="pointer-events-none absolute right-6 lg:right-12 top-8 hidden md:flex items-center gap-2 rounded-2xl border border-white/90 bg-white/80 px-3.5 py-1.5 shadow-lg shadow-dew-900/5 backdrop-blur-md animate-float-soft"
        style={{ animationDuration: '8s', animationDelay: '0.5s' }}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-100 text-xs text-amber-700">⚡</span>
        <div className="flex flex-col">
          <span className="text-xs font-black text-slate-800">AI Trợ Giảng 24/7</span>
          <span className="text-[10px] font-bold text-amber-600">Chấm điểm & Gợi ý 1s</span>
        </div>
      </div>

      {/* Chip 4: Word • Excel • PPT (Bottom Right) */}
      <div
        className="pointer-events-none absolute right-4 lg:right-10 bottom-12 hidden md:flex items-center gap-2 rounded-2xl border border-white/90 bg-white/80 px-3.5 py-1.5 shadow-lg shadow-dew-900/5 backdrop-blur-md animate-float-soft"
        style={{ animationDuration: '6.5s', animationDelay: '1.5s' }}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-100 text-xs font-black text-sky-700">DOC</span>
        <div className="flex flex-col">
          <span className="text-xs font-black text-slate-800">Word • Excel • PPT</span>
          <span className="text-[10px] font-semibold text-slate-500">Chuẩn THCS & Đi làm</span>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:py-16 md:py-20 lg:grid-cols-2 lg:py-24">
        {/* Left Column: Heading & Value props */}
        <div className="reveal-left text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-dew-200 bg-white px-3.5 py-1 text-xs font-extrabold text-dew-700 shadow-xs">
            <Sparkles size={14} className="text-amber-500" /> Tự học tin học có lộ trình
          </span>

          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl">
            {site.heroTitle || 'Học tin học như chơi game, tự tin thành thạo cùng DewSkill'}
          </h1>

          {site.heroSubtitle ? (
            <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-slate-600 sm:text-base mx-auto lg:mx-0">
              {site.heroSubtitle}
            </p>
          ) : null}

          {/* CTA Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <a href={lmsLink(site.lmsUrl, 'start')} className="btn-primary !px-5 sm:!px-6 !py-3 text-sm sm:text-base">
              Vào luyện tập ngay <ArrowRight size={16} />
            </a>
            <a href="#trai-nghiem" className="btn-ghost !px-5 sm:!px-6 !py-3 text-sm sm:text-base">
              Xem giao diện thực tế
            </a>
          </div>

          {/* Gamification tags */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs font-extrabold">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200/60 px-3 py-1.5 text-amber-700">
              <Zap size={14} /> Tích XP mỗi ngày
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200/60 px-3 py-1.5 text-orange-700">
              <Flame size={14} /> Giữ chuỗi ngày học
            </span>
          </div>
        </div>

        {/* Right Column: Floating Mascot with EdTech Tech Radar Rings & XP badges */}
        <div className="reveal-right delay-150 relative mx-auto flex items-center justify-center w-full max-w-md">
          {/* Tech Radar Rings behind Mascot */}
          <div className="pointer-events-none absolute -inset-8 flex items-center justify-center" aria-hidden="true">
            {/* Halo hào quang công nghệ */}
            <div className="absolute h-80 w-80 sm:h-[400px] sm:w-[400px] rounded-full bg-gradient-to-tr from-emerald-400/20 via-sky-400/15 to-transparent blur-2xl" />
            {/* Vòng quay radar nét đứt */}
            <div className="h-72 w-72 sm:h-96 sm:w-96 rounded-full border border-dew-400/40 border-dashed animate-spin-slow" />
            {/* Vòng tròn công nghệ nét chấm */}
            <div className="absolute h-80 w-80 sm:h-[420px] sm:w-[420px] rounded-full border border-sky-400/30 border-dotted" />
          </div>

          {/* Circular glass bubble */}
          <div className="glass relative z-10 flex h-64 w-64 items-center justify-center rounded-full sm:h-80 sm:w-80 md:h-96 md:w-96 shadow-2xl shadow-dew-900/10 border border-white/90">
            <div className="h-48 w-48 sm:h-64 sm:w-64 md:h-72 md:w-72 flex items-center justify-center">
              <Mascot name="doc-sach" size={240} className="animate-floaty" />
            </div>
          </div>

          {/* Floating Badges (safely positioned within container boundaries) */}
          <div className="glass absolute left-2 top-4 sm:left-0 sm:top-8 rounded-drop px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-black text-dew-700 shadow-md">
            ⚡ +15 XP
          </div>
          <div className="glass absolute right-2 bottom-4 sm:right-0 sm:bottom-8 rounded-drop px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-black text-orange-600 shadow-md">
            🔥 7 ngày liên tục
          </div>
        </div>
      </div>
    </section>
  );
}
