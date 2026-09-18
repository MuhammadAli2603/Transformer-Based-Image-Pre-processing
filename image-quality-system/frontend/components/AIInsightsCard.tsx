'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Insight {
  title: string;
  description: string;
  metric?: string;
}

interface AIInsightsCardProps {
  insights?: Insight[];
  delay?: number;
}

export default function AIInsightsCard({
  insights = [
    {
      title: 'Quality Improvement',
      description: 'Your average image quality has improved by 23% this month.',
      metric: '+23%',
    },
    {
      title: 'Processing Speed',
      description: 'Analysis time reduced by 35% with optimized algorithms.',
      metric: '-35%',
    },
    {
      title: 'Batch Efficiency',
      description: 'Larger batches show 40% better processing efficiency.',
      metric: '+40%',
    },
  ],
  delay = 0,
}: AIInsightsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="widget-card group relative overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-primary/20 via-blue-primary/20 to-purple-secondary/20 opacity-50 group-hover:opacity-70 transition-opacity duration-300" />

      {/* Glow effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-primary/30 rounded-full blur-3xl group-hover:bg-purple-primary/40 transition-all duration-500" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-primary/30 rounded-full blur-3xl group-hover:bg-blue-primary/40 transition-all duration-500" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-primary to-blue-primary shadow-elevation-1 animate-glow">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                AI Insights
                <span className="px-2 py-1 text-xs font-semibold bg-purple-primary/20 text-purple-primary rounded-lg">
                  Beta
                </span>
              </h3>
              <p className="text-sm text-text-secondary">
                Powered by machine learning
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg bg-dark-tertiary/50 hover:bg-dark-tertiary transition-all"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-text-secondary" />
            ) : (
              <ChevronDown className="w-5 h-5 text-text-secondary" />
            )}
          </button>
        </div>

        {/* First insight (always visible) */}
        {insights.length > 0 && (
          <div className="mb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-base font-semibold text-text-primary mb-1">
                  {insights[0].title}
                </h4>
                <p className="text-sm text-text-secondary">
                  {insights[0].description}
                </p>
              </div>
              {insights[0].metric && (
                <div className="ml-4 px-3 py-1 rounded-lg bg-gradient-to-r from-success/20 to-success/30 text-success font-bold text-lg">
                  {insights[0].metric}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Expandable insights */}
        <AnimatePresence>
          {isExpanded && insights.length > 1 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-4 border-t border-dark-border/30">
                {insights.slice(1).map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-text-primary mb-1">
                        {insight.title}
                      </h4>
                      <p className="text-sm text-text-secondary">
                        {insight.description}
                      </p>
                    </div>
                    {insight.metric && (
                      <div className="ml-4 px-3 py-1 rounded-lg bg-gradient-to-r from-blue-primary/20 to-blue-secondary/30 text-blue-primary font-bold text-lg">
                        {insight.metric}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View all button */}
        {!isExpanded && insights.length > 1 && (
          <button
            onClick={() => setIsExpanded(true)}
            className="mt-4 text-sm font-medium text-blue-primary hover:text-blue-secondary transition-colors flex items-center gap-1"
          >
            View {insights.length - 1} more insight{insights.length > 2 ? 's' : ''}
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
