import { deletePoster, listPosters, savePoster } from '@/lib/store';
import { adminRoute, ok } from '@/lib/api';

export const GET = adminRoute(async () => ok({ data: await listPosters() }));

export const POST = adminRoute(async (request) => {
  const body = await request.json();
  return ok({ data: await savePoster(body) });
});

export const DELETE = adminRoute(async (request) => {
  const id = new URL(request.url).searchParams.get('id');
  await deletePoster(id);
  return ok();
});

