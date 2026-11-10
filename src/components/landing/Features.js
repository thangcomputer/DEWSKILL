import Link from 'next/link';
import {
  Bot,
  BrainCircuit,
  CheckCircle2,
  Compass,
  Flame,
  GraduationCap,
  Milestone,
  PlayCircle,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react';

const FEATURES = [
  {
    slug: 'lo-trinh-hoc-tin-hoc-theo-tung-chang',
    icon: Milestone,
    category: 'Lộ trình bài bản',
    categoryIcon: Compass,
    title: 'Lộ trình từng chặng',
    text: 'Bài học chia nhỏ theo chặng. Xong bước này mới mở bước tiếp theo, học chắc từng phần. Đã biết rồi thì làm bài kiểm tra để vượt chặng.',
    points: [
      'Chia nhỏ bài học từ căn bản đến chuyên sâu',
      'Mở khóa từng chặng, học đến đâu chắc đến đó',
      'Linh hoạt làm bài kiểm tra vượt chặng nhanh chóng',
    ],
    accent: {
      gradient: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/25',
      ring: 'ring-emerald-100',
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      topBar: 'from-emerald-400 via-teal-500 to-emerald-600',
      glow: 'bg-emerald-400/15',
      checkBg: 'bg-emerald-500',
      tagText: 'text-emerald-700',
    },
    meta: 'Chuẩn sư phạm thực chiến',
  },
  {
    slug: 'tich-luy-xp-cap-do-va-chuoi-ngay-hoc-tap',
    icon: Zap,
    category: 'Gamification & Động lực',
    categoryIcon: Trophy,
    title: 'XP, cấp độ và chuỗi ngày',
    text: 'Mỗi lượt luyện cộng XP, giữ chuỗi ngày học để lên cấp, nhận huy hiệu và có tên trên bảng xếp hạng tuần, tháng.',
    points: [
      'Cộng điểm XP và thăng hạng liên tục sau mỗi câu đúng',
      'Duy trì chuỗi ngày (Streak) rèn tính kỷ luật tự học',
      'Mở khóa huy hiệu và tranh tài trên bảng vàng thành tích',
    ],
    accent: {
      gradient: 'from-amber-500 via-orange-500 to-rose-500',
      shadow: 'shadow-orange-500/25',
      ring: 'ring-amber-100',
      badge: 'bg-amber-50 text-amber-900 border-amber-200/80',
      topBar: 'from-amber-400 via-orange-500 to-rose-500',
      glow: 'bg-orange-400/15',
      checkBg: 'bg-orange-500',
      tagText: 'text-amber-700',
    },
    meta: 'Học hào hứng như chơi game',
  },
  {
    slug: 'video-ngan-co-cau-hoi-trong-bai-giang',
    icon: PlayCircle,
    category: 'Tương tác Micro-Learning',
    categoryIcon: GraduationCap,
    title: 'Video ngắn có câu hỏi trong bài',
    text: 'Video dừng đúng chỗ quan trọng để bạn trả lời nhanh. Làm sai được gợi ý, không phải xem lại cả bài.',
    points: [
      'Bài giảng 3 - 5 phút súc tích, vào thẳng trọng tâm thao tác',
      'Tự động dừng câu hỏi tương tác: trả lời đúng mới đi tiếp',
      'Hướng dẫn sửa sai tại chỗ, không phải xem lại cả video',
    ],
    accent: {
      gradient: 'from-sky-500 to-blue-600',
      shadow: 'shadow-blue-500/25',
      ring: 'ring-sky-100',
      badge: 'bg-sky-50 text-sky-900 border-sky-200/80',
      topBar: 'from-sky-400 via-blue-500 to-indigo-500',
      glow: 'bg-sky-400/15',
      checkBg: 'bg-sky-500',
      tagText: 'text-sky-700',
    },
    meta: 'Tập trung cao độ, tiếp thu tức thì',
  },
  {
    slug: 'cham-diem-va-goi-y-tuc-thi-cong-nghe-ai',
    icon: Bot,
    category: 'AI Trợ giảng 24/7',
    categoryIcon: Sparkles,
    title: 'Chấm điểm và gợi ý tức thì',
    text: 'Trắc nghiệm, điền khuyết, sắp xếp thao tác, nối cột, đúng sai. Có kết quả ngay, có gợi ý mà không lộ đáp án.',
    points: [
      'Trả kết quả và điểm số chi tiết ngay sau 1 giây',
      'Đa dạng 5 dạng bài thực hành chuẩn thi chứng chỉ tin học',
      'Gợi ý tư duy sư phạm giúp hiểu bản chất, không lộ đáp án',
    ],
    accent: {
      gradient: 'from-violet-500 via-purple-600 to-indigo-600',
      shadow: 'shadow-purple-500/25',
      ring: 'ring-purple-100',
      badge: 'bg-purple-50 text-purple-900 border-purple-200/80',
      topBar: 'from-violet-400 via-purple-500 to-indigo-600',
      glow: 'bg-purple-400/15',
      checkBg: 'bg-purple-500',
      tagText: 'text-purple-700',
    },
    meta: 'Phản hồi tức thì, nhớ bài tại chỗ',
  },
];

export default function Features({ site }) {
  const cards = (site?.featuresCards && site.featuresCards.length > 0
    ? site.featuresCards
    : FEATURES
  ).map((item, idx) => {
    const base = FEATURES[idx] || FEATURES[0];
    return {
      ...base,
      ...item,
      points: Array.isArray(item.points) && item.points.length > 0 ? item.points : base.points,
      accent: base.accent,
      icon: base.icon,
      categoryIcon: base.categoryIcon,
    };
  });

  return (
    <section id="tinh-nang" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-10 sm:py-14">
      {/* Section Header chuẩn giáo dục */}
      <div className="reveal mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-dew-200/80 bg-dew-100/70 px-4 py-1.5 text-xs sm:text-sm font-bold text-dew-800 shadow-xs backdrop-blur-sm">
          <GraduationCap className="h-4 w-4 text-dew-700" />
          <span>{site?.featuresBadge || 'Phương pháp giáo dục tương tác 4.0'}</span>
        </div>
        <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          {site?.featuresTitle || 'Tự học mà vẫn có động lực'}
        </h2>
        <p className="mt-2.5 text-sm sm:text-base font-medium leading-relaxed text-slate-600">
          {site?.featuresSubtitle ||
            'Mỗi ngày 10 đến 15 phút là đủ để tiến bộ đều đặn với phương pháp sư phạm số thông minh.'}
        </p>
      </div>

      {/* Grid 4 Cards phong cách EdTech chuyên nghiệp */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:gap-8">
        {cards.map((item) => {
          const Icon = item.icon;
          const CategoryIcon = item.categoryIcon;
          const { accent } = item;
          const articleUrl = `/bai-viet/${item.slug || 'lo-trinh-hoc-tin-hoc-theo-tung-chang'}`;

          return (
            <article
              key={item.title}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-6 sm:p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/5"
            >
              {/* Thanh màu điểm nhấn đầu card */}
              <div
                className={`absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r ${accent.topBar}`}
                aria-hidden="true"
              />

              {/* Hào quang màu nền mờ khi rê chuột */}
              <div
                className={`pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${accent.glow}`}
                aria-hidden="true"
              />

              {/* Phần trên card: Icon chuyên nghiệp & Badge danh mục */}
              <div>
                <div className="flex items-center justify-between gap-4">
                  {/* Icon nổi khối 3D gradient cao cấp */}
                  <Link
                    href={articleUrl}
                    className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${accent.gradient} text-white shadow-lg ${accent.shadow} ring-4 ${accent.ring} transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1`}
                    title={`Đọc bài viết: ${item.title}`}
                  >
                    {item.iconUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={item.iconUrl} alt={item.title} className="h-8 w-8 sm:h-9 sm:w-9 object-contain" />
                    ) : (
                      <Icon className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2.2} />
                    )}
                  </Link>

                  {/* Badge danh mục sư phạm */}
                  <Link
                    href={articleUrl}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold shadow-xs transition-opacity hover:opacity-80 ${accent.badge}`}
                  >
                    <CategoryIcon className="h-3.5 w-3.5" />
                    <span>{item.category}</span>
                  </Link>
                </div>

                {/* Tiêu đề & Mô tả bài giảng */}
                <h3 className="mt-5 text-xl sm:text-2xl font-black tracking-tight text-slate-900 transition-colors group-hover:text-dew-700">
                  <Link href={articleUrl} className="hover:underline">
                    {item.title}
                  </Link>
                </h3>
                <p className="mt-2.5 text-sm sm:text-[15px] font-normal leading-relaxed text-slate-600">
                  {item.text}
                </p>

                {/* Danh sách 3 tiêu chí phương pháp giáo dục */}
                <div className="my-5 border-t border-slate-100 transition-colors group-hover:border-slate-200/80" />
                <ul className="space-y-2.5">
                  {item.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-slate-700"
                    >
                      <span
                        className={`mt-0.5 flex h-4.5 w-4.5 sm:h-5 sm:w-5 shrink-0 items-center justify-center rounded-full text-white ${accent.checkBg} shadow-xs`}
                      >
                        <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2.5} />
                      </span>
                      <span className="leading-snug text-slate-700">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer card: Huy hiệu đảm bảo chất lượng sư phạm & Link tìm hiểu thêm */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-100/90 pt-3.5 text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className={`h-1.5 w-1.5 rounded-full ${accent.checkBg}`} />
                  {item.meta}
                </span>
                <Link
                  href={articleUrl}
                  className={`inline-flex items-center gap-1 font-bold transition-all duration-300 group-hover:translate-x-1 hover:underline ${accent.tagText}`}
                  title={`Đọc bài viết chi tiết về ${item.title}`}
                >
                  <span>Tìm hiểu thêm</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
