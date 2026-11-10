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
  footerNote: '',
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
    if (typeof patch[key] === 'string') {
      const val = patch[key].trim();
      next[key] = val;
      if (SECURITY_KEYS.includes(key)) {
        nextSecurity[key] = val;
      }
    } else if (typeof patch[key] === 'boolean' && SECURITY_KEYS.includes(key)) {
      next[key] = patch[key];
      nextSecurity[key] = patch[key];
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

