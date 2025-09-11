'use client';

import { subscribeLoader } from '@/services/loaderService';
import { useEffect, useState } from 'react';

export default function GlobalLoader() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeLoader(setLoading);
    return unsubscribe;
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-[9999]">
      <div className="w-12 h-12 border-4 border-gray-300 rounded-full border-t-neutral-800 animate-spin"></div>
    </div>
  );
}
