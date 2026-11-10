# DewSkill Landing Page

Trang quảng bá **tự học tin học** (luyện tập hằng ngày, XP, chuỗi ngày, video có câu hỏi, chấm điểm tức thì).
Đây là **project độc lập**, chạy tên miền riêng, không dùng chung mã nguồn hay database với LMS.
Các nút Đăng nhập / Đăng ký chỉ chuyển người dùng sang LMS.

## Chạy thử

```bash
cd landingpage-dewskill
npm install
cp .env.example .env.local   # rồi sửa mật khẩu admin
npm run dev                  # http://localhost:3100
```

- Trang chủ: `/`
- Quản trị: `/admin` (mật khẩu lấy từ `ADMIN_PASSWORD` trong `.env.local`)

Production: `npm run build` rồi `npm start`.

## Cấu trúc

```
src/
  app/
    page.js                 Trang chủ (ghép các khối)
    admin/page.js           Trang quản trị (đăng nhập hoặc bảng điều khiển)
    api/
      leads/                Khách gửi form tư vấn (công khai, có chống spam)
      uploads/[name]/       Phục vụ ảnh poster đã tải lên
      admin/                session, site, posters, leads, upload (cần đăng nhập)
  components/
    landing/                Header, Hero, Features, Journey, Posters, LeadForm, Footer, Mascot
    admin/                  AdminPanel + các tab Poster, Khách, Cấu hình
  lib/
    store.js                Đọc/ghi dữ liệu (file JSON). Đổi sang DB chỉ cần sửa file này
    auth.js                 Đăng nhập admin (cookie ký HMAC)
    lms.js                  Đường dẫn sang LMS (đổi route LMS chỉ sửa ở đây)
    api.js                  Tiện ích cho route
data/
  site.json                 Cấu hình chung (link LMS, hotline, tiêu đề...)
  posters.json              Poster & bài viết
  leads.json                Khách tư vấn (tự sinh, không đưa lên git)
  uploads/                  Ảnh tải lên (tự sinh, không đưa lên git)
public/mascot/              Ảnh động giọt nước lấy từ LMS
```

## Việc thường làm

| Việc | Làm ở đâu |
| --- | --- |
| Đổi địa chỉ LMS | Admin > Cấu hình > Địa chỉ LMS |
| Thêm poster / bài viết | Admin > Poster & bài viết |
| Xem / xuất khách tư vấn | Admin > Khách tư vấn |
| Đổi route đăng nhập, đăng ký của LMS | `src/lib/lms.js` |
| Đổi màu thương hiệu | `tailwind.config.js` (nhóm `dew`) |

## Lưu ý khi triển khai

- Bắt buộc đặt `ADMIN_PASSWORD` và `ADMIN_SECRET` riêng trên server.
- Thư mục `data/` cần quyền ghi và nên được sao lưu định kỳ.
- Chạy 1 tiến trình duy nhất (dữ liệu lưu file JSON). Nếu cần chạy nhiều bản, chuyển `store.js` sang database.

