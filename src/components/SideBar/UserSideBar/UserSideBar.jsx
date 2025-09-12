'use client';

import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  UploadCloud,
  ClipboardList,
  BarChart3,
  CreditCard,
} from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';

const getNavItems = () => [
  {
    title: 'Dashboard',
    url: `/user/dashboard`,
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: 'Bill Upload & Analysis',
    url: `/user/bill-upload`,
    icon: <UploadCloud className="w-5 h-5" />,
  },
  {
    title: 'Bill Intake & Prep',
    url: `/user/bill-Intake-Prep`,
    icon: <ClipboardList className="w-5 h-5" />,
  },
  {
    title: 'Reports & Analytics',
    url: `/user/reports`,
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    title: 'Payment Management',
    url: `/user/payments`,
    icon: <CreditCard className="w-5 h-5" />,
  },
];

export default function UserSideBar({ pathname }) {
  const items = getNavItems();

  return (
    <Sidebar variant="sidebar" collapsible="offcanvas">
      <SidebarContent>
        <SidebarGroup className="flex-1 p-0">
          <SidebarGroupLabel className="border-b justify-center py-3.5 !h-auto">
            <Link
              href="/dashboard"
              className="font-semibold text-org-primary-dark text-2xl leading-relaxed"
            >
              <img
                src="/images/them_logo.png"
                className="h-20"
                alt="T.H.E.M. logo"
              />
            </Link>
          </SidebarGroupLabel>

          <SidebarGroupContent className="pt-9">
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn(
                          'flex items-center gap-2 px-3 py-3.5 text-sm rounded-none font-medium transition-colors border-r-2 h-auto',
                          isActive
                            ? 'border-org-primary text-org-primary'
                            : 'border-transparent text-text-muted'
                        )}
                      >
                        <span className="block size-6">{item.icon}</span>
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="p-0">
          <div>
            <LogoutButton />
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
