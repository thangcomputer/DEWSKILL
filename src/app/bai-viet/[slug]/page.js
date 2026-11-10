import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, CheckCircle2, Clock, Share2, Sparkles, Tag } from 'lucide-react';
import { getPoster, getSite, listPosters } from '@/lib/store';
import { lmsLink } from '@/lib/lms';
import MarkdownView from '@/components/common/MarkdownView';
import Mascot from '@/components/landing/Mascot';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const poster = await getPoster(resolvedParams?.slug);
  const site = await getSite();

  if (!poster) {
    return { title: 'Không tìm thấy bài viết | DewSkill' };
  }

  const title = `${poster.title} | ${site.brandName || 'DewSkill'}`;
  const description = poster.summary || `Bài viết hướng dẫn chuẩn SEO: ${poster.title}`;
  const image = poster.image || site.logoUrl || '/brand/logo.webp';

  return {
    title,
    description,
    keywords: Array.isArray(poster.keywords) ? poster.keywords.join(', ') : '',
    openGraph: {
      title,
      description,
      images: [{ url: image }],
      type: 'article',
      publishedTime: poster.createdAt,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function ArticlePage({ params }) {
  const resolvedParams = await params;
  const poster = await getPoster(resolvedParams?.slug);
  const site = await getSite();

  if (!poster || !poster.published) {
    notFound();
  }

  const allPosters = await listPosters({ onlyPublished: true });
  const related = allPosters.filter((p) => p.id !== poster.id).slice(0, 3);
  const lmsUrl = site.lmsUrl || 'http://localhost:5173';
  const registerUrl = lmsLink(lmsUrl, 'start');

  // Ước tính thời gian đọc
  const words = ((poster.content || '') + ' ' + (poster.summary || '')).split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(2, Math.ceil(words / 200));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: poster.title,
    description: poster.summary,
    image: poster.image || '/brand/logo.webp',
    datePublished: poster.createdAt,
    dateModified: poster.updatedAt || poster.createdAt,
    author: {
      '@type': 'Organization',
      name: `${site.brandName || 'DewSkill'} - Nền Tảng Tự Học Tin Học`,
    },
    publisher: {
      '@type': 'Organization',
      name: site.brandName || 'DewSkill',
      logo: {
        '@type': 'ImageObject',
        url: site.logoUrl || '/brand/logo.webp',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dew-50/50 via-white to-dew-50/30 text-ink">
      {/* JSON-LD Schema cho Google Bot cào dữ liệu */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header điều hướng */}
      <header className="sticky top-0 z-40 border-b border-dew-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-dew-700">
            <ArrowLeft size={16} /> Quay lại trang chủ
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={site.logoUrl || '/brand/logo.webp'} alt={site.brandName} className="h-8 object-contain" />
            </Link>
            <a
              href={registerUrl}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-dew-600 px-4 py-1.5 text-xs font-black text-white shadow-sm hover:bg-dew-700 transition"
            >
              <Sparkles size={13} /> Học thử miễn phí
            </a>
          </div>
        </div>
      </header>

      {/* Thân bài viết */}
      <main className="mx-auto max-w-4xl px-4 py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-dew-600">Trang chủ</Link>
          <span>/</span>
          <span className="text-dew-700">{poster.category || 'Mẹo học'}</span>
          <span>/</span>
          <span className="truncate max-w-[200px] text-slate-400">{poster.title}</span>
        </nav>

        {/* Tiêu đề & Thông tin Meta */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded-full bg-dew-100 px-3 py-1 text-xs font-extrabold text-dew-800">
              {poster.category}
            </span>
            {poster.seoScore ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                <CheckCircle2 size={12} /> Chuẩn SEO Top Google ({poster.seoScore}/100)
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
              <Calendar size={13} /> {new Date(poster.createdAt).toLocaleDateString('vi-VN')}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
              <Clock size={13} /> {readTime} phút đọc
            </span>
          </div>

          <h1 className="text-2xl font-black leading-tight text-ink sm:text-3xl md:text-4xl">
            {poster.title}
          </h1>

          {poster.summary ? (
            <p className="rounded-2xl border-l-4 border-dew-500 bg-dew-50/70 p-4 text-base font-semibold leading-relaxed text-dew-950 sm:text-lg">
              {poster.summary}
            </p>
          ) : null}
        </div>

        {/* Ảnh bài viết nếu có */}
        {poster.image ? (
          <div className="my-8 overflow-hidden rounded-2xl border border-dew-100 bg-dew-50 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={poster.image} alt={poster.title} className="w-full max-h-[480px] object-cover" />
          </div>
        ) : null}

        {/* Nội dung chi tiết chuẩn SEO */}
        <article className="mt-8 rounded-drop bg-white p-6 sm:p-10 shadow-sm border border-dew-100/80">
          {poster.content ? (
            <MarkdownView content={poster.content} />
          ) : (
            <p className="text-slate-600 leading-relaxed font-medium">{poster.summary}</p>
          )}

          {/* Tags từ khóa SEO */}
          {Array.isArray(poster.keywords) && poster.keywords.length > 0 ? (
            <div className="mt-10 pt-6 border-t border-dew-100">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Tag size={14} /> Từ khóa tìm kiếm liên quan (SEO LSI):
              </div>
              <div className="flex flex-wrap gap-2">
                {poster.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-dew-50 px-3 py-1 text-xs font-semibold text-dew-700 border border-dew-200"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </article>

        {/* Box kêu gọi hành động (Call To Action chuyển đổi SEO) */}
        <section className="my-10 overflow-hidden rounded-drop bg-gradient-to-r from-dew-700 via-dew-600 to-cyan-600 p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-dew-100">
                <Sparkles size={12} /> Tự học thực hành 1-kèm-1 cùng AI
              </span>
              <h3 className="text-xl font-black sm:text-2xl">
                Luyện tin học mỗi ngày, nâng trình vượt bậc!
              </h3>
              <p className="text-sm font-medium text-dew-100 max-w-xl">
                Chỉ 5-10 phút mỗi ngày với phương pháp chia nhỏ bài học (Micro-learning) và AI chấm điểm tức thì 1 giây. Học thử 100% miễn phí ngay hôm nay!
              </p>
            </div>
            <a
              href={registerUrl}
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-black text-slate-900 shadow-lg hover:bg-amber-300 hover:scale-105 transition"
            >
              Học thử miễn phí ngay ➔
            </a>
          </div>
        </section>

        {/* Bài viết liên quan */}
        {related.length > 0 ? (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-black text-ink">Bài viết & mẹo học khác</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/bai-viet/${item.slug || item.id}`}
                  className="glass group flex flex-col overflow-hidden rounded-2xl p-4 transition hover:-translate-y-1 hover:border-dew-300"
                >
                  <span className="mb-2 text-[11px] font-bold text-dew-700">{item.category}</span>
                  <h4 className="line-clamp-2 text-sm font-black text-ink group-hover:text-dew-600">
                    {item.title}
                  </h4>
                  {item.summary ? (
                    <p className="mt-2 line-clamp-2 text-xs font-medium text-slate-500">{item.summary}</p>
                  ) : null}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
