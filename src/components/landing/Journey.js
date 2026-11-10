import Mascot from './Mascot';

const STEPS = [
  { n: 1, title: 'Tạo tài khoản', text: 'Đăng ký trên hệ thống học, vào học ngay không cần chờ duyệt.', mascot: 'cam-xuc-hoc-bai' },
  { n: 2, title: 'Học theo chặng', text: 'Đọc lý thuyết ngắn, xem video, trả lời câu hỏi kiểm tra nhanh.', mascot: 'doc-sach' },
  { n: 3, title: 'Luyện tập mỗi ngày', text: 'Làm bài luyện, nhận XP, giữ chuỗi ngày và leo bảng xếp hạng.', mascot: 'nang-dong' },
  { n: 4, title: 'Vượt chặng', text: 'Hoàn thành chặng để mở chặng mới, nhận huy hiệu ghi dấu tiến bộ.', mascot: 'tot-nghiep-vui-ve' },
];

export default function Journey({ site }) {
  const steps = site?.journeySteps && site.journeySteps.length > 0 ? site.journeySteps : STEPS;

  return (
    <section id="lo-trinh" className="scroll-mt-24 bg-white/60 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="reveal mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            {site?.journeyTitle || `Hành trình của bạn cùng ${site?.brandName || 'DewSkill'}`}
          </h2>
          <p className="mt-2 text-sm sm:text-base font-medium text-slate-600">
            {site?.journeySubtitle ||
              'Lộ trình 4 bước đơn giản từ người mới bắt đầu đến thành thạo tin học văn phòng.'}
          </p>
        </div>
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <li
              key={step.n || idx + 1}
              className={`reveal-scale delay-${(idx + 1) * 100} glass rounded-drop p-5 text-center flex flex-col justify-between`}
            >
              <div>
                <div className="h-28 w-28 mx-auto flex items-center justify-center overflow-hidden">
                  {step.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={step.image}
                      alt={step.title}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Mascot name={step.mascot || 'cam-xuc-hoc-bai'} size={110} className="mx-auto" />
                  )}
                </div>
                <span className="mt-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-dew-500 text-xs font-black text-white">
                  {step.n || idx + 1}
                </span>
                <h3 className="mt-2 font-black text-ink">{step.title}</h3>
                <p className="mt-1 text-sm font-medium text-slate-600">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

