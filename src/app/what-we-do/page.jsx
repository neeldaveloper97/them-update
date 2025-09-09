'use client';

import { useEffect } from 'react';
import { DynamicDataList } from '@/config/orgData';
import InfoBanner from '@/components/DynamicTemplate/InfoBanner';

import SectionBg from '@/app/assets/about_banner_bg.png';
import Image from 'next/image';

export default function Page() {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Pull data from the first (default) entry
    const servicesPage = DynamicDataList?.[0]?.pages?.services;

    const bannerData =
        servicesPage?.banner ?? {
            title: 'What We Do',
            bannerImg: SectionBg,
            breadcrumbs: [
                { name: 'Home', url: '/' },
                { name: 'What We Do', url: '/what-we-do' },
            ],
        };

    const servicesModuleData =
        servicesPage?.servicesModule ?? {
            title: 'What We Do',
            description:
                'At T.H.E.M., we provide an easy, stress-free way to lower medical bills for individuals, doctors, and businesses.',
            services: [],
        };

    return (
        <>
            <InfoBanner
                title={bannerData.title}
                currentPage={bannerData.title}
                bannerImg={bannerData.bannerImg ?? SectionBg}
                breadcrumbs={bannerData.breadcrumbs ?? []}
            />

            <section className="bg-white py-24 what_we_do_container">
                <div className="container">
                    <div className="text-center">
                        <h2 className="pb-2 text-3xl font-bold text-primary-color-dark">
                            {servicesModuleData?.title || 'What We Do'}
                        </h2>
                        <p className="text-muted-text max-w-[919px] mx-auto w-full">
                            {servicesModuleData?.description ||
                                'At T.H.E.M., we provide an easy, stress-free way to lower medical bills for individuals, doctors, and businesses.'}
                        </p>
                    </div>

                    {(servicesModuleData?.services?.length ?? 0) > 0 && (
                        <div className="flex flex-wrap justify-center gap-6 pt-12 lg:flex-nowrap">
                            {(servicesModuleData.services || []).map((service) => (
                                <div
                                    key={service.title}
                                    className="bg-white w-full sm:w-[calc(50%_-_12px)] lg:flex-1 rounded-3xl shadow-lg shadow-brand-teal/10 overflow-hidden transition-transform border border-[#33acc133] p-2.5"
                                >
                                    <div className="w-full h-[200px] border-2 border-brand-teal rounded-2xl overflow-hidden">
                                        {service.bgImage ? (
                                            <Image
                                                src={service.bgImage?.src ?? service.bgImage}
                                                className="object-cover size-full"
                                                alt={service.title || 'Service Image'}
                                                width={400}
                                                height={200}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full bg-gray-100">
                                                <span className="text-gray-400">No image available</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative z-10 px-5 -mt-10 pb-11">
                                        <div
                                            className={`p-2.5 w-16 h-16 rounded-lg ${service.iconBgColor || ''
                                                } ${service.iconColor || ''} flex items-center justify-center`}
                                        >
                                            {service.icon}
                                        </div>

                                        <h3 className="pt-6 text-xl font-bold text-primary-color">
                                            {service.title}
                                        </h3>
                                        <p className="pt-2 text-muted-text">{service.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
