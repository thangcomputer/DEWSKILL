import { Bot, Map, PlayCircle, Zap } from 'lucide-react';

const FEATURES = [
  {
    icon: Map,
    title: 'Lộ trình từng chặng',
    text: 'Bài học chia nhỏ theo chặng. Xong bước này mới mở bước tiếp theo, học chắc từng phần. Đã biết rồi thì làm bài kiểm tra để vượt chặng.',
    tone: 'bg-dew-50 text-dew-600',
  },
  {
    icon: Zap,
    title: 'XP, cấp độ và chuỗi ngày',
    text: 'Mỗi lượt luyện cộng XP, giữ chuỗi ngày học để lên cấp, nhận huy hiệu và có tên trên bảng xếp hạng tuần, tháng.',
    tone: 'bg-amber-50 text-amber-600',
  },
  {
    icon: PlayCircle,
    title: 'Video ngắn có câu hỏi trong bài',
    text: 'Video dừng đúng chỗ quan trọng để bạn trả lời nhanh. Làm sai được gợi ý, không phải xem lại cả bài.',
    tone: 'bg-sky-50 text-sky-600',
  },
  {
    icon: Bot,
    title: 'Chấm điểm và gợi ý tức thì',
    text: 'Trắc nghiệm, điền khuyết, sắp xếp thao tác, nối cột, đúng sai. Có kết quả ngay, có gợi ý mà không lộ đáp án.',
    tone: 'bg-violet-50 text-violet-600',
  },
];

export default function Features() {
  return (
    <section id="tinh-nang" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
      <div className="reveal mx-auto max-w-2xl text-center">
        <h2 className="section-title">Tự học mà vẫn có động lực</h2>
        <p className="mt-3 font-medium text-slate-600">
          Mỗi ngày 10 đến 15 phút là đủ để tiến bộ đều đặn.
        </p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {FEATURES.map(({ icon: Icon, title, text, tone }, idx) => (
          <article
            key={title}
            className={`reveal-scale delay-${(idx % 2 + 1) * 150} glass rounded-drop p-6 transition hover:-translate-y-1`}
          >
            <span className={`flex h-12 w-12 items-center justify-center rounded-drop ${tone}`}>
              <Icon size={24} />
            </span>
            <h3 className="mt-4 text-lg font-black text-ink">{title}</h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

