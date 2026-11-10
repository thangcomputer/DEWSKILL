import { NextResponse } from 'next/server';
import { isAdmin } from './auth';

export const ok = (data = {}) => NextResponse.json({ success: true, ...data });

export const fail = (message, status = 400) =>
  NextResponse.json({ success: false, message }, { status });

/** Bọc route admin: chưa đăng nhập trả 401, lỗi bất ngờ trả 500 gọn gàng. */
export function adminRoute(handler) {
  return async (request, context) => {
    if (!isAdmin()) return fail('Chưa đăng nhập', 401);
    try {
      return await handler(request, context);
    } catch (error) {
      return fail(error?.message || 'Có lỗi xảy ra', 400);
    }
  };
}

