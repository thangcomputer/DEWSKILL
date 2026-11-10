import { adminRoute, fail, ok } from '@/lib/api';
import { generateSeoArticle } from '@/lib/aiSeoWriter';

export const POST = adminRoute(async (request) => {
  try {
    const body = await request.json();
    const { topic, category, targetAudience, tone, customNotes } = body || {};

    if (!topic || !String(topic).trim()) {
      return fail('Vui lòng nhập chủ đề hoặc từ khóa bài viết');
    }

    const article = await generateSeoArticle({
      topic,
      category,
      targetAudience,
      tone,
      customNotes,
    });

    return ok({ data: article });
  } catch (err) {
    console.error('[POST /api/admin/ai-seo]', err);
    return fail(err.message || 'Lỗi xử lý tạo bài viết chuẩn SEO');
  }
});
