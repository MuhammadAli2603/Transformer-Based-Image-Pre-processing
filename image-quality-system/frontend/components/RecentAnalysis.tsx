'use client';

import { motion } from 'framer-motion';
import { Image, CheckCircle2, AlertCircle, XCircle, Clock } from 'lucide-react';

interface AnalysisItem {
  filename: string;
  category: 'high' | 'normal' | 'bad';
  score: number;
  timestamp: string;
  size: string;
}

interface RecentAnalysisProps {
  items?: AnalysisItem[];
  delay?: number;
}

export default function RecentAnalysis({
  items = [
    {
      filename: 'IMG_2024_001.jpg',
      category: 'high',
      score: 95,
      timestamp: '2 min ago',
      size: '2.4 MB',
    },
    {
      filename: 'photo_sunset.png',
      category: 'high',
      score: 89,
      timestamp: '5 min ago',
      size: '1.8 MB',
    },
    {
      filename: 'screenshot_001.jpg',
      category: 'normal',
      score: 67,
      timestamp: '12 min ago',
      size: '856 KB',
    },
    {
      filename: 'low_res_img.jpg',
      category: 'bad',
      score: 34,
      timestamp: '18 min ago',
      size: '342 KB',
    },
    {
      filename: 'vacation_photo.jpg',
      category: 'high',
      score: 92,
      timestamp: '25 min ago',
      size: '3.1 MB',
    },
  ],
  delay = 0,
}: RecentAnalysisProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'high':
        return <CheckCircle2 className="w-5 h-5 text-success" aria-label="High quality" />;
      case 'normal':
        return <AlertCircle className="w-5 h-5 text-warning" aria-label="Normal quality" />;
      case 'bad':
        return <XCircle className="w-5 h-5 text-error" aria-label="Bad quality" />;
      default:
        return <Image className="w-5 h-5 text-text-secondary" aria-label="Image" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      high: 'bg-success/20 text-success border-success/30',
      normal: 'bg-warning/20 text-warning border-warning/30',
      bad: 'bg-error/20 text-error border-error/30',
    };
    return badges[category as keyof typeof badges] || 'bg-text-secondary/20 text-text-secondary';
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
            Recent Analysis
          </h3>
          <p className="text-sm text-text-secondary">
            Latest processed images
          </p>
        </div>
        <button className="text-sm font-medium text-blue-primary hover:text-blue-secondary transition-colors">
          View All
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + index * 0.05 }}
            className="group flex items-center gap-4 p-4 rounded-xl bg-dark-tertiary/30 hover:bg-dark-tertiary/50 transition-all duration-300 cursor-pointer"
          >
            {/* Icon */}
            <div className="p-2 rounded-lg bg-dark-secondary/50">
              {getCategoryIcon(item.category)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate mb-1">
                {item.filename}
              </p>
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <Clock className="w-3 h-3" />
                <span>{item.timestamp}</span>
                <span className="text-text-muted">•</span>
                <span>{item.size}</span>
              </div>
            </div>

            {/* Score */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-bold text-text-primary">
                  {item.score}
                </p>
                <p className="text-xs text-text-secondary">Score</p>
              </div>

              {/* Category badge */}
              <div
                className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getCategoryBadge(
                  item.category
                )}`}
              >
                {item.category.toUpperCase()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
