/** Đăng nhập admin: mật khẩu trong .env, cookie ký HMAC (không cần database). */
import crypto from 'crypto';
import { cookies } from 'next/headers';

import { getSite } from './store';
import { verifyTotpToken } from './totp';

const COOKIE = 'dew_admin';
const MAX_AGE_SEC = 60 * 60 * 12;

function secret() {
  return process.env.ADMIN_SECRET || 'dev-only-secret-change-me';
}

function sign(value) {
  return crypto.createHmac('sha256', secret()).update(value).digest('hex');
}

function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

export async function checkPassword(input) {
  const site = await getSite().catch(() => ({}));
  const expected = site.adminPassword || process.env.ADMIN_PASSWORD || 'admin123';
  return safeEqual(input || '', expected);
}

export async function isTotpRequired() {
  const site = await getSite().catch(() => ({}));
  return Boolean(site.adminTotpEnabled && site.adminTotpSecret);
}

export async function verifyAdminTotp(code) {
  const site = await getSite().catch(() => ({}));
  if (!site.adminTotpEnabled || !site.adminTotpSecret) return true;
  return verifyTotpToken(site.adminTotpSecret, code);
}

export function startSession() {
  const expires = String(Date.now() + MAX_AGE_SEC * 1000);
  cookies().set(COOKIE, `${expires}.${sign(expires)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SEC,
  });
}

export function endSession() {
  cookies().delete(COOKIE);
}

export function isAdmin() {
  const raw = cookies().get(COOKIE)?.value || '';
  const [expires, signature] = raw.split('.');
  if (!expires || !signature) return false;
  if (!safeEqual(signature, sign(expires))) return false;
  return Number(expires) > Date.now();
}

