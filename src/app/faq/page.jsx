'use client';

import { useEffect } from 'react';

import InfoBanner from '@/components/dynamicTemplate/InfoBanner';
import { DynamicDataList } from '@/config/orgData';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import Image from 'next/image';
import SectionBg from '@/app/assets/about_banner_bg.png';

const Page = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Pull FAQ content from the first (default) site entry
  const faqPage = DynamicDataList?.[0]?.pages?.faq;

  const bannerData =
    faqPage?.banner ?? {
      title: 'FAQ',
      bannerImg: SectionBg,
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'FAQ', url: '/faq' },
      ],
    };

  const faqModuleData =
    faqPage?.faqModule ?? {
      title: 'Frequently Asked Questions',
      questions: [],
    };

  const faqImg = faqPage?.faqImg ?? SectionBg;

  return (
    <>
      <InfoBanner
        title={bannerData.title}
        currentPage={bannerData.title}
        bannerImg={bannerData.bannerImg ?? SectionBg}
        breadcrumbs={bannerData.breadcrumbs ?? []}
      />

      <section className="pt-8 bg-white sm:py-12 md:py-16">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-5xl font-bold text-primary-color-dark">
                {faqModuleData?.title || 'FAQ'}
              </h2>

              <Accordion type="single" collapsible className="w-full h-full pt-12 space-y-5">
                {(faqModuleData?.questions ?? []).map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-white px-5 rounded-[12px] border shadow-lg shadow-primary-color/10 border-primary-color"
                  >
                    <AccordionTrigger className="text-lg font-bold !cursor-pointer">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-text text-base pt-4 pb-8">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="flex justify-center mt-12 lg:w-1/2 lg:mt-0">
              <div className="relative w-full">
                <Image
                  src={faqImg}
                  alt="Customer Support Representative"
                  width={500}
                  height={600}
                  className="object-cover h-[600px] rounded-lg size-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
