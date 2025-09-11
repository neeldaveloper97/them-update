import { deleteFileThunk, getImageThunk } from '@/store/slices/imageSlice';
import { getMedicalBillsThunk } from '@/store/slices/medOptimizeSlice';
import { submitNegotiation } from '@/store/slices/negotiationSlice';
import { getMedicalBillByIdThunk } from '@/store/slices/medOptimizeSlice';
import {
  formatPhoneNumber,
  formatSSN,
  formatTaxId,
  validateForm,
} from '@/utils/validationUtils';
import { toast } from 'react-toastify';

export const handleDeleteFile = async ({
  item,
  dispatch,
  fetchImages,
  setDeletingKey,
  setDeleteModal,
  setCurrentPage,
  images,
  userId,
}) => {
  if (!item) return;
  try {
    setDeletingKey(item.s3_key);
    await dispatch(deleteFileThunk(item.s3_key)).unwrap();

    window.location.reload();
  } catch (error) {
    console.error('Delete failed:', error);
  } finally {
    setDeletingKey(null);
  }
};

export const handleNegotiationStart = async ({
  id,
  dispatch,
  router,
  orgId,
  poa,
}) => {
  try {
    const response = await dispatch(submitNegotiation({ id, poa })).unwrap();
    if (response?.success) {
      sessionStorage.setItem('billId', id);
      router.push(`/them/dashboard/bill-Intake-Prep`);
    } else {
      console.warn('Negotiation API did not return success:', response);
    }
    return response;
  } catch (err) {
    console.error('Negotiation failed:', err);
    throw err;
  }
};

export const handleRetryBillProcessing = async ({
  billId,
  dispatch,
  userId,
}) => {
  try {
    toast.info('Retrying bill processing...');
    await dispatch(getMedicalBillsThunk(userId));
    toast.success('Bill reprocessed successfully');
  } catch (error) {
    toast.error('Retry failed. Please contact support.');
  }
};

export const handleDownloadFile = async (url, filename = 'file.png') => {
  toast.info('Downloading...');
  try {
    const response = await fetch(url, { mode: 'cors' });
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error('Failed to download:', err);
  }
};

export const handleDownloadAllFiles = async (images) => {
  toast.info('Preparing downloads...');
  for (let i = 0; i < images.length; i++) {
    const item = images[i];
    try {
      const response = await fetch(item.signed_url, { mode: 'cors' });
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', item.id || `file-${i + 1}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      await new Promise((res) => setTimeout(res, 500));
    } catch (error) {
      console.error(`Failed to download ${item.id}`, error);
    }
  }
  toast.success('All files downloaded (or attempted).');
};

export async function fetchMedicalBill({
  id,
  dispatch,
  setLoading,
  setError,
  setFormData,
  setInitialData,
  setIsReady,
  setValidationErrors,
  setTouchedFields,
}) {
  setLoading(true);
  setError(null);
  try {
    const data = await dispatch(getMedicalBillByIdThunk(id)).unwrap();
    setIsReady(Boolean(data.isReadyForNegotiation));
    const sanitizedData = { ...data };
    Object.entries(sanitizedData).forEach(([key, value]) => {
      if (value == null) return;

      if (
        [
          'hospitalContactNumber',
          'billingQuestionsPhone',
          'insurancePhoneNumber',
          'patientPhone',
        ].includes(key)
      ) {
        sanitizedData[key] = formatPhoneNumber(value);
      }

      if (key === 'patientSsn') {
        sanitizedData[key] = formatSSN(value);
      }

      if (key === 'hospitalTaxId') {
        sanitizedData[key] = formatTaxId(value);
      }
    });

    setFormData(sanitizedData);
    setInitialData(sanitizedData);
    validateForm({ formData: sanitizedData, setValidationErrors });
    const allTouched = {};
    Object.keys(sanitizedData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouchedFields(allTouched);
  } catch (err) {
    //setError('Failed to load medical bill details.');
  } finally {
    setLoading(false);
  }
}

export async function submitNegotiationHandler({
  id,
  dispatch,
  router,
  orgId,
  setLoading,
}) {
  try {
    await dispatch(submitNegotiation(id)).unwrap();
    sessionStorage.setItem('billId', id);
    router.push(`/them/dashboard/bill-Intake-Prep`);
  } catch (err) {
    console.error('Negotiation failed:', err);
  } finally {
    setLoading(false);
  }
}

export const updateMedicalBillHandler = async ({
  e,
  formData,
  setValidationErrors,
  validateForm,
  setLoading,
  setError,
  setSuccess,
  getChangedFields,
  initialData,
  selectedFile,
  dispatch,
  updateMedicalBillThunk,
  id,
  setNegotiationEnabled,
  setInitialData,
}) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setSuccess(false);

  try {
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      setLoading(false);
      setNegotiationEnabled(false);
      return false;
    }

    const changedFields = getChangedFields(initialData, formData);
    const payload = { ...changedFields, file: selectedFile };

    const response = await dispatch(
      updateMedicalBillThunk({ billId: id, data: payload })
    ).unwrap();

    //setNegotiationEnabled(true);
    setInitialData({ ...initialData, ...changedFields });
    setSuccess(true);
    return true;
  } catch (err) {
    // ❌ API failed
    setError(err.message || 'Failed to update medical bill');
    setNegotiationEnabled(false);
    return false;
  } finally {
    setLoading(false);
  }
};
