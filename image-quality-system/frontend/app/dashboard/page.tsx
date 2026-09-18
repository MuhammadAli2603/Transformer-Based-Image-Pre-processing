'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardNav from '@/components/dashboard/DashboardNav';
import MetricCard from '@/components/MetricCard';
import AIInsightsCard from '@/components/AIInsightsCard';
import RecentAnalysis from '@/components/RecentAnalysis';
import QualityChart from '@/components/QualityChart';
import CategoryBreakdown from '@/components/CategoryBreakdown';
import { Images, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DashboardPage() {
  // Mock stats - replace with real data from your API
  const stats = {
    total: 0,
    high: 0,
    normal: 0,
    bad: 0,
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-dark-primary">
        <DashboardNav />

        <main className="container mx-auto px-4 lg:px-8 pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-text-primary mb-2">Dashboard</h1>
            <p className="text-text-secondary">Welcome back! Here&apos;s your image quality overview.</p>
          </motion.div>

          {/* Empty State */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <div className="glass-card p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-primary mb-6">
                <Images className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-text-primary mb-3">
                No Images Yet
              </h2>
              <p className="text-text-secondary max-w-xl mx-auto mb-8">
                Get started by uploading your first batch of images for quality analysis.
                Our AI will provide detailed metrics and insights.
              </p>
              <Link
                href="/upload"
                className="inline-flex items-center btn-gradient text-lg px-8 py-4"
              >
                <Images className="mr-2" size={20} />
                Upload Images
              </Link>
            </div>
          </motion.div>

          {/* Metrics Grid - Hidden until there's data */}
          {stats.total > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Total Images"
                  value={stats.total}
                  icon={Images}
                  gradient="blue"
                  trend={{ value: 12, isPositive: true }}
                  delay={0}
                />
                <MetricCard
                  title="High Quality"
                  value={stats.high}
                  icon={CheckCircle2}
                  gradient="success"
                  trend={{ value: 8, isPositive: true }}
                  delay={0.1}
                />
                <MetricCard
                  title="Normal Quality"
                  value={stats.normal}
                  icon={AlertCircle}
                  gradient="warning"
                  delay={0.2}
                />
                <MetricCard
                  title="Avg Quality Score"
                  value="0%"
                  icon={TrendingUp}
                  gradient="purple"
                  trend={{ value: 5, isPositive: true }}
                  delay={0.3}
                />
              </div>

              <AIInsightsCard delay={0.4} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <QualityChart delay={0.5} />
                </div>
                <div>
                  <CategoryBreakdown
                    data={[
                      { name: 'High Quality', value: stats.high, color: '#10b981' },
                      { name: 'Normal Quality', value: stats.normal, color: '#f59e0b' },
                      { name: 'Bad Quality', value: stats.bad, color: '#ef4444' },
                    ]}
                    delay={0.6}
                  />
                </div>
              </div>

              <RecentAnalysis delay={0.7} />
            </motion.div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
