import React from 'react';

const BannerBg = ({ primaryColor = '#FAF3EB', secondaryColor = '#E4F7F3' }) => {
  return (
    <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden lg:top-0 -z-10">
      <svg
        width="1920"
        height="700"
        viewBox="0 0 1920 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_744_1045)">
          <rect width="1920" height="700" fill="#FDFDFD" />
          <g filter="url(#filter0_f_744_1045)">
            <circle cx="167" cy="743" r="276" fill={primaryColor} />
          </g>
          <g filter="url(#filter1_f_744_1045)">
            <circle cx="1033" cy="546" r="276" fill={primaryColor} />
          </g>
          <g filter="url(#filter2_f_744_1045)">
            <circle cx="493" cy="80" r="304" fill={primaryColor} />
          </g>
          <g filter="url(#filter3_f_744_1045)">
            <circle cx="1545" cy="-103" r="304" fill={secondaryColor} />
          </g>
          <g filter="url(#filter4_f_744_1045)">
            <circle cx="1907" cy="564" r="304" fill={secondaryColor} />
          </g>
        </g>
        <defs>
          <filter
            id="filter0_f_744_1045"
            x="-309"
            y="267"
            width="952"
            height="952"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="100"
              result="effect1_foregroundBlur_744_1045"
            />
          </filter>
          <filter
            id="filter1_f_744_1045"
            x="557"
            y="70"
            width="952"
            height="952"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="100"
              result="effect1_foregroundBlur_744_1045"
            />
          </filter>
          <filter
            id="filter2_f_744_1045"
            x="-11"
            y="-424"
            width="1008"
            height="1008"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="100"
              result="effect1_foregroundBlur_744_1045"
            />
          </filter>
          <filter
            id="filter3_f_744_1045"
            x="1041"
            y="-607"
            width="1008"
            height="1008"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="100"
              result="effect1_foregroundBlur_744_1045"
            />
          </filter>
          <filter
            id="filter4_f_744_1045"
            x="1403"
            y="60"
            width="1008"
            height="1008"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="100"
              result="effect1_foregroundBlur_744_1045"
            />
          </filter>
          <clipPath id="clip0_744_1045">
            <rect width="1920" height="700" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

export default BannerBg;
