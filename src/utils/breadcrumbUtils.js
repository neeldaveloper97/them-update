// utils/breadcrumbUtils.js
export const getBreadcrumbConfig = () => ({
  // Main dashboard routes
  dashboard: 'Overview Panel',
  'bill-upload': 'Bill Upload & Analysis',
  'bill-Intake-Prep': 'Bill Intake & Prep',
  'bill-upload-initiate-negotiation': 'Initiate Negotiation',
  'check-uploaded-bill': 'Check Uploaded Bill',
  'initiate-negotiation': 'Initiate Negotiation',
  reports: 'Reports & Analytics',
  payments: 'Payment Management',
  'billing-history': 'Billing History',
  profile: 'Profile',
  plans: 'Plans',
  support: 'Support',

  // Sub-routes for bill upload
  upload: 'Upload',
  analysis: 'Analysis',
  review: 'Review',

  // Sub-routes for negotiation tracker
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

export const generateBreadcrumbs = (pathname) => {
  const config = getBreadcrumbConfig();
  if (pathname.endsWith('/support')) {
    return [];
  }
  const pathSegments = pathname.split('/').filter(Boolean);

  // Remove orgId from segments if present
  const relevantSegments = pathSegments.slice(1); // Skip orgId

  // Always start with Dashboard
  const breadcrumbs = [
    {
      label: 'Dashboard',
      href: `/user/dashboard`,
      isActive:
        relevantSegments.length === 1 && relevantSegments[0] === 'dashboard',
    },
  ];

  // If we're on the main dashboard, return just Dashboard
  if (relevantSegments.length === 1 && relevantSegments[0] === 'dashboard') {
    return breadcrumbs;
  }

  // Process all segments (not skipping the first one)
  relevantSegments.forEach((segment, index) => {
    // Skip UUID-like segments
    if (/^[a-f0-9]{24}$/i.test(segment) || /^[a-f0-9-]{36}$/i.test(segment)) {
      return;
    }

    const isLast = index === relevantSegments.length - 1;
    const segmentPath = `/user/${relevantSegments
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
