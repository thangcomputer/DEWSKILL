import { checkPassword, endSession, startSession } from '@/lib/auth';
import { fail, ok } from '@/lib/api';

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  if (!checkPassword(body.password)) return fail('Sai mật khẩu', 401);
  startSession();
  return ok();
}

export async function DELETE() {
  endSession();
  return ok();
}

