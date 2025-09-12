'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, X, AlertCircle, FileText } from 'lucide-react';
import {
  getNegotiationCaseById,
  submitNegotiation,
  updateNegotiation,
} from '@/store/slices/negotiationSlice';
import {
  formSchema,
  validateField,
  validateForm,
  formatPhoneNumber,
  formatSSN,
  formatTaxId,
  VALIDATION_CONSTANTS,
} from '@/utils/validationUtils';
import { formFieldGroups } from '@/config/negotiationFields';

import { getMedicalBillByIdThunk } from '@/store/slices/medOptimizeSlice';
import SupportingDocuments from '@/components/checkUploadedBill/SupportingDocuments';
import GlobalLoader from '@/components/GlobalLoader';

export default function Component() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const id = params?.id;
  const orgId = params?.orgId;
  const isEditMode = Boolean(id);
  const mode = searchParams?.get('mode');
  const isViewMode = mode === 'view';

  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(!!isEditMode);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [discountType, setDiscountType] = useState('Percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [isFormDirty, setIsFormDirty] = useState(false);

  const [validationErrors, setValidationErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleCheckboxChange = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isRowSelected = (id) => selectedRows.includes(id);
  const billingData =
    formData.medoptimize_negotiation_line_items || formData.lineItems || [];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const data = await dispatch(getNegotiationCaseById(id)).unwrap();
        const optionalFields = [
          'patientSsn',
          'accountNumber',
          'hospitalTaxId',
          //   'statementDate',
          'billingQuestionsPhone',
          'justification',
          //   'negotiationDeadline',
          'insuranceProviderName',
          'policyNumber',
          'insurancePhoneNumber',
        ];
        const sanitizedData = { ...data };
        optionalFields.forEach((field) => {
          if (
            sanitizedData[field] === null ||
            sanitizedData[field] === undefined
          ) {
            sanitizedData[field] = '';
          }
        });
        const syncedData = {
          ...sanitizedData,
          requested_discount_type:
            sanitizedData.requested_discount_type || 'Percentage',
          requested_discount_value:
            sanitizedData.requested_discount_value || '',
        };
        setFormData(syncedData);
        setOriginalData(syncedData);
        setDiscountType(syncedData.requested_discount_type);
        setDiscountValue(syncedData.requested_discount_value);
        setIsFormDirty(false);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    if (isEditMode) fetchData();
    else setLoading(false);
  }, [id, isEditMode]);

  const getChangedFields = (newData, oldData) => {
    const changed = {};
    for (const key in newData) {
      if (newData[key] !== oldData[key]) {
        changed[key] = newData[key];
      }
    }
    return changed;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let formattedValue = value;

    // For text fields, only remove multiple consecutive spaces during typing
    if (type === 'text' || type === 'email' || type === 'textarea') {
      // Replace multiple spaces with single space, but allow normal spacing
      formattedValue = formattedValue.replace(/\s{2,}/g, ' ');
    }

    // Handle special formatting for phone numbers
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

    setFormData((prev) => {
      const updated = { ...prev, [name]: formattedValue };
      const changed = getChangedFields(updated, originalData);
      setIsFormDirty(Object.keys(changed).length > 0);
      return updated;
    });

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFieldBlur = (fieldName) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));

    const currentValue = formData[fieldName];
    if (currentValue && typeof currentValue === 'string') {
      const cleanedValue = currentValue.replace(/\s+/g, ' ').trim();

      if (cleanedValue !== currentValue) {
        setFormData((prev) => {
          const updated = { ...prev, [fieldName]: cleanedValue };
          const changed = getChangedFields(updated, originalData);
          setIsFormDirty(Object.keys(changed).length > 0);
          return updated;
        });
      }
    }

    const valueToValidate = formData[fieldName];
    const error = validateField(fieldName, valueToValidate);
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
    e.preventDefault();

    const isValid = validateForm({
      formData,
      setValidationErrors,
    });
    if (!isValid) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let payload;

      if (isEditMode) {
        const changedFields = getChangedFields(formData, originalData);
        const hasFile = !!selectedFile;
        const hasFieldChanges = Object.keys(changedFields).length > 0;

        if (!hasFile && !hasFieldChanges) {
          setError('No changes detected.');
          setLoading(false);
          return;
        }

        if (hasFile) {
          payload = new FormData();
          Object.entries(changedFields).forEach(([key, value]) => {
            payload.append(key, value);
          });
          payload.append('file', selectedFile);
        } else {
          payload = changedFields;
        }

        await dispatch(
          updateNegotiation({ caseId: id, negotiationData: payload })
        ).unwrap();
      } else {
        if (selectedFile) {
          payload = new FormData();
          Object.entries(formData).forEach(([key, value]) => {
            payload.append(key, value);
          });
          payload.append('file', selectedFile);
        } else {
          payload = { ...formData };
        }

        await dispatch(submitNegotiation(payload)).unwrap();
      }

      setSuccess(true);
      router.push(`/${orgId || 'them'}/dashboard/bill-Intake-Prep`);
    } catch (err) {
      console.error(err);
      setError('Failed to submit negotiation case.');
    } finally {
      setLoading(false);
    }
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

    const baseProps = {
      name,
      value,
      type,
      onBlur: () => handleFieldBlur(name),
      className: validationErrors[name]
        ? 'border-red-500 focus:border-red-500'
        : '',
    };

    if (isViewMode) {
      return {
        ...baseProps,
        readOnly: true,
        disabled: true,
      };
    } else {
      return {
        ...baseProps,
        onChange: handleChange,
      };
    }
  };

  const ErrorMessage = ({ error }) => {
    if (!error) return null;
    return (
      <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>{error}</span>
      </div>
    );
  };

  // const handleFieldBlur = (fieldName) => {
  //   setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
  //   const error = validateField(fieldName, formData[fieldName]);
  //   setValidationErrors((prev) => {
  //     const updated = { ...prev };
  //     if (error) {
  //       updated[fieldName] = error;
  //     } else {
  //       delete updated[fieldName];
  //     }
  //     return updated;
  //   });
  // };

  const { patientFields, hospitalFields } = formFieldGroups;

  // const renderFields = (fields) =>
  //   fields.map(({ name, label, type, required }) => {
  //     if (name === 'insurancePlanName') {
  //       return (
  //         <div className="space-y-2" key={name}>
  //           <Label htmlFor={name}>
  //             {label}
  //             {required && ' *'}
  //           </Label>
  //           <select
  //             id={name}
  //             name={name}
  //             value={formData[name] || ''}
  //             onChange={handleChange}
  //             onBlur={() => handleFieldBlur(name)}
  //             disabled={isViewMode}
  //             className={`px-3 py-2 border rounded-md w-full text-sm ${validationErrors[name] ? 'border-red-500 focus:border-red-500' : 'border-gray-300'}`}
  //           >
  //             <option value="">Select a plan</option>
  //             <option value="Blue Cross">Blue Cross</option>
  //             <option value="Aetna">Aetna</option>
  //             <option value="United Healthcare">United Healthcare</option>
  //             <option value="Kaiser Permanente">Kaiser Permanente</option>
  //             <option value="Cigna">Cigna</option>
  //           </select>
  //           <ErrorMessage error={validationErrors[name]} />
  //         </div>
  //       );
  //     }
  //     return (
  //       <div className="space-y-2" key={name}>
  //         <Label htmlFor={name}>
  //           {label}
  //           {required && ' *'}
  //         </Label>
  //         <Input id={name} {...fieldProps(name, type)} placeholder={label} />
  //         <ErrorMessage error={validationErrors[name]} />
  //       </div>
  //     );
  //   });

  const renderFields = (fields) => {
    const groupedFields = [];

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];

      // Check for city-state-zip group
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
                  {/* <ErrorMessage error={validationErrors[name]} /> */}
                </div>
              )
            )}
          </div>
        );
        i += 2; // Skip the next two since we already handled them
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
            {/* <ErrorMessage error={validationErrors[field.name]} /> */}
          </div>
        );
      }
    }

    return groupedFields;
  };

  // if (loading)
  //   return <div className="p-8 text-gray-500 text-center">Loading...</div>;
  if (error && !validationErrors)
    return <div className="p-8 text-red-500 text-center">{error}</div>;
  if (success)
    return (
      <div className="p-8 text-green-600 text-center">
        Negotiation case {isEditMode ? 'updated' : 'created'} successfully!
      </div>
    );

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

          <Tabs defaultValue="patient-info" className="space-y-4 sm:space-y-6">
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
                <Card className="shadow-none">
                  <CardHeader>
                    <CardTitle>Patient Information</CardTitle>
                    <CardDescription>
                      Enter patient details and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {renderFields(patientFields)}
                  </CardContent>
                </Card>

                <Card className="shadow-none">
                  <CardHeader>
                    <CardTitle>Hospital/Provider Information</CardTitle>
                    <CardDescription>
                      Healthcare provider and facility details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {renderFields(hospitalFields)}
                  </CardContent>
                </Card>
                {/* <Card className="shadow-none">
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {renderFields(billingFields)}
                </CardContent>
              </Card> */}
                <SupportingDocuments
                  formData={formData}
                  selectedFile={selectedFile}
                  validationErrors={validationErrors}
                  getFileIcon={getFileIcon}
                  getExtension={getExtension}
                />
              </div>
            </TabsContent>

            {/* Billing Details Tab can remain as is or be updated if needed */}
            <TabsContent value="billing-details" className="space-y-6">
              <div className="text-lg font-bold text-org-primary-dark bg-primary-light px-4 py-2 rounded-lg border">
                Total Billed Amount: ${formData['totalAmount'] || 0}
              </div>
              <Card className="shadow-none p-0">
                <CardContent className="!p-0">
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
                    <div className="max-w-[calc(100vw - 4.1rem)] md:max-w-[calc(100vw-20rem)] overflow-x-auto w-full">
                      <table className="min-w-xl w-full table-auto">
                        <thead>
                          <tr>
                            <th className="p-2 text-left">Service Date</th>
                            {/* <th className="p-2 text-left">Date of Service</th> */}
                            <th className="p-2 text-left">Procedure Code</th>
                            {/* <th className="p-2 text-left">Provider Name</th> */}
                            <th className="p-2 text-left">Service Provided</th>
                            {/* <th className="hidden lg:table-cell p-2 text-left">
                            Location
                          </th> */}
                            <th className="p-2 text-left">Billed Charges</th>
                            <th className="hidden md:table-cell p-2 text-left">
                              Insurance Payment
                            </th>
                            <th className="hidden md:table-cell p-2 text-left">
                              Adjustment
                            </th>
                            <th className="p-2 text-left">Due From Patient</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {billingData.map((item, index) => (
                            <tr
                              key={item.id || index}
                              className="bg-white hover:bg-gray-50"
                            >
                              {/* <td className="p-2">{item.id || ''}</td> */}
                              <td className="p-2">
                                {item.dateOfService?.slice(0, 10) ||
                                  item.serviceDate}
                              </td>
                              <td className="p-2">
                                <Badge variant="outline" className="text-xs">
                                  {item.procedureCode || item.cpt_code}
                                </Badge>
                              </td>
                              {/* <td className="p-2">{item.provider_name}</td> */}
                              <td className="p-2">{item.providerName}</td>
                              {/* <td className="hidden lg:table-cell p-2">
                              <Badge
                                variant={
                                  item.location === 'Outpatient'
                                    ? 'default'
                                    : 'secondary'
                                }
                                className="text-xs"
                              >
                                {item.location}
                              </Badge>
                            </td> */}
                              <td className="p-2 font-medium">
                                ${item.billed_charges?.toFixed(2) || '0.00'}
                              </td>
                              <td className="hidden md:table-cell p-2 text-green-600">
                                ${item.insurance_payment?.toFixed(2) || '0.00'}
                              </td>
                              <td className="hidden md:table-cell p-2 text-blue-600">
                                ${item.adjustment?.toFixed(2) || '0.00'}
                              </td>
                              <td
                                className={`p-3 ${item.due_from_patient > 0 ? 'text-red-600 font-medium' : 'text-gray-500'}`}
                              >
                                ${item.due_from_patient?.toFixed(2) || '0.00'}
                              </td>
                              <td className="p-2">
                                {selectedRows.length === 1 &&
                                  selectedRows[0] === item.id && (
                                    <NegotiationDialog
                                      item={item}
                                      selectedItems={[item]}
                                      billId={id}
                                    />
                                  )}
                                {selectedRows.length > 1 &&
                                  selectedRows.includes(item.id) && (
                                    <NegotiationDialog
                                      item={null}
                                      selectedItems={billingData.filter((i) =>
                                        selectedRows.includes(i.id)
                                      )}
                                      billId={id}
                                    />
                                  )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
                          <div className="p-2">
                            {selectedRows.length === 1 &&
                              selectedRows[0] === item.id && (
                                <div className="mt-4 flex justify-start">
                                  <NegotiationDialog
                                    item={item}
                                    selectedItems={[item]}
                                    billId={id}
                                  />
                                </div>
                              )}

                            {selectedRows.length > 1 &&
                              selectedRows.includes(item.id) && (
                                <div className="mt-4 flex justify-start">
                                  <NegotiationDialog
                                    item={null}
                                    selectedItems={billingData.filter((i) =>
                                      selectedRows.includes(i.id)
                                    )}
                                    billId={id}
                                  />
                                </div>
                              )}
                          </div>
                          {/* Removed inline NegotiationDialog */}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Global NegotiationDialog Button */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          {/* Only show submit button if not in view mode */}
          {!isViewMode && (
            <div className="flex justify-end gap-4 mt-8">
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={!isFormDirty}
              >
                {isEditMode
                  ? 'Update Negotiation Case'
                  : 'Create Negotiation Case'}
              </Button>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
