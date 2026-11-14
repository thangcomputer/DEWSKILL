import { checkPassword, endSession, startSession, isTotpRequired, verifyAdminTotp } from '@/lib/auth';
import { fail, ok } from '@/lib/api';

// Chống dò mật khẩu / mã 2FA theo IP
const failedAttempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 10;

function getClientIp(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'local';
}

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (failedAttempts.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  failedAttempts.set(ip, recent);
  return recent.length >= MAX_FAILS;
}

function recordFailure(ip) {
  const now = Date.now();
  const recent = (failedAttempts.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  failedAttempts.set(ip, recent);
}

export async function POST(request) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return fail('Thử đăng nhập sai quá nhiều lần. Vui lòng đợi 15 phút rồi thử lại.', 429);
  }

  const body = await request.json().catch(() => ({}));
  if (!(await checkPassword(body.password))) {
    recordFailure(ip);
    return fail('Sai mật khẩu', 401);
  }

  // Kiểm tra 2FA Google Authenticator
  const need2FA = await isTotpRequired();
  if (need2FA) {
    if (!body.totpCode) {
      return ok({ require2FA: true, message: 'Vui lòng nhập mã Google Authenticator' });
    }
    const validTotp = await verifyAdminTotp(body.totpCode);
    if (!validTotp) {
      recordFailure(ip);
      return fail('Mã xác thực Google Authenticator không đúng hoặc đã hết hạn', 401);
    }
  }

  failedAttempts.delete(ip);
  startSession();
  return ok();
}

export async function DELETE() {
  endSession();
  return ok();
}

