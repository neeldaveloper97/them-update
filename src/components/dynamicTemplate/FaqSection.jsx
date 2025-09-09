import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FaqSection = ({ faqSectionData }) => {
  return (
    <>
      <section className="bg-gray-100 py-24 md g-blend-luminosity bg-cover bg-no-repeat relative">
        <div className="container">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-5xl font-bold text-primary-dark">FAQ</h2>
              <Accordion
                type="single"
                collapsible
                className="w-full pt-12 space-y-5"
              >
                {(faqSectionData?.questions).map((item, index) => (
                  <AccordionItem
                    key={index}
                    className="bg-white px-5 rounded-[12px] border-0 "
                    value={`item-${index}`}
                  >
                    <AccordionTrigger className="text-lg font-bold !cursor-pointer">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="flex justify-center mt-12 lg:w-1/2 lg:mt-0">
              <div className="relative w-full">
                <Image
                  src={faqSectionData?.backgroundImage}
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

export default FaqSection;
