'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  filename: string;
  quality_score: number;
  category: string;
}

export default function ImageModal({
  isOpen,
  onClose,
  imageUrl,
  filename,
  quality_score,
  category,
}: ImageModalProps) {
  const [scale, setScale] = useState(1);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'high':
        return 'text-success';
      case 'normal':
        return 'text-warning';
      case 'bad':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full h-full max-w-[95vw] max-h-[95vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex-shrink-0 bg-gradient-to-b from-dark-primary/95 to-dark-primary/80 backdrop-blur-sm p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <h3 className="text-xl font-bold text-text-primary truncate mb-1">
                    {filename}
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-text-secondary">
                      Quality Score:{' '}
                      <span className={`font-bold ${getCategoryColor(category)}`}>
                        {(quality_score * 100).toFixed(0)}%
                      </span>
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-lg font-semibold uppercase ${
                      category === 'high'
                        ? 'bg-success/20 text-success'
                        : category === 'normal'
                        ? 'bg-warning/20 text-warning'
                        : 'bg-error/20 text-error'
                    }`}>
                      {category}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleZoomOut}
                    className="p-2 rounded-lg bg-dark-tertiary hover:bg-dark-border transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-5 h-5 text-text-primary" />
                  </button>
                  <button
                    onClick={handleZoomIn}
                    className="p-2 rounded-lg bg-dark-tertiary hover:bg-dark-border transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-5 h-5 text-text-primary" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg bg-dark-tertiary hover:bg-error/20 hover:text-error transition-colors"
                    title="Close"
                  >
                    <X className="w-5 h-5 text-text-primary" />
                  </button>
                </div>
              </div>
            </div>

            {/* Image Container - Perfectly Centered */}
            <div className="flex-1 bg-dark-secondary relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <motion.img
                  src={imageUrl}
                  alt={filename}
                  animate={{ scale }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  className="rounded-lg shadow-2xl"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                  }}
                />
              </div>
            </div>

            {/* Footer Info */}
            <div className="flex-shrink-0 bg-gradient-to-t from-dark-primary/95 to-dark-primary/80 backdrop-blur-sm p-4 rounded-b-2xl">
              <div className="flex items-center justify-center gap-4 text-xs text-text-muted">
                <span>Zoom: {(scale * 100).toFixed(0)}%</span>
                <span>•</span>
                <span>Press ESC to close</span>
                <span>•</span>
                <span>Click backdrop to close</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
