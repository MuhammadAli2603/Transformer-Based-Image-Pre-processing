'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface QualityChartProps {
  data?: Array<{
    name: string;
    high: number;
    normal: number;
    bad: number;
  }>;
  delay?: number;
}

export default function QualityChart({
  data = [
    { name: 'Mon', high: 85, normal: 42, bad: 15 },
    { name: 'Tue', high: 92, normal: 38, bad: 12 },
    { name: 'Wed', high: 78, normal: 45, bad: 18 },
    { name: 'Thu', high: 98, normal: 35, bad: 8 },
    { name: 'Fri', high: 105, normal: 40, bad: 10 },
    { name: 'Sat', high: 88, normal: 42, bad: 14 },
    { name: 'Sun', high: 95, normal: 38, bad: 11 },
  ],
  delay = 0,
}: QualityChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 border border-dark-border/50">
          <p className="text-sm font-semibold text-text-primary mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-text-secondary capitalize">{entry.name}:</span>
              </div>
              <span className="font-bold text-text-primary">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="widget-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-text-primary mb-1">
            Quality Trends
          </h3>
          <p className="text-sm text-text-secondary">
            Weekly analysis breakdown
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-success/20 text-success">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-semibold">+12%</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorBad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.1} />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              tickLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="high"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorHigh)"
              name="High Quality"
            />
            <Area
              type="monotone"
              dataKey="normal"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#colorNormal)"
              name="Normal Quality"
            />
            <Area
              type="monotone"
              dataKey="bad"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#colorBad)"
              name="Bad Quality"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
