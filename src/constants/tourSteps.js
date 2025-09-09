export const DASHBOARD_TOUR_STEPS = [
  {
    element: '[data-tour="dashboard-greeting"]',
    popover: {
      title: 'Welcome!',
      description: 'This is your personalized dashboard greeting.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="dashboard-stats"]',
    popover: {
      title: 'Your Stats',
      description: 'Here you can view your performance statistics.',
    },
  },
  {
    element: '[data-tour="dashboard-quick-actions"]',
    popover: {
      title: 'Quick Actions',
      description: 'Access important actions quickly from here.',
    },
    nextPage: '/them/dashboard/bill-upload',
    localStorageKey: 'startBillTour',
    localStorageValue: 'true',

    onNavigate: () => {},
  },
];

export const BILL_UPLOAD_TOUR_STEPS = [
  {
    element: '[data-tour="bill-uploader"]',
    popover: {
      title: 'Upload Medical Bills',
      description:
        'Drag and drop or click to upload your bills. Supported formats: PDF, JPG, PNG, PPT, WORD.',
      align: 'start',
    },
  },
  {
    element: '[data-tour="uploaded-files"]',
    popover: {
      title: 'Uploaded Files',
      description:
        'Here you can view, download, or delete uploaded bills. Use "Download All Files" to save everything at once.',
    },
  },
  {
    element: '[data-tour="analyzed-bills"]',
    popover: {
      title: 'Analysed Medical Bills',
      description:
        'These are your processed bills with total amounts detected. Status shows when they are ready for action.',
    },
  },
  {
    element: '[data-tour="ai-recommendations"]',
    popover: {
      title: 'AI Analysis & Recommendations',
      description:
        'Here you find detected issues and opportunities to optimize your bills, like overcharges or duplicate billing.',
    },
    nextPage: '/them/dashboard/bill-Intake-Prep',
    localStorageKey: 'startBillIntakeTour',
    localStorageValue: 'true',
    currentStepTourFinishKey: 'startBillTour',
  },
];

export const INTAKE_PREP_TOUR_STEPS = [
  {
    element: '[data-tour="intake-metrics"]',
    popover: {
      title: 'Key Metrics',
      description:
        'Quickly glance at active claims, total savings, success rate, and average processing time.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="intake-claim-list"]',
    popover: {
      title: 'Negotiation Bill List',
      description:
        'This table lists all submitted bills. Click any row to focus that claim and see more details.',
      side: 'right',
      align: 'start',
    },
  },
  {
    element: '[data-tour="intake-claim-focus"]',
    popover: {
      title: 'Current Claim in Focus',
      description:
        'Detailed snapshot for the selected claim, including patient, provider, status, and total billed.',
      side: 'top',
      align: 'end',
    },
  },
  {
    element: '[data-tour="intake-next-steps"]',
    popover: {
      title: 'Next Steps',
      description:
        'Take quick actions like contacting the provider, uploading documents, or downloading the report.',
      side: 'right',
      align: 'center',
    },
  },
  {
    element: '[data-tour="intake-claim-timeline"]',
    popover: {
      title: 'Claim Timeline',
      description:
        'Track step-by-step progress for the selected claim and see which stage your negotiation is in.',
      side: 'right',
      align: 'start',
    },
    nextPage: '/them/dashboard/reports',
    localStorageKey: 'startReportsTour',
    localStorageValue: 'true',
    currentStepTourFinishKey: 'startBillIntakeTour',
  },
];

export const REPORTS_ANALYTICS_TOUR_STEPS = [
  {
    element: '[data-tour="reports-chart"]',
    popover: {
      title: 'Savings Overview',
      description:
        'This bar chart shows your savings over time. Hover to see exact values.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="reports-mode-toggle"]',
    popover: {
      title: 'Monthly vs Annually',
      description:
        'Switch between monthly and annual views to compare trends at different scales.',
      side: 'left',
      align: 'center',
    },
  },
  {
    element: '[data-tour="reports-total-savings"]',
    popover: {
      title: 'Total Savings',
      description:
        'Cumulative savings across all processed claims for the selected period.',
      side: 'left',
      align: 'center',
    },
  },
  {
    element: '[data-tour="reports-claims-processed"]',
    popover: {
      title: 'Claims Processed',
      description: 'Total number of claims you’ve processed.',
      side: 'left',
      align: 'center',
    },
  },
  {
    element: '[data-tour="reports-avg-savings"]',
    popover: {
      title: 'Avg. Savings per Claim',
      description:
        'Average savings achieved per claim. Use this to gauge efficiency.',
      side: 'left',
      align: 'center',
    },
    nextPage: '/them/dashboard/payments',
    localStorageKey: 'startPaymentsTour',
    localStorageValue: 'true',
    currentStepTourFinishKey: 'startReportsTour',
  },
];

export const PAYMENT_MANAGEMENT_TOUR_STEPS = [
  {
    element: '[data-tour="payments-plans"]',
    popover: {
      title: 'Payment Plans',
      description:
        'Choose the plan that fits your usage. Each tier lists what’s included and any overage/performance fees.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="payments-plan-starter"]',
    popover: {
      title: 'Starter Plan',
      description:
        'Great for individuals. We’ll highlight one card to show you the structure used across all plans.',
      side: 'right',
      align: 'center',
    },
  },
  {
    element: '[data-tour="payments-buy-button"]',
    popover: {
      title: 'Subscribe',
      description:
        'Click “Buy” to start checkout (Stripe or your configured processor).',
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '[data-tour="payment-methods"]',
    popover: {
      title: 'Payment Methods',
      description:
        'Pay with card, ACH/wire, or a secure Stripe flow—pick what works best for you.',
      side: 'left',
      align: 'center',
    },
  },
  {
    element: '[data-tour="payments-autopay"]',
    popover: {
      title: 'Auto-Pay',
      description:
        'Toggle to automatically charge future invoices to your default method.',
      side: 'right',
      align: 'center',
    },
  },
  {
    element: '[data-tour="payment-security"]',
    popover: {
      title: 'Confirmation & Security',
      description:
        'All transactions are encrypted. Receipts are available for download here.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="payments-refund"]',
    popover: {
      title: 'Request a Refund',
      description: 'Need help with a charge? Start a refund request from here.',
      side: 'left',
      align: 'end',
    },
    currentStepTourFinishKey: 'startPaymentsTour',
    isFinalStep: true,
    // nextPage: '/them/dashboard/profile',
    // localStorageKey: 'startProfileTour',
    // localStorageValue: 'true',
  },
];

// profile.tour.ts (or inline in the page component)
export const PROFILE_TOUR_STEPS = [
  {
    element: '[data-tour="profile-header"]',
    popover: {
      title: 'Your Profile',
      description: 'This header shows your avatar, name, and email.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="profile-personal"]',
    popover: {
      title: 'Personal Information',
      description:
        'View or edit your details. Click “Edit” to enable fields, then “Save Changes.”',
      side: 'right',
      align: 'center',
    },
  },
  {
    element: '[data-tour="profile-edit"]',
    popover: {
      title: 'Edit & Save',
      description:
        'Toggle edit mode. Unsaved changes are highlighted so you don’t miss them.',
      side: 'left',
      align: 'center',
    },
  },
  {
    element: '[data-tour="profile-plan"]',
    popover: {
      title: 'Plan Details',
      description: 'See your current plan, remaining usage, and plan duration.',
      side: 'left',
      align: 'center',
    },
  },
  {
    element: '[data-tour="profile-security"]',
    popover: {
      title: 'Security Settings',
      description:
        'Manage password and two-factor authentication to keep your account safe.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="profile-change-password"]',
    popover: {
      title: 'Change Password',
      description:
        'Open a guided flow to update your password with validation.',
      side: 'left',
      align: 'center',
    },
  },
  {
    element: '[data-tour="profile-transactions"]',
    popover: {
      title: 'Transaction History',
      description:
        'Review past payments. Use the action buttons to view details or download.',
      side: 'top',
      align: 'start',
    },
    isFinalStep: true,
  },
];
