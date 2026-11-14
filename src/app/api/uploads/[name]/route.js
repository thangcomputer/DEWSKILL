import { promises as fs } from 'fs';
import path from 'path';
import { UPLOAD_DIR } from '@/lib/store';

const MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogv': 'video/ogg',
  '.mov': 'video/quicktime',
};

/** Phục vụ ảnh poster đã tải lên (lưu ngoài public để chạy production vẫn thấy ảnh mới). */
export async function GET(_request, { params }) {
  const name = path.basename(params.name || '');
  const type = MIME[path.extname(name).toLowerCase()];
  if (!type) return new Response('Not found', { status: 404 });
  try {
    const buffer = await fs.readFile(path.join(UPLOAD_DIR, name));
    const headers = {
      'Content-Type': type,
      'Cache-Control': 'public, max-age=86400',
      'X-Content-Type-Options': 'nosniff',
    };
    if (type === 'image/svg+xml') {
      headers['Content-Security-Policy'] = "sandbox; default-src 'none'; style-src 'unsafe-inline'";
    }
    return new Response(buffer, { headers });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}

