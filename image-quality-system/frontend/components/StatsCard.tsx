'use client';

import { useEffect, useState } from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  color: 'red' | 'yellow' | 'green';
  icon?: string;
}

export default function StatsCard({ title, value, color, icon }: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000; // 1 second
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, value);
      setDisplayValue(Math.round(current));

      if (step >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const colorClasses = {
    red: 'bg-red-50 border-red-200 text-red-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    green: 'bg-green-50 border-green-200 text-green-700',
  };

  const iconClasses = {
    red: 'text-red-500',
    yellow: 'text-yellow-500',
    green: 'text-green-500',
  };

  return (
    <div
      className={`
        rounded-lg border-2 p-6 transition-all duration-300 hover:shadow-lg
        ${colorClasses[color]}
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide opacity-75">
            {title}
          </p>
          <p className="text-4xl font-bold mt-2">{displayValue}</p>
        </div>
        {icon && (
          <div className={`text-5xl ${iconClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
