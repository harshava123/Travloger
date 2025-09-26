import NextDynamic from 'next/dynamic';
import { fetchCityContent } from '@/app/lib/cityContent'
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import KeralaHero from '@/components/sections/KeralaHero';
import FloatingActionBar from '@/components/ui/FloatingActionBar';
import { ScrollProgress } from '@/components/ui/ScrollIndicators';

// Dynamically import below-the-fold components for better performance
const CompanyLogos = NextDynamic(() => import('@/components/sections/CompanyLogos'), {
  loading: () => <div className="h-32 bg-gray-50 animate-pulse" />
});

const KeralaTripOptions = NextDynamic(() => import('@/components/sections/KeralaTripOptions'), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />
});

const UnfilteredReviews = NextDynamic(() => import('@/components/sections/UnfilteredReviews'), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />
});

const GroupCTA = NextDynamic(() => import('@/components/sections/GroupCTA'), {
  loading: () => <div className="h-96 bg-orange-400 animate-pulse" />
});

const Accommodation = NextDynamic(() => import('@/components/sections/Accommodation'), {
  loading: () => <div className="h-screen bg-gray-50 animate-pulse" />
});

const KeralaTripHighlights = NextDynamic(() => import('@/components/sections/KeralaTripHighlights'), {
  loading: () => <div className="h-96 bg-white animate-pulse" />
});

const USP = NextDynamic(() => import('@/components/sections/USP'), {
  loading: () => <div className="h-96 bg-teal-50 animate-pulse" />
});

const KeralaFAQ = NextDynamic(() => import('@/components/sections/KeralaFAQ'), {
  loading: () => <div className="h-96 bg-gray-900 animate-pulse" />
});

export const dynamic = 'force-dynamic'

export default async function KeralaPage() {
  const content = await fetchCityContent('kerala')
  console.log('KeralaPage - Content received:', content);
  console.log('KeralaPage - Header content:', content?.header);
  return (
    <>
      <ScrollProgress />
      <Header content={content?.header} />
      <KeralaHero content={content?.hero} />
      <KeralaTripOptions content={content?.tripOptions} />
      <UnfilteredReviews content={content?.reviews} />
      <Accommodation />
      <USP content={content?.usp} />
      <KeralaTripHighlights />
      <GroupCTA content={content?.groupCta} />
      <CompanyLogos content={content?.brands} />
      <KeralaFAQ content={content?.faq} />
      <Footer />
      <FloatingActionBar />
    </> 
  );
}