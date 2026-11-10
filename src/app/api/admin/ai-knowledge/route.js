import { getAiKnowledge, saveAiKnowledge } from '@/lib/aiConsultant';
import { adminRoute, ok } from '@/lib/api';

export const GET = adminRoute(async () => {
  const data = await getAiKnowledge();
  return ok({ data });
});

export const PUT = adminRoute(async (request) => {
  const body = await request.json();
  const updated = await saveAiKnowledge(body);
  return ok({ data: updated });
});

