'use client';

import { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';

const SESSION_KEY = 'dewskill_promo_popup_seen';

export default function PromoPopup({ popup, lmsUrl }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const delayTimerRef = useRef(null);
  const autoCloseIntervalRef = useRef(null);

  const isEnabled = Boolean(popup && popup.enabled);
  const hasContent = Boolean(popup && (popup.imageUrl || popup.title || popup.subtitle));

  // 1. Khởi động kiểm tra và tính toán thời gian hiển thị
  useEffect(() => {
    if (!isEnabled || !hasContent) {
      setIsOpen(false);
      return;
    }

    // Kiểm tra cấu hình chỉ hiển thị 1 lần khi truy cập (Session)
    if (popup.showOncePerSession !== false) {
      try {
        if (sessionStorage.getItem(SESSION_KEY)) {
          return; // Đã xem trong phiên này rồi
        }
      } catch {
        // bỏ qua lỗi nếu trình duyệt chặn sessionStorage
      }
    }

    const delaySec = Math.max(0, Number(popup.delaySeconds) || 0);
    const autoCloseSec = Math.max(0, Number(popup.autoCloseSeconds) || 0);

    setTotalTime(autoCloseSec);
    setTimeLeft(autoCloseSec);

    // Đặt lịch xuất hiện
    delayTimerRef.current = setTimeout(() => {
      setIsOpen(true);
      // Đánh dấu đã xem trong phiên này
      if (popup.showOncePerSession !== false) {
        try {
          sessionStorage.setItem(SESSION_KEY, '1');
        } catch {}
      }
    }, delaySec * 1000);

    return () => {
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
    };
  }, [isEnabled, hasContent, popup?.delaySeconds, popup?.autoCloseSeconds, popup?.showOncePerSession]);

  // 2. Tự động đóng sau bao lâu (Auto-close)
  useEffect(() => {
    if (!isOpen || totalTime <= 0) return;

    autoCloseIntervalRef.current = setInterval(() => {
      if (isPaused) return; // Tạm dừng đếm khi rê chuột vào popup

      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(autoCloseIntervalRef.current);
          setIsOpen(false);
          return 0;
        }
        return Math.max(0, prev - 0.1);
      });
    }, 100);

    return () => {
      if (autoCloseIntervalRef.current) clearInterval(autoCloseIntervalRef.current);
    };
  }, [isOpen, totalTime, isPaused]);

  // 3. Đóng bằng phím ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  function handleClose() {
    setIsOpen(false);
    if (autoCloseIntervalRef.current) clearInterval(autoCloseIntervalRef.current);
    if (popup?.showOncePerSession !== false) {
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {}
    }
  }

  // Điều hướng khi bấm link
  function handleLinkClick(e, rawUrl) {
    if (!rawUrl) return;

    let targetUrl = rawUrl.trim();
    if (targetUrl === '/#tu-van' || targetUrl === '#tu-van') {
      e.preventDefault();
      const el = document.getElementById('tu-van');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      handleClose();
      return;
    }

    if (popup.openNewTab) {
      // Mở tab mới bình thường
      handleClose();
    } else if (targetUrl.startsWith('/') || targetUrl.startsWith('#')) {
      // Điều hướng nội bộ
      handleClose();
    }
  }

  if (!isOpen || !isEnabled || !hasContent) {
    return null;
  }

  const bannerLink = popup.linkUrl ? popup.linkUrl.trim() : '';
  const buttonLink = (popup.buttonLink || bannerLink || '/#tu-van').trim();
  const showButton = popup.buttonEnabled !== false && Boolean(popup.buttonText);
  const targetAttr = popup.openNewTab ? '_blank' : '_self';
  const progressPercent = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Thông báo ưu đãi"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/65 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl shadow-slate-950/40 border border-emerald-100 overflow-hidden transition-all duration-300 transform scale-100 animate-scaleUp"
      >
        {/* Nút đóng X nổi bật */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Đóng popup"
          className="absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/70 text-white backdrop-blur-md transition hover:bg-slate-900 hover:scale-110 active:scale-95 shadow-md"
        >
          <X size={18} />
        </button>

        {/* Thanh đếm ngược tự đóng (nếu có cấu hình tự biến mất) */}
        {totalTime > 0 && (
          <div className="absolute top-0 left-0 right-0 z-20 h-1.5 bg-slate-200/60 overflow-hidden">
            <div
              className={`h-full transition-all duration-100 ease-linear ${
                isPaused ? 'bg-amber-400' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Vùng cuộn nội dung nếu màn hình nhỏ */}
        <div className="overflow-y-auto max-h-[88vh] p-0 flex flex-col">
          {/* Banner Hình ảnh */}
          {popup.imageUrl ? (
            <div className="relative group overflow-hidden bg-slate-100">
              {bannerLink ? (
                <a
                  href={bannerLink}
                  target={targetAttr}
                  rel="noopener noreferrer"
                  onClick={(e) => handleLinkClick(e, bannerLink)}
                  className="block relative overflow-hidden"
                  title="Nhấn để xem chi tiết"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={popup.imageUrl}
                    alt={popup.title || 'Banner quảng cáo'}
                    className="w-full h-auto max-h-[55vh] object-contain sm:object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none flex items-end justify-end p-2 opacity-0 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-sm backdrop-blur-xs">
                      Xem chi tiết <ExternalLink size={12} />
                    </span>
                  </div>
                </a>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={popup.imageUrl}
                  alt={popup.title || 'Banner quảng cáo'}
                  className="w-full h-auto max-h-[55vh] object-contain sm:object-cover"
                />
              )}
            </div>
          ) : null}

          {/* Nội dung Tiêu đề & Nút bấm (nếu có) */}
          {(popup.title || popup.subtitle || showButton) && (
            <div className="p-5 sm:p-6 flex flex-col gap-3 text-center bg-white">
              {popup.title && (
                <div className="flex items-center justify-center gap-1.5">
                  <Sparkles size={18} className="text-amber-500 shrink-0" />
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    {popup.title}
                  </h3>
                </div>
              )}

              {popup.subtitle && (
                <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-md mx-auto">
                  {popup.subtitle}
                </p>
              )}

              {/* Nút Đăng ký ngay / Kêu gọi hành động */}
              {showButton && (
                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href={buttonLink}
                    target={targetAttr}
                    rel="noopener noreferrer"
                    onClick={(e) => handleLinkClick(e, buttonLink)}
                    className="btn-primary !w-full !py-3.5 !text-base shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 group"
                  >
                    <span>{popup.buttonText || 'Đăng ký ngay'}</span>
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </a>

                  {totalTime > 0 && (
                    <p className="text-[11px] font-bold text-slate-400">
                      {isPaused ? (
                        <span className="text-amber-600">Đã tạm dừng đếm ngược khi rê chuột</span>
                      ) : (
                        <span>Tự động đóng sau {Math.ceil(timeLeft)} giây</span>
                      )}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

