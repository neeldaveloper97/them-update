'use client';

import AlarmClock_svg from '@/app/assets/svg/AlarmClock_svg';
import Bill_svg from '@/app/assets/svg/Bill_svg';
import GraphUp_svg from '@/app/assets/svg/GraphUp_svg';
import PiggyBank_svg from '@/app/assets/svg/PiggyBank_svg';
import {
  acknowledgeListRefresh,
  getNegotiationCases,
  removeNegotiationCase,
} from '@/store/slices/negotiationSlice';
import { Icon } from '@iconify/react';
import { Circle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChartContainer } from '@/components/ui/chart';
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts';

import TourProvider from '@/components/TourProvider';
import { INTAKE_PREP_TOUR_STEPS } from '@/constants/tourSteps';
import GlobalLoader from '@/components/GlobalLoader';
import { onAllRequestsDone } from '@/lib/axiosInstance';
import PaginationBar from '@/components//Pagination';

export default function NegotiationTrackerPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [expandedStep, setExpandedStep] = useState(null);

  const [casesLoaded, setCasesLoaded] = useState(false);
  const [runBillIntakeTour, setRunBillIntakeTour] = useState(false);
  const [tourAlreadyRun, setTourAlreadyRun] = useState(false);

  const router = useRouter();
  const urlparam = useParams();
  const dispatch = useDispatch();

  const fetchAll = useSelector((state) => state.negotiation.fetchAll);
  const billingData = fetchAll?.data || [];
  const [activeClaim, setActiveClaim] = useState(billingData[0]);
  console.log('billingData: ', billingData);

  const itemsPerPage = 5;
  const shouldRefetch = useSelector((s) => s.negotiation.shouldRefetchList);
  const items = useSelector((s) => s.negotiation.fetchAll.data);

  const totalPages = Math.max(
    1,
    Math.ceil((billingData?.length || 0) / itemsPerPage)
  );

  const visibleData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return (billingData || []).slice(start, end);
  }, [billingData, currentPage]);

  const userId =
    typeof window !== 'undefined' ? sessionStorage.getItem('chatUserId') : null;

  const fmtCurrency = (n) =>
    typeof n === 'number'
      ? `$${n.toLocaleString()}`
      : Number(n)
        ? `$${Number(n).toLocaleString()}`
        : '-';

  useEffect(() => {
    if (shouldRefetch) {
      dispatch(getNegotiationCases(userId)).finally(() =>
        dispatch(acknowledgeListRefresh())
      );
    }
  }, [shouldRefetch, userId, dispatch]);

  const fmtDate = (d) => {
    if (!d) return '-';
    try {
      const date = new Date(d);
      if (isNaN(date)) return d;
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return d;
    }
  };

  const statusStyles = {
    Completed: 'bg-green-100 text-green-600',
    'Under review': 'bg-red-100 text-red-600',
    Pending: 'bg-orange-100 text-orange-800',
    Negotiating: 'bg-blue-100 text-blue-600',
    'In Progress': 'bg-green-100 text-green-800',
  };

  const getBadgeClass = (status) =>
    statusStyles[status] || 'bg-gray-100 text-gray-600';

  const getTextColor = (phase) =>
    phase === 'pending' ? 'text-gray-400' : 'text-gray-700';

  const getStatusIcon = (phase) => {
    switch (phase) {
      case 'completed':
        return (
          <Icon
            icon="material-symbols:check-circle"
            className="text-org-primary-light-100"
            width="24"
            height="24"
          />
        );
      case 'current':
        return (
          <span className="w-6 h-6 rounded-full border border-[#D9D9D9] relative flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-primary-light-100"></span>
          </span>
        );
      case 'pending':
      default:
        return <Circle className="w-6 h-6 text-gray-300" />;
    }
  };

  useEffect(() => {
    if (!userId) return;
    if (billingData.length === 0) {
      dispatch(getNegotiationCases(userId))
        .unwrap()
        .then((res) => {
          const cases = Array.isArray(res) ? res : res?.data || [];
          if (cases.length > 0) {
            setActiveClaim(cases[0]);
          }
          setCasesLoaded(true);
        })
        .catch(() => {
          setCasesLoaded(true);
        });
    }
  }, [dispatch, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tourAlreadyRun) return;
    if (!casesLoaded || typeof window === 'undefined') return;
    onAllRequestsDone(() => {
      const dashboardTourDone =
        localStorage.getItem('dashboardTourCompleted') === 'true';
      const billIntakeTourDone =
        localStorage.getItem('billIntakeTourCompleted') === 'true';

      const shouldStartLocal =
        localStorage.getItem('startBillIntakeTour') === 'true';

      if (shouldStartLocal && !billIntakeTourDone && !dashboardTourDone) {
        setTimeout(() => {
          setRunBillIntakeTour(true);

          localStorage.setItem('dashboardTourCompleted', 'false');
          setTourAlreadyRun(true);
        }, 800);
      }
    });
  }, [casesLoaded, tourAlreadyRun]);

  const getTimelineSteps = (claim) => {
    if (!claim) return [];

    const status = (claim.status || '').toLowerCase();

    const submittedStep = {
      id: 1,
      title: 'Claim Submitted',
      description: `Claim #${(claim.id || claim._id || '')
        .toString()
        .slice(0, 8)} submitted.`,
      date: fmtDate(claim.createdAt || claim.created_date),
      status: 'completed',
      details: [
        { label: 'Policy Holder Name:', value: claim.patientName || '-' },
        { label: 'Hospital:', value: claim.hospitalProviderName || '-' },
        { label: 'Insurer:', value: claim.insuranceProviderName || '-' },
        {
          label: 'Requested Discount:',
          value: `${claim.requestedDiscountType || '-'} ${claim.requestedDiscountValue || ''
            }`,
        },
      ],
    };

    const reviewStep = {
      id: 2,
      title: 'In Review',
      description: 'Negotiation review in progress.',
      date: fmtDate(claim.lastUpdated || claim.updatedAt),
      status:
        status === 'under review' || status === 'in review' || !status
          ? 'current'
          : 'completed',
      details: [],
    };

    const decisionStep = {
      id: 3,
      title: 'Negotiation Complete',
      description: 'Final decision reached.',
      date:
        status === 'completed'
          ? fmtDate(claim.lastUpdated || claim.updatedAt)
          : '-',
      status: status === 'completed' ? 'completed' : 'pending',
      details: [],
    };

    return [submittedStep, reviewStep, decisionStep];
  };

  const timelineSteps = useMemo(
    () => getTimelineSteps(activeClaim),
    [activeClaim]
  );

  const totalBilled = useMemo(() => {
    const items = activeClaim?.lineItems || [];
    return items.reduce((sum, li) => sum + (Number(li?.billedCharges) || 0), 0);
  }, [activeClaim]);

  const hasCases = (billingData?.length || 0) > 0;

  const totalSavings = useMemo(() => {
    return (billingData || []).reduce((sum, it) => {
      const sv = Number(
        it?.savings ?? it?.potentialSaving ?? it?.expectedSaving
      );
      return sum + (isNaN(sv) ? 0 : sv);
    }, 0);
  }, [billingData]);

  const successRatePct = useMemo(() => {
    const total = billingData?.length || 0;
    if (!total) return 0;
    const completed = (billingData || []).filter((it) => {
      const s = (it?.status || it?.currentStatus || '').toLowerCase();
      return s === 'completed';
    }).length;
    return Math.round((completed / total) * 100);
  }, [billingData]);

  const avgProcessingDays = useMemo(() => {
    const daysBetween = (a, b) => {
      const d1 = a ? new Date(a) : null;
      const d2 = b ? new Date(b) : null;
      if (!d1 || !d2 || isNaN(d1) || isNaN(d2)) return null;
      const diff = (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
      return diff < 0 ? 0 : diff;
    };

    const durations = (billingData || [])
      .map((it) =>
        daysBetween(
          it?.createdAt || it?.created_date,
          it?.updatedAt || it?.lastUpdated
        )
      )
      .filter((x) => x != null);

    if (!durations.length) return 0;
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    return Number.isFinite(avg) ? Number(avg.toFixed(1)) : 0;
  }, [billingData]);

  const chartData = [
    {
      metric: 'Total Billed',
      value: Math.max(0, totalBilled || 0),
      fill: 'var(--color-safari)',
    },
  ];
  const chartConfig = {
    value: { label: 'USD' },
    metric: { label: 'Total Billed', color: 'var(--chart-2)' },
  };

  const handleView = (id) => {
    const { orgId } = urlparam;
    router.push(
      `/${orgId}/dashboard/bill-upload-initiate-negotiation/${id}?mode=view`
    );
  };

  const handleEdit = (id) => {
    const { orgId } = urlparam;
    router.push(
      `/${orgId}/dashboard/bill-upload-initiate-negotiation/${id}?mode=edit`
    );
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await dispatch(removeNegotiationCase(id)).unwrap();
      await dispatch(getNegotiationCases(userId)).unwrap();
      if (activeClaim && (activeClaim.id === id || activeClaim._id === id)) {
        const list = fetchAll?.data || [];
        setActiveClaim(list.length ? list[0] : null);
      }
      const remaining = (billingData?.length || 1) - 1;
      const newTotalPages = Math.max(1, Math.ceil(remaining / itemsPerPage));
      setCurrentPage((prev) => Math.min(prev, newTotalPages));
    } catch {
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <GlobalLoader />
      {runBillIntakeTour && <TourProvider steps={INTAKE_PREP_TOUR_STEPS} />}

      <div className="">
        <div className="space-y-6 col-span-2">
          <div
            data-tour="intake-metrics"
            className="gap-4 grid grid-cols-1 lg:grid-cols-4"
          >
            {/* Active Claims */}
            <div className="shadow-1 p-8 bg-white rounded-[30px] flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-base text-muted-text leading-none">
                  Active Claims
                </p>
                <h5 className="text-2xl text-muted-text-bold font-bold">
                  {billingData?.length || 0}
                </h5>
                <p className="text-org-primary-light-100">
                  {hasCases ? '+3 this week' : '+0 this week'}
                </p>
              </div>
              <div className="bg-org-primary-light size-16 flex items-center justify-center text-org-primary-color rounded-full">
                <Bill_svg />
              </div>
            </div>

            {/* Total saving */}
            <div className="shadow-1 p-8 bg-white rounded-[30px] flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-base text-muted-text leading-none">
                  Total saving
                </p>
                <h5 className="text-2xl text-muted-text-bold font-bold">
                  {hasCases ? fmtCurrency(totalSavings) : '$0'}
                </h5>
                <p className="text-orange-400">
                  {hasCases ? '+0 this month' : '+$0 this month'}
                </p>
              </div>
              <div className=" bg-orange-100 size-16 flex items-center justify-center text-orange-400 rounded-full">
                <PiggyBank_svg />
              </div>
            </div>

            {/* Success rate */}
            <div className="shadow-1 p-8 bg-white rounded-[30px] flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-base text-muted-text leading-none">
                  Success rate
                </p>
                <h5 className="text-2xl text-muted-text-bold font-bold">
                  {hasCases ? `${successRatePct}%` : '0%'}
                </h5>
                <p className="text-org-primary-light-100">
                  {hasCases ? 'Above average' : '—'}
                </p>
              </div>
              <div className="bg-org-primary-light size-16 flex items-center justify-center text-org-primary-color rounded-full">
                <GraphUp_svg />
              </div>
            </div>

            {/* Avr. processing */}
            <div className="shadow-1 p-8 bg-white rounded-[30px] flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-base text-muted-text leading-none">
                  Avr. processing
                </p>
                <h5 className="text-2xl text-muted-text-bold font-bold">
                  {hasCases ? avgProcessingDays : 0}
                </h5>
                <p className="text-orange-400">days</p>
              </div>
              <div className=" bg-orange-100 size-16 flex items-center justify-center text-orange-400 rounded-full">
                <AlarmClock_svg />
              </div>
            </div>
          </div>

          <div className="gap-4 grid grid-cols-1 lg:grid-cols-8 pt-6">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div
                data-tour="intake-claim-list"
                className="shadow-1 bg-white rounded-[30px] flex-1 flex flex-col"
              >
                <div className="flex lg:flex-row flex-col justify-between lg:items-center gap-2 p-5 border-b border-b-[#E9EDF7]">
                  <h2 className="font-bold text-org-primary-dark text-2xl">
                    Negotiation bill list
                  </h2>
                </div>

                <div className="p-5 flex-1">
                  {visibleData?.length ? (
                    <ul className="space-y-4 overflow-y-auto">
                      {visibleData.map((item) => {
                        const id = item.id || item._id;
                        const title =
                          item.title ||
                          item.hospitalProviderName ||
                          'Negotiation case';
                        const claimNo =
                          item.claimNumber ||
                          item.id ||
                          `#${String(id).slice(-6)}`;
                        const createdAt =
                          item.createdAt || item.date || item.created_date;
                        const status =
                          item.status || item.currentStatus || 'Pending';
                        const amount =
                          item.totalAmount ??
                          item.amount ??
                          item.claimAmount ??
                          (Array.isArray(item.lineItems)
                            ? item.lineItems.reduce(
                              (s, li) => s + (Number(li?.billedCharges) || 0),
                              0
                            )
                            : undefined);
                        const savings =
                          item.savings ??
                          item.potentialSaving ??
                          item.expectedSaving;
                        const isActive =
                          activeClaim?.id === id || activeClaim?._id === id;
                        return (
                          <li
                            key={id}
                            className={`flex items-center justify-between px-4 py-3 rounded-lg w-full transition-colors ${isActive ? 'bg-[#F0F6F8]' : 'bg-[#F8F8F8] hover:bg-[#F0F6F8]'}`}
                          >
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => setActiveClaim(item)}
                                className="bg-org-primary-light size-12 flex items-center justify-center text-org-primary-color rounded-full"
                                title="Select"
                              >
                                <Bill_svg />
                              </button>
                              <div
                                className="cursor-pointer"
                                onClick={() => setActiveClaim(item)}
                              >
                                <h5 className="font-medium">{title}</h5>
                                <p className="divide-x text-muted-text divide-muted-text/20">
                                  <span className="pr-3">{claimNo}</span>
                                  <span className="pl-3">
                                    {fmtDate(createdAt)}
                                  </span>
                                </p>
                              </div>
                            </div>

                            <span
                              className={`text-xs px-2.5 py-1 rounded-full ${getBadgeClass(status)}`}
                            >
                              {status}
                            </span>

                            <div className="text-right px-2.5">
                              <p className="text-lg font-semibold text-neutral-800">
                                {amount != null ? fmtCurrency(amount) : '-'}
                              </p>
                              {savings ? (
                                <p className="text-sm text-org-primary-dark font-semibold">
                                  Save {fmtCurrency(savings)}
                                </p>
                              ) : null}
                            </div>

                            <div className="flex items-center gap-3 text-gray-500 pl-3">
                              <button
                                onClick={() => handleView(id)}
                                className="text-black p-1 rounded flex items-center justify-center hover:bg-muted-text/50 hover:text-white transition-all duration-200"
                                title="View"
                              >
                                <Icon icon="gg:eye" className="size-5" />
                              </button>
                              <button
                                onClick={() => handleEdit(id)}
                                className="text-black p-1 rounded flex items-center justify-center hover:bg-muted-text/50 hover:text-white transition-all duration-200"
                                title="Edit"
                              >
                                <Icon icon="lucide:edit" className="size-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(id)}
                                disabled={deletingId === id}
                                className={`p-1 rounded flex items-center justify-center transition-all duration-200 ${deletingId === id ? 'text-rose-400 opacity-60' : 'text-rose-500 hover:bg-rose-500/50 hover:text-white'}`}
                                title="Delete"
                              >
                                {deletingId === id ? (
                                  <Icon
                                    icon="eos-icons:loading"
                                    className="size-5 animate-spin"
                                  />
                                ) : (
                                  <Icon icon="gg:trash" className="size-5" />
                                )}
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="py-16 text-center text-muted-text">
                      No cases found.
                    </div>
                  )}
                </div>

                <div className="p-5 pt-0">
                  <PaginationBar
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onChange={setCurrentPage}
                    disabled={deletingId !== null}
                    labels={{
                      prev: 'Previous',
                      next: 'Next',
                      page: (n) => `Page ${n}`,
                    }}
                  />
                </div>
              </div>

              <div
                data-tour="intake-claim-focus"
                className="shadow-1 bg-white rounded-[30px] p-5"
              >
                <div className="flex lg:flex-row flex-col justify-between lg:items-center gap-2">
                  <h2 className="font-bold text-org-primary-dark text-2xl">
                    Current Claim in Focus
                  </h2>
                </div>

                <div className="p-3.5 bg-primary-light-50 rounded-md mt-4 grid grid-cols-1 lg:grid-cols-2">
                  {activeClaim ? (
                    <>
                      <ul className="space-y-2">
                        <li className="grid grid-cols-2 text-sm">
                          <span>Claim ID :</span>
                          <span className="text-right text-muted-text">
                            #
                            {(activeClaim.id || activeClaim._id || '')
                              .toString()
                              .slice(0, 8)}
                          </span>
                        </li>
                        <li className="grid grid-cols-2 text-sm">
                          <span>Patient Name :</span>
                          <span className="text-right text-muted-text">
                            {activeClaim.patientName || '-'}
                          </span>
                        </li>
                        <li className="grid grid-cols-2 text-sm">
                          <span>Hospital Name :</span>
                          <span className="text-right text-muted-text">
                            {activeClaim.hospitalProviderName || '-'}
                          </span>
                        </li>
                        <li className="grid grid-cols-2 text-sm">
                          <span>Provider :</span>
                          <span className="text-right text-muted-text">
                            {activeClaim.insuranceProviderName || '-'}
                          </span>
                        </li>
                        <li className="grid grid-cols-2 text-sm">
                          <span>Type of Claim :</span>
                          <span className="text-right text-muted-text">
                            {activeClaim.claimType ||
                              'Cashless / Reimbursement'}
                          </span>
                        </li>
                        <li className="grid grid-cols-2 text-sm">
                          <span>Claim Initiated On :</span>
                          <span className="text-right text-muted-text">
                            {fmtDate(
                              activeClaim.createdAt || activeClaim.created_date
                            )}
                          </span>
                        </li>
                        <li className="grid grid-cols-2 text-sm">
                          <span>Current Status :</span>
                          <span className="text-right">
                            <span
                              className={`text-xs px-2.5 py-1 rounded-full ${getBadgeClass(activeClaim.status || 'Pending')}`}
                            >
                              {activeClaim.status || 'Pending'}
                            </span>
                          </span>
                        </li>
                        <li className="grid grid-cols-2 text-sm">
                          <span>Expected Resolution :</span>
                          <span className="text-right text-muted-text">
                            Within 7–15 working days
                          </span>
                        </li>
                      </ul>

                      <div className="text-end">
                        <ChartContainer
                          config={chartConfig}
                          className="mx-auto aspect-square max-h-[250px]"
                        >
                          <RadialBarChart
                            data={chartData}
                            startAngle={0}
                            endAngle={250}
                            innerRadius={80}
                            outerRadius={110}
                          >
                            <PolarGrid
                              gridType="circle"
                              radialLines={false}
                              stroke="none"
                              className="first:fill-muted last:fill-background"
                              polarRadius={[86, 74]}
                            />
                            <RadialBar
                              dataKey="value"
                              background
                              cornerRadius={10}
                            />
                            <PolarRadiusAxis
                              tick={false}
                              tickLine={false}
                              axisLine={false}
                            >
                              <Label
                                content={({ viewBox }) => {
                                  if (
                                    viewBox &&
                                    'cx' in viewBox &&
                                    'cy' in viewBox
                                  ) {
                                    return (
                                      <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                      >
                                        <tspan
                                          x={viewBox.cx}
                                          y={viewBox.cy}
                                          className="fill-foreground text-2xl font-bold"
                                        >
                                          {fmtCurrency(chartData[0].value)}
                                        </tspan>
                                        <tspan
                                          x={viewBox.cx}
                                          y={(viewBox.cy || 0) + 24}
                                          className="fill-muted-foreground"
                                        >
                                          Total Billed
                                        </tspan>
                                      </text>
                                    );
                                  }
                                  return null;
                                }}
                              />
                            </PolarRadiusAxis>
                          </RadialBarChart>
                        </ChartContainer>
                      </div>
                    </>
                  ) : (
                    <div className="col-span-2 py-4 text-center text-muted-text">
                      Select a claim to view details
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div
                data-tour="intake-next-steps"
                className="shadow-1 bg-white rounded-[30px]"
              >
                <div className="flex lg:flex-row flex-col justify-between lg:items-center gap-2 p-5 border-b border-b-[#E9EDF7]">
                  <h2 className="font-bold text-org-primary-dark text-2xl">
                    {`Next Steps for claim #${(activeClaim?.id || activeClaim?._id || '')
                        .toString()
                        .slice(0, 8) || '—'
                      }`}
                  </h2>
                </div>
                <div className="p-5">
                  <ul className="space-y-6">
                    <li className="bg-[#FEFCE8] p-3 rounded-xl border-l-4 border-[#EF7907]">
                      <div className="flex items-center gap-3">
                        <span className="text-[#D48708]">
                          <Icon
                            icon="material-symbols:info-outline-rounded"
                            width="24"
                            height="24"
                          />
                        </span>
                        <h5 className="text-[#894B00]">
                          Manual Review in Progress
                        </h5>
                      </div>
                      <p className="text-[#D48708] text-sm py-1.5">
                        {activeClaim?.status?.toLowerCase() === 'completed'
                          ? 'Completed — no action needed.'
                          : 'Human advocate is reviewing complex negotiation. Expected completion 2–3 business days.'}
                      </p>
                    </li>
                    <li className="bg-blue-50 p-3 rounded-xl border-l-4 border-blue-600">
                      <div className="flex items-center gap-3">
                        <span className="text-blue-600">
                          <Icon
                            icon="material-symbols:info-outline-rounded"
                            width="24"
                            height="24"
                          />
                        </span>
                        <h5 className="text-blue-600">
                          Additional document required
                        </h5>
                      </div>
                      <p className="text-blue-600 text-sm py-1.5">
                        If requested, upload missing EOB or discharge summary to
                        speed up review.
                      </p>
                    </li>
                    <li className="bg-green-50 p-3 rounded-xl border-l-4 border-green-600">
                      <div className="flex items-center gap-3">
                        <span className="text-green-600">
                          <Icon
                            icon="akar-icons:phone"
                            width="24"
                            height="24"
                          />
                        </span>
                        <h5 className="text-green-600">
                          Contact{' '}
                          {activeClaim?.hospitalProviderName || 'provider'}
                        </h5>
                      </div>
                    </li>
                    <li className="bg-neutral-50 p-3 rounded-xl border-l-4 border-neutral-600">
                      <div className="flex items-center gap-3">
                        <span className="text-neutral-600">
                          <Icon icon="lucide:download" width="24" height="24" />
                        </span>
                        <h5 className="text-neutral-600">Download report</h5>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Claim Timeline */}
              <div
                data-tour="intake-claim-timeline"
                className="shadow-1 bg-white rounded-[30px]"
              >
                <div className="flex flex-col justify-between gap-2 p-5 border-b border-b-[#E9EDF7]">
                  <h2 className="font-bold text-org-primary-dark text-2xl">
                    Claim Timeline
                  </h2>
                  <p>
                    Track progress for claim #
                    {(activeClaim?.id || activeClaim?._id || '')
                      .toString()
                      .slice(0, 8) || '—'}
                  </p>
                </div>
                <div className="p-5">
                  {timelineSteps.length ? (
                    <div>
                      {timelineSteps.map((step, index) => (
                        <div key={step.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <span className="relative z-50 bg-white">
                              {getStatusIcon(step.status)}
                            </span>
                            {index < timelineSteps.length - 1 && (
                              <div
                                className={`w-0.5 h-16 -mt-1 flex-1 ${step.status === 'completed'
                                    ? 'bg-primary-light-100'
                                    : 'bg-[#D9D9D9]'
                                  }`}
                              />
                            )}
                          </div>

                          <div className="flex-1 pb-8">
                            <div
                              className="cursor-pointer"
                              onClick={() =>
                                setExpandedStep((p) =>
                                  p === step.id ? null : step.id
                                )
                              }
                            >
                              <h3
                                className={`font-medium mb-1 ${getTextColor(
                                  step.status
                                )}`}
                              >
                                {step.title}
                              </h3>
                              <p
                                className={`text-sm mb-2 ${getTextColor(
                                  step.status
                                )}`}
                              >
                                {step.description}
                              </p>
                              <p
                                className={`text-xs ${getTextColor(
                                  step.status
                                )}`}
                              >
                                {step.date}
                              </p>
                            </div>

                            {expandedStep === step.id &&
                              step.details?.length > 0 && (
                                <div className="mt-4 bg-gray-50/10 border border-[#33ACC1]/20 rounded-lg p-4">
                                  <div className="space-y-3">
                                    {step.details.map((detail, idx) => (
                                      <div
                                        key={idx}
                                        className="flex justify-between text-sm"
                                      >
                                        <span className="text-[#2C2C2C] text-xs flex-shrink-0 mr-4">
                                          {detail.label}
                                        </span>
                                        <span className="text-muted-text text-xs text-right">
                                          {detail.value}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-muted-text">
                      Select a claim to see timeline
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
