import { Pin } from 'lucide-react';
import Mascot from './Mascot';

function PosterCard({ poster, lmsUrl }) {
  const href = poster.link || '';
  const body = (
    <article className="glass group flex h-full flex-col overflow-hidden rounded-drop transition hover:-translate-y-1">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-dew-100 to-cyan-100">
        {poster.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster.image} alt={poster.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Mascot name="cam-xuc-vui" size={120} />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black text-dew-700">
          {poster.category}
        </span>
        {poster.pinned ? (
          <span className="absolute right-3 top-3 rounded-full bg-amber-400 p-1.5 text-white">
            <Pin size={12} />
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-black text-ink group-hover:text-dew-600">{poster.title}</h3>
        {poster.summary ? (
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">{poster.summary}</p>
        ) : null}
      </div>
    </article>
  );
  if (!href) return body;
  const target = href.startsWith('/') ? `${String(lmsUrl).replace(/\/+$/, '')}${href}` : href;
  return (
    <a href={target} target="_blank" rel="noopener noreferrer" className="block">
      {body}
    </a>
  );
}

export default function Posters({ posters, lmsUrl }) {
  if (!posters.length) return null;
  return (
    <section id="poster" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
      <div className="reveal mx-auto max-w-2xl text-center">
        <h2 className="section-title">Poster và tin mới</h2>
        <p className="mt-3 font-medium text-slate-600">Ưu đãi, mẹo học và thông báo mới nhất.</p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posters.map((poster, idx) => (
          <div key={poster.id} className={`reveal-scale delay-${(idx % 3 + 1) * 100}`}>
            <PosterCard poster={poster} lmsUrl={lmsUrl} />
          </div>
        ))}
      </div>
    </section>
  );
}

