/**
 * Đường dẫn sang LMS. Chỉ cần đổi lmsUrl trong admin, mọi nút trên landing tự cập nhật.
 * Nếu LMS đổi route, sửa duy nhất ở file này.
 */
export const LMS_PATHS = {
  // Cổng tự học miễn phí DewSkill (chuyển sang Hình 2 với tab Đăng nhập)
  login: '/DANGNHAPMIENPHI?mode=login',
  // Cổng tự học miễn phí DewSkill (mặc định tab Đăng ký học thử 0đ)
  start: '/DANGNHAPMIENPHI',
  // Dành riêng cho học viên đăng ký theo khóa chính thức (LMS cũ)
  courseLogin: '/login',
};

export function lmsLink(lmsUrl, key) {
  const base = String(lmsUrl || '').replace(/\/+$/, '');
  return `${base}${LMS_PATHS[key] || ''}`;
}

