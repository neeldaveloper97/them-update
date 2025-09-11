'use client';

import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/store/slices/authSlice';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LogoutButton({ className }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, redirect to login
      router.push('/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={cn(
        'flex items-center gap-2 px-3 py-3.5 text-sm rounded-none font-medium transition-colors border-r-2 h-auto border-transparent text-red-600 hover:text-red-700 hover:bg-red-50 w-full',
        className
      )}
    >
      <span className="block size-6">
        <LogOut className="w-5 h-5" />
      </span>
      <span>Logout</span>
    </button>
  );
}
