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
    <div className="p-2.5">
      <button
        onClick={handleLogout}
        className="flex rounded-full justify-center items-center gap-1.5 bg-org-primary p-2.5 w-full text-white cursor-pointer"
      >
        <span className="block size-6">
          <LogOut className="w-5 h-5" />
        </span>
        <span>Logout</span>
      </button>
    </div>
  );
}
