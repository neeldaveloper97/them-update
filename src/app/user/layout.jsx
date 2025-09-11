'use client';

import { useSelector } from 'react-redux';
import { selectAuthLayoutState } from '@/store/slices/authSlice';
import { redirect, usePathname } from 'next/navigation';
import UserSideBar from '@/components/SideBar/UserSideBar/UserSideBar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import DashboardHeader from '@/components/user/DashboardHeader';

export default function UserLayout({ children }) {
  const { isAuthenticated, isLoaded } = useSelector(selectAuthLayoutState);
  const pathname = usePathname();

  if (isLoaded && !isAuthenticated) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <UserSideBar pathname={pathname} />
      <SidebarInset className="overflow-auto bg-white">
        <DashboardHeader pageTitle={"Dashboard"} />
        <main className="p-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
