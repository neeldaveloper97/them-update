'use client';

import GlobalLoader from '@/components/GlobalLoader';
import TourProvider from '@/components/TourProvider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem
} from '@/components/ui/pagination';
import { Switch } from '@/components/ui/switch';
import { PAYMENT_MANAGEMENT_TOUR_STEPS } from '@/constants/tourSteps';
import { selectAuth } from '@/store/slices/authSlice';
import { Icon } from '@iconify/react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { ChevronRight, CreditCard } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export default function PaymentManagementPage() {
  const { user } = useSelector(selectAuth);
 
  const [currentPage, setCurrentPage] = useState(1);

  const isSubscribed = !!user?.data?.isSubscribed;
  const currentPlanName =
    user?.data?.subscriptionDetails?.plan?.planName?.toLowerCase() ?? '';
  const router = useRouter();
  const transactionData = [];
  const itemsPerPage = 6;
  const totalPages = Math.max(
    1,
    Math.ceil(transactionData.length / itemsPerPage)
  );
  const visibleData = transactionData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const dashboardTourCompleted =
    typeof window !== 'undefined'
      ? localStorage.getItem('dashboardTourCompleted') === 'true'
      : true;

  const PaymentTour =
    typeof window !== 'undefined'
      ? localStorage.getItem('startPaymentsTour') === 'true'
      : false;

  const startPaymentsTour = () => {
    const d = driver({
      showProgress: true,
      steps: PAYMENT_MANAGEMENT_TOUR_STEPS,
      nextBtnText: 'Next',
      prevBtnText: 'Back',
      doneBtnText: 'Finish',
      stagePadding: 8,
      allowClose: true,
    });
    d.drive();
  };

  const tiers = [
    {
      title: 'Starter',
      price: '$11.99',
      note: '(2-yr contract)',
      features: [
        'Up to 3 bills/appeals per year',
        'Valence chat',
        'Basic status dashboard',
      ],
      overage: [
        '$15/bill after 3',
        'Optional white-glove review: 10% of savings',
      ],
    },
    {
      title: 'Family',
      price: '$19.99',
      features: [
        '8 bills pooled/yr across household',
        'Priority queue',
        'First white-glove review FREE',
      ],
      overage: ['$15/bill overage', 'Additional reviews: 10% of savings'],
    },
    {
      title: 'Premium Care',
      price: '$39.00',
      features: ['Unlimited bills', 'Priority appeal drafting'],
      overage: [],
    },
  ];

  const paymentMethods = [
    {
      title: 'Credit/Debit Card',
      description: '(Visa, MasterCard, Amex)',
      icon: <CreditCard className="size-[30px] text-org-primary-color" />,
      bg: 'bg-org-primary-light-50',
      link: '#',
    },
    {
      title: 'Bank Transfer',
      description: '(ACH, Wire Transfer)',
      icon: (
        <Icon
          className="text-orange-400"
          icon="fluent:building-bank-16-regular"
          width="40"
          height="40"
        />
      ),
      bg: 'bg-orange-100',
      link: '#',
    },
    {
      title: 'Secure Payment via Stripe',
      description: '',
      icon: (
        <Icon
          className="text-green-400"
          icon="system-uicons:chain"
          width="40"
          height="40"
        />
      ),
      bg: 'bg-green-100',
      link: '#',
    },
  ];

  return (
    <>
      <GlobalLoader></GlobalLoader>
      {!dashboardTourCompleted && PaymentTour && (
        <TourProvider steps={PAYMENT_MANAGEMENT_TOUR_STEPS} />
      )}

      <div className="space-y-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
          {/* Payment Plans */}
          <div className="lg:col-span-12 space-y-6">
            <div
              className="shadow-1 bg-white rounded-xl p-4 lg:p-7"
              data-tour="payments-plans"
            >
              <h2 className="text-2xl font-bold text-org-primary-dark">
                Payment Plans
              </h2>

              <div className="flex gap-4 pt-5 overflow-x-auto px-0.5">
                {tiers.map((tier, idx) => {
                  const isCurrentPlan =
                    isSubscribed &&
                    currentPlanName === tier.title.toLowerCase();

                  return (
                    <div
                      key={tier.title}
                      className={`flex w-[calc(100%_-_16px)] flex-col items-center justify-between text-center p-2.5 border rounded-xl ${
                        isCurrentPlan ? 'border-gray-300' : ''
                      }`}
                      {...(idx === 0
                        ? { 'data-tour': 'payments-plan-starter' }
                        : {})}
                    >
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-org-primary-dark">
                            {tier.title}
                          </h3>

                          {isCurrentPlan && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                              Current plan
                            </span>
                          )}
                        </div>

                        <div className="min-h-14 mb-3">
                          <div className="flex items-baseline justify-center">
                            <span
                              className={`text-4xl font-bold ${
                                isCurrentPlan
                                  ? 'text-gray-500'
                                  : 'text-org-primary-color'
                              }`}
                            >
                              {tier.price}
                            </span>
                            <span className="text-base text-muted-text ml-1">
                              /month
                            </span>
                          </div>
                          {tier.note && (
                            <p className="text-xs font-bold text-muted-text">
                              {tier.note}
                            </p>
                          )}
                        </div>

                        <div className="w-full text-left space-y-4">
                          <div>
                            <h4 className="text-xs font-semibold text-gray-700 uppercase mb-1">
                              Included
                            </h4>
                            <ul className="space-y-2">
                              {tier.features.map((feature, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-xs text-muted-text"
                                >
                                  <Icon
                                    icon="lucide:badge-check"
                                    className={`size-4 mt-0.5 ${isCurrentPlan ? 'text-gray-400' : 'text-org-primary'}`}
                                  />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {tier.overage.length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-700 uppercase mb-1">
                                Overage / Performance
                              </h4>
                              <ul className="space-y-2">
                                {tier.overage.map((line, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2 text-xs text-muted-text"
                                  >
                                    <Icon
                                      icon="lucide:alert-circle"
                                      className={`size-4 mt-0.5 ${isCurrentPlan ? 'text-gray-400' : 'text-yellow-600'}`}
                                    />
                                    <span className="flex-1">{line}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {!isSubscribed && (
                        <Button
                          className="mt-6 w-full bg-org-primary"
                          onClick={() =>
                            router.push(`/user/plans`)
                          }
                          {...(idx === 0
                            ? { 'data-tour': 'payments-buy-button' }
                            : {})}
                        >
                          Buy Plan
                        </Button>
                      )}

                      {isSubscribed && isCurrentPlan && (
                        <Button
                          className="mt-6 w-full bg-gray-300 text-gray-600 cursor-not-allowed"
                          disabled
                        >
                          Purchased
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div
            className="bg-white rounded-xl shadow-1 p-4 lg:p-7 lg:col-span-5"
            data-tour="payment-methods"
          >
            <h2 className="text-xl font-bold mb-5 text-org-primary-dark">
              Payment Methods
            </h2>

            <div className="space-y-4">
              {paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between shadow-1 p-5 rounded-2xl relative"
                >
                  <a
                    href={method.link}
                    className="absolute size-full top-0 left-0"
                  />
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center justify-center p-3 rounded-full ${method.bg}`}
                    >
                      {method.icon}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-org-primary-dark">
                        {method.title}
                      </p>
                      {method.description && (
                        <p className="text-base text-org-primary-dark">
                          {method.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="text-org-primary-color size-10" />
                </div>
              ))}
            </div>

            <div
              className="flex items-center space-x-2 py-2 mt-6"
              data-tour="payments-autopay"
            >
              <Switch id="auto-pay" />
              <Label htmlFor="auto-pay">
                Enable Auto-Pay for Future Transactions
              </Label>
            </div>
          </div>

          {/* Confirmation & Security */}
          <div className="lg:col-span-7">
            <div
              className="bg-white rounded-xl shadow-1 p-4 lg:p-7"
              data-tour="payment-security"
            >
              <h2 className="text-xl font-semibold mb-6 text-org-primary-dark">
                Payment Confirmation & Security
              </h2>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-base text-org-primary-dark">
                    256-bit Encrypted Transactions
                  </p>
                  <p className="text-base text-org-primary-dark">
                    Payment Receipts Available for Download
                  </p>
                </div>
                <Button className="bg-org-primary" data-tour="payments-refund">
                  Request a Refund
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* (Optional) Transaction list & FRONTEND pagination UI */}
        {transactionData.length > 0 && (
          <div className="bg-white rounded-xl shadow-1 p-4 lg:p-7">
            <h3 className="text-lg font-semibold text-org-primary-dark mb-4">
              Recent Transactions
            </h3>

            <div className="divide-y">
              {visibleData.map((tx) => (
                <div
                  key={tx.id}
                  className="py-3 flex items-center justify-between"
                >
                  <div className="text-sm">
                    <div className="font-medium text-org-primary-dark">
                      {tx.plan}
                    </div>
                    <div className="text-muted-text">{tx.date}</div>
                  </div>
                  <div className="text-sm">{tx.method}</div>
                  <div className="text-sm font-semibold">{tx.amount}</div>
                  <div>
                    <span className="text-xs px-2 py-1 rounded-full bg-[#33ACC1]/20 text-org-primary">
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <button
                      className={`px-3 py-1 text-sm rounded-md border ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 border-gray-300 opacity-50'
                          : 'bg-white text-gray-800 border-[#C7D5D6] hover:bg-gray-100'
                      }`}
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>
                  </PaginationItem>

                  {Array.from(
                    { length: Math.min(3, totalPages) },
                    (_, i) => i + 1
                  ).map((p) => (
                    <PaginationItem key={p}>
                      <button
                        onClick={() => setCurrentPage(p)}
                        className={`px-3 py-1 text-sm rounded-md border ${
                          currentPage === p
                            ? 'bg-org-primary text-white border-org-primary'
                            : 'bg-white text-gray-800 border-[#C7D5D6] hover:bg-gray-100'
                        }`}
                      >
                        {p}
                      </button>
                    </PaginationItem>
                  ))}

                  {totalPages > 3 && (
                    <>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className="px-3 py-1 text-sm rounded-md border bg-white text-gray-800 border-[#C7D5D6] hover:bg-gray-100"
                        >
                          {totalPages}
                        </button>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem>
                    <button
                      className={`px-3 py-1 text-sm rounded-md border ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 border-gray-300 opacity-50'
                          : 'bg-white text-gray-800 border-[#C7D5D6] hover:bg-gray-100'
                      }`}
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </div>

      {/* Quick launcher */}
      <Button
        onClick={startPaymentsTour}
        className="fixed bottom-6 right-6 rounded-full shadow-lg bg-org-primary"
        aria-label="Start payments page tour"
      >
        Take a tour
      </Button>
    </>
  );
}
