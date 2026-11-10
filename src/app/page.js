import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Showcase from '@/components/landing/Showcase';
import Journey from '@/components/landing/Journey';
import Posters from '@/components/landing/Posters';
import LeadForm from '@/components/landing/LeadForm';
import Footer from '@/components/landing/Footer';
import AiChatWidget from '@/components/landing/AiChatWidget';
import PromoPopup from '@/components/landing/PromoPopup';
import ScrollReveal from '@/components/landing/ScrollReveal';
import { getSite, listPosters } from '@/lib/store';

// Nội dung do admin cấu hình nên luôn lấy dữ liệu mới.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [site, posters] = await Promise.all([getSite(), listPosters({ onlyPublished: true })]);
  return (
    <>
      <ScrollReveal />
      <PromoPopup popup={site.popup} lmsUrl={site.lmsUrl} />
      <Header site={site} />
      <main>
        <Hero site={site} />
        <Showcase site={site} lmsUrl={site.lmsUrl} />
        <Features site={site} />
        <Journey site={site} />
        <Posters site={site} posters={posters} lmsUrl={site.lmsUrl} />
        <LeadForm site={site} hotline={site.hotline} />
      </main>
      <Footer site={site} />
      <AiChatWidget lmsUrl={site.lmsUrl} />
    </>
  );
}

