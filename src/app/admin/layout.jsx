'use client';

import { useSelector } from 'react-redux';
import { selectAuthLayoutState } from '@/store/slices/authSlice';
import { redirect, usePathname } from 'next/navigation';
import AdminSideBar from '@/components/SideBar/AdminSideBar/AdminSideBar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function AdminLayout({ children }) {
  const { isAuthenticated, userRole, isLoaded } = useSelector(selectAuthLayoutState);
  const pathname = usePathname();
 
  if (isLoaded && (!isAuthenticated || !['admin', 'super_admin'].includes(userRole))) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <AdminSideBar pathname={pathname} />
        <div className="flex-1 overflow-auto">
          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
