'use client';

import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown, Maximize2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: LucideIcon;
  gradient?: 'blue' | 'purple' | 'success' | 'warning';
  delay?: number;
}

export default function MetricCard({
  title,
  value,
  trend,
  icon: Icon,
  gradient = 'blue',
  delay = 0,
}: MetricCardProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : 0;

  useEffect(() => {
    if (typeof value === 'number') {
      const duration = 1000;
      const steps = 30;
      const increment = value / steps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current = Math.min(current + increment, value);
        setAnimatedValue(Math.round(current));

        if (step >= steps) {
          clearInterval(timer);
          setAnimatedValue(value);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [value]);

  const gradientClasses = {
    blue: 'from-blue-primary/20 to-blue-secondary/20 border-blue-primary/30',
    purple: 'from-purple-primary/20 to-purple-secondary/20 border-purple-primary/30',
    success: 'from-success/20 to-success/30 border-success/30',
    warning: 'from-warning/20 to-warning/30 border-warning/30',
  };

  const iconGradients = {
    blue: 'from-blue-primary to-blue-secondary',
    purple: 'from-purple-primary to-purple-secondary',
    success: 'from-success to-success',
    warning: 'from-warning to-warning',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="widget-card group relative overflow-hidden"
    >
      {/* Background gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[gradient]} opacity-50 group-hover:opacity-70 transition-opacity duration-300`}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-1">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-bold text-text-primary">
                {typeof value === 'number' ? animatedValue : value}
              </h3>
              {trend && (
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                    trend.isPositive
                      ? 'bg-success/20 text-success'
                      : 'bg-error/20 text-error'
                  }`}
                >
                  {trend.isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{Math.abs(trend.value)}%</span>
                </div>
              )}
            </div>
          </div>

          {/* Icon */}
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${iconGradients[gradient]} shadow-elevation-1 group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Action button */}
        <button
          className="absolute bottom-6 right-6 p-2 rounded-lg bg-dark-tertiary/50 hover:bg-dark-tertiary transition-all opacity-0 group-hover:opacity-100"
          aria-label="Maximize"
        >
          <Maximize2 className="w-4 h-4 text-text-secondary" />
        </button>
      </div>
    </motion.div>
  );
}
