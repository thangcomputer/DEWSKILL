import { deleteLead, listLeads, updateLeadStatus } from '@/lib/store';
import { adminRoute, ok } from '@/lib/api';

export const GET = adminRoute(async () => ok({ data: await listLeads() }));

export const PATCH = adminRoute(async (request) => {
  const { id, status } = await request.json();
  await updateLeadStatus(id, status);
  return ok();
});

export const DELETE = adminRoute(async (request) => {
  const id = new URL(request.url).searchParams.get('id');
  await deleteLead(id);
  return ok();
});

