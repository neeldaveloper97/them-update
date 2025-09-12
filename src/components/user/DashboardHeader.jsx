'use client';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import PropTypes from 'prop-types';
import { Button } from '../ui/button';
import { SidebarTrigger } from '../ui/sidebar';
import { generateBreadcrumbs } from '@/utils/breadcrumbUtils';
import Breadcrumb from '../Breadcrumb';
import { useDispatch, useSelector } from 'react-redux';
import { getUserById, selectAuth } from '@/store/slices/authSlice';

const DashboardHeader = ({ pageTitle }) => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const urlparam = useParams();
  const { user } = useSelector(selectAuth);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedUserId = sessionStorage.getItem('chatUserId');
    if (storedUserId && !user) {
      dispatch(getUserById(storedUserId));
    }
  }, [dispatch]);

  const breadcrumbs = generateBreadcrumbs(pathname, urlparam.orgId);

  return (
    <header className="flex lg:flex-row flex-col justify-between items-start lg:items-center gap-3 lg:gap-0 p-4 h-auto">
      <div className="flex justify-between items-start lg:items-center gap-3 lg:gap-0 w-full">
        <div>
          <Breadcrumb breadcrumbs={breadcrumbs} />
        </div>
        <div className="flex items-center gap-2">
          <SidebarTrigger className="lg:hidden size-8" />
          <div className="flex items-center gap-5 rounded-full w-fit">
            <Button
              variant="ghost"
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              asChild
            >
              <Link
                href={`/dashboard/profile`}
                className="flex items-center gap-2"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={user?.avatarUrl || 'https://github.com/shadcn.png'}
                    alt={`${user?.data?.firstName} ${user?.data?.lastName}`}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
                    {user?.data?.firstName?.[0]}
                    {user?.data?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:flex flex-col items-start min-w-0">
                  <span className="font-medium text-muted-text-bold text-sm truncate max-w-[120px]">
                    {user?.data?.firstName} {user?.data?.lastName}
                  </span>
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

DashboardHeader.propTypes = {
  pageTitle: PropTypes.string.isRequired,
};

export default DashboardHeader;
