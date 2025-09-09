'use client';

import { useSelector } from 'react-redux';
import { selectAuthLayoutState } from '@/store/slices/authSlice';
import { redirect } from 'next/navigation';

export default function AdminLayout({ children }) {
  const { isAuthenticated, userRole, isLoaded } = useSelector(selectAuthLayoutState);

  if (isLoaded && (!isAuthenticated || userRole !== 'admin')) {
    redirect('/login');
  }

  return (
    <div className="admin-layout">
      {/* Add your admin sidebar and header components here */}
      <main>{children}</main>
    </div>
  );
}
