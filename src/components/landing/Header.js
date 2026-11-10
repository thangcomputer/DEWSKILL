'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, PlayCircle, Sparkles, Map, Newspaper, MessageSquare, ExternalLink, ArrowRight, Phone } from 'lucide-react';
import { lmsLink } from '@/lib/lms';

const NAV = [
  { href: '#trai-nghiem', label: 'Trải nghiệm', icon: PlayCircle },
  { href: '#tinh-nang', label: 'Tính năng', icon: Sparkles },
  { href: '#lo-trinh', label: 'Lộ trình', icon: Map },
  { href: '#poster', label: 'Poster & Tin', icon: Newspaper },
  { href: '#tu-van', label: 'Nhận tư vấn', icon: MessageSquare },
];

export function BrandMark({ name = 'DewSkill', logoUrl }) {
  const logo = logoUrl || '/brand/logo.webp';
  return (
    <span className="relative inline-flex flex-col items-center justify-center pt-0.5 pb-2">
      {/* Ảnh Logo thương hiệu với độ nổi 3D cao cấp */}
      <img
        src={logo}
        alt={name}
        className="relative z-10 h-8 sm:h-9 md:h-10 w-auto max-h-10 object-contain transition-transform duration-300 group-hover:scale-105"
        style={{
          filter: 'drop-shadow(0 3px 5px rgba(5, 150, 105, 0.3)) drop-shadow(0 1px 2px rgba(15, 23, 42, 0.12))',
        }}
      />
      {/* ─── Bóng đổ sàn 3D chân thực đa tầng (Multi-layer 3D Ground Shadow) ─── */}
      <span className="pointer-events-none absolute -bottom-0.5 inset-x-0 flex items-center justify-center" aria-hidden="true">
        {/* Lớp 1: Bóng tiếp xúc mặt sàn (Contact Shadow) - Rõ nét & ôm sát đáy chữ */}
        <span
          className="h-1.5 w-[85%] rounded-full blur-[2px] opacity-75 transition-all duration-300 group-hover:w-[92%] group-hover:opacity-90"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.35) 0%, rgba(4, 120, 87, 0.45) 35%, transparent 75%)',
          }}
        />
        {/* Lớp 2: Bóng khuếch tán ánh sáng xanh ngọc (Ambient Ground Glow) - Tỏa rộng & mờ ảo tự nhiên */}
        <span
          className="absolute -bottom-1 h-3.5 w-[110%] rounded-full blur-[6px] opacity-70 transition-all duration-300 group-hover:w-[120%] group-hover:opacity-90"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.5) 0%, rgba(5, 150, 105, 0.2) 55%, transparent 80%)',
          }}
        />
      </span>
    </span>
  );
}

export default function Header({ site }) {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogoClick = (e) => {
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      e.preventDefault();
      setIsOpen(false);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      if (window.location.hash) {
        window.history.pushState(null, '', '/');
      }
    }
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    const targetId = href.replace('#', '');
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      if (window.history.pushState) {
        window.history.pushState(null, '', href);
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur-md transition-all duration-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-1.5 sm:px-4 sm:py-2">
          {/* Left area: Hamburger button (mobile & tablet) + Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hamburger Button: Opens side navigation from left to right */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-dew-200/80 bg-white text-slate-700 shadow-xs transition hover:bg-dew-50 hover:text-dew-700 active:scale-95 lg:hidden"
              aria-label="Mở menu điều hướng"
              title="Mở menu"
            >
              <Menu size={22} />
            </button>

            {/* Logo Link */}
            <Link
              href="/"
              onClick={handleLogoClick}
              aria-label={site.brandName}
              title="Về đầu trang DewSkill"
              className="group inline-flex items-center transition-transform duration-200 active:scale-95 cursor-pointer"
            >
              <BrandMark name={site.brandName} logoUrl={site.logoUrl} />
            </Link>
          </div>

          {/* Desktop Navigation (Laptop & Large screens: lg:flex) */}
          <nav className="hidden items-center gap-6 text-sm font-bold text-slate-600 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="transition duration-150 hover:text-dew-600"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <a
              href={lmsLink(site.lmsUrl, 'login')}
              className="btn-ghost hidden sm:inline-flex !px-3.5 !py-2 text-xs md:text-sm"
            >
              Đăng nhập
            </a>
            <a
              href={lmsLink(site.lmsUrl, 'start')}
              className="btn-primary !px-3.5 sm:!px-4 !py-2 text-xs md:text-sm font-extrabold"
            >
              <span className="hidden xs:inline">Đăng ký </span>học thử
            </a>
          </div>
        </div>
      </header>

      {/* OFF-CANVAS SIDE DRAWER NAVIGATION (Xuất hiện từ trái sang phải) */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Side Drawer Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 sm:w-80 max-w-[85vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Menu điều hướng di động"
      >
        {/* Drawer Header: Logo + Close Button */}
        <div className="flex items-center justify-between border-b border-dew-100 p-4">
          <Link href="/" onClick={handleLogoClick} className="flex items-center">
            <BrandMark name={site.brandName} logoUrl={site.logoUrl} />
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition active:scale-95"
            aria-label="Đóng menu"
          >
            <X size={19} />
          </button>
        </div>

        {/* Mascot Greeting Badge */}
        <div className="mx-4 mt-3 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-dew-50 to-emerald-50 p-3 border border-dew-200/80">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white p-1 shadow-xs border border-dew-200">
            <img
              src="/brand/favicon.png"
              alt="Linh vật giọt nước"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-dew-900 truncate">Học tin học vui nhộn</p>
            <p className="text-[11px] font-semibold text-dew-700">Tích XP cùng Giọt Nước AI</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
          <p className="px-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Danh mục khám phá
          </p>
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-dew-50 hover:text-dew-700 active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition group-hover:bg-dew-100 group-hover:text-dew-700">
                    <Icon size={16} />
                  </span>
                  <span>{item.label}</span>
                </div>
                <ArrowRight size={14} className="text-slate-300 transition group-hover:text-dew-600 group-hover:translate-x-0.5" />
              </a>
            );
          })}
        </nav>

        {/* Bottom Drawer Actions */}
        <div className="border-t border-dew-100 p-4 space-y-2.5 bg-dew-50/30">
          <a
            href={lmsLink(site.lmsUrl, 'start')}
            onClick={() => setIsOpen(false)}
            className="btn-primary w-full !py-2.5 text-sm text-center justify-center shadow-md"
          >
            Đăng ký học thử 0đ
          </a>
          <a
            href={lmsLink(site.lmsUrl, 'login')}
            onClick={() => setIsOpen(false)}
            className="btn-ghost w-full !py-2.5 text-sm text-center justify-center"
          >
            Đăng nhập tự học DewSkill
          </a>
          <a
            href={lmsLink(site.lmsUrl, 'courseLogin')}
            onClick={() => setIsOpen(false)}
            className="w-full py-1.5 text-xs text-center justify-center text-slate-500 hover:text-dew-700 font-semibold block transition"
          >
            Học viên theo khóa? Đăng nhập LMS →
          </a>

          {/* Hotline & Zalo contact */}
          <div className="pt-2 border-t border-dew-100/80 flex flex-col gap-1 text-center text-xs text-slate-500">
            {site.hotline ? (
              <p className="font-semibold">
                Hotline: <strong className="text-slate-800">{site.hotline}</strong>
              </p>
            ) : null}
            {site.zaloUrl ? (
              <a
                href={site.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-dew-700 hover:underline"
              >
                Chat Zalo hỗ trợ 24/7
              </a>
            ) : null}
          </div>
        </div>
      </aside>
    </>
  );
}
