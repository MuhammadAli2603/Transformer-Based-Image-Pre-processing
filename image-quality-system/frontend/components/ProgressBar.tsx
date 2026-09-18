'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export default function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-3">
          <span className="text-sm font-medium text-text-primary">{label}</span>
          <span className="text-sm font-semibold text-blue-primary">
            {current} / {total}
          </span>
        </div>
      )}
      <div className="w-full bg-dark-tertiary rounded-full h-5 overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-gradient-primary rounded-full flex items-center justify-center relative overflow-hidden"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 shimmer opacity-30" />

          {percentage > 15 && (
            <span className="text-xs font-bold text-white relative z-10">
              {percentage}%
            </span>
          )}
        </motion.div>
      </div>
    </div>
  );
}
