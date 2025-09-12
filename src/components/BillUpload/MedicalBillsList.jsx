'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Hourglass, Loader2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '../ui/tooltip';
import { getUserFacingLabel } from '@/constants/getUserFacingLabel';
import { useMemo, useState, useEffect, useRef } from 'react';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';
import PaginationBar from '../Pagination';

const STATUS_STYLES = {
  uploaded: 'bg-blue-100 text-blue-700',
  parsing: 'bg-blue-100 text-blue-700',
  parse_failed: 'bg-red-200 text-red-700',
  waiting_user_input: 'bg-yellow-100 text-yellow-700',
  user_input_received: 'bg-amber-100 text-amber-700',
  waiting_provider_input: 'bg-amber-100 text-amber-700',
  provider_input_received: 'bg-amber-100 text-amber-700',
  ready_for_negotiation: 'bg-green-100 text-green-700',
  negotiation_initiated: 'bg-green-200 text-green-800',
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '$0';
  try {
    return `$${Number(amount).toLocaleString()}`;
  } catch {
    return `$${amount}`;
  }
};

const getPageNumbers = (current, total, maxButtons = 5) => {
  const half = Math.floor(maxButtons / 2);
  let start = Math.max(1, current - half);
  let end = Math.min(total, current + half);

  if (current <= half) end = Math.min(total, maxButtons);
  if (current + half >= total) start = Math.max(1, total - maxButtons + 1);

  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return { pages, start, end };
};

export default function MedicalBillsList({
  visibleMedData,
  currentMedPage,
  totalMedPages,
  setCurrentMedPage,
  orgId,
  isUserSubscribed,
  handleStartNegotiation,
  retryBillProcessing,
  handleReportIssue,
  router,
  negotiationLoading = false,
  onSelectBill = visibleMedData[0],
}) {
  const { pages } = useMemo(
    () => getPageNumbers(currentMedPage, totalMedPages),
    [currentMedPage, totalMedPages]
  );

  const [highlightedBillId, setHighlightedBillId] = useState(null);
  const [selectedBillId, setSelectedBillId] = useState(null);

  const lastHighlightedRef = useRef(null);
  const userPickedRef = useRef(false);
  const prevStatusMapRef = useRef(new Map());

  const handleSelect = (bill) => {
    userPickedRef.current = true;
    setSelectedBillId(bill.id);
    onSelectBill?.(bill);
  };

  useEffect(() => {
    if (!visibleMedData?.length) return;
    if (userPickedRef.current) return;

    const first = visibleMedData[0];
    onSelectBill?.(first);
    setSelectedBillId(first.id);
    setHighlightedBillId(first.id);
    lastHighlightedRef.current = first.id;
  }, [visibleMedData, onSelectBill]);

  useEffect(() => {
    userPickedRef.current = false;
  }, [currentMedPage]);

  useEffect(() => {
    if (!visibleMedData?.length) return;

    const prevMap = prevStatusMapRef.current;
    let transitionedBill = null;

    for (const item of visibleMedData) {
      const currentStatus = item?.bill_status ?? 'unknown';
      const prevStatus = prevMap.get(item.id);
      if (
        prevStatus &&
        prevStatus === 'parsing' &&
        currentStatus !== 'parsing'
      ) {
        transitionedBill = item;
        break;
      }
    }

    const nextMap = new Map();
    for (const item of visibleMedData) {
      nextMap.set(item.id, item?.bill_status ?? 'unknown');
    }
    prevStatusMapRef.current = nextMap;

    if (transitionedBill) {
      setHighlightedBillId(transitionedBill.id);
      setSelectedBillId(transitionedBill.id);
      onSelectBill?.(transitionedBill);
    }
  }, [visibleMedData, onSelectBill]);

  useEffect(() => {
    if (!highlightedBillId) return;
    const t = setTimeout(() => setHighlightedBillId(null), 3000);
    return () => clearTimeout(t);
  }, [highlightedBillId]);

  return (
    <div
      className="bg-white shadow-1 rounded-xl flex flex-col"
      data-tour="analyzed-bills"
    >
      <div className="p-3.5 lg:p-5">
        <h2 className="font-bold text-org-primary-dark text-xl lg:text-2xl">
          Analyzed Medical Bills
        </h2>
      </div>

      <TooltipProvider delayDuration={200}>
        <div className="overflow-y-auto flex-1">
          <table className="w-full min-w-xl text-left table-auto">
            <caption className="sr-only">
              List of analyzed medical bills
            </caption>
            <thead>
              <tr className="border-gray-200 border-b">
                <th className="p-3 font-normal text-muted-text text-sm w-80">
                  File Name
                </th>
                <th className="p-3 font-normal text-muted-text text-sm">
                  Total Amount
                </th>
                <th className="p-3 font-normal text-muted-text text-sm w-40">
                  Status
                </th>
                <th className="p-3 font-normal text-muted-text text-sm w-11">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="text-org-primary-dark text-left">
              {visibleMedData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-gray-500 text-center">
                    No medical bills to display.
                  </td>
                </tr>
              ) : (
                visibleMedData.map((item) => {
                  const status = item?.bill_status || 'unknown';
                  const hasZeroTotal =
                    item?.total_amount === 0 || item?.total_amount === null;

                  const label = getUserFacingLabel(status);
                  const badgeStyle =
                    STATUS_STYLES[status] || 'bg-gray-100 text-gray-600';

                  const isParsing = status === 'parsing';
                  const isProviderReview =
                    status === 'user_input_received' ||
                    status === 'waiting_provider_input' ||
                    status === 'provider_input_received';
                  const isReady = status === 'ready_for_negotiation';

                  const statusBadge = (
                    <span
                      className={`block w-fit px-2 py-0.5 rounded-full text-xs ${badgeStyle}`}
                      aria-label={`Status: ${label}`}
                    >
                      {label}
                    </span>
                  );

                  let action = null;
                  if (isParsing) {
                    action = (
                      <Tooltip
                        open={highlightedBillId === item.id ? true : undefined}
                      >
                        <TooltipTrigger asChild>
                          <span
                            className="inline-flex items-center p-2 rounded-full text-xs bg-blue-100 text-blue-700"
                            aria-label="Parsing in progress"
                            role="status"
                          >
                            <Hourglass size={16} aria-hidden="true" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            We’re parsing your bill now. Please wait a moment.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  } else if (status === 'parse_failed') {
                    action = (
                      <div className="flex items-center gap-2">
                        <Button
                          className="bg-blue-50 text-blue-600 rounded-xl font-semibold text-sm hover:bg-blue-600 hover:text-white flex items-center gap-2"
                          onClick={() => retryBillProcessing(item.id)}
                        >
                          Retry
                        </Button>
                        <Button
                          className="bg-red-50 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-600 hover:text-white flex items-center gap-2"
                          onClick={() => handleReportIssue(item.id)}
                        >
                          <AlertCircle className="w-4 h-4" aria-hidden="true" />
                          Report
                        </Button>
                      </div>
                    );
                  } else if (status === 'waiting_user_input') {
                    action = (
                      <Button
                        asChild
                        className="bg-red-50 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-600 hover:text-white flex items-center gap-2"
                        aria-label="Resolve issues for this bill"
                      >
                        <Link
                          href={`/${orgId}/dashboard/check-uploaded-bill/${item.id}`}
                        >
                          <AlertCircle className="w-4 h-4" aria-hidden="true" />
                          Check Issues
                        </Link>
                      </Button>
                    );
                  } else if (isProviderReview) {
                    action = (
                      <Tooltip
                        open={highlightedBillId === item.id ? true : undefined}
                      >
                        <TooltipTrigger asChild>
                          <span className="inline-flex items-center p-2 rounded-full text-xs bg-blue-100 text-blue-700">
                            <Hourglass size={16} />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Currently under provider review</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  } else if (isReady) {
                    action = (
                      <Button
                        className="bg-green-100 !text-green-800 font-semibold text-sm hover:bg-green-200 flex items-center gap-2"
                        disabled={negotiationLoading}
                        onClick={() => {
                          if (isUserSubscribed) {
                            handleStartNegotiation(item.id);
                          } else {
                            router.push(`/${orgId}/dashboard/plans`);
                          }
                        }}
                      >
                        {negotiationLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        {negotiationLoading ? 'Starting...' : 'Negotiate'}
                      </Button>
                    );
                  }

                  const isFlash = highlightedBillId === item.id;
                  const isSelected = selectedBillId === item.id;

                  const rowClass = isFlash
                    ? 'bg-yellow-50 animate-pulse'
                    : isSelected
                      ? 'bg-blue-50'
                      : 'hover:bg-gray-50';

                  return (
                    <tr key={item.id} className={`border-gray-100 ${rowClass}`}>
                      <td className="p-3 text-xs leading-6 text-org-primary-dark">
                        {isParsing || status === 'parse_failed' ? (
                          <span className="line-clamp-2 text-gray-500 cursor-not-allowed">
                            {capitalizeFirstLetter(item.file_name || item.id)}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSelect?.(item)}
                            className="block w-full -m-3 p-3 text-left cursor-pointer focus:outline-none
                                       decoration-transparent hover:decoration-current focus:decoration-current
                                       rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                          >
                            <span className="line-clamp-2">
                              {capitalizeFirstLetter(item.file_name || item.id)}
                            </span>
                          </button>
                        )}
                      </td>

                      <td className="p-3 text-xs leading-6">
                        {isParsing && !item.total_amount ? (
                          <span className="text-gray-600 font-medium">
                            Processing...
                          </span>
                        ) : hasZeroTotal ? (
                          <span className="text-red-600 font-medium">
                            Needs Attention
                          </span>
                        ) : (
                          <span className="font-medium">
                            {formatCurrency(item.total_amount)}
                          </span>
                        )}
                      </td>

                      <td className="text-center py-3 text-xs leading-6 w-20">
                        {statusBadge}
                      </td>

                      <td className="p-3 text-sm leading-6">
                        <div className="flex items-center space-x-2">
                          {action}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </TooltipProvider>

      <PaginationBar
        currentPage={currentMedPage}
        totalPages={totalMedPages}
        onChange={setCurrentMedPage}
      />
    </div>
  );
}
