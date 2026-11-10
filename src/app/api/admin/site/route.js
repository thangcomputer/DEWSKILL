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

export const GET = adminRoute(async () => {
  const site = await getSite();
  return ok({
    data: {
      ...site,
      hasAdminPassword: Boolean(site.adminPassword),
      adminPassword: '',
      hasGoogleAuth: Boolean(site.googleClientId && site.googleClientSecret),
    },
  });
});

export const PUT = adminRoute(async (request) => {
  const body = await request.json();
  const current = await getSite();

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

  if (typeof body.googleClientId === 'string' && body.googleClientId.trim()) {
    updateRootEnv('GOOGLE_CLIENT_ID', body.googleClientId.trim());
    process.env.GOOGLE_CLIENT_ID = body.googleClientId.trim();
  }
  if (typeof body.googleClientSecret === 'string' && body.googleClientSecret.trim()) {
    updateRootEnv('GOOGLE_CLIENT_SECRET', body.googleClientSecret.trim());
    process.env.GOOGLE_CLIENT_SECRET = body.googleClientSecret.trim();
  }

  const saved = await saveSite(body);
  return ok({
    data: {
      ...saved,
      hasAdminPassword: Boolean(saved.adminPassword),
      adminPassword: '',
      hasGoogleAuth: Boolean(saved.googleClientId && saved.googleClientSecret),
    },
  });
});

