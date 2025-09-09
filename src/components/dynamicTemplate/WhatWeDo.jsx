'use client';

const WhatWeDo = ({ servicesSectionData, textCenter }) => {
  return (
    <section
      className={`bg-primary-transparent py-24 what_we_do_container`}
      id="what-we-do"
    >
      <div className="container">
        <div className={textCenter ? 'text-center' : ''}>
          {servicesSectionData.title && (
            <h2 className="pb-2 text-3xl font-bold text-primary-dark">
              {servicesSectionData.title}
            </h2>
          )}
          {servicesSectionData.description && (
            <p className="text-muted-text">{servicesSectionData.description}</p>
          )}
        </div>
        {servicesSectionData.services && (
          <div className="flex flex-wrap justify-center gap-6 pt-12 lg:flex-nowrap">
            {servicesSectionData.services.map((feature, index) => (
              <div
                key={index}
                className="bg-white w-full sm:w-[calc(50%_-_12px)] lg:flex-1 rounded-3xl shadow-lg shadow-primary-dark/10 overflow-hidden transition-transform"
              >
                <div className="relative p-8">
                  <div
                    className={`p-2.5 w-16 h-16 rounded-lg ${feature.iconBgColor} ${feature.iconColor} flex items-center justify-center`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="pt-6 text-xl font-bold text-primary-color">
                    {feature.title}
                  </h3>
                  <p className="pt-2 text-muted-text">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WhatWeDo;
