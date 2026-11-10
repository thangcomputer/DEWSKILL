/**
 * Dữ liệu mặc định cho các phần trên Landing Page.
 * File thuần JavaScript/JSON, dùng chung an toàn cho cả Server và Client component.
 */

export const DEFAULT_FEATURES_DATA = [
  {
    id: 'feature-1',
    slug: 'lo-trinh-hoc-tin-hoc-theo-tung-chang',
    category: 'Lộ trình bài bản',
    title: 'Lộ trình từng chặng',
    text: 'Bài học chia nhỏ theo chặng. Xong bước này mới mở bước tiếp theo, học chắc từng phần. Đã biết rồi thì làm bài kiểm tra để vượt chặng.',
    points: [
      'Chia nhỏ bài học từ căn bản đến chuyên sâu',
      'Mở khóa từng chặng, học đến đâu chắc đến đó',
      'Linh hoạt làm bài kiểm tra vượt chặng nhanh chóng',
    ],
    meta: 'Chuẩn sư phạm thực chiến',
    iconUrl: '',
  },
  {
    id: 'feature-2',
    slug: 'tich-luy-xp-cap-do-va-chuoi-ngay-hoc-tap',
    category: 'Gamification & Động lực',
    title: 'XP, cấp độ và chuỗi ngày',
    text: 'Mỗi lượt luyện cộng XP, giữ chuỗi ngày học để lên cấp, nhận huy hiệu và có tên trên bảng xếp hạng tuần, tháng.',
    points: [
      'Cộng điểm XP và thăng hạng liên tục sau mỗi câu đúng',
      'Duy trì chuỗi ngày (Streak) rèn tính kỷ luật tự học',
      'Mở khóa huy hiệu và tranh tài trên bảng vàng thành tích',
    ],
    meta: 'Học hào hứng như chơi game',
    iconUrl: '',
  },
  {
    id: 'feature-3',
    slug: 'video-ngan-co-cau-hoi-trong-bai-giang',
    category: 'Tương tác Micro-Learning',
    title: 'Video ngắn có câu hỏi trong bài',
    text: 'Video dừng đúng chỗ quan trọng để bạn trả lời nhanh. Làm sai được gợi ý, không phải xem lại cả bài.',
    points: [
      'Bài giảng 3 - 5 phút súc tích, vào thẳng trọng tâm thao tác',
      'Tự động dừng câu hỏi tương tác: trả lời đúng mới đi tiếp',
      'Hướng dẫn sửa sai tại chỗ, không phải xem lại cả video',
    ],
    meta: 'Tập trung cao độ, tiếp thu tức thì',
    iconUrl: '',
  },
  {
    id: 'feature-4',
    slug: 'cham-diem-va-goi-y-tuc-thi-cong-nghe-ai',
    category: 'AI Trợ giảng 24/7',
    title: 'Chấm điểm và gợi ý tức thì',
    text: 'Trắc nghiệm, điền khuyết, sắp xếp thao tác, nối cột, đúng sai. Có kết quả ngay, có gợi ý mà không lộ đáp án.',
    points: [
      'Trả kết quả và điểm số chi tiết ngay sau 1 giây',
      'Đa dạng 5 dạng bài thực hành chuẩn thi chứng chỉ tin học',
      'Gợi ý tư duy sư phạm giúp hiểu bản chất, không lộ đáp án',
    ],
    meta: 'Phản hồi tức thì, nhớ bài tại chỗ',
    iconUrl: '',
  },
];

export const DEFAULT_JOURNEY_DATA = [
  {
    n: 1,
    title: 'Tạo tài khoản',
    text: 'Đăng ký trên hệ thống học, vào học ngay không cần chờ duyệt.',
    mascot: 'cam-xuc-hoc-bai',
    image: '',
  },
  {
    n: 2,
    title: 'Học theo chặng',
    text: 'Đọc lý thuyết ngắn, xem video, trả lời câu hỏi kiểm tra nhanh.',
    mascot: 'doc-sach',
    image: '',
  },
  {
    n: 3,
    title: 'Luyện tập mỗi ngày',
    text: 'Làm bài luyện, nhận XP, giữ chuỗi ngày và leo bảng xếp hạng.',
    mascot: 'nang-dong',
    image: '',
  },
  {
    n: 4,
    title: 'Vượt chặng',
    text: 'Hoàn thành chặng để mở chặng mới, nhận huy hiệu ghi dấu tiến bộ.',
    mascot: 'tot-nghiep-vui-ve',
    image: '',
  },
];

export const DEFAULT_SHOWCASE_DATA = [
  {
    id: 'path',
    shortTitle: 'Lộ trình từng chặng',
    badge: 'Chặng học thông minh',
    title: 'Học theo từng chặng',
    desc: 'Lộ trình chia nhỏ khoa học. Mỗi chặng là một bước tiến vững chắc: học lý thuyết, xem video và hoàn thành bài tập kiểm tra để mở khóa chặng tiếp theo.',
    points: [
      'Bản đồ trạm học tuần tự: Học chắc bài trước mới mở bài sau',
      'Có trạm thử thách vượt chặng nếu bạn đã có nền tảng',
      'Linh vật giọt nước chúc mừng và ghi dấu mỗi khi bạn về đích',
    ],
    image: '/screenshots/lo-trinh-chang.png',
  },
  {
    id: 'video',
    shortTitle: 'Video theo bài',
    badge: 'Học bài tương tác',
    title: 'Video ngắn có câu hỏi dừng bài',
    desc: 'Không còn những video dài hàng tiếng gây buồn ngủ. Mỗi bài giảng là video ngắn 3 - 5 phút súc tích, thực hành trực quan và tự động dừng ở mốc quan trọng để bạn trả lời.',
    points: [
      'Lý thuyết chắt lọc cô đọng, đi thẳng vào thao tác thực tế',
      'Câu hỏi tương tác dừng ngay trong video: Trả lời đúng mới xem tiếp',
      'Không tua qua phần chưa học, đảm bảo nắm chắc từng kiến thức',
    ],
    image: '/screenshots/video-bai-giang.png',
  },
  {
    id: 'ai',
    shortTitle: 'AI chấm điểm & Gợi ý',
    badge: 'Công nghệ thông minh',
    title: 'AI chấm điểm & Gợi ý tức thì',
    desc: 'Làm bài xong có kết quả ngay lập tức chỉ sau 1 giây. AI phân tích đáp án, khen ngợi khi bạn làm đúng và đưa ra gợi ý tư duy logic khi gặp câu hỏi hóc búa.',
    points: [
      'Chấm điểm tự động tức thì cho đủ các dạng bài tập thực hành',
      'Tích lũy XP sau mỗi câu đúng để tăng cấp và đua bảng xếp hạng',
      'Nút gợi ý thông minh giúp bạn tự tư duy mà không lộ ngay đáp án',
    ],
    image: '/screenshots/ai-cham-diem.png',
  },
];

export const DEFAULT_POPUP_DATA = {
  enabled: false,
  title: 'Ưu đãi học thử miễn phí hôm nay!',
  subtitle: 'Đăng ký tài khoản ngay để nhận trọn bộ bài giảng tương tác và luyện tập cùng AI chấm điểm tức thì.',
  imageUrl: '',
  linkUrl: '',
  buttonEnabled: true,
  buttonText: 'Đăng ký ngay',
  buttonLink: '/#tu-van',
  openNewTab: false,
  delaySeconds: 2,
  autoCloseSeconds: 0,
  showOncePerSession: true,
};


