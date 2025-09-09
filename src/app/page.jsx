'use client';

import { useEffect } from 'react';
import { DynamicDataList } from '@/config/orgData';

import Banner from '@/components/dynamicTemplate/Banner';
import AboutSection from '@/components/dynamicTemplate/AboutUs';
import WhatWeDo from '@/components/dynamicTemplate/WhatWeDo';
import HowItWorks from '@/components/dynamicTemplate/HowItWorks';
import SubscriptionPlans from '@/components/dynamicTemplate/SubscriptionPlans';
import FaqSection from '@/components/dynamicTemplate/FaqSection';

export default function Page() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Pull home content from the first (default) entry
  const home = DynamicDataList?.[0]?.pages?.home ?? {};

  const bannerData = home.banner ?? null;
  const aboutSectionData = home.aboutSection ?? null;
  const servicesSectionData = home.servicesSection ?? null;
  const howItWorksSectionData = home.howItWorksSection ?? null;
  const subscriptionSectionData = home.subscriptionSection ?? null;
  const faqSectionData = home.faqSection ?? null;

  return (
    <>
      {bannerData && <Banner bannerData={bannerData} />}
      {aboutSectionData && (
        <AboutSection aboutSectionData={aboutSectionData} reverse={false} />
      )}
      {servicesSectionData && (
        <WhatWeDo servicesSectionData={servicesSectionData} textCenter={false} />
      )}
      {howItWorksSectionData && (
        <HowItWorks howItWorksSectionData={howItWorksSectionData} />
      )}
      {subscriptionSectionData && (
        <SubscriptionPlans subscriptionSectionData={subscriptionSectionData} />
      )}
      {faqSectionData && <FaqSection faqSectionData={faqSectionData} />}
    </>
  );
}
