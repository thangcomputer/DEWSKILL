import { getSite, saveSite } from '@/lib/store';
import { adminRoute, ok } from '@/lib/api';

export const GET = adminRoute(async () => ok({ data: await getSite() }));

export const PUT = adminRoute(async (request) => {
  const body = await request.json();
  return ok({ data: await saveSite(body) });
});

