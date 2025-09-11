'use client';

import { ChevronDown } from 'lucide-react';
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const chartData = [
  { name: 'Resolve', value: 63, color: '#0097B2' },
  { name: 'In progress', value: 12, color: '#E3F4F8' },
  { name: 'Pending', value: 25, color: '#C2E7ED' },
];

export function ClaimsOverviewPieChart({
  showDonut = true,
  showDropdown = false,
  showViewAll = true,
}) {
  return (
    <div className="rounded-3xl w-full bg-white p-7 pb-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-primary-dark text-lg lg:text-2xl font-bold">
          Claims Overview
        </h3>

        {showDropdown ? (
          <Select>
            <SelectTrigger className="w-[120px] h-8 px-3 py-1 text-sm border rounded-md text-gray-700 font-medium">
              <SelectValue placeholder="Monthly" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        ) : showViewAll ? (
          <button className="text-white bg-primary-dark text-sm px-4 py-1.5 rounded-full hover:opacity-90">
            View All
          </button>
        ) : null}
      </div>

      {/* Chart + Legend */}
      <div className="flex  items-center justify-between gap-4">
        {/* Legend */}
        <div className="flex flex-col gap-3">
          {chartData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 text-sm">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></span>
              <span className="text-gray-500">{entry.name}</span>
              <span className="font-bold text-primary-dark ml-1">
                {entry.value}%
              </span>
            </div>
          ))}
        </div>

        {/* Pie or Donut */}
        <div className="w-full flex-1 h-64 max-w-sm">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={showDonut ? 50 : 0}
                outerRadius={80}
                paddingAngle={1}
                stroke="none"
                isAnimationActive={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
