/** Giọt nước linh vật - dùng chung các ảnh động từ LMS (public/mascot). */
const LABELS = {
  'cam-xuc-hoc-bai': 'Giọt nước sẵn sàng học',
  'doc-sach': 'Giọt nước đang đọc sách',
  'cam-xuc-vui': 'Giọt nước vui mừng',
  'om-trai-tim-vui': 'Giọt nước ăn mừng',
  'tot-nghiep-vui-ve': 'Giọt nước tốt nghiệp',
  'hoan-thanh-checklish': 'Giọt nước hoàn thành',
  'y-tuong': 'Giọt nước có ý tưởng',
  'quyet-tam': 'Giọt nước quyết tâm',
  'nang-dong': 'Giọt nước năng động',
  'cam-xuc-suy-nghi': 'Giọt nước đang suy nghĩ',
};

export default function Mascot({ name = 'cam-xuc-hoc-bai', size = 160, className = '' }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/mascot/${name}.gif`}
      alt={LABELS[name] || 'Linh vật giọt nước DewSkill'}
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  );
}

