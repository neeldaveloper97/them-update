import React from 'react';

const HowItWorks = ({ howItWorksSectionData }) => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="w-full max-w-3xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-primary-dark leading-11">
            {howItWorksSectionData?.title || 'How It Works'}
          </h3>
          <p className="pt-2 text-base text-center text-muted-text">
            {howItWorksSectionData?.description ||
              'You can choose to pay only if you save, or subscribe for unlimited bill negotiation at a simple, affordable rate.'}
          </p>
        </div>
        <div className="grid items-start grid-cols-1 gap-8 mt-12 md:grid-cols-4 md:gap-4 hiw_container">
          {(howItWorksSectionData?.steps).map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-5 md:flex-col md:justify-center md:text-center"
            >
              <div className="border border-dashed border-[#004C5933] p-2 rounded-full bg-white">
                <div className="flex items-center justify-center border-2 border-white rounded-full bg-primary-light-100 custom-box-shadow size-12">
                  <h3 className="font-bold text-white w-fit">{item.step}</h3>
                </div>
              </div>

              <div className="flex flex-col gap-2 ">
                <h6 className="text-xl font-bold text-primary-dark">
                  {item.title}
                </h6>
                <p className="text-base lg:px-8 text-muted-text md:pt-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
