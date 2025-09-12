'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formFieldGroups } from '@/config/negotiationFields';
import { updateMedicalBillThunk } from '@/store/slices/medOptimizeSlice';
import {
  fetchMedicalBill,
  submitNegotiationHandler,
  updateMedicalBillHandler,
} from '@/utils/apiHandlers';
import {
  formatPhoneNumber,
  formatSSN,
  formatTaxId,
  validateField,
  validateForm,
} from '@/utils/validationUtils';
import { AlertCircle, FileText, Upload } from 'lucide-react';
import ErrorMessage from '@/components/checkUploadedBill/ErrorMessage';
import InfoFormSection from '@/components/checkUploadedBill/InfoFormSection';
import SupportingDocuments from '@/components/checkUploadedBill/SupportingDocuments';
import { BillingDetailsTable } from '@/components/checkUploadedBill/BillingDetailsTable';
import SaveWarningDialog from '@/components/checkUploadedBill/SaveWarningDialog';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth } from '@/store/slices/authSlice';
import GlobalLoader from '@/components/GlobalLoader';

export default function Component() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const id = params?.id;
  const orgId = params?.orgId;
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSaveWarning, setShowSaveWarning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [negotiationEnabled, setNegotiationEnabled] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [initialData, setInitialData] = useState({});
  const [activeTab, setActiveTab] = useState('patient-info');
  const [isUserSubscribed, setIsUserSubscribed] = useState(false);

  const { user } = useSelector(selectAuth);

  useEffect(() => {
    if (user?.data?.isSubscribed !== undefined) {
      setIsUserSubscribed(user.data.isSubscribed);
    }
  }, [user]);

  const handleCheckboxChange = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // API handler wrappers
  const handleStartNegotiation = async () => {
    await submitNegotiationHandler({ id, dispatch, router, orgId, setLoading });
  };

  const isRowSelected = (id) => selectedRows.includes(id);

  const billingData =
    formData.negotiation_line_items || formData.lineItems || [];

  useEffect(() => {
    if (id) {
      fetchMedicalBill({
        id,
        dispatch,
        setLoading,
        setError,
        setFormData,
        setInitialData,
        setIsReady,
        setValidationErrors,
        setTouchedFields,
      });
    } else {
      setLoading(false);
    }
  }, [id, dispatch]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let formattedValue = value;

    if (type === 'text' || type === 'email' || type === 'textarea') {
      formattedValue = formattedValue.replace(/\s{2,}/g, ' ');
    }

    if (
      name === 'hospitalContactNumber' ||
      name === 'billingQuestionsPhone' ||
      name === 'insurancePhoneNumber' ||
      name === 'patientPhone'
    ) {
      formattedValue = formatPhoneNumber(formattedValue);
    } else if (name === 'patientSsn') {
      formattedValue = formatSSN(formattedValue);
    } else if (name === 'hospitalTaxId') {
      formattedValue = formatTaxId(formattedValue);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };
  const hasFormChanged = () => {
    const current = { ...formData };
    const original = { ...initialData };

    delete current.file;
    delete original.file;

    const formIsChanged =
      JSON.stringify(current) !== JSON.stringify(original) ||
      selectedFile !== null;

    return formIsChanged;
  };

  const getChangedFields = (original, current) => {
    const changed = {};

    for (const key in current) {
      if (key === 'file') continue; // Skip 'file' key, handled separately

      const originalVal = original[key] ?? '';
      const currentVal = current[key] ?? '';

      if (originalVal !== currentVal) {
        changed[key] = currentVal;
      }
    }

    return changed;
  };

  const handleFieldBlur = (fieldName) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));

    const currentValue = formData[fieldName];
    if (currentValue && typeof currentValue === 'string') {
      const cleanedValue = currentValue.replace(/\s+/g, ' ').trim();
      if (cleanedValue !== currentValue) {
        setFormData((prev) => ({ ...prev, [fieldName]: cleanedValue }));
      }
    }

    const error = validateField(fieldName, formData[fieldName]);
    setValidationErrors((prev) => {
      const updated = { ...prev };
      if (error) {
        updated[fieldName] = error;
      } else {
        delete updated[fieldName];
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    const success = await updateMedicalBillHandler({
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
      router,
    });

    if (!success) {
      // Optionally revert unsaved changes
      setNegotiationEnabled(false);
    }
    router.push(`/${orgId}/dashboard/bill-upload`);
  };

  const getFileIcon = (file) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return Upload;
    if (ext === 'pdf') return FileText;
    if (['doc', 'docx'].includes(ext)) return FileText;
    return FileText;
  };
  const getExtension = (input) => {
    if (typeof input === 'string') {
      return input.split('?')[0].split('.').pop()?.toLowerCase();
    }
    if (input?.name) {
      return input.name.split('.').pop()?.toLowerCase();
    }
    return '';
  };

  const fieldProps = (name, type = 'text') => {
    let value = formData[name] || '';

    if (type === 'date' && value) {
      value = value.split('T')[0];
    }

    return {
      name,
      value,
      type,
      onChange: handleChange,
      onBlur: () => handleFieldBlur(name),
      className: validationErrors[name]
        ? 'border-red-500 focus:border-red-500'
        : '',
    };
  };

  const { patientFields, hospitalFields } = formFieldGroups;
  // Render fields utility for InfoFormSection
  const renderFields = (fields) => {
    const groupedFields = [];
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if (
        i + 2 < fields.length &&
        ((field.name === 'patientCity' &&
          fields[i + 1].name === 'patientState' &&
          fields[i + 2].name === 'patientZip') ||
          (field.name === 'hospitalCity' &&
            fields[i + 1].name === 'hospitalState' &&
            fields[i + 2].name === 'hospitalZip'))
      ) {
        groupedFields.push(
          <div
            key={`${field.name}-group`}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[field, fields[i + 1], fields[i + 2]].map(
              ({ name, label, type, required }) => (
                <div className="space-y-2" key={name}>
                  <Label htmlFor={name}>
                    {label}
                    {required && ' *'}
                  </Label>
                  <Input
                    id={name}
                    {...fieldProps(name, type)}
                    placeholder={label}
                  />
                  <ErrorMessage error={validationErrors[name]} />
                </div>
              )
            )}
          </div>
        );
        i += 2;
      } else {
        groupedFields.push(
          <div className="space-y-2" key={field.name}>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && ' *'}
            </Label>
            <Input
              id={field.name}
              {...fieldProps(field.name, field.type)}
              placeholder={field.label}
            />
            <ErrorMessage error={validationErrors[field.name]} />
          </div>
        );
      }
    }
    return groupedFields;
  };
  const hasChanges = hasFormChanged();
  const canNegotiate = (isReady && !hasChanges) || negotiationEnabled;

  // if (loading)
  //   return (
  //     <div className="z-10 absolute inset-0 flex flex-col justify-center items-center bg-white/80 rounded-xl">
  //       <div className="border-4 border-gray-300 border-t-neutral-800 rounded-full w-10 h-10 animate-spin"></div>
  //       <p className="mt-2 text-sm text-gray-600">Loading...</p>
  //     </div>
  //   );

  return (
    <>
      <GlobalLoader />
      <div className="min-h-screen">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 mb-4 p-4 border border-red-200 rounded-md">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          <Tabs
            defaultValue="patient-info"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4 sm:space-y-6"
          >
            <TabsList className="grid grid-cols-1 sm:grid-cols-2 bg-gray-200 border-2 w-full h-auto sm:h-10">
              <TabsTrigger value="patient-info" className="text-sm">
                Patient Information
              </TabsTrigger>
              <TabsTrigger value="billing-details" className="text-sm">
                Billing Details
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="patient-info"
              className="space-y-4 sm:space-y-6"
            >
              <div className="gap-4 sm:gap-6 grid grid-cols-1 xl:grid-cols-2">
                <InfoFormSection
                  title="Patient Information"
                  description="Enter patient details and contact information"
                  fields={patientFields}
                  renderFields={renderFields}
                />
                <InfoFormSection
                  title="Hospital/Provider Information"
                  description="Healthcare provider and facility details"
                  fields={hospitalFields}
                  renderFields={renderFields}
                />
                <SupportingDocuments
                  formData={formData}
                  selectedFile={selectedFile}
                  validationErrors={validationErrors}
                  getFileIcon={getFileIcon}
                  getExtension={getExtension}
                />
              </div>
            </TabsContent>

            <TabsContent value="billing-details" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-org-primary-dark bg-primary-light px-4 py-3 rounded-lg border">
                <div className="text-lg font-bold">
                  Total Billed Amount: ${formData['totalAmount'] || 0}
                </div>

                {/* {!isReady && ( */}
                {/* <Button
                type="button"
                variant="outline"
                disabled={loading}
                className="flex items-center gap-2"
                onClick={async () => {
                  const formChanged = hasFormChanged();

                  if (formChanged) {
                    setShowSaveWarning(false); // Reset it first
                    setTimeout(() => setShowSaveWarning(true), 0); // Trigger it again
                    return;
                  }

                  if (canNegotiate) {
                    try {
                      if (isUserSubscribed) {
                        await handleStartNegotiation();
                      } else {
                        router.push(`/${orgId}/dashboard/plans`);
                      }
                    } catch (err) {
                      console.error('Negotiation API failed', err);
                    }
                  } else {
                    setShowSaveWarning(false); // Reset before re-trigger
                    setTimeout(() => setShowSaveWarning(true), 0);
                  }
                }}
              >
                {loading ? (
                  <>
                    <div className="border-2 border-t-transparent border-gray-700 rounded-full w-4 h-4 animate-spin" />
                    Starting...
                  </>
                ) : (
                  'Negotiate'
                )}
              </Button> */}
                {/* )} */}
              </div>

              <Card className="shadow-none p-0">
                <CardContent className="!p-0">
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
                    <BillingDetailsTable billingData={billingData} />
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden divide-y divide-gray-200">
                    <div className="xl:hidden flex items-center px-4 py-2 gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setSelectedRows(
                            checked ? billingData.map((item) => item.id) : []
                          );
                        }}
                        checked={
                          selectedRows.length > 0 &&
                          selectedRows.length === billingData.length
                        }
                      />
                      <span className="text-sm text-gray-700">Select All</span>
                    </div>

                    {billingData.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="hover:bg-gray-50 p-4 border-b"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs font-medium text-gray-700">
                            Case: {item.negotiation_case_id || `#${index + 1}`}
                          </div>
                          <input
                            type="checkbox"
                            checked={isRowSelected(item.id)}
                            onChange={() => handleCheckboxChange(item.id)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>

                        <div className="flex flex-col space-y-3">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                            <div className="space-y-1">
                              <p className="font-semibold text-sm">
                                {item.service_provided}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>CPT:</span>
                                <Badge variant="outline" className="text-xs">
                                  {item.cpt_code ||
                                    item.procedure_code ||
                                    'N/A'}
                                </Badge>
                                <span>
                                  Qty: {item.quantity_amount}{' '}
                                  {item.quantity_unit}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 sm:mt-0">
                              <Badge
                                variant={
                                  item.location === 'Outpatient'
                                    ? 'default'
                                    : 'secondary'
                                }
                                className="text-xs"
                              >
                                {item.location || 'Unknown'}
                              </Badge>
                            </div>
                          </div>

                          <div className="text-sm text-gray-600">
                            <p>
                              Provider:{' '}
                              <span className="font-medium">
                                {item.provider_name || '—'}
                              </span>
                            </p>
                            <p>
                              Date of Service:{' '}
                              <span className="font-medium">
                                {item.date_of_service?.slice(0, 10) || '—'}
                              </span>
                            </p>
                          </div>

                          <div className="gap-4 grid grid-cols-2 sm:grid-cols-4 text-sm">
                            <div>
                              <p className="text-gray-600">Billed</p>
                              <p className="font-medium">
                                ${item.billed_charges?.toFixed(2) || '0.00'}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Insurance</p>
                              <p className="font-medium text-green-600">
                                ${item.insurance_payment?.toFixed(2) || '0.00'}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Adjustment</p>
                              <p className="font-medium text-blue-600">
                                ${item.adjustment?.toFixed(2) || '0.00'}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Due</p>
                              <p
                                className={`font-medium ${item.due_from_patient > 0 ? 'text-red-600' : 'text-gray-500'}`}
                              >
                                ${item.due_from_patient?.toFixed(2) || '0.00'}
                              </p>
                            </div>
                          </div>

                          <div className="text-sm">
                            <p className="text-gray-600">
                              Status:
                              <span
                                className={`ml-1 font-semibold capitalize ${
                                  item.clinical_status === 'error'
                                    ? 'text-red-600'
                                    : item.clinical_status === 'overbilled'
                                      ? 'text-yellow-600'
                                      : 'text-gray-700'
                                }`}
                              >
                                {item.clinical_status || '—'}
                              </span>
                            </p>
                            {item.projected_savings != null && (
                              <p className="text-gray-600">
                                Projected Savings:{' '}
                                <span className="font-medium text-green-700">
                                  ${item.projected_savings}
                                </span>
                              </p>
                            )}
                            {item.clinical_notes && (
                              <p className="mt-1 text-gray-600 italic text-xs">
                                "{item.clinical_notes}"
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <SaveWarningDialog
                    open={showSaveWarning}
                    onOpenChange={setShowSaveWarning}
                    isReady={isReady}
                    hasChanges={hasChanges}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {activeTab === 'patient-info' && (
            <div className="flex justify-start gap-4">
              <Button
                type="submit"
                disabled={
                  loading || !hasFormChanged() || (isReady && !hasFormChanged())
                }
                className={`w-full sm:w-auto flex items-center gap-2 ${
                  !hasFormChanged() || (isReady && !hasFormChanged()) || loading
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                {loading ? (
                  <>
                    <div className="border-2 border-t-transparent border-white rounded-full w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
