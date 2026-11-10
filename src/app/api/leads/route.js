import { addLead } from '@/lib/store';
import { fail, ok } from '@/lib/api';

// Chống spam đơn giản theo IP (bộ nhớ tiến trình).
const hits = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_HITS;
}

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (limited(ip)) return fail('Bạn gửi hơi nhanh, vui lòng thử lại sau ít phút.', 429);
  try {
    const body = await request.json();
    if (body.website) return ok(); // ô ẩn chống bot
    await addLead(body);
    return ok();
  } catch (error) {
    return fail(error?.message || 'Không gửi được, vui lòng thử lại.');
  }
}

