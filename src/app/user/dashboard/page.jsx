'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import banner_img_pattern from '@/app/assets/banner_img_pattern.png';
import morning_img from '@/app/assets/morning_img.png';
import ActiveSvg from '@/app/assets/svg/ActiveSvg';
import DollarEarning from '@/app/assets/svg/DollarEarning';
import SmallEarning from '@/app/assets/svg/SmallEarning';
export const dynamics = 'force-static';
import { selectAuth } from '@/store/slices/authSlice';
import {
    AlertCircle,
    CheckCircle,
    ChevronRight,
    Clock,
    FileText,
    Info,
    MessageSquare,
    TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '@iconify/react';
import { DASHBOARD_TOUR_STEPS } from '@/constants/tourSteps';
import TourProvider from '@/components/TourProvider';

import { getMedicalBillsThunk } from '@/store/slices/medOptimizeSlice';
import { getUserFacingLabel } from '@/constants/getUserFacingLabel';
import GlobalLoader from '@/components/GlobalLoader';

import { onAllRequestsDone } from '@/lib/axiosInstance';
import { getNegotiationCases } from '@/store/slices/negotiationSlice';

const cardData = [
    {
        icon: <DollarEarning />,
        label: 'Savings YTD',
        value: '0',
        iconBg: 'bg-sky-100',
        tooltip:
            'Total amount saved on medical bills from January 1st to current date through successful negotiations.',
    },
    {
        icon: <ActiveSvg />,
        label: 'Active Claims',
        value: '0',
        iconBg: 'bg-orange-100',
        tooltip:
            'Number of medical bill negotiations currently in progress or pending review.',
    },
    {
        icon: <SmallEarning />,
        label: 'Success rate',
        value: '0',
        iconBg: 'bg-yellow-100',
        tooltip:
            'Percentage of negotiations that resulted in reduced medical bills or payment plans.',
    },
];

const statusStyles = {
    Pending: { bg: 'bg-[#FFEEDD]', text: 'text-[#EF7907]' },
    'In Progress': { bg: 'bg-[#DDF8EE]', text: 'text-[#34A853]' },
    Completed: { bg: 'bg-green-100', text: 'text-green-700' },
    'Under review': { bg: 'bg-blue-100', text: 'text-blue-700' },
};

export default function UserDashboard() {
    const dispatch = useDispatch();
    const { user } = useSelector(selectAuth);
    const [greeting, setGreeting] = useState('Good Morning');
    const [currentDate, setCurrentDate] = useState('');
    // orgId removed from path; default to 'them' where needed in links
    const [runDashboardTour, setRunDashboardTour] = useState(false);
    const [isExistingUser, setIsExistingUser] = useState();
 

    const bills = useSelector((state) => state.medOptimize.bills);
    const [recentBills, setRecentBills] = useState([]);
    const [recentBillsLoading, setRecentBillsLoading] = useState(false);
    const [recentBillsError, setRecentBillsError] = useState();

    const userId =
        typeof window !== 'undefined' ? sessionStorage.getItem('chatUserId') : null;
    const fetchAll = useSelector((state) => state.negotiation.fetchAll);
    const negotiationData = fetchAll?.data || [];

    const hasBills = Array.isArray(bills) && bills.length > 0;
    const hasNegotiations =
        Array.isArray(negotiationData) && negotiationData.length > 0;

    useEffect(() => {
        const now = new Date();
        const hours = now.getHours();
        setGreeting(
            hours < 12
                ? 'Good Morning'
                : hours < 18
                    ? 'Good Afternoon'
                    : 'Good Evening'
        );

        setCurrentDate(
            now.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
        );

        const isNewUserFlag = sessionStorage.getItem('isExistingUser');
        setIsExistingUser(isNewUserFlag);
    }, []);

    const isTourDone =
        typeof window !== 'undefined' &&
        localStorage.getItem('dashboardTourCompleted') === 'true';
    useEffect(() => {
        onAllRequestsDone(() => {
            if (!isTourDone) setRunDashboardTour(true);
        });
    }, [isTourDone]);

    useEffect(() => {
        if (typeof window === 'undefined' || !userId) return;

        if (!hasBills) {
            setRecentBillsLoading(true);
            setRecentBillsError(null);

            dispatch(getMedicalBillsThunk(userId))
                .unwrap()
                .catch(() => { })
                .finally(() => setRecentBillsLoading(false));
        }

        if (!hasNegotiations) {
            dispatch(getNegotiationCases(userId))
                .unwrap()
                .catch(() => { });
        }
    }, [dispatch, userId]);

    useEffect(() => {
        if (!Array.isArray(bills)) return;
        setRecentBills(bills.slice(0, 3));
    }, [bills]);

    const deriveStatusKey = (bill) => {
        const raw = String(bill?.bill_status || '').toLowerCase();
        const parsedFlag = String(bill?.is_parsed || '').toLowerCase() === 'true';
        if (!raw && parsedFlag) return BillStatus?.READY_FOR_NEGOTIATION || 'ready';
        return raw || BillStatus?.PARSING || 'parsing';
    };

    const getStatusText = (bill) => getUserFacingLabel(deriveStatusKey(bill));

    const getStatusIcon = (bill) => {
        const label = getStatusText(bill);
        if (label === 'Ready to Negotiate') {
            return <CheckCircle className="w-4 h-4" style={{ color: '#22c55e' }} />;
        }
        if (label === 'Parse Failed') {
            return <AlertCircle className="w-4 h-4" style={{ color: '#ef4444' }} />;
        }
        if (
            label === 'In Negotiation' ||
            label === 'Provider Review' ||
            label === 'Missing Details' ||
            label === 'Pending'
        ) {
            return <Clock className="w-4 h-4" style={{ color: '#f59e0b' }} />;
        }
        return <Clock className="w-4 h-4" style={{ color: '#9ca3af' }} />;
    };

    const negotiationRows = useMemo(() => {
        const list = Array.isArray(negotiationData) ? negotiationData : [];
        const sorted = [...list].sort((a, b) => {
            const da = new Date(
                a?.updatedAt || a?.lastUpdated || a?.createdAt || 0
            ).getTime();
            const db = new Date(
                b?.updatedAt || b?.lastUpdated || b?.createdAt || 0
            ).getTime();
            return db - da;
        });

        return sorted.slice(0, 5).map((n) => {
            const id = n?.id || n?._id || '';
            const shortId = id ? `#${String(id).slice(0, 6)}` : '-';
            const status = (n?.status || 'Pending').toString().trim() || 'Pending';
            const dt =
                n?.createdAt ||
                n?.created_date ||
                n?.date ||
                n?.lastUpdated ||
                n?.updatedAt;
            const date = dt
                ? new Date(dt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                })
                : '-';
            const savingsNum =
                typeof n?.savingsEstimate === 'number' ? n.savingsEstimate : null;
            const savings =
                savingsNum != null ? `$${savingsNum.toLocaleString()}` : '-';
            const tooltip =
                status.toLowerCase() === 'completed'
                    ? 'Completed — no action needed.'
                    : status.toLowerCase().includes('progress') ||
                        status.toLowerCase().includes('review')
                        ? 'Negotiation in progress. We’ll notify you on updates.'
                        : 'We’re on it—gathering your latest negotiation updates.';
            return { id, shortId, status, date, savings, tooltip };
        });
    }, [negotiationData]);

    return (
        <>
            <GlobalLoader />
            {runDashboardTour && isExistingUser === 'false' && (
                <TourProvider steps={DASHBOARD_TOUR_STEPS} />
            )}
            <TooltipProvider>
                <div className="h-full w-full flex flex-col">
                    {/* Greeting */}
                    <section
                        className="h-44 bg-white rounded-3xl pl-4 lg:pl-16 flex items-center justify-between overflow-visible relative"
                        data-tour="dashboard-greeting"
                    >
                        <div className="cmd:flex-1 sm:w-1/3 lg:w-2/4 cmd:w-full">
                            <h3 className="text-2xl lg:text-3xl font-bold text-org-primary-dark">
                                <span>{greeting}, </span>
                                <span className="text-org-primary-dark">
                                    {user
                                        ? `${user.data?.firstName ?? ''} ${user.data?.lastName ?? ''}`.trim()
                                        : ''}
                                </span>
                            </h3>
                            <p className="text-base font-medium text-neutral-500 mt-1">
                                {currentDate}
                            </p>
                        </div>
                        <div className="h-full flex justify-end flex-1">
                            <div className="w-auto h-[200px] relative sm:-mt-6 hidden sm:block z-50">
                                <Image
                                    src={morning_img.src}
                                    className="h-full object-contain lg:object-cover aspect-square"
                                    width={300}
                                    height={170}
                                    alt="Banner Pattern"
                                />
                            </div>
                            <Image
                                src={banner_img_pattern.src}
                                className="size-full object-cover rounded-tr-3xl rounded-br-3xl absolute w-auto cmd:relative right-0"
                                width={327}
                                height={170}
                                alt="Banner Pattern"
                            />
                        </div>
                    </section>

                    <section className="pt-6 flex-1 flex flex-col">
                        {/* Top cards */}
                        <div
                            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                            data-tour="dashboard-stats"
                        >
                            {cardData.map((card, idx) => (
                                <Card
                                    className="flex items-center gap-4 p-4 rounded-3xl flex-row !shadow-1 border-0"
                                    key={idx}
                                >
                                    <div className={`rounded-full p-3 ${card.iconBg}`}>
                                        {card.icon}
                                    </div>
                                    <CardContent className="p-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm text-text-muted">{card.label}</p>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Info className="w-3 h-3 text-gray-400" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="max-w-xs">{card.tooltip}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                        <p className="text-2xl text-org-primary-dark font-bold">
                                            {card.value}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Explainer / Onboarding card */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6 flex-1">
                            {hasBills || hasNegotiations ? (
                                <div
                                    className="col-span-2 lg:col-span-3"
                                    data-tour="dashboard-saving-trends"
                                >
                                    <div className="bg-white p-7 rounded-3xl shadow-1 col-span-2 lg:col-span-1 h-full grid grid-cols-1 xl:grid-cols-10 gap-2.5">
                                        <div className="xl:col-span-6">
                                            <h3 className="text-org-primary-dark text-lg lg:text-2xl font-bold ">
                                                Take control of your medical bills—with help.
                                            </h3>
                                            <ul className="space-y-3 text-sm text-gray-600 list-disc list-inside mt-2.5">
                                                <li className="text-[#6B7A7A]">
                                                    We review your bills and negotiate on your behalf.
                                                </li>
                                                <li className="text-[#6B7A7A]">
                                                    You’ll be able to track each bill’s progress.
                                                </li>
                                                <li className="text-[#6B7A7A]">
                                                    You don’t need to be a billing expert—we handle the
                                                    hard parts.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="col-span-2 lg:col-span-3">
                                    <Card className="gap-3 h-full justify-center items-center border-0 !shadow-1">
                                        <CardContent className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                <TrendingUp className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <h4 className="text-lg font-medium text-gray-900 mb-2">
                                                No savings yet
                                            </h4>
                                            <p className="text-gray-600 mb-4 text-center">
                                                Upload your first bill to get started and see your
                                                savings grow.
                                            </p>
                                        </CardContent>
                                        <CardFooter className="flex flex-col items-center justify-center">
                                            <Button asChild>
                                                <Link href={`/them/dashboard/bill-upload`}>
                                                    Upload First Bill
                                                </Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div
                                className="bg-white p-7 rounded-3xl shadow-1 col-span-2 lg:col-span-1"
                                data-tour="dashboard-quick-actions"
                            >
                                <h3 className="text-2xl text-org-primary-dark font-bold">
                                    Quick Actions
                                </h3>
                                <ul className="space-y-4 pt-5">
                                    {isExistingUser === 'true' && (
                                        <li>
                                            <Link href={`/them/dashboard/bill-upload`}>
                                                <div className="flex items-center justify-between p-4 shadow-2 rounded-2xl cursor-pointer hover:bg-gray-50 transition">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-12 rounded-full flex items-center justify-center bg-amber-100 text-amber-600">
                                                            <Icon icon="uil:bill" width="24" height="24" />
                                                        </div>
                                                        <p className="text-sm text-org-primary-dark font-semibold">
                                                            Upload Bills
                                                        </p>
                                                    </div>
                                                    <ChevronRight color="#0097B2" size={16} />
                                                </div>
                                            </Link>
                                        </li>
                                    )}
                                    <li>
                                        <Link href={`/them/dashboard/support`}>
                                            <div className="flex items-center justify-between p-4 shadow-2 rounded-2xl cursor-pointer hover:bg-gray-50 transition">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-12 rounded-full flex items-center justify-center bg-blue-100">
                                                        <MessageSquare className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <p className="text-sm text-org-primary-dark font-semibold">
                                                        Contact Support
                                                    </p>
                                                </div>
                                                <ChevronRight color="#0097B2" size={16} />
                                            </div>
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            // onClick={openChatModal}
                                            className="w-full text-left"
                                            style={{ background: 'none', border: 'none', padding: 0 }}
                                        >
                                            <div className="flex items-center justify-between p-4 shadow-2 rounded-2xl cursor-pointer hover:bg-gray-50 transition">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-12 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
                                                        <Icon
                                                            icon="icon-park-outline:voice"
                                                            width="24"
                                                            height="24"
                                                        />
                                                    </div>
                                                    <p className="text-sm text-org-primary-dark font-semibold">
                                                        Try Voice with RAI
                                                    </p>
                                                </div>
                                                <ChevronRight color="#0097B2" size={16} />
                                            </div>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Negotiations Overview (replaces Claim Overview) */}
                        {(hasBills || hasNegotiations) && (
                            <div className="grid grid-cols-8 gap-6 pt-6">
                                <div
                                    className="col-span-8 lg:col-span-5 shadow-1 bg-white rounded-xl pb-3"
                                    data-tour="dashboard-negotiations-overview"
                                >
                                    <div className="flex items-center justify-between p-7">
                                        <h3 className="text-org-primary-dark text-lg lg:text-2xl font-bold">
                                            Claims Overview
                                        </h3>
                                        <Button asChild className="rounded-xl">
                                            <Link href={`/them/dashboard/bill-Intake-Prep`}>
                                                View All
                                            </Link>
                                        </Button>
                                    </div>

                                    <div className="overflow-y-auto">
                                        {negotiationRows.length === 0 ? (
                                            <div className="px-8 py-12 text-center text-gray-500">
                                                No negotiation cases yet.
                                            </div>
                                        ) : (
                                            <table className="min-w-xl w-full mt-6 table-auto">
                                                <thead className="border-b border-gray-200">
                                                    <tr className="text-left">
                                                        <th className="text-sm p-1.5 font-normal text-muted-text px-8">
                                                            Case ID
                                                        </th>
                                                        <th className="text-sm p-1.5 font-normal text-muted-text">
                                                            Current Status
                                                        </th>
                                                        <th className="text-sm p-1.5 font-normal text-muted-text">
                                                            Date Initiated
                                                        </th>
                                                        <th className="text-sm p-1.5 font-normal text-muted-text">
                                                            Savings Achieved
                                                        </th>
                                                        <th className="text-sm p-1.5 font-normal text-muted-text">
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {negotiationRows.map((data) => {
                                                        const style =
                                                            statusStyles[data.status] ||
                                                            statusStyles['Pending'] ||
                                                            {};
                                                        return (
                                                            <tr key={data.id}>
                                                                <td className="py-3.5 px-8 text-org-primary-light-100">
                                                                    {data.shortId}
                                                                </td>
                                                                <td className="py-3.5">
                                                                    <div className="flex items-center gap-1">
                                                                        <span
                                                                            className={`text-center py-1.5 text-[10px] w-28 rounded-full block ${style.bg} ${style.text}`}
                                                                        >
                                                                            {data.status}
                                                                        </span>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Info className="w-3.5 h-3.5 text-muted-text cursor-pointer" />
                                                                            </TooltipTrigger>
                                                                            <TooltipContent
                                                                                side="top"
                                                                                className="text-xs max-w-xs"
                                                                            >
                                                                                {data.tooltip}
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </div>
                                                                </td>
                                                                <td className="py-3.5 text-org-primary-light-100">
                                                                    {data.date}
                                                                </td>
                                                                <td className="py-3.5 text-org-primary-light-100">
                                                                    {data.savings}
                                                                </td>
                                                                <td className="py-3.5">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="text-org-primary-color"
                                                                    >
                                                                        <Link
                                                                            href={`/them/dashboard/bill-upload-initiate-negotiation/${encodeURIComponent(
                                                                                data.id || ''
                                                                            )}?mode=view`}
                                                                        >
                                                                            View Details
                                                                        </Link>
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>

                                {/* Recent Bills */}
                                <div
                                    className="col-span-8 lg:col-span-3 shadow-1 bg-white rounded-xl h-full"
                                    data-tour="dashboard-recent-bills"
                                >
                                    <div className="p-7 flex flex-col h-full gap-4">
                                        <h3 className="text-org-primary-dark text-lg lg:text-2xl font-bold">
                                            Recent Uploaded Bills
                                        </h3>
                                        <div className="flex-1">
                                            {recentBillsLoading ? (
                                                <div className="text-center py-8">
                                                    <div className="w-8 h-8 border-4 border-gray-200 rounded-full border-t-neutral-500 animate-spin mx-auto mb-3" />
                                                    <p className="text-gray-500 text-sm">
                                                        Loading your recent bills…
                                                    </p>
                                                </div>
                                            ) : recentBillsError ? (
                                                <div className="text-center py-8">
                                                    <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-3" />
                                                    <p className="text-gray-500 text-sm">
                                                        {recentBillsError}
                                                    </p>
                                                </div>
                                            ) : recentBills.length === 0 ? (
                                                <div className="text-center py-8">
                                                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                    <p className="text-gray-500">
                                                        Nothing new yet. We’ll nudge your provider if we
                                                        don’t hear back.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {recentBills.map((bill) => {
                                                        const issued = bill?.date_issued
                                                            ? new Date(bill.date_issued).toLocaleDateString(
                                                                'en-US',
                                                                {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                }
                                                            )
                                                            : new Date(
                                                                bill?.created_at || Date.now()
                                                            ).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            });
                                                        const displayName =
                                                            bill?.file_name ||
                                                            bill?.file_url?.split('/').pop() ||
                                                            'Bill';
                                                        const amount =
                                                            typeof bill?.total_amount === 'number'
                                                                ? bill.total_amount
                                                                : null;

                                                        return (
                                                            <div
                                                                key={bill.id}
                                                                className="flex xl:items-center justify-between p-3 flex-col xl:flex-row gap-2.5 xl:gap-0 border rounded-lg hover:bg-gray-50 transition"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <FileText className="w-5 h-5 text-gray-400" />
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                                                                            {displayName}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">
                                                                            {issued}
                                                                            {amount != null
                                                                                ? ` · ${bill?.currency || 'USD'} ${amount}`
                                                                                : ''}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {getStatusIcon(bill)}
                                                                    <span className="text-xs font-medium">
                                                                        {getStatusText(bill)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                        <Button className="w-full rounded-xl" asChild>
                                            <Link href={`/them/dashboard/bill-upload`}>
                                                View Bills
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </TooltipProvider>
        </>
    );
}
