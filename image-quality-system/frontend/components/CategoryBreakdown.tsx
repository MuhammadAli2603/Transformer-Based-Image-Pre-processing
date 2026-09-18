'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CategoryBreakdownProps {
  data?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  delay?: number;
}

export default function CategoryBreakdown({
  data = [
    { name: 'High Quality', value: 385, color: '#10b981' },
    { name: 'Normal Quality', value: 245, color: '#f59e0b' },
    { name: 'Bad Quality', value: 78, color: '#ef4444' },
  ],
  delay = 0,
}: CategoryBreakdownProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="glass-card p-4 border border-dark-border/50">
          <p className="text-sm font-semibold text-text-primary mb-1">
            {data.name}
          </p>
          <p className="text-xs text-text-secondary">
            Count: <span className="font-bold text-text-primary">{data.value}</span>
          </p>
          <p className="text-xs text-text-secondary">
            Percentage: <span className="font-bold text-text-primary">
              {((data.value / total) * 100).toFixed(1)}%
            </span>
          </p>
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
      <div className="mb-6">
        <h3 className="text-xl font-bold text-text-primary mb-1">
          Quality Distribution
        </h3>
        <p className="text-sm text-text-secondary">
          Breakdown by category
        </p>
      </div>

      {/* Chart */}
      <div className="h-[280px] w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with bars */}
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.1 + index * 0.05 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-text-secondary">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-text-primary">{item.value}</span>
                  <span className="text-text-muted min-w-[45px] text-right">
                    {percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-dark-tertiary rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: delay + 0.2 + index * 0.05 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-6 pt-6 border-t border-dark-border/30 flex items-center justify-between">
        <span className="text-sm font-medium text-text-secondary">Total Images</span>
        <span className="text-2xl font-bold text-text-primary">{total}</span>
      </div>
    </motion.div>
  );
}
