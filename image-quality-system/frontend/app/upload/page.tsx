'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardNav from '@/components/dashboard/DashboardNav';
import ImageUploader from '@/components/ImageUploader';
import QualityResults from '@/components/QualityResults';
import ProgressBar from '@/components/ProgressBar';
import { imageQualityAPI, QualityResult } from '@/lib/api';
import { Images, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@clerk/nextjs';

export default function UploadPage() {
  const { getToken } = useAuth();
  const [results, setResults] = useState<QualityResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    setError(null);
    setIsProcessing(true);
    setProgress({ current: 0, total: files.length });
    setResults([]);

    const newResults: QualityResult[] = [];

    try {
      // Get Clerk auth token
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      // Process images one by one for real-time progress
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          // Create image preview URL
          const imageUrl = URL.createObjectURL(file);

          const result = await imageQualityAPI.classifyImage(file, token);
          // Add image URL to result
          result.imageUrl = imageUrl;

          newResults.push(result);
          setResults([...newResults]);
          setProgress({ current: i + 1, total: files.length });
        } catch (err) {
          console.error(`Error processing ${file.name}:`, err);
          // Continue with next image even if one fails
        }
      }

      if (newResults.length === 0) {
        setError('No images were successfully processed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    // Revoke object URLs to free memory
    results.forEach(result => {
      if (result.imageUrl) {
        URL.revokeObjectURL(result.imageUrl);
      }
    });

    setResults([]);
    setProgress({ current: 0, total: 0 });
    setError(null);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quality-results-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Calculate statistics
  const stats = {
    total: results.length,
    bad: results.filter((r) => r.category === 'bad').length,
    normal: results.filter((r) => r.category === 'normal').length,
    high: results.filter((r) => r.category === 'high').length,
  };

  // Calculate average quality score
  const avgQuality = results.length > 0
    ? Math.round((results.reduce((sum, r) => sum + r.quality_score, 0) / results.length) * 100)
    : 0;

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
            <h1 className="text-4xl font-bold text-text-primary mb-2">Upload Images</h1>
            <p className="text-text-secondary">
              Upload images for quality analysis. Our AI will provide detailed metrics for each image.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Upload Section - Show when no results */}
            {results.length === 0 && !isProcessing && (
              <motion.div
                key="upload-section"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                <div className="glass-card p-8 lg:p-12">
                  <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-primary mb-4">
                      <Images className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-text-primary mb-2">
                      Upload Images to Analyze
                    </h2>
                    <p className="text-text-secondary max-w-xl mx-auto">
                      Our AI-powered system analyzes image quality using advanced computer vision
                      to classify images as high, normal, or low quality.
                    </p>
                  </div>
                  <ImageUploader onFilesSelected={handleFilesSelected} disabled={isProcessing} />
                </div>
              </motion.div>
            )}

            {/* Processing Section */}
            {isProcessing && (
              <motion.div
                key="processing-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl mx-auto"
              >
                <div className="glass-card p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-gradient-primary animate-pulse">
                      <Images className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-text-primary">
                        Processing Images...
                      </h2>
                      <p className="text-text-secondary">
                        Analyzing image {progress.current} of {progress.total}
                      </p>
                    </div>
                  </div>
                  <ProgressBar
                    current={progress.current}
                    total={progress.total}
                    label="Analysis Progress"
                  />
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                key="error-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto mb-8"
              >
                <div className="glass-card p-6 border-2 border-error/50 bg-error/10">
                  <p className="text-error font-medium">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Results Section */}
            {results.length > 0 && (
              <motion.div
                key="results-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Images className="text-blue-primary" size={24} />
                      <span className="text-text-muted text-sm">Total</span>
                    </div>
                    <div className="text-3xl font-bold text-text-primary">{stats.total}</div>
                  </div>
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle2 className="text-success" size={24} />
                      <span className="text-text-muted text-sm">High</span>
                    </div>
                    <div className="text-3xl font-bold text-success">{stats.high}</div>
                  </div>
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertCircle className="text-warning" size={24} />
                      <span className="text-text-muted text-sm">Normal</span>
                    </div>
                    <div className="text-3xl font-bold text-warning">{stats.normal}</div>
                  </div>
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="text-purple-primary" size={24} />
                      <span className="text-text-muted text-sm">Avg Score</span>
                    </div>
                    <div className="text-3xl font-bold text-text-primary">{avgQuality}%</div>
                  </div>
                </div>

                {/* Detailed Results */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card p-8"
                >
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-text-primary mb-1">
                        Detailed Results
                      </h3>
                      <p className="text-sm text-text-secondary">
                        Complete analysis breakdown for all images
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleExport} className="btn-gradient px-6 py-3">
                        Export Results
                      </button>
                      <button
                        onClick={handleReset}
                        className="px-6 py-3 rounded-xl bg-dark-tertiary hover:bg-dark-border
                                 text-text-primary font-medium transition-all duration-300"
                      >
                        Upload New Batch
                      </button>
                    </div>
                  </div>
                  <QualityResults
                    results={results}
                    onReset={handleReset}
                    onExport={handleExport}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </ProtectedRoute>
  );
}
