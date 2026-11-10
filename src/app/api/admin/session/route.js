import { checkPassword, endSession, startSession, isTotpRequired, verifyAdminTotp } from '@/lib/auth';
import { fail, ok } from '@/lib/api';

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  if (!(await checkPassword(body.password))) return fail('Sai mật khẩu', 401);

  // Kiểm tra 2FA Google Authenticator
  const need2FA = await isTotpRequired();
  if (need2FA) {
    if (!body.totpCode) {
      return ok({ require2FA: true, message: 'Vui lòng nhập mã Google Authenticator' });
    }
    const validTotp = await verifyAdminTotp(body.totpCode);
    if (!validTotp) {
      return fail('Mã xác thực Google Authenticator không đúng hoặc đã hết hạn', 401);
    }
  }

  startSession();
  return ok();
}

export async function DELETE() {
  endSession();
  return ok();
}

