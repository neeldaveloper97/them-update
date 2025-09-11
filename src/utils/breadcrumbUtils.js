// utils/breadcrumbUtils.js
export const getBreadcrumbConfig = () => ({
  // Main dashboard routes
  dashboard: 'Overview Panel',
  'bill-upload': 'Bill Upload & Analysis',
  'bill-Intake-Prep': 'Bill Intake & Prep',
  reports: 'Reports & Analytics',
  payments: 'Payment Management',
  'billing-history': 'Billing History',
  profile: 'Profile',

  // Sub-routes for bill upload
  upload: 'Upload',
  analysis: 'Analysis',
  review: 'Review',

  // Sub-routes for negotiation tracker
  'initiate-negotiation': 'Initiate Negotiation',
  'active-negotiations': 'Active Negotiations',
  'completed-negotiations': 'Completed Negotiations',
  'negotiation-history': 'Negotiation History',

  // Sub-routes for reports
  'monthly-reports': 'Monthly Reports',
  'quarterly-reports': 'Quarterly Reports',
  'custom-reports': 'Custom Reports',
  export: 'Export',

  // Sub-routes for payments
  'pending-payments': 'Pending Payments',
  'completed-payments': 'Completed Payments',
  'payment-history': 'Payment History',
  'payment-methods': 'Payment Methods',

  // Sub-routes for billing history
  'recent-bills': 'Recent Bills',
  'archived-bills': 'Archived Bills',
  search: 'Search',

  // Common sub-routes
  details: 'Details',
  edit: 'Edit',
  create: 'Create',
  view: 'View',
  settings: 'Settings',
});

export const generateBreadcrumbs = (pathname, orgId) => {
  const config = getBreadcrumbConfig();
  if (pathname.endsWith('/support')) {
    return [];
  }
  const pathSegments = pathname.split('/').filter(Boolean);

  // Remove orgId from segments
  const relevantSegments = pathSegments.slice(1); // Skip orgId

  // Always start with Dashboard
  const breadcrumbs = [
    {
      label: 'Dashboard',
      href: `/them/dashboard`,
      isActive:
        relevantSegments.length === 1 && relevantSegments[0] === 'dashboard',
    },
  ];

  // If we're on the main dashboard, return just Dashboard
  if (relevantSegments.length === 1 && relevantSegments[0] === 'dashboard') {
    return breadcrumbs;
  }

  // Process remaining segments (skip 'dashboard' segment)
  const routeSegments = relevantSegments.slice(1);
  routeSegments.forEach((segment, index) => {
    if (/^[a-f0-9]{24}$/i.test(segment) || /^[a-f0-9-]{36}$/i.test(segment)) {
      return;
    }

    const isLast = index === routeSegments.length - 1;
    const segmentPath = `/them/dashboard/${routeSegments
      .slice(0, index + 1)
      .join('/')}`;

    const label = config[segment] || formatSegment(segment);

    breadcrumbs.push({
      label,
      href: segmentPath,
      isActive: isLast,
    });
  });

  return breadcrumbs;
};

const formatSegment = (segment) => {
  // Handle dynamic segments (like IDs)
  if (segment.match(/^[a-f0-9]{24}$/)) return 'Details'; // MongoDB ObjectId
  if (segment.match(/^\d+$/)) return 'Item'; // Numeric ID

  // Format kebab-case to Title Case
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
