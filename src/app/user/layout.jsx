'use client';

import { useSelector } from 'react-redux';
import { selectAuthLayoutState } from '@/store/slices/authSlice';
import { redirect, usePathname } from 'next/navigation';
import UserSideBar from '@/components/SideBar/UserSideBar/UserSideBar';

export default function UserLayout({ children }) {
  const { isAuthenticated, isLoaded } = useSelector(selectAuthLayoutState);
  const pathname = usePathname();

  if (isLoaded && !isAuthenticated) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <UserSideBar pathname={pathname} />
      <div className="flex-1 overflow-auto">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
