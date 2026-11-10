import crypto from 'crypto';

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/** Tạo chuỗi secret Base32 ngẫu nhiên cho Google Authenticator */
export function generateTotpSecret(length = 20) {
  const bytes = crypto.randomBytes(length);
  let base32 = '';
  for (let i = 0; i < bytes.length; i++) {
    base32 += BASE32_CHARS[bytes[i] % 32];
  }
  return base32;
}

/** Giải mã Base32 sang Buffer */
export function base32Decode(base32) {
  const cleaned = String(base32 || '').toUpperCase().replace(/=+$/, '').replace(/\s+/g, '');
  let bits = 0;
  let value = 0;
  const bytes = [];

  for (let i = 0; i < cleaned.length; i++) {
    const idx = BASE32_CHARS.indexOf(cleaned[i]);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

/** Tính toán mã OTP 6 chữ số theo RFC 6238 (chuẩn Google Authenticator) */
export function generateTotpToken(secret, timeStepOffset = 0, timeStepSeconds = 30) {
  const key = base32Decode(secret);
  const epoch = Math.floor(Date.now() / 1000);
  const counter = Math.floor(epoch / timeStepSeconds) + timeStepOffset;

  const buf = Buffer.alloc(8);
  buf.writeBigInt64BE(BigInt(counter), 0);

  const hmac = crypto.createHmac('sha1', key).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  return (code % 1000000).toString().padStart(6, '0');
}

/** Xác thực mã OTP 6 số (cho phép lệch ±1 time step ~ 30 giây tránh lệch đồng hồ) */
export function verifyTotpToken(secret, token, window = 1) {
  if (!secret || !token) return false;
  const cleanToken = String(token).trim().replace(/\s+/g, '');
  if (cleanToken.length !== 6 || !/^\d{6}$/.test(cleanToken)) return false;

  for (let i = -window; i <= window; i++) {
    if (generateTotpToken(secret, i) === cleanToken) {
      return true;
    }
  }
  return false;
}

/** Tạo URI định dạng otpauth chuẩn để quét QR code */
export function getTotpUri(secret, accountName = 'admin', issuer = 'DewSkill') {
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&digits=6&period=30`;
}
