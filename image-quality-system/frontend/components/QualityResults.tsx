'use client';

import { QualityResult } from '@/lib/api';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, XCircle, ImageIcon } from 'lucide-react';
import { useState } from 'react';
import ImageModal from './ImageModal';

interface QualityResultsProps {
  results: QualityResult[];
  onReset: () => void;
  onExport: () => void;
}

export default function QualityResults({ results, onReset, onExport }: QualityResultsProps) {
  const [selectedImage, setSelectedImage] = useState<QualityResult | null>(null);
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bad':
        return 'border-error/30 bg-error/5';
      case 'normal':
        return 'border-warning/30 bg-warning/5';
      case 'high':
        return 'border-success/30 bg-success/5';
      default:
        return 'border-dark-border/30 bg-dark-tertiary/30';
    }
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      bad: 'bg-error/20 text-error border-error/30',
      normal: 'bg-warning/20 text-warning border-warning/30',
      high: 'bg-success/20 text-success border-success/30',
    };
    return badges[category as keyof typeof badges] || 'bg-dark-tertiary text-text-secondary';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'high':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'normal':
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'bad':
        return <XCircle className="w-5 h-5 text-error" />;
      default:
        return null;
    }
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, QualityResult[]>);

  const categories = [
    { key: 'high', label: 'High Quality' },
    { key: 'normal', label: 'Normal Quality' },
    { key: 'bad', label: 'Bad Quality' },
  ];

  return (
    <>
      {/* Image Modal */}
      {selectedImage && selectedImage.imageUrl && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage.imageUrl}
          filename={selectedImage.filename}
          quality_score={selectedImage.quality_score}
          category={selectedImage.category}
        />
      )}

      <div className="space-y-6">
      {/* Grouped Results */}
      {categories.map((category) => {
        const categoryResults = groupedResults[category.key] || [];
        if (categoryResults.length === 0) return null;

        return (
          <div key={category.key} className="space-y-4">
            <div className="flex items-center gap-3">
              {getCategoryIcon(category.key)}
              <h3 className="text-lg font-bold text-text-primary">
                {category.label}
              </h3>
              <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getCategoryBadge(category.key)}`}>
                {categoryResults.length} {categoryResults.length === 1 ? 'image' : 'images'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryResults.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-2 rounded-xl p-5 transition-all duration-300 hover:shadow-elevation-2 hover:scale-[1.02] ${getCategoryColor(
                    result.category
                  )}`}
                >
                  {/* Image Thumbnail */}
                  {result.imageUrl ? (
                    <div
                      onClick={() => setSelectedImage(result)}
                      className="mb-3 relative w-full h-32 rounded-lg overflow-hidden bg-dark-tertiary cursor-pointer group"
                    >
                      <img
                        src={result.imageUrl}
                        alt={result.filename}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-white text-xs font-semibold flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4" />
                          <span>View Full Size</span>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* Filename */}
                  <div className="mb-4 flex items-start justify-between">
                    <p className="font-semibold text-text-primary truncate flex-1" title={result.filename}>
                      {result.filename}
                    </p>
                    {getCategoryIcon(result.category)}
                  </div>

                  {/* Quality Score */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-text-secondary">Quality Score</span>
                      <span className="text-2xl font-bold text-text-primary">
                        {(result.quality_score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-dark-tertiary rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.quality_score * 100}%` }}
                        transition={{ duration: 0.8, delay: index * 0.05 }}
                        className={`h-full rounded-full ${
                          result.category === 'high'
                            ? 'bg-gradient-success'
                            : result.category === 'normal'
                            ? 'bg-gradient-warning'
                            : 'bg-gradient-to-r from-error to-error'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-2.5 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Sharpness:</span>
                      <span className="font-semibold text-text-primary">{(result.metrics.sharpness * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Brightness:</span>
                      <span className="font-semibold text-text-primary">{(result.metrics.brightness * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Contrast:</span>
                      <span className="font-semibold text-text-primary">{(result.metrics.contrast * 100).toFixed(0)}%</span>
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div className="pt-3 border-t border-dark-border/30">
                    <p className="text-xs text-text-muted">
                      {result.dimensions.width} × {result.dimensions.height} • {result.dimensions.megapixels} MP
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
      </div>
    </>
  );
}
