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
    Users,
    Banknote,
    ListChecks,
    MessageSquareMore,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

const items = [
    { title: 'Dashboard', url: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { title: 'Users', url: '/admin/users', icon: <Users className="w-5 h-5" /> },
    { title: 'Payments', url: '/admin/payments', icon: <Banknote className="w-5 h-5" /> },
    { title: 'FAQ', url: '/admin/faqs', icon: <ListChecks className="w-5 h-5" /> },
    { title: 'Contacts', url: '/admin/contacts', icon: <MessageSquareMore className="w-5 h-5" /> },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar variant="sidebar" collapsible="offcanvas">
            <SidebarContent>
                <SidebarGroup className="flex-1 p-0">
                    <SidebarGroupLabel className="border-b justify-center py-3.5 !h-auto">
                        <Link href="/admin" className="flex items-center gap-3">
                            <img src="/images/them_logo.png" alt="T.H.E.M. logo" className="h-12" />
                            <span className="text-xl font-semibold">Admin</span>
                        </Link>
                    </SidebarGroupLabel>

                    <SidebarGroupContent className="pt-6">
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
            </SidebarContent>
        </Sidebar>
    );
}
