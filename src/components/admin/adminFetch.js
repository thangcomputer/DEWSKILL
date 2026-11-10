/** Gọi API admin ở phía trình duyệt, tự ném lỗi có thông báo tiếng Việt. */
export async function adminFetch(url, options = {}) {
  const isForm = options.body instanceof FormData;
  const res = await fetch(url, {
    ...options,
    headers: isForm ? options.headers : { 'Content-Type': 'application/json', ...options.headers },
    body: options.body && !isForm && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.success === false) {
    if (res.status === 401) window.location.reload();
    throw new Error(body.message || 'Có lỗi xảy ra');
  }
  return body;
}

