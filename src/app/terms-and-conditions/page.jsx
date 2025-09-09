'use client';

import { useEffect } from 'react';
import { DynamicDataList } from '@/config/orgData';

import InfoBanner from '@/components/DynamicTemplate/InfoBanner';
import SectionBg from '@/app/assets/about_banner_bg.png';
import { BadgeCheck } from 'lucide-react';

export default function Page() {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Pull org-less data from the first (default) entry
    const termsPage = DynamicDataList?.[0]?.pages?.terms;

    const bannerData =
        termsPage?.banner ?? {
            title: 'Terms & Conditions',
            bannerImg: SectionBg,
            breadcrumbs: [
                { name: 'Home', url: '/' },
                { name: 'Terms & Conditions', url: '/terms-and-conditions' },
            ],
        };

    const termsData =
        termsPage?.termsModule ?? {
            title: 'Terms & Conditions',
            introduction: null,
            sections: [],
        };

    return (
        <>
            <InfoBanner
                title={bannerData.title}
                currentPage={bannerData.title}
                bannerImg={bannerData.bannerImg ?? SectionBg}
                breadcrumbs={bannerData.breadcrumbs ?? []}
            />

            <section className="py-8 bg-white sm:py-12 md:py-16">
                <div className="max-w-[900px] w-full mx-auto px-5">
                    <h2 className="mb-8 text-3xl font-bold text-primary-color-dark">
                        {termsData?.title || 'Terms & Conditions'}
                    </h2>

                    <div className="space-y-6 md:space-y-8">
                        <div className="mb-10">
                            {!!termsData?.introduction && (
                                <>
                                    {termsData.introduction.title && (
                                        <p className="mb-4 text-xl font-semibold text-primary-color-dark">
                                            {termsData.introduction.title}
                                        </p>
                                    )}

                                    {(termsData.introduction.agreements || []).length > 0 && (
                                        <ul className="pt-5 space-y-4">
                                            {(termsData.introduction.agreements || []).map((item, index) => (
                                                <li key={`agreement-${index}`} className="flex items-start gap-2">
                                                    <div className="pt-0.5">
                                                        <BadgeCheck className="text-primary-color" size={18} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-normal leading-6 text-muted-text">{item.text}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {termsData.introduction.commitment && (
                                        <p className="pt-6 text-lg text-muted-text">
                                            {termsData.introduction.commitment}
                                        </p>
                                    )}
                                </>
                            )}

                            {(termsData.sections || []).map((section, sectionIndex) => (
                                <div key={`section-${sectionIndex}`}>
                                    {section.title && (
                                        <p className="pt-8 text-xl font-semibold text-primary-color-dark">
                                            {section.title}
                                        </p>
                                    )}

                                    {section.content && (
                                        <p className="mt-3 text-lg text-muted-text">{section.content}</p>
                                    )}

                                    {(section.points || []).length > 0 && (
                                        <ul className="pt-5 space-y-4">
                                            {(section.points || []).map((point, pointIndex) => (
                                                <li
                                                    key={`point-${sectionIndex}-${pointIndex}`}
                                                    className="flex items-start gap-2"
                                                >
                                                    <div className="pt-0.5">
                                                        <BadgeCheck className="text-primary-color" size={18} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-normal leading-6 text-muted-text">
                                                            {point.text}
                                                        </p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
