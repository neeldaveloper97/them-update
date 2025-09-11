'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/components/ui/sidebar'; // ← your ShadCN sidebar context

export function SidebarAutoCloseOnRouteChange() {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (
      isMobile &&
      openMobile &&
      pathname !== prevPath.current // avoid firing on first load
    ) {
      setOpenMobile(false);
    }
    prevPath.current = pathname;
  }, [pathname, isMobile, openMobile, setOpenMobile]);

  return null;
}
