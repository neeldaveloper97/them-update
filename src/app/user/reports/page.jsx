'use client';

import TourProvider from '@/components/TourProvider';

export const description = 'A multiple bar chart';

import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { REPORTS_ANALYTICS_TOUR_STEPS } from '@/constants/tourSteps';
import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// ---- Data ----
const monthlyData = [
  { month: 'Jan', value: 1200 },
  { month: 'Feb', value: 3200 },
  { month: 'Mar', value: 2800 },
  { month: 'Apr', value: 2700 },
  { month: 'May', value: 2000 },
  { month: 'Jun', value: 3500 },
  { month: 'Jul', value: 1500 },
  { month: 'Aug', value: 3000 },
  { month: 'Sep', value: 900 },
  { month: 'Oct', value: 2200 },
  { month: 'Nov', value: 1300 },
  { month: 'Dec', value: 1900 },
];

const annualData = [
  { year: '2021', value: 21400 },
  { year: '2022', value: 26800 },
  { year: '2023', value: 24100 },
  { year: '2024', value: 28600 },
];

// ---- Helpers ----
function niceMax(n, step = 500) {
  if (n <= 0) return step;
  return Math.ceil(n / step) * step;
}
function kFormat(v) {
  return v >= 1000 ? `${Math.round(v / 100) / 10}k` : `${v}`;
}

const Page = () => {
  const [mode, setMode] = useState('monthly');

  const currentData = useMemo(() => {
    if (mode === 'monthly') {
      return monthlyData.map((d) => ({ label: d.month, value: d.value }));
    }
    return annualData.map((d) => ({ label: d.year, value: d.value }));
  }, [mode]);

  const maxValue = useMemo(
    () => Math.max(...currentData.map((d) => d.value)),
    [currentData]
  );

  const yMax = useMemo(() => {
    const step = mode === 'monthly' ? 500 : 2000;
    return niceMax(maxValue, step);
  }, [maxValue, mode]);

  const yTicks = useMemo(() => {
    const steps = 5;
    const stepSize = Math.max(1, Math.round(yMax / steps / 100) * 100);
    const arr = [];
    for (let v = 0; v <= yMax; v += stepSize) arr.push(v);
    if (arr[arr.length - 1] !== yMax) arr.push(yMax);
    return arr;
  }, [yMax]);
  const dashboardTourCompleted =
    typeof window !== 'undefined'
      ? localStorage.getItem('dashboardTourCompleted') === 'true'
      : true;
  const ReportsTour =
    typeof window !== 'undefined'
      ? localStorage.getItem('startReportsTour') === 'true'
      : false;
  return (
    <>
      {!dashboardTourCompleted && ReportsTour && (
        <TourProvider steps={REPORTS_ANALYTICS_TOUR_STEPS} />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {/* Chart card */}
        <div className="col-span-1 lg:col-span-4">
          <div
            data-tour="reports-chart"
            className="shadow-1 lg:p-8 bg-white rounded-[30px]"
          >
            <div className="flex justify-between lg:items-center flex-col lg:flex-row p-4 lg:p-0 gap-2 lg:gap-0 pb-0 lg:pb-1.5">
              <CardTitle className="text-lg">Savings Overview</CardTitle>

              {/* Mode toggle */}
              <div
                data-tour="reports-mode-toggle"
                className="bg-[#E9F6F9] p-1 rounded-full flex gap-1"
              >
                <Button
                  size="sm"
                  className={`!flex-1 !lg:flex-none rounded-full px-4 transition-all ${mode === 'monthly'
                      ? 'bg-[#33ACC1] text-white'
                      : 'bg-transparent text-[#33ACC1] hover:bg-[#D4EEF3]'
                    }`}
                  onClick={() => setMode('monthly')}
                >
                  Monthly
                </Button>
                <Button
                  size="sm"
                  className={`!flex-1 !lg:flex-none rounded-full px-4 transition-all ${mode === 'annually'
                      ? 'bg-[#33ACC1] text-white'
                      : 'bg-transparent text-[#33ACC1] hover:bg-[#D4EEF3]'
                    }`}
                  onClick={() => setMode('annually')}
                >
                  Annually
                </Button>
              </div>
            </div>

            <div className="h-[326px] p-2 lg:p-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentData} barSize={30}>
                  <XAxis dataKey="label" axisLine={false} tickLine={false} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    domain={[0, yMax]}
                    ticks={yTicks}
                    tickFormatter={(v) => kFormat(v)}
                  />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const val = payload[0].value;
                        return (
                          <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs">
                            ${val.toLocaleString()}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {currentData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.value === maxValue ? '#003F47' : '#33ACC133'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* KPI cards */}
        <div className="gap-4 grid grid-cols-1 lg:col-span-2">
          <div
            data-tour="reports-total-savings"
            className="shadow-1 p-8 bg-white rounded-[30px] flex items-center justify-between"
          >
            <div className="space-y-2">
              <p className="text-base text-muted-text leading-none">
                Total Savings
              </p>
              <h5 className="text-2xl text-org-primary-dark font-bold">
                $45,000
              </h5>
            </div>
            <div className="bg-org-primary-light size-16 flex items-center justify-center text-org-primary-color rounded-full">
              <Icon
                icon="lineicons:hand-taking-dollar"
                width="40"
                height="40"
              />
            </div>
          </div>

          <div
            data-tour="reports-claims-processed"
            className="shadow-1 p-8 bg-white rounded-[30px] flex items-center justify-between"
          >
            <div className="space-y-2">
              <p className="text-base text-muted-text leading-none">
                Claims Processed
              </p>
              <h5 className="text-2xl text-org-primary-dark font-bold">120</h5>
            </div>
            <div className=" bg-orange-100 size-16 flex items-center justify-center text-orange-400 rounded-full">
              <Icon icon="pepicons-pop:dollar" width="30" height="30" />
            </div>
          </div>

          <div
            data-tour="reports-avg-savings"
            className="shadow-1 p-8 bg-white rounded-[30px] flex items-center justify-between"
          >
            <div className="space-y-2">
              <p className="text-base text-muted-text leading-none">
                Avg. Savings per Claim
              </p>
              <h5 className="text-2xl text-org-primary-dark font-bold">$375</h5>
            </div>
            <div className="bg-org-primary-light size-16 flex items-center justify-center text-org-primary-color rounded-full">
              <Icon
                icon="lineicons:hand-taking-dollar"
                width="40"
                height="40"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
