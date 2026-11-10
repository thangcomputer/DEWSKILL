'use client';

import { useState } from 'react';
import { ArrowRight, Bot, CheckCircle2, ChevronRight, Map, PlayCircle, Sparkles, Zap } from 'lucide-react';
import Mascot from './Mascot';
import { lmsLink } from '@/lib/lms';

const TABS = [
  {
    id: 'path',
    icon: Map,
    badge: 'Chặng học thông minh',
    title: 'Học theo từng chặng',
    shortTitle: 'Lộ trình từng chặng',
    desc: 'Lộ trình chia nhỏ khoa học. Mỗi chặng là một bước tiến vững chắc: học lý thuyết, xem video và hoàn thành bài tập kiểm tra để mở khóa chặng tiếp theo.',
    points: [
      'Bản đồ trạm học tuần tự: Học chắc bài trước mới mở bài sau',
      'Có trạm thử thách vượt chặng nếu bạn đã có nền tảng',
      'Linh vật giọt nước chúc mừng và ghi dấu mỗi khi bạn về đích',
    ],
    image: '/screenshots/lo-trinh-chang.png',
    alt: 'Giao diện lộ trình từng chặng trên hệ thống',
  },
  {
    id: 'video',
    icon: PlayCircle,
    badge: 'Học bài tương tác',
    title: 'Video ngắn có câu hỏi dừng bài',
    shortTitle: 'Video theo bài',
    desc: 'Không còn những video dài hàng tiếng gây buồn ngủ. Mỗi bài giảng là video ngắn 3 - 5 phút súc tích, thực hành trực quan và tự động dừng ở mốc quan trọng để bạn trả lời.',
    points: [
      'Lý thuyết chắt lọc cô đọng, đi thẳng vào thao tác thực tế',
      'Câu hỏi tương tác dừng ngay trong video: Trả lời đúng mới xem tiếp',
      'Không tua qua phần chưa học, đảm bảo nắm chắc từng kiến thức',
    ],
    image: '/screenshots/video-bai-giang.png',
    alt: 'Giao diện video bài giảng có câu hỏi dừng bài',
  },
  {
    id: 'ai',
    icon: Bot,
    badge: 'Công nghệ thông minh',
    title: 'AI chấm điểm & Gợi ý tức thì',
    shortTitle: 'AI chấm điểm & Gợi ý',
    desc: 'Làm bài xong có kết quả ngay lập tức chỉ sau 1 giây. AI phân tích đáp án, khen ngợi khi bạn làm đúng và đưa ra gợi ý tư duy logic khi gặp câu hỏi hóc búa.',
    points: [
      'Chấm điểm tự động tức thì cho đủ các dạng bài tập thực hành',
      'Tích lũy XP sau mỗi câu đúng để tăng cấp và đua bảng xếp hạng',
      'Nút gợi ý thông minh giúp bạn tự tư duy mà không lộ ngay đáp án',
    ],
    image: '/screenshots/ai-cham-diem.png',
    alt: 'Giao diện câu hỏi luyện tập và AI chấm điểm tức thì',
  },
];

export default function Showcase({ site, lmsUrl }) {
  const [activeTab, setActiveTab] = useState('path');

  const tabs = TABS.map((tab) => {
    if (tab.id === 'path') return { ...tab, image: site?.showcasePathImage || tab.image };
    if (tab.id === 'video') return { ...tab, image: site?.showcaseVideoImage || tab.image };
    if (tab.id === 'ai') return { ...tab, image: site?.showcaseAiImage || tab.image };
    return tab;
  });

  const current = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <section id="trai-nghiem" className="relative scroll-mt-20 overflow-hidden py-20">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 h-96 w-full max-w-5xl rounded-full bg-dew-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="reveal mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-dew-200 bg-white px-3.5 py-1 text-xs font-black uppercase tracking-wider text-dew-700 shadow-sm">
            <Sparkles size={14} className="text-amber-500" /> Trải nghiệm học thực tế trên nền tảng
          </span>
          <h2 className="section-title mt-4">
            Học tin học như chơi game, tiến bộ thấy rõ từng ngày
          </h2>
          <p className="mt-3 text-base font-medium text-slate-600 sm:text-lg">
            Ảnh chụp thực tế từ hệ sinh thái học tập: Chặng học rõ ràng, bài giảng video ngắn và AI chấm điểm tức thì.
          </p>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="reveal delay-100 mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-extrabold transition-all active:scale-95 ${
                  active
                    ? 'bg-dew-600 text-white shadow-lg shadow-dew-600/30 ring-2 ring-dew-400'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-dew-300 hover:bg-dew-50/60'
                }`}
              >
                <Icon size={18} className={active ? 'text-white' : 'text-dew-600'} />
                <span>{tab.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Showcase Content Card */}
        <div className="reveal-scale delay-200 glass mt-10 grid items-center gap-10 overflow-hidden rounded-[2.5rem] p-6 shadow-2xl shadow-dew-950/5 sm:p-10 lg:grid-cols-[1.1fr_1.3fr]">
          {/* Left Text Column */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-dew-100 px-3 py-1 text-xs font-extrabold text-dew-800">
              <current.icon size={14} /> {current.badge}
            </span>
            <h3 className="mt-4 text-2xl font-black text-ink sm:text-3xl">
              {current.title}
            </h3>
            <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
              {current.desc}
            </p>

            <ul className="mt-6 space-y-3">
              {current.points.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm font-bold text-slate-700">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-dew-500" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={lmsLink(lmsUrl, 'start')} className="btn-primary !px-5 !py-2.5 text-xs sm:text-sm">
                Trải nghiệm miễn phí ngay <ArrowRight size={15} />
              </a>
              <span className="text-xs font-bold text-slate-400">
                ⚡ Nhận ngay +15 XP khi hoàn thành bài đầu tiên
              </span>
            </div>
          </div>

          {/* Right Image Mockup Column */}
          <div className="relative">
            {/* Decorative Browser Window Frame */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-2xl ring-1 ring-black/5">
              {/* Browser Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-2.5 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="font-mono text-[11px] font-semibold text-slate-400">
                  dewskill.com · lms.practice
                </span>
                <div className="w-10" />
              </div>

              {/* Screenshot Image with Smooth Aspect */}
              <div className="relative aspect-[4/3] bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current.image}
                  alt={current.alt}
                  className="h-full w-full object-cover object-top transition-all duration-300"
                />
              </div>
            </div>

            {/* Floating mascot badge */}
            <div className="glass absolute -bottom-5 -right-3 hidden items-center gap-2 rounded-2xl p-2.5 shadow-lg sm:flex">
              <Mascot name="cam-xuc-vui" size={44} />
              <div>
                <p className="text-[11px] font-black text-dew-700">✓ Chấm điểm tức thì</p>
                <p className="text-[10px] font-semibold text-slate-500">Giọt nước đồng hành cùng bạn</p>
              </div>
            </div>
          </div>
        </div>

        {/* Free Portal Call-To-Action Banner (Phần học miễn phí đăng ký ngay) */}
        <div className="relative mt-16 overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-emerald-950 via-dew-900 to-dew-700 p-6 sm:p-10 lg:p-12 text-white shadow-2xl shadow-dew-950/30">
          {/* Subtle water ripple circle */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-dew-400/20 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-emerald-200 backdrop-blur">
                <Zap size={14} className="text-amber-300" /> Bắt đầu không rủi ro
              </span>
              <h3 className="mt-4 text-2xl font-black leading-tight sm:text-3xl lg:text-4xl text-white">
                Học thử miễn phí ngay hôm nay!
              </h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-dew-100 sm:text-base">
                Tạo tài khoản nhanh chóng chỉ với số điện thoại để vào luyện tập các chặng mở đầu, xem video lý thuyết và tích lũy XP. Hoàn toàn không mất phí ban đầu.
              </p>

              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold text-dew-100">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-300 shrink-0" /> Miễn phí 100% tài khoản học thử
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-300 shrink-0" /> Tự do luyện tập câu hỏi mỗi ngày
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-300 shrink-0" /> Tích XP và duy trì ngọn lửa Streak
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={lmsLink(lmsUrl, 'start')}
                  className="btn-drop bg-white px-6 py-3 sm:px-7 sm:py-3.5 text-sm sm:text-base font-black text-dew-800 shadow-xl hover:bg-dew-50 active:scale-95"
                >
                  Đăng ký học miễn phí ngay <ArrowRight size={18} />
                </a>
                <a
                  href={lmsLink(lmsUrl, 'login')}
                  className="btn-drop border border-white/40 bg-white/10 px-5 py-3 text-xs sm:text-sm font-extrabold text-white backdrop-blur hover:bg-white/20"
                >
                  Đã có tài khoản? Đăng nhập
                </a>
              </div>
            </div>

            {/* Mascot Celebration visual */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="relative">
                <div className="flex h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                  <Mascot name="quyet-tam" size={180} className="animate-floaty" />
                </div>
                <span className="glass absolute left-0 top-3 sm:-left-2 sm:top-4 rounded-full bg-amber-400 px-3 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs font-black text-amber-950 shadow-md">
                  ⚡ 0đ học thử
                </span>
                <span className="glass absolute right-0 bottom-3 sm:-right-2 sm:bottom-4 rounded-full bg-white px-3 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs font-black text-dew-800 shadow-md">
                  🔥 Giữ chuỗi ngay
                </span>
              </div>
              <p className="mt-3 text-xs font-extrabold text-emerald-200">
                Hơn 1.000+ học viên đã tham gia tự học mỗi ngày
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
