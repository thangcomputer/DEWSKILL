'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pin } from 'lucide-react';
import Mascot from './Mascot';

function PosterCard({ poster, lmsUrl }) {
  const customLink = (poster.link || '').trim();
  const internalArticleUrl = poster.content || poster.slug ? `/bai-viet/${poster.slug || poster.id}` : '';
  const href = customLink || internalArticleUrl;

  const body = (
    <article className="glass group flex h-full flex-col overflow-hidden rounded-3xl border border-dew-100 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-dew-300 bg-white">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-dew-100 via-dew-50 to-emerald-100 flex items-center justify-center">
        {poster.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster.image}
            alt={poster.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Mascot name="cam-xuc-vui" size={110} />
          </div>
        )}
        <span className="absolute left-3.5 top-3.5 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-dew-800 shadow-sm backdrop-blur-xs">
          {poster.category}
        </span>
        {poster.pinned ? (
          <span className="absolute right-3.5 top-3.5 rounded-full bg-amber-400 p-1.5 text-white shadow-sm">
            <Pin size={13} />
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-black text-ink transition-colors group-hover:text-dew-600 line-clamp-2">
          {poster.title}
        </h3>
        {poster.summary ? (
          <p className="mt-2 text-xs font-medium leading-relaxed text-slate-600 line-clamp-2">
            {poster.summary}
          </p>
        ) : null}
      </div>
    </article>
  );

  if (!href) return body;

  const isExternal = href.startsWith('http');
  const isLmsRelative = !isExternal && href.startsWith('/') && !href.startsWith('/bai-viet');
  const target = isLmsRelative ? `${String(lmsUrl).replace(/\/+$/, '')}${href}` : href;

  return (
    <a
      href={target}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="block h-full"
    >
      {body}
    </a>
  );
}

export default function Posters({ posters = [], lmsUrl }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const isPausedRef = useRef(false);
  const touchStartX = useRef(null);

  // Tính số lượng thẻ hiển thị theo kích thước màn hình (Desktop: 3, Tablet: 2, Mobile: 1)
  useEffect(() => {
    function updateItemsPerPage() {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    }
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const totalItems = posters.length;
  const maxIndex = Math.max(0, totalItems - itemsPerPage);
  const totalDots = maxIndex + 1;

  // Tự động trượt mượt mà (Auto-play), dừng lại khi rê chuột vào
  const nextSlide = useCallback(() => {
    if (isPausedRef.current || maxIndex <= 0) return;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    if (maxIndex <= 0) return;
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (maxIndex <= 0) return;
    const interval = setInterval(() => {
      if (!isPausedRef.current) {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [maxIndex]);

  function handleMouseEnter() {
    isPausedRef.current = true;
  }

  function handleMouseLeave() {
    isPausedRef.current = false;
  }

  // Hỗ trợ vuốt chạm trên màn hình cảm ứng / mobile
  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      if (maxIndex > 0) setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    } else if (diff < -50) {
      if (maxIndex > 0) setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    }
    touchStartX.current = null;
  }

  if (!posters || posters.length === 0) return null;

  return (
    <section id="poster" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
      <div className="reveal mx-auto max-w-2xl text-center">
        <h2 className="section-title">Poster và tin mới</h2>
        <p className="mt-3 font-medium text-slate-600">Ưu đãi, mẹo học và thông báo mới nhất.</p>
      </div>

      {/* Khung Slider Carousel */}
      <div
        className="relative mt-10"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onPointerEnter={handleMouseEnter}
        onPointerLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Nút lùi slide (Prev) */}
        {totalDots > 1 ? (
          <button
            type="button"
            aria-label="Bài viết trước"
            onClick={prevSlide}
            className="absolute -left-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-dew-200 bg-white/90 p-2.5 text-dew-800 shadow-md backdrop-blur-xs transition hover:bg-white hover:scale-110 sm:inline-flex"
          >
            <ChevronLeft size={20} />
          </button>
        ) : null}

        {/* Nút tiến slide (Next) */}
        {totalDots > 1 ? (
          <button
            type="button"
            aria-label="Bài viết tiếp theo"
            onClick={nextSlide}
            className="absolute -right-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-dew-200 bg-white/90 p-2.5 text-dew-800 shadow-md backdrop-blur-xs transition hover:bg-white hover:scale-110 sm:inline-flex"
          >
            <ChevronRight size={20} />
          </button>
        ) : null}

        {/* Vùng chứa các thẻ - Trượt ngang */}
        <div className="overflow-hidden py-3">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
            }}
          >
            {posters.map((poster) => (
              <div
                key={poster.id}
                className="shrink-0 px-2.5"
                style={{ width: `${100 / itemsPerPage}%` }}
              >
                <PosterCard poster={poster} lmsUrl={lmsUrl} />
              </div>
            ))}
          </div>
        </div>

        {/* Các chấm điều hướng (Dots) ở dưới */}
        {totalDots > 1 ? (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: totalDots }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Trang ${idx + 1}`}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 transition-all duration-300 ${
                  currentIndex === idx
                    ? 'w-8 rounded-full bg-dew-600 shadow-sm'
                    : 'w-2.5 rounded-full bg-dew-200 hover:bg-dew-400'
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
