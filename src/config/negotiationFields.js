export const formFieldGroups = {
  patientFields: [
    {
      name: 'patientName',
      label: 'Patient Full Name',
      type: 'text',
      required: true,
    },
    {
      name: 'patientDob',
      label: 'Patient Date of Birth',
      type: 'date',
      required: false,
    },
    {
      name: 'patientEmail',
      label: 'Patient Email',
      type: 'email',
      required: false,
    },
    {
      name: 'patientAccNo',
      label: 'Patient Account No',
      type: 'text',
      required: false,
    },
    {
      name: 'patientPhone',
      label: 'Patient Phone',
      type: 'text',
      required: false,
    },
    {
      name: 'insuranceMemberId',
      label: 'Insurance Member ID',
      type: 'text',
      required: false,
    },
    {
      name: 'insurancePlanName',
      label: 'Plan Name / Payer',
      type: 'text',
      required: false,
    },
    {
      name: 'patientAddress',
      label: 'Street Address',
      type: 'text',
      required: false,
    },
    { name: 'patientCity', label: 'City', type: 'text', required: false },
    { name: 'patientState', label: 'State', type: 'text', required: false },
    { name: 'patientZip', label: 'ZIP Code', type: 'text', required: false },
  ],

  hospitalFields: [
    {
      name: 'hospitalProviderName',
      label: 'Hospital / Clinic Name',
      type: 'text',
      required: false,
    },
    {
      name: 'hospitalNpi',
      label: 'Facility NPI (or Tax ID)',
      type: 'text',
      required: false,
    },
    {
      name: 'hospitalContactNumber',
      label: 'Billing Department Phone',
      type: 'text',
      required: false,
    },
    {
      name: 'hospitalEmail',
      label: 'Billing department email',
      type: 'email',
      required: false,
    },
    {
      name: 'renderingProviderNpi',
      label: 'Rendering Provider NPI',
      type: 'text',
      required: false,
    },
    {
      name: 'hospitalAddress',
      label: 'Street Address',
      type: 'text',
      required: false,
    },
    {
      name: 'claimReferenceNumber',
      label: 'Claim / Reference Number',
      type: 'text',
      required: false,
    },
    { name: 'hospitalCity', label: 'City', type: 'text', required: false },
    { name: 'hospitalState', label: 'State', type: 'text', required: false },
    { name: 'hospitalZip', label: 'ZIP Code', type: 'text', required: false },
  ]
};
