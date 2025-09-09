import { z } from 'zod';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_EXTENSIONS = ['pdf', 'png', 'jpeg', 'jpg', 'doc', 'docx'];
const PHONE_REGEX = /^\(\d{3}\) \d{3}-\d{4}$/;
const SSN_REGEX = /^\d{3}-?\d{2}-?\d{4}$/;
const ACCOUNT_NUMBER_REGEX = /^[a-zA-Z0-9-]+$/;
const POLICY_NUMBER_REGEX = /^[a-zA-Z0-9-]+$/;
const NAME_REGEX = /^(?!.* {2})(?! )[a-zA-Z'-]+(?: [a-zA-Z'-]+)*$/;

const validatePhoneDigits = (value) => {
  const digits = value.replace(/\D/g, '');
  return digits.length === 10;
};

export const formSchema = z.object({
  // Patient Information
  patientName: z
    .string()
    .min(2, 'Patient name must be at least 2 characters')
    .max(100, 'Patient name must be less than 100 characters')
    .regex(NAME_REGEX, 'Only letters, spaces, hyphens, and apostrophes allowed')
    .nonempty('Patient name is required'),
  patientDob: z
    .string()
    .refine(
      (val) => {
        if (!val) return false;
        const dob = new Date(val);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        return age >= 0 && age <= 150 && dob <= today;
      },
      { message: 'Please enter a valid date of birth' }
    )
    .optional()
    .or(z.literal('')),

  patientEmail: z
    .string()
    .min(1, 'Patient email is required')
    .email('Please enter a valid email address')
    .nonempty('Patient email is required'),

  patientAccNo: z
    .string()
    .min(5, 'Account number is required')
    .optional()
    .or(z.literal('')),

  // Fixed phone number validation
  patientPhone: z
    .string()
    .refine(validatePhoneDigits, 'Phone number must be exactly 10 digits')
    .refine(
      (val) => PHONE_REGEX.test(val),
      'Phone number must be in format (XXX) XXX-XXXX'
    )
    .optional()
    .or(z.literal('')),

  patientCity: z
    .string()
    .min(2, 'City is required')
    .optional()
    .or(z.literal('')),

  patientState: z
    .string()
    .min(2, 'State is required')
    .optional()
    .or(z.literal('')),

  patientZip: z
    .string()
    .min(5, 'ZIP code is required')
    .optional()
    .or(z.literal('')),

  insuranceMemberId: z.string().optional(),

  insurancePlanName: z
    .string()
    .min(1, 'Insurance Plan Name is required')
    .optional()
    .or(z.literal('')),

  patientAddress: z.string().optional(),

  // Hospital/Provider Information
  hospitalProviderName: z
    .string()
    .min(2, 'Hospital/Provider name is required')
    .max(100, 'Hospital/Provider name must be less than 100 characters')
    .nonempty('Hospital/Provider name is required')
    .optional()
    .or(z.literal('')),

  hospitalNpi: z.string().optional(),

  // Fixed phone number validation for hospital contact
  hospitalContactNumber: z
    .string()
    .refine(validatePhoneDigits, 'Phone number must be exactly 10 digits')
    .refine(
      (val) => PHONE_REGEX.test(val),
      'Phone number must be in format (XXX) XXX-XXXX'
    )
    .optional()
    .or(z.literal('')),

  hospitalEmail: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),

  renderingProviderNpi: z.string().optional(),

  hospitalAddress: z
    .string()
    .min(1, 'Street address is required')
    .optional()
    .or(z.literal('')),

  hospitalCity: z
    .string()
    .min(2, 'City is required')
    .optional()
    .or(z.literal('')),

  hospitalState: z
    .string()
    .min(2, 'State is required')
    .optional()
    .or(z.literal('')),

  hospitalZip: z
    .string()
    .min(5, 'ZIP code is required')
    .optional()
    .or(z.literal('')),

  // Billing Information
  // serviceDate: z.string().refine(
  //   (val) => {
  //     if (!val) return false;
  //     return new Date(val) <= new Date();
  //   },
  //   { message: 'Service date cannot be in the future' }
  // ),

  // totalAmount: z.coerce.number().refine(
  //   (val) => {
  //     if (!val) return false;
  //     return !isNaN(val) && val > 0;
  //   },
  //   { message: 'Total amount must be a positive number' }
  // ),

  claimReferenceNumber: z.string().optional(),

  // procedureCode: z
  //   .string()
  //   .refine((val) => val === undefined || val.trim().length > 0, {
  //     message: 'Procedure code is required if provided',
  //   })
  //   .optional(),

  // Supporting Documents
  supportingDocument: z
    .any()
    .refine(
      (files) => {
        if (!files || files.length === 0) return true; // Optional field
        const file = files[0];
        return file.size <= MAX_FILE_SIZE;
      },
      {
        message: 'File must be less than 10MB',
      }
    )
    .refine(
      (files) => {
        if (!files || files.length === 0) return true; // Optional field
        const file = files[0];
        const extension = file.name?.split('.').pop()?.toLowerCase();
        return ALLOWED_FILE_EXTENSIONS.includes(extension);
      },
      {
        message:
          'File type not allowed. Must be PDF, PNG, JPEG, JPG, DOC, or DOCX',
      }
    )
    .optional(),

  // Optional fields that were in original but not used in form
  patientSsn: z
    .string()
    .regex(SSN_REGEX, 'Please enter a valid SSN (XXX-XX-XXXX format)')
    .optional()
    .or(z.literal(''))
    .or(z.literal(null)),

  accountNumber: z
    .string()
    .min(5, 'Account number must be at least 5 characters')
    .max(20, 'Account number must be less than 20 characters')
    .regex(ACCOUNT_NUMBER_REGEX, 'Account number must be alphanumeric')
    .optional()
    .or(z.literal(''))
    .or(z.literal(null)),

  hospitalTaxId: z.string().optional().or(z.literal('')).or(z.literal(null)),

  // statementDate: z
  //   .string()
  //   .refine(
  //     (val) => {
  //       if (!val) return true; // Optional field
  //       const date = new Date(val);
  //       const today = new Date();
  //       return date <= today;
  //     },
  //     { message: 'Statement date cannot be in the future' }
  //   )
  //   .optional(),

  // Fixed phone number validation for billing questions
  billingQuestionsPhone: z
    .string()
    .refine(
      (val) => !val || validatePhoneDigits(val),
      'Phone number must be exactly 10 digits'
    )
    .refine(
      (val) => !val || PHONE_REGEX.test(val),
      'Phone number must be in format (XXX) XXX-XXXX'
    )
    .optional()
    .or(z.literal(''))
    .or(z.literal(null)),

  justification: z
    .string()
    .min(10, 'Justification must be at least 10 characters')
    .max(1000, 'Justification must be less than 1000 characters')
    .optional()
    .or(z.literal(''))
    .or(z.literal(null)),

  // negotiationDeadline: z
  //   .string()
  //   .refine(
  //     (val) => {
  //       if (!val) return true; // Optional field
  //       const deadline = new Date(val);
  //       const today = new Date();
  //       return deadline > today;
  //     },
  //     { message: 'Negotiation deadline must be in the future' }
  //   )
  //   .optional()
  //   .or(z.literal(''))
  //   .or(z.literal(null)),

  insuranceProviderName: z
    .string()
    .min(2, 'Insurance provider name must be at least 2 characters')
    .max(100, 'Insurance provider name must be less than 100 characters')
    .optional()
    .or(z.literal(''))
    .or(z.literal(null)),

  policyNumber: z
    .string()
    .min(1, 'Policy number is required')
    .max(20, 'Policy number must be less than 20 characters')
    .regex(POLICY_NUMBER_REGEX, 'Policy number must be alphanumeric')
    .optional()
    .or(z.literal(''))
    .or(z.literal(null)),

  // Fixed phone number validation for insurance phone
  insurancePhoneNumber: z
    .string()
    .refine(
      (val) => !val || validatePhoneDigits(val),
      'Phone number must be exactly 10 digits'
    )
    .refine(
      (val) => !val || PHONE_REGEX.test(val),
      'Phone number must be in format (XXX) XXX-XXXX'
    )
    .optional()
    .or(z.literal(''))
    .or(z.literal(null)),

  // Keep the old field name for compatibility
  selectedFile: z
    .any()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: 'File must be less than 10MB',
    })
    .refine(
      (file) =>
        !file ||
        ALLOWED_FILE_EXTENSIONS.includes(
          file.name?.split('.').pop()?.toLowerCase()
        ),
      {
        message:
          'File type not allowed. Must be PDF, PNG, JPEG, JPG, DOC, or DOCX',
      }
    )
    .optional(),

  // Additional fields for form submission
  groupNumber: z.string().optional(),
});

// --- Validation Helpers ---
export function validateField(fieldName, value) {
  try {
    formSchema.pick({ [fieldName]: true }).parse({ [fieldName]: value });
    return null;
  } catch (err) {
    if (err instanceof z.ZodError) {
      return err.errors[0]?.message || 'Invalid value';
    }
    return 'Invalid value';
  }
}

export function validateForm({ formData, setValidationErrors }) {
  const normalized = { ...formData };
  Object.keys(formSchema.shape).forEach((key) => {
    if (normalized[key] === undefined || normalized[key] === null) {
      normalized[key] = '';
    }
  });

  try {
    formSchema.parse(normalized);
    if (setValidationErrors) setValidationErrors({});
    return true;
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors = {};
      for (const e of err.errors) {
        const key = e.path?.[0];
        if (key && typeof key === 'string') {
          errors[key] = e.message;
        }
      }
      if (setValidationErrors) setValidationErrors(errors);
      return false;
    }
    setValidationErrors?.({ form: 'Invalid form' });
    return false;
  }
}

// --- Formatting Helpers ---
export function formatPhoneNumber(value) {
  const cleaned = value.replace(/\D/g, '');

  // Limit to 10 digits
  const limited = cleaned.slice(0, 10);

  const match = limited.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  // Handle partial formatting
  if (limited.length >= 6) {
    return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
  } else if (limited.length >= 3) {
    return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
  }

  return limited;
}

// Format SSN
export const formatSSN = (value) => {
  // Remove all non-digits and limit to 9 digits
  const cleaned = value.replace(/\D/g, '').slice(0, 9);
  let formatted = cleaned;
  if (cleaned.length > 5) {
    formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`;
  } else if (cleaned.length > 3) {
    formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }
  return formatted;
};

export function formatTaxId(value) {
  if (!value) return '';
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{7})$/);
  if (match) {
    return `${match[1]}-${match[2]}`;
  }
  return cleaned;
}

// --- Export constants for use in forms ---
export const VALIDATION_CONSTANTS = {
  MAX_FILE_SIZE,
  ALLOWED_FILE_EXTENSIONS,
  PHONE_REGEX,
  SSN_REGEX,
  ACCOUNT_NUMBER_REGEX,
  POLICY_NUMBER_REGEX,
  NAME_REGEX,
};
