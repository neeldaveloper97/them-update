'use client';

import React, { useState, useEffect } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip } from 'recharts';

const CustomHoverTooltip = ({ active, payload, label }) => {
  if (active && payload?.length > 0) {
    const value = payload[0].value;
    return (
      <div className="bg-orange-500 text-white text-sm font-semibold rounded-md px-2 py-1 shadow-md">
        ${value.toLocaleString()}
      </div>
    );
  }
  return null;
};

export function ChartAreaInteractive({
  title,
  data,
  chartKeys,
  referenceDate = '2024-06-30',
  timeRangeOptions = [
    { value: '90d', label: 'Daily', days: 90 },
    { value: '30d', label: 'Weekly', days: 30 },
    { value: '7d', label: 'Annually', days: 7 },
  ],
  defaultTimeRange = '30d',
  mobileTimeRange = '7d',
}) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState(defaultTimeRange);

  useEffect(() => {
    if (isMobile) {
      setTimeRange(mobileTimeRange);
    }
  }, [isMobile]);

  const currentRange = timeRangeOptions.find((opt) => opt.value === timeRange);
  const startDate = new Date(referenceDate);
  startDate.setDate(startDate.getDate() - (currentRange?.days || 30));

  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    return date >= startDate;
  });

  return (
    <Card className="@container/card !shadow-1 border-0 h-full justify-betweens">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-primary-dark text-lg lg:text-2xl font-bold">
            {title}
          </CardTitle>

          {/* Desktop toggle group */}
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden p-1 bg-brand-teal-light gap-0.5 rounded-2xl bg-org-primary-light-50"
          >
            {timeRangeOptions.map((option) => (
              <ToggleGroupItem
                key={option.value}
                value={option.value}
                className="h-8 px-2.5 !border-0 !rounded-lg text data-[state=on]:bg-org-primary-dark data-[state=on]:text-white"
              >
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          {/* Mobile dropdown */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="@[767px]/card:hidden flex w-40"
              aria-label="Select a range"
            >
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {timeRangeOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="rounded-lg"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 flex-1">
        <ChartContainer config={{}} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              {chartKeys.map(({ key, color }) => (
                <linearGradient
                  key={key}
                  id={`fill-${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.0} />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }
            />
            <YAxis
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={40}
              tickFormatter={(value) => value.toLocaleString()}
            />
            {/* <ChartTooltip
              content={<ChartTooltipContent hideIndicator hideLabel />}
              cursor={false}
              defaultIndex={1}
            /> */}

            <Tooltip
              content={<CustomHoverTooltip />}
              cursor={{ stroke: '#000', strokeWidth: 1 }}
              isAnimationActive={false}
            />

            {chartKeys.map(({ key, color }) => (
              <Area
                key={key}
                dataKey={key}
                type="monotone"
                fill={`url(#fill-${key})`}
                stroke={color}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
