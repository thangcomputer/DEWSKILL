'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Droplet, ExternalLink, Phone, MessageSquare, ShieldCheck, Sparkles, ArrowUp } from 'lucide-react';
import { BrandMark } from './Header';
import { lmsLink } from '@/lib/lms';

/* ---------- SVG Brand Icons ---------- */
function FacebookIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function YoutubeIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function TiktokIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function ZaloIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.782 0.166016H27.199C33.2653 0.166016 36.8103 1.05701 39.9572 2.74421C43.1041 4.4314 45.5875 6.89585 47.2557 10.0428C48.9429 13.1897 49.8339 16.7347 49.8339 22.801V27.1991C49.8339 33.2654 48.9429 36.8104 47.2557 39.9573C45.5685 43.1042 43.1041 45.5877 39.9572 47.2559C36.8103 48.9431 33.2653 49.8341 27.199 49.8341H22.8009C16.7346 49.8341 13.1896 48.9431 10.0427 47.2559C6.89583 45.5687 4.41243 43.1042 2.7442 39.9573C1.057 36.8104 0.166016 33.2654 0.166016 27.1991V22.801C0.166016 16.7347 1.057 13.1897 2.7442 10.0428C4.43139 6.89585 6.89583 4.41245 10.0427 2.74421C13.1707 1.05701 16.7346 0.166016 22.782 0.166016Z"
        fill="#0068FF"
      />
      <path
        opacity="0.12"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M49.8336 26.4736V27.1994C49.8336 33.2657 48.9427 36.8107 47.2555 39.9576C45.5683 43.1045 43.1038 45.5879 39.9569 47.2562C36.81 48.9434 33.265 49.8344 27.1987 49.8344H22.8007C17.8369 49.8344 14.5612 49.2378 11.8104 48.0966L7.27539 43.4267L49.8336 26.4736Z"
        fill="#001A33"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.779 43.5892C10.1019 43.846 13.0061 43.1836 15.0682 42.1825C24.0225 47.1318 38.0197 46.8954 46.4923 41.4732C46.8209 40.9803 47.1279 40.4677 47.4128 39.9363C49.1062 36.7779 50.0004 33.22 50.0004 27.1316V22.7175C50.0004 16.629 49.1062 13.0711 47.4128 9.91273C45.7385 6.75436 43.2461 4.28093 40.0877 2.58758C36.9293 0.894239 33.3714 0 27.283 0H22.8499C17.6644 0 14.2982 0.652754 11.4699 1.89893C11.3153 2.03737 11.1636 2.17818 11.0151 2.32135C2.71734 10.3203 2.08658 27.6593 9.12279 37.0782C9.13064 37.0921 9.13933 37.1061 9.14889 37.1203C10.2334 38.7185 9.18694 41.5154 7.55068 43.1516C7.28431 43.399 7.37944 43.5512 7.779 43.5892Z"
        fill="white"
      />
      <path
        d="M20.5632 17H10.8382V19.0853H17.5869L10.9329 27.3317C10.7244 27.635 10.5728 27.9194 10.5728 28.5639V29.0947H19.748C20.203 29.0947 20.5822 28.7156 20.5822 28.2606V27.1421H13.4922L19.748 19.2938C19.8428 19.1801 20.0134 18.9716 20.0893 18.8768L20.1272 18.8199C20.4874 18.2891 20.5632 17.8341 20.5632 17.2844V17Z"
        fill="#0068FF"
      />
      <path
        d="M32.9416 29.0947H34.3255V17H32.2402V28.3933C32.2402 28.7725 32.5435 29.0947 32.9416 29.0947Z"
        fill="#0068FF"
      />
      <path
        d="M25.814 19.6924C23.1979 19.6924 21.0747 21.8156 21.0747 24.4317C21.0747 27.0478 23.1979 29.171 25.814 29.171C28.4301 29.171 30.5533 27.0478 30.5533 24.4317C30.5723 21.8156 28.4491 19.6924 25.814 19.6924ZM25.814 27.2184C24.2785 27.2184 23.0273 25.9672 23.0273 24.4317C23.0273 22.8962 24.2785 21.645 25.814 21.645C27.3495 21.645 28.6007 22.8962 28.6007 24.4317C28.6007 25.9672 27.3685 27.2184 25.814 27.2184Z"
        fill="#0068FF"
      />
      <path
        d="M40.4867 19.6162C37.8516 19.6162 35.7095 21.7584 35.7095 24.3934C35.7095 27.0285 37.8516 29.1707 40.4867 29.1707C43.1217 29.1707 45.2639 27.0285 45.2639 24.3934C45.2639 21.7584 43.1217 19.6162 40.4867 19.6162ZM40.4867 27.2181C38.9322 27.2181 37.681 25.9669 37.681 24.4124C37.681 22.8579 38.9322 21.6067 40.4867 21.6067C42.0412 21.6067 43.2924 22.8579 43.2924 24.4124C43.2924 25.9669 42.0412 27.2181 40.4867 27.2181Z"
        fill="#0068FF"
      />
      <path
        d="M29.4562 29.0944H30.5747V19.957H28.6221V28.2793C28.6221 28.7153 29.0012 29.0944 29.4562 29.0944Z"
        fill="#0068FF"
      />
    </svg>
  );
}

function AppleIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 170 170" fill="currentColor" aria-hidden="true">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.88-11.96-14.52-5.74-8.91-10.3-19.16-13.68-30.75-3.38-11.59-5.07-22.78-5.07-33.57 0-14.99 3.56-27.42 10.68-37.28 7.12-9.87 16.32-14.93 27.6-15.19 4.35 0 9.28 1.13 14.79 3.39 5.51 2.26 9.4 3.44 11.66 3.54 2.05-.1 6.07-1.32 12.06-3.67 5.99-2.35 11.03-3.41 15.12-3.17 11.83.67 21.39 4.96 28.68 12.87-10.42 6.33-15.5 15.18-15.24 26.54.26 9.2 3.86 16.89 10.79 23.07 6.94 6.18 15.29 9.61 25.07 10.28-2.35 7.02-5.28 14.19-8.79 21.5zm-32.99-106.87c.13 1.83-.24 3.73-1.12 5.71-.88 1.98-2.17 3.93-3.87 5.86-2.13 2.39-4.7 4.38-7.72 5.96-3.02 1.58-5.99 2.5-8.92 2.76-.26-1.83.17-3.71 1.28-5.63 1.11-1.92 2.45-3.79 4.02-5.61 2.02-2.39 4.54-4.38 7.57-5.96 3.03-1.58 5.95-2.61 8.76-3.09z" />
    </svg>
  );
}

function GooglePlayIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 512 512" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M48.7 13.8C44.3 18.5 41.8 25.6 41.8 35.1v441.8c0 9.5 2.5 16.6 6.9 21.3l1.2 1.2 247.4-247.4v-5.8L50 12.6l-1.3 1.2z"
      />
      <path
        fill="#FFBA00"
        d="M379.8 329.4l-82.5-82.5v-5.8l82.5-82.5 1.9 1.1 97.7 55.5c27.9 15.8 27.9 41.8 0 57.7l-97.7 55.4-1.9 1.1z"
      />
      <path
        fill="#EA4335"
        d="M297.3 241.1L48.7 499.7c8.1 8.6 21.6 9.7 36.8 1.1l296.2-168.3-84.4-91.4z"
      />
      <path
        fill="#34A853"
        d="M297.3 270.9l84.4-91.4L85.5 11.2C70.3 2.6 56.8 3.7 48.7 12.3l248.6 258.6z"
      />
    </svg>
  );
}

export default function Footer({ site }) {
  const scrollToTop = (e) => {
    if (typeof window !== 'undefined') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      if (window.location.hash) {
        window.history.pushState(null, '', window.location.pathname);
      }
    }
  };

  const socials = [
    {
      name: 'Facebook',
      url: site.facebookUrl || 'https://facebook.com',
      icon: FacebookIcon,
      badgeClass: 'text-[#1877F2] bg-blue-50/80 border-blue-200/80 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]',
    },
    {
      name: 'Zalo',
      url: site.zaloUrl || 'https://zalo.me',
      icon: ZaloIcon,
      badgeClass: 'text-[#0068FF] bg-sky-50/80 border-sky-200/80 hover:bg-[#0068FF] hover:text-white hover:border-[#0068FF]',
    },
    {
      name: 'YouTube',
      url: site.youtubeUrl || 'https://youtube.com',
      icon: YoutubeIcon,
      badgeClass: 'text-[#FF0000] bg-red-50/80 border-red-200/80 hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]',
    },
    {
      name: 'TikTok',
      url: site.tiktokUrl || 'https://tiktok.com',
      icon: TiktokIcon,
      badgeClass: 'text-slate-900 bg-slate-100 border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900',
    },
  ];

  return (
    <footer className="border-t border-dew-100 bg-gradient-to-b from-white via-dew-50/20 to-dew-50/50">
      {/* Top Banner / Trust bar */}
      <div className="border-b border-dew-100/70 bg-white/60 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-dew-100 text-dew-700">
              <Sparkles size={12} />
            </span>
            <span>Tự học chuẩn phương pháp Microlearning & Gamification</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-dew-100 text-dew-700">
              <ShieldCheck size={12} />
            </span>
            <span>Học thử 100% miễn phí · Không cần thẻ tín dụng</span>
          </div>
          <div className="flex items-center gap-2 text-dew-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-dew-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-dew-500"></span>
            </span>
            <span>Cố vấn học tập hỗ trợ 24/7</span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Cột 1: Thương hiệu & Linh vật & Mạng xã hội (lg: 5 cols) */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            <div className="flex items-center">
              <Link
                href="/"
                onClick={scrollToTop}
                aria-label={`Về đầu trang ${site.brandName || 'DewSkill'}`}
                title="Bấm để cuộn mượt về đầu trang"
                className="group inline-flex items-center transition-transform duration-200 active:scale-95 cursor-pointer"
              >
                <img
                  src={site.logoUrl || '/brand/logo.webp'}
                  alt={site.brandName || 'DewSkill'}
                  className="h-14 sm:h-16 w-auto max-h-16 object-contain drop-shadow-xs transition duration-300 group-hover:scale-105"
                />
              </Link>
            </div>

            <p className="max-w-md text-sm font-medium leading-relaxed text-slate-600">
              {site.footerNote ||
                'DewSkill là nền tảng tự học tin học thế hệ mới. Học qua thực hành, video ngắn tương tác và công nghệ AI đồng hành từng chặng.'}
            </p>

            {/* Mạng xã hội */}
            <div className="pt-2">
              <p className="mb-2.5 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Kết nối cùng DewSkill
              </p>
              <div className="flex items-center gap-2.5">
                {socials.map((soc) => {
                  const Icon = soc.icon;
                  return (
                    <a
                      key={soc.name}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={soc.name}
                      aria-label={`Theo dõi DewSkill trên ${soc.name}`}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border shadow-xs transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${soc.badgeClass}`}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cột 2: Lối tắt học tập (lg: 3 cols) */}
          <div className="flex flex-col gap-3 lg:col-span-3">
            <p className="text-xs font-extrabold uppercase tracking-wider text-dew-900">
              Nền tảng học tập
            </p>
            <nav className="flex flex-col gap-2.5 text-sm font-semibold text-slate-600">
              <a
                href={lmsLink(site.lmsUrl, 'login')}
                className="flex items-center gap-1.5 transition hover:text-dew-700 hover:translate-x-1 duration-150"
              >
                <span>Đăng nhập tự học DewSkill</span>
                <ExternalLink size={13} className="text-slate-400" />
              </a>
              <a
                href={lmsLink(site.lmsUrl, 'courseLogin')}
                className="flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-dew-700 hover:translate-x-1 duration-150"
              >
                <span>Đăng nhập học viên theo khóa (LMS)</span>
                <ExternalLink size={12} className="text-slate-400" />
              </a>
              <a
                href={lmsLink(site.lmsUrl, 'start')}
                className="flex items-center gap-1.5 text-dew-700 font-extrabold transition hover:text-dew-800 hover:translate-x-1 duration-150"
              >
                <span>Đăng ký học miễn phí</span>
                <span className="rounded-full bg-dew-100 px-2 py-0.5 text-[10px] font-black text-dew-700">Free</span>
              </a>
              <a href="#trai-nghiem" className="transition hover:text-dew-700 hover:translate-x-1 duration-150">
                Lộ trình luyện tập & XP
              </a>
              <a href="#tinh-nang" className="transition hover:text-dew-700 hover:translate-x-1 duration-150">
                Tính năng & AI chấm bài
              </a>
              <a href="#poster" className="transition hover:text-dew-700 hover:translate-x-1 duration-150">
                Tin tức & Ưu đãi
              </a>
            </nav>

            {/* Hotline & Zalo */}
            <div className="mt-3 pt-3 border-t border-dew-100 flex flex-col gap-1.5 text-xs text-slate-600">
              {site.hotline ? (
                <div className="flex items-center gap-1.5 font-bold">
                  <Phone size={13} className="text-dew-600" />
                  <span>Hotline: <strong className="text-slate-900">{site.hotline}</strong></span>
                </div>
              ) : null}
              {site.zaloUrl ? (
                <a
                  href={site.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-bold text-dew-700 hover:underline"
                >
                  <MessageSquare size={13} />
                  <span>Tư vấn 1:1 qua Zalo</span>
                </a>
              ) : null}
            </div>
          </div>

          {/* Cột 3: Tải ứng dụng Android & iOS (lg: 4 cols) */}
          <div className="flex flex-col gap-3 lg:col-span-4">
            <p className="text-xs font-extrabold uppercase tracking-wider text-dew-900">
              Ứng dụng di động
            </p>
            <p className="text-sm font-medium text-slate-600">
              Học mọi lúc mọi nơi, duy trì chuỗi Streak và nhận thông báo nhắc nhở làm bài hàng ngày.
            </p>

            {/* App download badges */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 pt-1">
              {/* Google Play (Android) */}
              <a
                href={site.googlePlayUrl || 'https://play.google.com'}
                target="_blank"
                rel="noopener noreferrer"
                title="Tải ứng dụng DewSkill trên Google Play (Android)"
                className="group flex items-center gap-3.5 rounded-xl bg-slate-900 px-4 py-2.5 text-white shadow-sm border border-slate-800 transition duration-200 hover:bg-slate-800 hover:border-dew-500/50 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center">
                  <GooglePlayIcon className="h-6 w-6 transition duration-200 group-hover:scale-110" />
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-300">
                    Khám phá trên
                  </span>
                  <span className="text-sm font-extrabold tracking-tight text-white">
                    Google Play
                  </span>
                </div>
                <span className="ml-auto rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  Android
                </span>
              </a>

              {/* App Store (iOS) */}
              <a
                href={site.appStoreUrl || 'https://apps.apple.com'}
                target="_blank"
                rel="noopener noreferrer"
                title="Tải ứng dụng DewSkill trên App Store (iOS)"
                className="group flex items-center gap-3.5 rounded-xl bg-slate-900 px-4 py-2.5 text-white shadow-sm border border-slate-800 transition duration-200 hover:bg-slate-800 hover:border-dew-500/50 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center">
                  <AppleIcon className="h-6 w-6 text-white transition duration-200 group-hover:scale-110" />
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-300">
                    Tải về trên
                  </span>
                  <span className="text-sm font-extrabold tracking-tight text-white">
                    App Store
                  </span>
                </div>
                <span className="ml-auto rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold text-sky-400">
                  iOS
                </span>
              </a>
            </div>

            <p className="text-[11px] font-medium text-slate-500">
              * Hỗ trợ đồng bộ tiến độ học giữa điện thoại, máy tính bảng và máy tính bàn.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom copyright bar */}
      <div className="border-t border-dew-100 bg-slate-50/80 py-4 pb-20 sm:pb-4">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center justify-between gap-3 px-4 md:grid-cols-3">
          {/* Left: Copyright */}
          <div className="order-2 md:order-1 text-center md:text-left text-xs font-semibold text-slate-600">
            <span>
              {site.copyright || `© ${new Date().getFullYear()} ${site.brandName}. Bản quyền thuộc về ${site.brandName}.`}
            </span>
          </div>

          {/* Center: Back to top pill button */}
          <div className="order-1 md:order-2 flex justify-center">
            <button
              type="button"
              onClick={scrollToTop}
              className="group inline-flex items-center gap-2 rounded-full border border-dew-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 shadow-xs transition-all duration-200 hover:border-dew-400 hover:bg-dew-50 hover:text-dew-800 hover:shadow-sm active:scale-95 cursor-pointer"
              title="Cuộn mượt lên đầu trang"
            >
              <span>Lên đầu trang</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-dew-100 text-dew-700 transition-transform duration-200 group-hover:-translate-y-0.5">
                <ArrowUp size={12} strokeWidth={2.5} />
              </span>
            </button>
          </div>

          {/* Right spacer for 3-column symmetry (keeps center button strictly in the middle) */}
          <div className="order-3 hidden md:block" />
        </div>
      </div>
    </footer>
  );
}
