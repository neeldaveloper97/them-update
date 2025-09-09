'use client';
import { DynamicDataList } from '@/config/orgData.js';
import SectionBg from '@/app/assets/about_banner_bg.png';
import AboutSection from '@/components/DynamicTemplate/AboutUs.jsx';
import InfoBanner from '@/components/DynamicTemplate/InfoBanner.jsx';
import WhatWeDo from '@/components/DynamicTemplate/WhatWeDo.jsx';

export default function AboutPage() {
    const {
        banner = {},
        aboutModule = null,
        servicesSection = null,
    } = DynamicDataList[0]?.pages?.about || {};

    return (
        <>
            <InfoBanner
                title={banner.title || 'About Us'}
                currentPage={banner.title || 'About Us'}
                bannerImg={banner.bannerImg || SectionBg}
                breadcrumbs={banner.breadcrumbs || []}
            />

            {aboutModule && (
                <AboutSection aboutSectionData={aboutModule} reverse={true} />
            )}

            {servicesSection?.services?.length > 0 && (
                <WhatWeDo
                    servicesSectionData={servicesSection}
                    textCenter={true}
                    bgColor={servicesSection.bgColor || 'bg-white'}
                />
            )}
        </>
    );
}
