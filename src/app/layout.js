import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import { getSite } from '@/lib/store';

const font = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
  display: 'swap',
});

export async function generateMetadata() {
  const site = await getSite();
  const favicon = site.faviconUrl || '/brand/favicon.png';
  const v = site.updatedAt || '1';
  const faviconWithVersion = `${favicon}?v=${v}`;
  return {
    title: `${site.brandName || 'DewSkill'} | Tự học tin học như chơi game`,
    description:
      site.heroSubtitle ||
      'Tự học tin học với lộ trình từng chặng, luyện tập hằng ngày tích XP, video ngắn có câu hỏi ngay trong bài và chấm điểm tức thì.',
    icons: {
      icon: [
        { url: faviconWithVersion },
        { url: `/favicon.png?v=${v}` },
        { url: `/favicon.ico?v=${v}` },
      ],
      shortcut: faviconWithVersion,
      apple: faviconWithVersion,
    },
  };
}

export default async function RootLayout({ children }) {
  const site = await getSite();
  const favicon = site.faviconUrl || '/brand/favicon.png';
  const v = site.updatedAt || '1';
  const faviconWithVersion = `${favicon}?v=${v}`;

  return (
    <html lang="vi" className={font.variable}>
      <head>
        <link rel="icon" href={faviconWithVersion} />
        <link rel="shortcut icon" href={faviconWithVersion} />
        <link rel="apple-touch-icon" href={faviconWithVersion} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

