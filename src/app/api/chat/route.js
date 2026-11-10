import { askAiConsultant } from '@/lib/aiConsultant';
import { fail, ok } from '@/lib/api';

export async function POST(request) {
  try {
    const body = await request.json();
    const message = String(body.message || '').trim();
    const history = Array.isArray(body.history) ? body.history : [];

    if (!message) return fail('Vui lòng nhập tin nhắn', 400);

    const reply = await askAiConsultant(message, history);
    return ok({ data: reply });
  } catch (error) {
    return fail(error?.message || 'Lỗi xử lý tư vấn', 500);
  }
}

