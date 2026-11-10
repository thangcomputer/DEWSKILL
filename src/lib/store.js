/**
 * Lưu trữ dữ liệu bằng file JSON trong thư mục data/.
 * Muốn đổi sang database sau này chỉ cần thay file này, phần còn lại không phải sửa.
 */
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
export const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');

async function readJson(file, fallback) {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function writeJson(file, data) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), 'utf8');
}

export const newId = (prefix) => `${prefix}-${crypto.randomBytes(5).toString('hex')}`;

import { DEFAULT_FEATURES_DATA, DEFAULT_JOURNEY_DATA, DEFAULT_SHOWCASE_DATA } from './landingDefaults';
export { DEFAULT_FEATURES_DATA, DEFAULT_JOURNEY_DATA, DEFAULT_SHOWCASE_DATA };

/* ---------- Cấu hình chung ---------- */
const SITE_DEFAULTS = {
  lmsUrl: process.env.NEXT_PUBLIC_DEFAULT_LMS_URL || 'http://localhost:5173',
  brandName: 'DewSkill',
  logoUrl: '/brand/logo.webp',
  faviconUrl: '/brand/favicon.png',
  copyright: '© 2026 DewSkill. Bản quyền thuộc về DewSkill.',
  hotline: '',
  zaloUrl: '',
  facebookUrl: '',
  youtubeUrl: '',
  tiktokUrl: '',
  appStoreUrl: '',
  googlePlayUrl: '',
  heroTitle: 'Học tin học như chơi game cùng DewSkill',
  heroSubtitle: '',
  heroBadge: 'Tự học tin học có lộ trình',
  heroCtaPrimary: 'Vào luyện tập ngay',
  heroCtaSecondary: 'Xem giao diện thực tế',
  heroMascotImage: '',
  footerNote: '',
  // Section 1: Trải nghiệm (#trai-nghiem)
  showcaseTitle: 'Học tin học như chơi game, tiến bộ thấy rõ từng ngày',
  showcaseSubtitle: 'Ảnh chụp thực tế từ hệ sinh thái học tập: Chặng học rõ ràng, bài giảng video ngắn và AI chấm điểm tức thì.',
  showcaseTabs: DEFAULT_SHOWCASE_DATA,
  showcasePathImage: '/screenshots/lo-trinh-chang.png',
  showcaseVideoImage: '/screenshots/video-bai-giang.png',
  showcaseAiImage: '/screenshots/ai-cham-diem.png',
  ctaBadge: '⚡ Bắt đầu không rủi ro',
  ctaTitle: 'Học thử miễn phí ngay hôm nay!',
  ctaSubtitle: 'Tạo tài khoản nhanh chóng chỉ với số điện thoại để vào luyện tập các chặng mở đầu, xem video lý thuyết và tích lũy XP. Hoàn toàn không mất phí ban đầu.',
  ctaMascotImage: '',
  ctaPoints: [
    'Miễn phí 100% tài khoản học thử',
    'Tự do luyện tập câu hỏi mỗi ngày',
    'Tích XP và duy trì ngọn lửa Streak',
  ],
  ctaPrimaryText: 'Đăng ký học miễn phí ngay',
  ctaSecondaryText: 'Đã có tài khoản? Đăng nhập',

  // Section 2: Tính năng (#tinh-nang)
  featuresBadge: 'Phương pháp giáo dục tương tác 4.0',
  featuresTitle: 'Tự học mà vẫn có động lực',
  featuresSubtitle: 'Mỗi ngày 10 đến 15 phút là đủ để tiến bộ đều đặn với phương pháp sư phạm số thông minh.',
  featuresCards: DEFAULT_FEATURES_DATA,

  // Section 3: Lộ trình (#lo-trinh)
  journeyTitle: 'Hành trình của bạn cùng giọt nước',
  journeySubtitle: 'Lộ trình 4 bước đơn giản từ người mới bắt đầu đến thành thạo tin học văn phòng.',
  journeySteps: DEFAULT_JOURNEY_DATA,

  // Section 4: Poster & Tin (#poster)
  postersTitle: 'Poster và tin mới',
  postersSubtitle: 'Ưu đãi, mẹo học và thông báo mới nhất.',

  // Section 5: Nhận tư vấn (#tu-van)
  leadTitle: 'Cần bạn đồng hành?',
  leadSubtitle: 'Để lại số điện thoại, chúng tôi sẽ hướng dẫn bạn tạo tài khoản và bắt đầu lộ trình tự học.',
  leadImage: '',
  leadButtonText: 'Gửi thông tin tư vấn',
  adminPassword: '',
  googleClientId: '',
  googleClientSecret: '',
  facebookAppId: '',
  facebookAppSecret: '',
  adminTotpSecret: '',
  adminTotpEnabled: false,
  updatedAt: 0,
};

async function syncFaviconFiles(faviconUrl) {
  if (!faviconUrl) return;
  try {
    let sourcePath = null;
    if (faviconUrl.startsWith('/api/uploads/')) {
      const filename = path.basename(faviconUrl.split('?')[0]);
      sourcePath = path.join(UPLOAD_DIR, filename);
    } else if (faviconUrl.startsWith('/')) {
      sourcePath = path.join(process.cwd(), 'public', faviconUrl.slice(1).split('?')[0]);
    }

    if (sourcePath) {
      const data = await fs.readFile(sourcePath);
      const targets = [
        path.join(process.cwd(), 'public', 'favicon.ico'),
        path.join(process.cwd(), 'public', 'favicon.png'),
        path.join(process.cwd(), 'public', 'favicon.webp'),
        path.join(process.cwd(), 'public', 'brand', 'favicon.png'),
        path.join(process.cwd(), 'public', 'brand', 'favicon.webp'),
        path.join(process.cwd(), '..', 'client', 'public', 'favicon.ico'),
        path.join(process.cwd(), '..', 'client', 'public', 'favicon.png'),
        path.join(process.cwd(), '..', 'client', 'public', 'favicon.webp'),
        path.join(process.cwd(), '..', 'client', 'public', 'brand', 'favicon.png'),
        path.join(process.cwd(), '..', 'client', 'public', 'brand', 'favicon.webp'),
      ];
      for (const target of targets) {
        try {
          await fs.mkdir(path.dirname(target), { recursive: true });
          await fs.writeFile(target, data);
        } catch {
          // ignore individual target errors
        }
      }
    }
  } catch {
    // ignore
  }
}

const SECURITY_KEYS = [
  'adminPassword',
  'googleClientId',
  'googleClientSecret',
  'facebookAppId',
  'facebookAppSecret',
  'adminTotpSecret',
  'adminTotpEnabled',
];

export async function getSite() {
  const siteData = await readJson('site.json', {});
  const securityData = await readJson('admin-security.json', {});
  return { ...SITE_DEFAULTS, ...siteData, ...securityData };
}

export async function saveSite(patch) {
  const current = await getSite();
  const next = { ...current };
  const nextSecurity = await readJson('admin-security.json', {});

  for (const key of Object.keys(SITE_DEFAULTS)) {
    if (patch[key] === undefined) continue;

    if (typeof patch[key] === 'string') {
      const val = patch[key].trim();
      next[key] = val;
      if (SECURITY_KEYS.includes(key)) {
        nextSecurity[key] = val;
      }
    } else if (typeof patch[key] === 'boolean') {
      next[key] = patch[key];
      if (SECURITY_KEYS.includes(key)) {
        nextSecurity[key] = patch[key];
      }
    } else if (Array.isArray(patch[key])) {
      next[key] = patch[key];
    } else if (typeof patch[key] === 'object' && patch[key] !== null) {
      next[key] = patch[key];
    }
  }

  next.updatedAt = Date.now();

  // Lưu file admin-security.json (được .gitignore bảo vệ, không bao giờ bị push lên git)
  await writeJson('admin-security.json', nextSecurity);

  // Tạo bản sao public cho site.json (xóa các thông tin bí mật để GitHub Push không bao giờ bị chặn)
  const cleanSite = { ...next };
  for (const sKey of SECURITY_KEYS) {
    if (typeof cleanSite[sKey] === 'boolean') {
      cleanSite[sKey] = false;
    } else {
      cleanSite[sKey] = '';
    }
  }

  await writeJson('site.json', cleanSite);
  if (next.faviconUrl) {
    await syncFaviconFiles(next.faviconUrl);
  }
  return next;
}

/* ---------- Poster / bài viết ---------- */
function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

export async function listPosters({ onlyPublished = false } = {}) {
  const all = await readJson('posters.json', []);
  const rows = onlyPublished ? all.filter((p) => p.published) : all;
  return rows.sort(
    (a, b) => Number(b.pinned) - Number(a.pinned) || String(b.createdAt).localeCompare(String(a.createdAt)),
  );
}

export async function getPoster(idOrSlug) {
  const all = await readJson('posters.json', []);
  return all.find((p) => p.id === idOrSlug || (p.slug && p.slug === idOrSlug)) || null;
}

export async function savePoster(input) {
  const all = await readJson('posters.json', []);
  const targetSlug = slugify(input.slug || input.title || 'bai-viet');
  const clean = {
    title: String(input.title || '').trim().slice(0, 200),
    summary: String(input.summary || '').trim().slice(0, 500),
    category: String(input.category || 'Thông báo').trim().slice(0, 50),
    image: String(input.image || '').trim(),
    link: String(input.link || '').trim(),
    slug: targetSlug,
    content: String(input.content || '').trim(),
    keywords: Array.isArray(input.keywords)
      ? input.keywords.map((k) => String(k).trim()).filter(Boolean)
      : String(input.keywords || '')
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean),
    seoScore: typeof input.seoScore === 'number' ? input.seoScore : (input.seoScore ? parseInt(input.seoScore, 10) : null),
    seoChecklist: Array.isArray(input.seoChecklist) ? input.seoChecklist : [],
    pinned: Boolean(input.pinned),
    published: input.published !== false,
  };
  if (!clean.title) throw new Error('Cần nhập tiêu đề');
  const index = input.id ? all.findIndex((p) => p.id === input.id) : -1;
  if (index >= 0) {
    all[index] = { ...all[index], ...clean, updatedAt: new Date().toISOString() };
  } else {
    all.push({ id: newId('poster'), createdAt: new Date().toISOString(), ...clean });
  }
  await writeJson('posters.json', all);
  return index >= 0 ? all[index] : all[all.length - 1];
}

export async function deletePoster(id) {
  const all = await readJson('posters.json', []);
  await writeJson('posters.json', all.filter((p) => p.id !== id));
}

/* ---------- Khách để lại thông tin tư vấn ---------- */
export const LEAD_STATUSES = ['new', 'contacted', 'done'];

export async function listLeads() {
  const all = await readJson('leads.json', []);
  return all.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

export async function addLead({ name, phone, need }) {
  const cleanName = String(name || '').trim().slice(0, 80);
  const cleanPhone = String(phone || '').replace(/[^\d+]/g, '').slice(0, 15);
  if (cleanName.length < 2) throw new Error('Vui lòng nhập họ tên');
  if (!/^(\+?84|0)\d{8,10}$/.test(cleanPhone)) throw new Error('Số điện thoại chưa đúng');
  const all = await readJson('leads.json', []);
  const lead = {
    id: newId('lead'),
    name: cleanName,
    phone: cleanPhone,
    need: String(need || '').trim().slice(0, 120),
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  all.push(lead);
  await writeJson('leads.json', all);
  return lead;
}

export async function updateLeadStatus(id, status) {
  if (!LEAD_STATUSES.includes(status)) throw new Error('Trạng thái không hợp lệ');
  const all = await readJson('leads.json', []);
  const lead = all.find((l) => l.id === id);
  if (!lead) throw new Error('Không tìm thấy');
  lead.status = status;
  await writeJson('leads.json', all);
}

export async function deleteLead(id) {
  const all = await readJson('leads.json', []);
  await writeJson('leads.json', all.filter((l) => l.id !== id));
}

