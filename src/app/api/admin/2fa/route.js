import { adminRoute, ok, fail } from '@/lib/api';
import { getSite, saveSite } from '@/lib/store';
import { generateTotpSecret, getTotpUri, verifyTotpToken } from '@/lib/totp';

export const GET = adminRoute(async (request) => {
  const site = await getSite();
  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  if (action === 'setup') {
    const secret = generateTotpSecret();
    const uri = getTotpUri(secret, 'admin', site.brandName || 'DewSkill');
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(uri)}`;
    return ok({
      data: {
        secret,
        uri,
        qrCodeUrl,
        enabled: Boolean(site.adminTotpEnabled),
      },
    });
  }

  return ok({
    data: {
      enabled: Boolean(site.adminTotpEnabled),
    },
  });
});

export const POST = adminRoute(async (request) => {
  const body = await request.json().catch(() => ({}));
  const site = await getSite();
  const { action, secret, code } = body;

  if (action === 'disable') {
    if (!site.adminTotpEnabled) {
      return ok({ message: '2FA hiện đang tắt' });
    }
    // Xác thực mã trước khi tắt để đảm bảo chính chủ
    const valid = verifyTotpToken(site.adminTotpSecret, code);
    if (!valid) {
      return fail('Mã xác thực Google Authenticator không đúng, không thể tắt 2FA', 400);
    }
    await saveSite({ adminTotpEnabled: false });
    return ok({ message: 'Đã tắt Google Authenticator thành công' });
  }

  // Mặc định: Kích hoạt 2FA
  if (!secret || !code) {
    return fail('Thiếu mã bí mật hoặc mã OTP xác thực', 400);
  }

  const valid = verifyTotpToken(secret, code);
  if (!valid) {
    return fail('Mã OTP không đúng hoặc đã hết hạn. Hãy kiểm tra lại ứng dụng Google Authenticator.', 400);
  }

  await saveSite({
    adminTotpSecret: secret,
    adminTotpEnabled: true,
  });

  return ok({
    message: 'Đã kích hoạt Google Authenticator thành công! Từ lần đăng nhập sau, bạn sẽ cần nhập mã này.',
  });
});
