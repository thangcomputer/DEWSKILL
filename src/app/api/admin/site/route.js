import { getSite, saveSite } from '@/lib/store';
import { adminRoute, ok, fail } from '@/lib/api';
import fs from 'fs';
import path from 'path';

function updateRootEnv(key, val) {
  try {
    const envPath = path.join(process.cwd(), '..', '.env');
    if (!fs.existsSync(envPath)) return;
    let content = fs.readFileSync(envPath, 'utf8');
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(content)) {
      content = content.replace(regex, `${key}=${val}`);
    } else {
      content += `\n${key}=${val}`;
    }
    fs.writeFileSync(envPath, content, 'utf8');
  } catch {
    // ignore
  }
}

function sanitizeSiteForAdmin(site) {
  return {
    ...site,
    hasAdminPassword: Boolean(site.adminPassword),
    adminPassword: '',
    adminTotpSecret: '',
    hasGoogleAuth: Boolean(site.googleClientId && site.googleClientSecret),
    googleClientSecret: '',
    hasFacebookAuth: Boolean(site.facebookAppId && site.facebookAppSecret),
    facebookAppSecret: '',
  };
}

export const GET = adminRoute(async () => {
  const site = await getSite();
  return ok({ data: sanitizeSiteForAdmin(site) });
});

export const PUT = adminRoute(async (request) => {
  const body = await request.json();
  const current = await getSite();

  // Không cho ghi đè trạng thái 2FA qua endpoint cấu hình chung (phải qua /api/admin/2fa)
  delete body.adminTotpSecret;
  delete body.adminTotpEnabled;

  if (typeof body.adminPassword === 'string') {
    const trimmed = body.adminPassword.trim();
    if (trimmed.length > 0 && trimmed.length < 6) {
      return fail('Mật khẩu quản trị mới phải có ít nhất 6 ký tự', 400);
    }
    if (trimmed.length >= 6) {
      body.adminPassword = trimmed;
    } else {
      body.adminPassword = current.adminPassword || '';
    }
  } else {
    body.adminPassword = current.adminPassword || '';
  }

  // Giữ nguyên secret OAuth cũ nếu form gửi chuỗi rỗng (đã ẩn ở GET)
  if (typeof body.googleClientSecret === 'string' && !body.googleClientSecret.trim()) {
    body.googleClientSecret = current.googleClientSecret || '';
  }
  if (typeof body.facebookAppSecret === 'string' && !body.facebookAppSecret.trim()) {
    body.facebookAppSecret = current.facebookAppSecret || '';
  }

  if (typeof body.googleClientId === 'string' && body.googleClientId.trim()) {
    updateRootEnv('GOOGLE_CLIENT_ID', body.googleClientId.trim());
    process.env.GOOGLE_CLIENT_ID = body.googleClientId.trim();
  }
  if (typeof body.googleClientSecret === 'string' && body.googleClientSecret.trim()) {
    updateRootEnv('GOOGLE_CLIENT_SECRET', body.googleClientSecret.trim());
    process.env.GOOGLE_CLIENT_SECRET = body.googleClientSecret.trim();
  }

  const saved = await saveSite(body);
  return ok({ data: sanitizeSiteForAdmin(saved) });
});

