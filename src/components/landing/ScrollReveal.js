'use client';

import { useEffect } from 'react';

/**
 * ScrollReveal: Tự động kích hoạt hiệu ứng Fly In khi lăn xuống và Fly Out khi lăn ra khỏi màn hình.
 * - Lăn xuống vào tầm nhìn: Thêm class .is-visible (Fly In)
 * - Lăn ra ngoài tầm nhìn: Gỡ class .is-visible (Fly Out)
 */
export default function ScrollReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Tôn trọng cài đặt giảm chuyển động của người dùng
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document
        .querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade')
        .forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Lăn vào tầm nhìn -> FLY IN
            entry.target.classList.add('is-visible');
          } else {
            // Lăn ra khỏi tầm nhìn -> FLY OUT
            entry.target.classList.remove('is-visible');
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const observeAll = () => {
      const elements = document.querySelectorAll(
        '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade'
      );
      elements.forEach((el) => observer.observe(el));
    };

    // Chờ 50ms để DOM ổn định rồi bắt đầu quan sát
    const timer = setTimeout(() => {
      observeAll();
    }, 50);

    // Tự động quan sát các phần tử mới nếu có cập nhật động
    const mutationObserver = new MutationObserver(() => {
      observeAll();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}

