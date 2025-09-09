'use client';

import { useSelector } from 'react-redux';
import { selectAuthLayoutState } from '@/store/slices/authSlice';
import { redirect, usePathname } from 'next/navigation';
import AdminSideBar from '@/components/SideBar/AdminSideBar/AdminSideBar';

export default function AdminLayout({ children }) {
  const { isAuthenticated, userRole, isLoaded } = useSelector(selectAuthLayoutState);
  const pathname = usePathname();
 
  if (isLoaded && (!isAuthenticated || userRole !== 'admin')) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSideBar pathname={pathname} />
      <div className="flex-1 overflow-auto">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
