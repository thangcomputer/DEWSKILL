import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { UPLOAD_DIR } from '@/lib/store';
import { adminRoute, fail, ok } from '@/lib/api';

const MAX_BYTES = 50 * 1024 * 1024; // Hỗ trợ tải video hoặc ảnh tối đa 50MB
const TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
  'image/x-icon': '.ico',
  'image/vnd.microsoft.icon': '.ico',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'video/ogg': '.ogv',
  'video/quicktime': '.mov',
};

export const POST = adminRoute(async (request) => {
  const form = await request.formData();
  const file = form.get('file');
  if (!file || typeof file === 'string') return fail('Chưa chọn file hình ảnh hoặc video');
  const ext = TYPES[file.type];
  if (!ext) return fail('Chỉ nhận ảnh (JPG, PNG, WEBP, GIF, SVG) hoặc video (MP4, WEBM, MOV)');
  if (file.size > MAX_BYTES) return fail('Dung lượng file tối đa 50MB');
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
  await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return ok({ url: `/api/uploads/${name}` });
});

