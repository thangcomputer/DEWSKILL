import Mascot from './Mascot';

const STEPS = [
  { n: 1, title: 'Tạo tài khoản', text: 'Đăng ký trên hệ thống học, vào học ngay không cần chờ duyệt.', mascot: 'cam-xuc-hoc-bai' },
  { n: 2, title: 'Học theo chặng', text: 'Đọc lý thuyết ngắn, xem video, trả lời câu hỏi kiểm tra nhanh.', mascot: 'doc-sach' },
  { n: 3, title: 'Luyện tập mỗi ngày', text: 'Làm bài luyện, nhận XP, giữ chuỗi ngày và leo bảng xếp hạng.', mascot: 'nang-dong' },
  { n: 4, title: 'Vượt chặng', text: 'Hoàn thành chặng để mở chặng mới, nhận huy hiệu ghi dấu tiến bộ.', mascot: 'tot-nghiep-vui-ve' },
];

export default function Journey() {
  return (
    <section id="lo-trinh" className="scroll-mt-20 bg-white/60 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="reveal mx-auto max-w-2xl text-center">
          <h2 className="section-title">Hành trình của bạn cùng giọt nước</h2>
        </div>
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, idx) => (
            <li
              key={step.n}
              className={`reveal-scale delay-${(idx + 1) * 100} glass rounded-drop p-5 text-center`}
            >
              <Mascot name={step.mascot} size={110} className="mx-auto" />
              <span className="mt-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-dew-500 text-xs font-black text-white">
                {step.n}
              </span>
              <h3 className="mt-2 font-black text-ink">{step.title}</h3>
              <p className="mt-1 text-sm font-medium text-slate-600">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

