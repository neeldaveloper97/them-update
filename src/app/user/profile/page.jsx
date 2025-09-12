'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '@/services/authService';
import {
  getUserById,
  selectAuth,
  updateUserById,
} from '@/store/slices/authSlice';
import ProfileHeader from '@/components/profile/ProfileHeader';
import PersonalInfo from '@/components/profile/PersonalInfo';
import PlanDetails from '@/components/profile/PlanDetails';
import SecuritySettings from '@/components/profile/SecuritySettings';
import TransactionHistory from '@/components/profile/TransactionHistory';
import PasswordModal from '@/components/profile/PasswordModal';
import { Icon } from '@iconify/react';
import GlobalLoader from '@/components/GlobalLoader';

const fmtDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(d);
};

const fmtMoney = (n) =>
  typeof n === 'number'
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(n)
    : '—';

const titleCase = (s) =>
  s ? s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '—';

const durationLabel = (d) => {
  if (!d) return '—';
  if (d === 'year') return '12 months';
  if (d === 'month') return '1 month';
  return titleCase(d);
};

const defaultForm = {
  user_id: '',
  email: '',
  firstName: '',
  lastName: '',
  acceptedTerms: false,
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  role: 'user',
};

const defaultPasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const passwordRules = {
  minLength: 6,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /\d/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
};

const validatePassword = (password) => {
  const errors = [];
  if (password.length < passwordRules.minLength) {
    errors.push(
      `Password must be at least ${passwordRules.minLength} characters long`
    );
  }
  if (!passwordRules.hasNumber.test(password)) {
    errors.push('Password must contain at least one number');
  }
  return errors;
};

const getChangedFields = (original, current) => {
  const changes = {};
  const fieldsToCompare = [
    'firstName',
    'lastName',
    'acceptedTerms',
    'phone',
    'addressLine1',
    'addressLine2',
    'city',
    'state',
    'zipCode',
    'country',
  ];
  fieldsToCompare.forEach((field) => {
    if (original[field] !== current[field]) {
      changes[field] = current[field];
    }
  });
  return changes;
};

const preventWhitespaceFields = [
  'firstName',
  'lastName',
  'acceptedTerms',
  'phone',
  'city',
  'state',
  'zipCode',
  'country',
];

const isEmpty = (obj) => Object.keys(obj).length === 0;

const Profile = () => {
  const [form, setForm] = useState(defaultForm);
  const [originalForm, setOriginalForm] = useState(defaultForm);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState(defaultPasswordForm);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [hasChanges, setHasChanges] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const dispatch = useDispatch();
  const { user } = useSelector(selectAuth);

  const fetchUser = useCallback(async () => {
    const storedUserId = sessionStorage.getItem('chatUserId');
    if (!storedUserId) return;
    setIsLoaded(true);
    await dispatch(getUserById(storedUserId));
    setIsLoaded(false);
  }, [dispatch]);

  useEffect(() => {
    if (user?.data) {
      const data = user.data;
      const authUser = data.user;

      const formData = {
        user_id: authUser?.id || data.id || '',
        email: authUser?.email || data.email || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        acceptedTerms: data.acceptedTerms || false,
        phone: data.phone || '',
        addressLine1: data.addressLine1 || '',
        addressLine2: data.addressLine2 || '',
        city: data.city || '',
        state: data.state || '',
        zipCode: data.zipCode || '',
        country: data.country || '',
        role: authUser?.role || data.role || 'user',
      };

      setForm(formData);
      setOriginalForm(formData);
      setHasChanges(false);
      setCurrentPage(1);
    }
  }, [user]);

  useEffect(() => {
    document.body.style.overflow = showPasswordModal ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showPasswordModal]);

  useEffect(() => {
    if (editMode) {
      const changedFields = getChangedFields(originalForm, form);
      setHasChanges(!isEmpty(changedFields));
    }
  }, [form, originalForm, editMode]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleSave = useCallback(async () => {
    const changedFields = getChangedFields(originalForm, form);

    if (isEmpty(changedFields)) {
      setEditMode(false);
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        user_id: form.user_id,
        ...changedFields,
      };

      const result = await dispatch(updateUserById(updateData));
      if (result.type === 'auth/updateUserById/fulfilled') {
        await fetchUser();
        setEditMode(false);
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setSaving(false);
    }
  }, [form, originalForm, dispatch, fetchUser]);

  const preventWhitespace = {
    onKeyDown: (e) => {
      if (e.key === ' ') e.preventDefault();
    },
    onPaste: (e) => {
      const paste = e.clipboardData.getData('text');
      if (/\s/.test(paste)) e.preventDefault();
    },
  };

  const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));

  const handleCancel = useCallback(() => {
    setForm(originalForm);
    setEditMode(false);
    setHasChanges(false);
  }, [originalForm]);

  const handlePasswordInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setPasswordForm((prev) => ({ ...prev, [name]: value }));

      if (passwordErrors.length > 0) {
        setPasswordErrors([]);
      }
    },
    [passwordErrors.length]
  );

  const togglePasswordVisibility = useCallback((field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  }, []);

  const resetPasswordModal = useCallback(() => {
    setPasswordForm(defaultPasswordForm);
    setPasswordErrors([]);
    setPasswordVisibility({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
    });
  }, []);

  const handlePasswordSubmit = useCallback(async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    const errors = [];

    if (!currentPassword.trim()) {
      errors.push('Current password is required');
    }

    if (!newPassword.trim()) {
      errors.push('New password is required');
    }

    if (!confirmPassword.trim()) {
      errors.push('Password confirmation is required');
    }

    if (newPassword) {
      const passwordValidationErrors = validatePassword(newPassword);
      errors.push(...passwordValidationErrors);
    }

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      errors.push('New password and confirmation do not match');
    }

    if (currentPassword && newPassword && currentPassword === newPassword) {
      errors.push('New password must be different from current password');
    }

    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await authService.changePassword({
        userId: form.user_id,
        oldPassword: currentPassword,
        newPassword,
        confirmPassword,
      });

      if (!res.success) {
        setPasswordErrors([res.message || 'Failed to change password']);
      } else {
        setShowPasswordModal(false);
        resetPasswordModal();
      }
    } catch (error) {
      setPasswordErrors(['Failed to change password. Please try again.']);
    } finally {
      setPasswordLoading(false);
    }
  }, [passwordForm, form.user_id, resetPasswordModal]);

  const handleClosePasswordModal = useCallback(() => {
    setShowPasswordModal(false);
    resetPasswordModal();
  }, [resetPasswordModal]);

  const renderPasswordInput = useCallback(
    (name, label, value) => (
      <div>
        <label className="block mb-1 text-muted-foreground text-sm">
          {label}
        </label>
        <div className="relative">
          <input
            type={passwordVisibility[name] ? 'text' : 'password'}
            name={name}
            value={value}
            onChange={handlePasswordInputChange}
            {...preventWhitespace}
            className="px-3 py-2 pr-10 border focus:border-transparent rounded focus:outline-none focus:ring-2 focus:ring-org-primary w-full text-org-primary"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility(name)}
            className="top-1/2 right-3 absolute focus:outline-none text-gray-500 hover:text-org-primary -translate-y-1/2 transform"
          >
            <Icon
              icon={passwordVisibility[name] ? 'mdi:eye-off' : 'mdi:eye'}
              className="w-5 h-5"
            />
          </button>
        </div>
      </div>
    ),
    [passwordVisibility, handlePasswordInputChange, togglePasswordVisibility]
  );

  const formFields = [
    ['firstName', 'First Name'],
    ['lastName', 'Last Name'],
    ['email', 'Email', false],
    ['phone', 'Phone'],
    ['addressLine1', 'Address Line 1'],
    ['addressLine2', 'Address Line 2'],
    ['city', 'City'],
    ['state', 'State'],
    ['zipCode', 'Zip Code'],
    ['country', 'Country'],
  ];

  const sub = user?.data?.subscriptionDetails || null;
  const hist = user?.data?.subscriptionHistory || [];

  const sortedHist = useMemo(() => {
    return [...hist].sort((a, b) => {
      const da = new Date(a.startDate || 0).getTime();
      const db = new Date(b.startDate || 0).getTime();
      return db - da;
    });
  }, [hist]);

  const totalPages = Math.max(1, Math.ceil(sortedHist.length / itemsPerPage));
  const visibleHistory = sortedHist.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const goToPage = (p) => setCurrentPage(Math.min(Math.max(1, p), totalPages));

  const used = sub?.usages?.amountUsed ?? 0;
  const total = sub?.usages?.maxLimit ?? 0;
  const remaining = Math.max(total - used, 0);
  const pct = total ? Math.round((used / total) * 100) : 0;

  const planName = sub?.plan?.planName || '—';
  const planDuration = durationLabel(sub?.plan?.duration);
  const startDate = fmtDate(sub?.subscription?.startDate);
  const endDate = fmtDate(sub?.subscription?.endDate);
  const subStatus = sub?.subscription?.status || 'inactive';

  const statusStyles = {
    paid: 'bg-[#33ACC1]/20 text-org-primary',
    pending: 'bg-orange-100 text-orange-800',
    failed: 'bg-red-100 text-red-700',
    succeeded: 'bg-green-100 text-green-800',
    processing: 'bg-blue-100 text-blue-800',
    active: 'bg-org-primary/10 text-org-primary',
    inactive: 'bg-gray-100 text-gray-600',
  };
  const badgeCls = (val) =>
    `block text-center w-[96px] leading-4 rounded-full px-2 py-1 text-[10px] font-medium ${
      statusStyles[(val || '').toLowerCase()] || 'bg-gray-100 text-gray-800'
    }`;

  return (
    <>
      <GlobalLoader />
      <section>
        <ProfileHeader
          firstName={form.firstName}
          lastName={form.lastName}
          email={form.email}
        />
        <div className="gap-4 lg:gap-6 grid grid-cols-1 lg:grid-cols-2 pt-6">
          <PersonalInfo
            form={form}
            originalForm={originalForm}
            editMode={editMode}
            saving={saving}
            isLoaded={isLoaded}
            hasChanges={hasChanges}
            handleCancel={handleCancel}
            handleSave={handleSave}
            setEditMode={setEditMode}
            handleChange={handleChange}
            preventWhitespaceFields={preventWhitespaceFields}
            preventWhitespace={preventWhitespace}
            formFields={formFields}
          />
          <PlanDetails
            planName={planName}
            planDuration={planDuration}
            used={used}
            remaining={remaining}
            total={total}
            pct={pct}
            sub={sub}
            startDate={startDate}
            endDate={endDate}
            subStatus={subStatus}
            titleCase={titleCase}
            clamp={clamp}
          />
        </div>
        <SecuritySettings setShowPasswordModal={setShowPasswordModal} />
        <TransactionHistory
          visibleHistory={visibleHistory}
          fmtDate={fmtDate}
          titleCase={titleCase}
          fmtMoney={fmtMoney}
          badgeCls={badgeCls}
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={goToPage}
        />
      </section>
      <PasswordModal
        show={showPasswordModal}
        handleClose={handleClosePasswordModal}
        renderPasswordInput={renderPasswordInput}
        passwordForm={passwordForm}
        passwordErrors={passwordErrors}
        passwordLoading={passwordLoading}
        handlePasswordSubmit={handlePasswordSubmit}
      />
    </>
  );
};

export default Profile;
