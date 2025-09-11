'use client';

import {
  CartesianGrid,
  Dot,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartTooltip } from '@/components/ui/chart';

const chartData = [
  { month: 'JAN', visitors: 180, fill: '#004C59' },
  { month: 'FEB', visitors: 170, fill: '#004C59' },
  { month: 'MAR', visitors: 165, fill: '#004C59' },
  { month: 'APR', visitors: 185, fill: '#004C59' },
  { month: 'MAY', visitors: 175, fill: '#004C59' },
  { month: 'JUN', visitors: 170, fill: '#004C59' },
  { month: 'JUL', visitors: 180, fill: '#004C59' },
  { month: 'AUG', visitors: 190, fill: '#004C59' },
  { month: 'SEP', visitors: 200, fill: '#004C59' },
  { month: 'OCT', visitors: 210, fill: '#004C59' },
  { month: 'NOV', visitors: 220, fill: '#004C59' },
  { month: 'DEC', visitors: 240, fill: '#004C59' },
];

const chartConfig = {
  visitors: {
    label: 'Claims',
    color: '#004C59',
  },
};

export default function ClaimsPredictionChart() {
  return (
    <Card className="@container/card !shadow-1 border-0 h-full justify-betweens">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-700">
          Claims Prediction
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-4">
        <div className="w-full h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickMargin={8}
              />
              <YAxis
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickMargin={8}
                domain={['dataMin - 10', 'dataMax + 20']}
                tickFormatter={(value) => `${value}k`}
              />
              <ChartTooltip
                cursor={false}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
                        <p className="text-sm font-medium">{`${label}: ${payload[0].value}k`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="visitors"
                stroke="#004C59"
                strokeWidth={2}
                dot={({ cx, cy, payload }) => (
                  <Dot
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill="#004C59"
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                )}
                activeDot={{ r: 6, fill: '#004C59' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
