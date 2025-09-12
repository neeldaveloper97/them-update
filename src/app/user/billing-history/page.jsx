'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import DashboardHeader from '@/components/user/DashboardHeader';
import { Icon } from '@iconify/react';
import { Eye, X } from 'lucide-react';
import { useState } from 'react';

export default function BillingHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const billingData = [
    {
      id: 'TXN-498614',
      date: 'Mar 20, 2025',
      hospital: 'City Hospital',
      originalBill: '$5,000',
      savings: '$1,200',
      finalAmount: '$3,800',
      status: 'Completed',
      statusColor: 'bg-blue-100 text-blue-800',
      patientName: 'John Doe',
      negotiationSavings: '$1,200',
      paymentDate: 'March 24, 2025',
      paymentMethod: 'Credit Card/Visa',
      notes:
        'Negotiated fee is based upon direct negotiation with authorized reps. Final agreement approved by hospital administration.',
    },
    {
      id: 'TXN-493825',
      date: 'Feb 15, 2025',
      hospital: 'Mercy Health',
      originalBill: '$7,800',
      savings: '$2,000',
      finalAmount: '$5,800',
      status: 'Pending',
      statusColor: 'bg-orange-100 text-orange-800',
    },
    {
      id: 'TXN-491772',
      date: 'Jan 12, 2025',
      hospital: 'Sunrise Medical',
      originalBill: '$6,500',
      savings: '$1,000',
      finalAmount: '$5,500',
      status: 'In Progress',
      statusColor: 'bg-green-100 text-green-800',
    },
    {
      id: 'TXN-485501',
      date: 'Dec 03, 2024',
      hospital: 'Valley Care Center',
      originalBill: '$4,300',
      savings: '$900',
      finalAmount: '$3,400',
      status: 'Completed',
      statusColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'TXN-481144',
      date: 'Nov 25, 2024',
      hospital: 'Global Health Group',
      originalBill: '$9,000',
      savings: '$2,500',
      finalAmount: '$6,500',
      status: 'Pending',
      statusColor: 'bg-orange-100 text-orange-800',
    },
    {
      id: 'TXN-479923',
      date: 'Oct 19, 2024',
      hospital: 'Trinity General',
      originalBill: '$3,750',
      savings: '$950',
      finalAmount: '$2,800',
      status: 'In Progress',
      statusColor: 'bg-green-100 text-green-800',
    },
    {
      id: 'TXN-479812',
      date: 'Oct 19, 2024',
      hospital: 'Trinity General',
      originalBill: '$3,750',
      savings: '$950',
      finalAmount: '$2,800',
      status: 'In Progress',
      statusColor: 'bg-green-100 text-green-800',
    },
    {
      id: 'TXN-476554',
      date: 'Sep 09, 2024',
      hospital: 'Beacon Hospital',
      originalBill: '$8,150',
      savings: '$1,600',
      finalAmount: '$6,550',
      status: 'Completed',
      statusColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'TXN-473312',
      date: 'Aug 21, 2024',
      hospital: 'Northern Wellness',
      originalBill: '$5,000',
      savings: '$1,300',
      finalAmount: '$3,700',
      status: 'Completed',
      statusColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'TXN-469877',
      date: 'Jul 05, 2024',
      hospital: 'Allied Medical',
      originalBill: '$5,500',
      savings: '$1,100',
      finalAmount: '$4,400',
      status: 'In Progress',
      statusColor: 'bg-green-100 text-green-800',
    },
  ];

  const itemsPerPage = 8;
  const totalPages = Math.ceil(billingData.length / itemsPerPage);
  const visibleData = billingData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusStyles = {
    Completed: 'bg-[#33ACC1]/20 text-org-primary',
    Pending: 'bg-orange-100 text-orange-800',
    'In Progress': 'bg-green-100 text-green-800',
  };

  const openDetailModal = (bill) => {
    setSelectedBill(bill);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-6">
      {/* <DashboardHeader pageTitle="Billing History" /> */}
      <div className="gap-6 grid grid-cols-1 md:grid-cols-4">
        <Card className="flex flex-row items-center gap-4 !shadow-1 p-5 border-0 rounded-3xl">
          <div className="bg-org-primary-light-50 p-3 rounded-full">
            <Icon
              className="text-org-primary"
              icon="solar:hand-money-linear"
              width="40"
              height="40"
            />
          </div>
          <div>
            <p className="text-muted-text text-base leading-6">
              Total Claims Received
            </p>
            <h3 className="font-bold text-org-primary-dark text-2xl">72</h3>
          </div>
        </Card>
        <Card className="flex flex-row items-center gap-4 !shadow-1 p-5 border-0 rounded-3xl">
          <div className="bg-orange-100 p-3 rounded-full">
            <Icon
              className="text-orange-400"
              icon="flowbite:dollar-outline"
              width="40"
              height="40"
            />
          </div>
          <div>
            <p className="text-muted-text text-base leading-6">
              Revenue Collected
            </p>
            <h3 className="font-bold text-org-primary-dark text-2xl">
              $224,500
            </h3>
          </div>
        </Card>
        <Card className="flex flex-row items-center gap-4 !shadow-1 p-5 border-0 rounded-3xl">
          <div className="bg-yellow-100 p-3 rounded-full">
            <Icon
              className="text-yellow-400"
              icon="solar:hand-money-linear"
              width="40"
              height="40"
            />
          </div>
          <div>
            <p className="text-muted-text text-base leading-6">
              Amount Adjusted
            </p>
            <h3 className="font-bold text-org-primary-dark text-2xl">
              $78,000
            </h3>
          </div>
        </Card>
        <Card className="flex flex-row items-center gap-4 !shadow-1 p-5 border-0 rounded-3xl">
          <div className="bg-orange-100 p-3 rounded-full">
            <Icon
              className="text-orange-400"
              icon="flowbite:dollar-outline"
              width="40"
              height="40"
            />
          </div>
          <div>
            <p className="text-muted-text text-base leading-6">
              Avg. Negotiation Time
            </p>
            <h3 className="font-bold text-org-primary-dark text-2xl">
              2.3 Days
            </h3>
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap lg:flex-nowrap justify-end gap-6">
        <div className="flex items-center mr-2 font-medium text-org-primary-dark text-sm">
          Export Report:
        </div>
        <Button className="bg-org-primary rounded-xl" size="lg">
          Export As PDF
        </Button>
        <Button className="bg-org-primary rounded-xl" size="lg">
          Export As CSV
        </Button>
        <Button className="bg-org-primary rounded-xl" size="lg">
          Export As Excel
        </Button>
      </div>

      <div className="bg-white shadow-1 rounded-xl">
        <div className="p-5">
          <h2 className="font-bold text-org-primary-dark text-2xl">
            Billing History
          </h2>
        </div>

        <div className="hidden md:block w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-gray-200 border-y">
                  <th className="px-5 py-2.5 font-normal text-muted-text text-sm text-left">
                    Date
                  </th>
                  <th className="px-5 py-2.5 font-normal text-muted-text text-sm text-left">
                    Hospital
                  </th>
                  <th className="px-5 py-2.5 font-normal text-muted-text text-sm text-left">
                    Original Bill
                  </th>
                  <th className="px-5 py-2.5 font-normal text-muted-text text-sm text-left">
                    Savings
                  </th>
                  <th className="px-5 py-2.5 font-normal text-muted-text text-sm text-left">
                    Final Amount
                  </th>
                  <th className="px-5 py-2.5 font-normal text-muted-text text-sm text-left">
                    Status
                  </th>
                  <th className="px-5 py-2.5 font-normal text-muted-text text-sm text-left">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 border-gray-100"
                  >
                    <td className="px-5 py-3 text-sm leading-6">{item.date}</td>
                    <td className="px-5 py-3 text-sm leading-6">
                      {item.hospital}
                    </td>
                    <td className="px-5 py-3 text-sm leading-c6">
                      {item.originalBill}
                    </td>
                    <td className="px-5 py-3 text-sm leading-6">
                      {item.savings}
                    </td>
                    <td className="px-5 py-3 text-sm leading-6">
                      {item.finalAmount}
                    </td>
                    <td className="px-5 py-3 text-sm leading-6">
                      <span
                        className={`block text-center w-[74px] leading-4 rounded-full px-2 py-1 text-[10px] font-medium ${statusStyles[item.status] ??
                          'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm leading-6">
                      <Dialog>
                        <DialogTrigger className="hover:bg-neutral-200 p-2.5 rounded-lg transition-all cursor-pointer">
                          <Eye className="w-4 h-4" />
                        </DialogTrigger>
                        <DialogContent
                          className="p-5 rounded-xl w-full !max-w-[728px] sm:max-w-xl"
                          showCloseButton={false}
                        >
                          <DialogHeader className="mb-4 border-b">
                            <div className="flex justify-between items-center">
                              <DialogTitle className="font-bold text-org-primary-dark text-2xl">
                                Billing Detail for City Hospital
                              </DialogTitle>
                              <DialogClose asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="hover:bg-gray-100"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </DialogClose>
                            </div>

                            <p className="py-3 text-base">
                              Date:{' '}
                              <span className="ps-3 font-bold text-org-primary">
                                Mar 20, 2025
                              </span>
                            </p>
                          </DialogHeader>

                          <div className="gap-x-10 gap-y-5 grid grid-cols-2 text-sm">
                            <div className="grid grid-cols-2 py-3">
                              <p className="text-muted-foreground">Hospital</p>
                              <p className="font-semibold text-org-primary text-end">
                                City Hospital
                              </p>
                            </div>

                            <div className="grid grid-cols-2 py-3">
                              <p className="text-muted-foreground">
                                Original Bill Amount
                              </p>
                              <p className="font-semibold text-org-primary text-end">
                                $5,000
                              </p>
                            </div>

                            <div className="grid grid-cols-2 py-3">
                              <p className="text-muted-foreground">
                                Patient Name
                              </p>
                              <p className="font-semibold text-org-primary text-end">
                                John Doe
                              </p>
                            </div>

                            <div className="grid grid-cols-2 py-3">
                              <p className="text-muted-foreground">
                                Negotiated Savings
                              </p>
                              <p className="font-semibold text-org-primary text-end">
                                $1,200
                              </p>
                            </div>

                            <div className="grid grid-cols-2 py-3">
                              <p className="text-muted-foreground">
                                Bill ID / Ref. No.
                              </p>
                              <p className="font-semibold text-org-primary text-end">
                                TXN-908213
                              </p>
                            </div>

                            <div className="grid grid-cols-2 py-3">
                              <p className="text-muted-foreground">
                                Final Paid Amount
                              </p>
                              <p className="font-semibold text-org-primary text-end">
                                $3,800
                              </p>
                            </div>

                            <div className="grid grid-cols-2 py-3">
                              <p className="text-muted-foreground">
                                Date of Payment
                              </p>
                              <p className="font-semibold text-org-primary text-end">
                                March 22, 2025
                              </p>
                            </div>

                            <div className="grid grid-cols-2 py-3">
                              <p className="text-muted-foreground">Status</p>
                              <p className="font-semibold text-org-primary text-end">
                                <span className="bg-org-primary-light-50 px-2.5 py-1 rounded-full font-medium text-xs">
                                  Completed
                                </span>
                              </p>
                            </div>

                            <div className="grid grid-cols-2 py-3">
                              <p className="text-muted-foreground">
                                Payment Method
                              </p>
                              <p className="font-semibold text-org-primary text-end">
                                Credit Card (Visa)
                              </p>
                            </div>
                          </div>

                          <div className="pt-5 border-[#E5E7EC] border-t">
                            <div className="pb-5 text-sm">
                              <p className="pb-5 font-bold text-org-primary-dark text-xl">
                                Note:
                              </p>
                              <p className="text-muted-text">
                                Negotiated due to excess room charges and
                                duplicate tests. Final agreement approved by
                                hospital billing department.
                              </p>
                            </div>

                            <div>
                              <Button className="bg-org-primary hover:bg-org-primary-dark text-white">
                                Export As PDF
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="md:hidden space-y-4">
          {billingData.map((item) => (
            <div
              key={item.id}
              className="space-y-2 bg-white shadow p-4 rounded-xl"
            >
              <div className="flex justify-between text-sm">
                <span className="text-muted-text">Date</span>
                <span>{item.date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-text">Hospital</span>
                <span>{item.hospital}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-text">Original Bill</span>
                <span>{item.originalBill}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-text">Savings</span>
                <span>{item.savings}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-text">Final Amount</span>
                <span>{item.finalAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-text">Status</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${statusStyles[item.status]}`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Pagination className="justify-end p-5">
          <PaginationContent className="gap-1.5">
            <PaginationItem>
              <PaginationLink
                href="#"
                className={
                  currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                }
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1)
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                }}
              >
                Prev
              </PaginationLink>
            </PaginationItem>

            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
              const pageNum = i + 1;
              const isActive = currentPage === pageNum;
              return (
                <PaginationItem key={`page-${pageNum}`}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === pageNum}
                    className={`px-3 py-1 text-sm rounded-md border transition-colors ${isActive
                        ? 'bg-org-primary text-white border-org-primary'
                        : 'bg-white text-gray-800 border-[#C7D5D6] hover:bg-gray-100'
                      }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(pageNum);
                    }}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {totalPages > 5 && (
              <>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    className="text-org-primary-dark"
                    isActive={currentPage === totalPages}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(totalPages);
                    }}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationLink
                href="#"
                className={
                  currentPage === totalPages
                    ? 'pointer-events-none opacity-50'
                    : ''
                }
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages)
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                }}
              >
                Next
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
