'use client';

import Image from 'next/image';

const AboutSection = ({ aboutSectionData, reverse }) => {
  return (
    <section className="bg-white py-[100px]" id="about-section">
      <div className="container">
        <div
          className={`flex flex-col lg:flex-row gap-20 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}
        >
          <div className="relative w-full lg:w-1/2">
            <div className="w-full lg:w-[519px] h-[400px] lg:h-[500px] rounded-3xl overflow-hidden">
              <Image
                src={aboutSectionData.mainImage}
                alt={aboutSectionData.title}
                width={519}
                height={400}
                className="object-cover w-full size-full"
              />
            </div>
          </div>

          <div className="lg:w-1/2">
            <h2 className="pb-6 text-3xl font-bold text-primary-dark">
              {aboutSectionData.title}
            </h2>
            <div className="space-y-4 text-muted-text">
              {aboutSectionData.description.map((para, index) => (
                <p key={index} className="text-base">
                  {para}
                </p>
              ))}
            </div>
            {aboutSectionData.values && (
              <ul className="space-y-6 pt-7">
                {aboutSectionData.values.map((feature, index) => (
                  <li key={index} className="flex items-center gap-5">
                    <div
                      className={`p-2.5 ${feature.iconBgColor} rounded-lg w-fit ${feature.iconColor}`}
                    >
                      {feature.icon}
                    </div>
                    <div>
                      <h6 className="text-xl font-semibold text-primary-color">
                        {feature.title}
                      </h6>
                      <p className="text-base text-muted-text">
                        {feature.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
