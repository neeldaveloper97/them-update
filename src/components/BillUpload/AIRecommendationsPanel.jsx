'use client';
import {
  AlertTriangle,
  Info,
  CheckCircle2,
  FileText,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

export default function AIRecommendationsPanel({
  bill,
  orgId,
  visibleMedData,
}) {
  if (!bill || bill?.bill_status === 'parsing') {
    return (
      <div className="bg-white shadow-1 p-3.5 lg:p-7 rounded-xl h-full flex flex-col">
        <h2 className="font-bold text-org-primary-dark text-xl lg:text-2xl mb-5">
          AI Analysis & Recommendations
        </h2>
        <div className="flex-1 flex items-center justify-center">
          {visibleMedData && visibleMedData?.length > 0 ? (
            <p className="text-gray-500 text-center">
              Your latest uploaded bill is being processed. In the meantime, you
              can view the AI analyses of your previous uploads from the list.
              The new analysis will appear here automatically once it’s ready.
            </p>
          ) : (
            <p className="text-gray-500 text-center">
              No bills available. Upload a medical bill to get started.
            </p>
          )}
        </div>
      </div>
    );
  }

  const lineItems = bill?.medoptimize_negotiation_line_items || [];

  const errorItems = lineItems.filter(
    (item) => item.clinical_status === 'error'
  );
  const missingCptCodes = lineItems.filter(
    (item) => item.cpt_code === 'UNKNOWN'
  );
  const isBlank = (v) =>
    v === null || v === undefined || String(v).trim() === '';
  const missingPatientFields = [];
  if (isBlank(bill?.patient_name)) missingPatientFields.push('Patient Name');
  if (isBlank(bill?.patient_email)) missingPatientFields.push('Patient Email');
  const hasMissingPatient = missingPatientFields?.length > 0;

  return (
    <>
      <div className="bg-white shadow-1 p-3.5 lg:p-7 rounded-xl h-full flex flex-col">
        <div className="mb-5 flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="font-bold text-org-primary-dark text-xl lg:text-2xl">
              AI Analysis & Recommendations
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {bill?.file_name || bill?.id}
            </p>
          </div>

          <Button className="bg-org-primary" asChild>
            <Link
              href={`/them/dashboard/check-uploaded-bill/${bill?.id}`}
              aria-label="Open full bill view"
            >
              <ExternalLink className="w-4 h-4" />
              View bill details
            </Link>
          </Button>
        </div>

        <div className="flex-1 space-y-6">
          {hasMissingPatient && (
            <div className="space-y-4">
              <h3 className="font-semibold text-amber-700 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Missing Patient Details
              </h3>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-900">
                  We couldn’t find the following required fields:
                </p>
                <ul className="list-disc ml-5 mt-2 text-sm text-amber-900">
                  {missingPatientFields.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {missingCptCodes.length !== 0 ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Issues Detected
              </h3>

              <div className="bg-red-50 border border-red-200 rounded-lg p-1.5">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800">
                        Missing CPT Codes
                      </p>
                      <p className="text-sm text-red-700 mt-1">
                        {missingCptCodes.length} out of {lineItems.length} line
                        items are missing proper CPT codes, which may lead to
                        claim denials or processing delays.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800">
                        Parsing Errors
                      </p>
                      <p className="text-sm text-red-700 mt-1">
                        {errorItems.length} line items have clinical status
                        errors that need attention.
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        The provider is currently reviewing this bill. Once all
                        issues are resolved, we’ll notify you immediately.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            !hasMissingPatient && (
              <div className="space-y-4">
                <h3 className="font-semibold text-green-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Ready for Negotiation
                </h3>

                <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                  <p className="text-sm text-green-800">
                    All line items have valid CPT codes and no blocking issues
                    were detected. This bill is ready to proceed with
                    negotiation.
                  </p>
                </div>
              </div>
            )
          )}

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Service Details ({lineItems.length} items)
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto [direction:rtl] [scrollbar-gutter:stable]">
              <div className="[direction:ltr] space-y-2 px-2">
                {lineItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-org-primary-light-50 rounded-lg p-3"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {item.service_provided}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          CPT: {item.cpt_code}
                          {item.clinical_status === 'error' && (
                            <span className="text-red-500 ml-2 inline-flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Error
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 text-sm">
                          ${(item.billed_charges || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.quantity_amount} {item.quantity_unit}
                        </p>
                      </div>
                    </div>

                    {item.clinical_notes && (
                      <p className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                        {item.clinical_notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
