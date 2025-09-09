'use client';

import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import IconHome from '../../app/assets/svg/icon_home.svg';

const InfoBanner = ({
  title = '',
  currentPage = '',
  breadcrumbs = null,
  bannerImg = '',
  bgPosition = 'bg-center',
}) => {
  const renderBreadcrumbs = () => {
    if (breadcrumbs && breadcrumbs.length > 0) {
      return breadcrumbs.map((crumb, index) => (
        <React.Fragment key={`${crumb.name}-${crumb.url}-${index}`}>
          <BreadcrumbItem>
            {index === breadcrumbs.length - 1 ? (
              <BreadcrumbPage className="text-white font-semibold">
                {crumb.name}
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink
                href={crumb.url}
                className="flex items-center gap-2 font-bold text-white"
              >
                {index === 0 && (
                  <span className="size-5">
                    <img
                      className="object-cover size-full"
                      src={IconHome.src}
                      alt="Home icon"
                    />
                  </span>
                )}
                {crumb.name}
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {index < breadcrumbs.length - 1 && (
            <BreadcrumbSeparator className="text-white" />
          )}
        </React.Fragment>
      ));
    }
    // Default breadcrumbs
    return (
      <>
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/"
            className="flex items-center gap-2 font-bold text-white"
          >
            <span className="size-5">
              <img
                className="object-cover size-full"
                src={IconHome.src}
                alt="Home icon"
              />
            </span>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-white" />
        <BreadcrumbItem>
          <BreadcrumbPage className="text-white font-semibold">
            {currentPage}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </>
    );
  };

  return (
    <section className="relative bg-gradient-to-r mx-5 md:mx-[60px]">
      <div
        className={`min-h-[400px] rounded-3xl bg-cover flex justify-center items-center info_banner_container overflow-hidden ${bgPosition}`}
        style={{
          backgroundImage: `url(${bannerImg?.src || bannerImg || ''})`,
        }}
      >
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          <h1 className="mb-4 text-5xl font-bold text-white">{title}</h1>
          <Breadcrumb>
            <BreadcrumbList>{renderBreadcrumbs()}</BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    </section>
  );
};

export default InfoBanner;
