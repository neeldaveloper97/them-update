import {
  LayoutDashboard,
  UploadCloud,
  BarChart2,
  PieChart,
  CreditCard,
  FileText,
  Settings,
  Users,
  MessageCircle,
  ClipboardList,
} from 'lucide-react';

export const getIconByName = (iconName) => {
  const icons = {
    LayoutDashboard: (props) => <LayoutDashboard {...props} />,
    UploadCloud: (props) => <UploadCloud {...props} />,
    BarChart2: (props) => <BarChart2 {...props} />,
    PieChart: (props) => <PieChart {...props} />,
    CreditCard: (props) => <CreditCard {...props} />,
    FileText: (props) => <FileText {...props} />,
    Settings: (props) => <Settings {...props} />,
    Users: (props) => <Users {...props} />,
    MessageCircle: (props) => <MessageCircle {...props} />,
    ClipboardList: (props) => <ClipboardList {...props} />,
  };

  return icons[iconName] || null;
};


const sidebarConfigs = {
  user: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      iconName: 'LayoutDashboard',
    },
    {
      title: 'Bill Intake & Prep',
      href: '/dashboard/bill-Intake-Prep',
      iconName: 'BarChart2',
    },
    {
      title: 'Bill Upload & Analysis',
      href: '/dashboard/bill-upload',
      iconName: 'UploadCloud',
    },
    {
      title: 'Reports & Analytics',
      href: '/dashboard/reports',
      iconName: 'PieChart',
    },
    {
      title: 'Payment Management',
      href: '/dashboard/payments',
      iconName: 'CreditCard',
    },
    {
      title: 'Billing History',
      href: '/dashboard/billing-history',
      iconName: 'FileText',
    },
    { logout: 'Logout', href: '/dashboard/billing-history' },
  ],

  admin: [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      iconName: 'LayoutDashboard',
    },
    {
      title: 'User Management',
      href: '/admin/users',
      iconName: 'Users',
    },
    {
      title: 'Reports',
      href: '/admin/reports',
      iconName: 'PieChart',
    },
    {
      title: 'Billing Control',
      href: '/admin/billing',
      iconName: 'CreditCard',
    },
    {
      title: 'System Settings',
      href: '/admin/settings',
      iconName: 'Settings',
    },
  ],

  provider: [
    {
      title: 'Dashboard',
      href: '/provider/dashboard',
      iconName: 'LayoutDashboard',
    },
    {
      title: 'Patient Records',
      href: '/provider/patients',
      iconName: 'ClipboardList',
    },
    {
      title: 'Messages',
      href: '/provider/messages',
      iconName: 'MessageCircle',
    },
    {
      title: 'Billing',
      href: '/provider/billing',
      iconName: 'FileText',
    },
  ],
};

export default sidebarConfigs;
