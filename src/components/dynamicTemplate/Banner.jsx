import { BadgeCheck } from 'lucide-react';
import BannerBg from './BannerBg';

const Banner = ({ bannerData }) => {
  return (
    <section className="banner_container h-full min-h-[700px] bg-cover bg-center relative">
      <BannerBg primaryColor="#E4F7F3" secondaryColor="#FAF3EB" />
      <div className="container min-h-[700px] flex items-center flex-col lg:flex-row justify-between h-full gap-8 pt-16 xl:pt-0">
        <div className="w-full xl:w-[558px]">
          <h1 className="text-5xl xl:text-[55px] text-primary-dark leading-none font-bold">
            {bannerData.title}
          </h1>
          <p className="pt-6 text-muted-text">{bannerData.description}</p>
          <ul className="pt-5 space-y-4">
            {bannerData.features.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="pt-0.5">
                  <BadgeCheck className="text-primary-light-100" size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-primary-dark">
                    {item.title}:
                  </p>
                  <p className="font-normal text-muted-text">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full xl:w-[calc(100%_-_580px)]">
          <img
            className="w-full lg:min-h-[700px] object-contain object-bottom"
            src={`${bannerData.image.src}`}
            alt="Banner Image Women Holding Laptop"
          />
        </div>
      </div>
    </section>
  );
};

export default Banner;
