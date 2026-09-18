'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileImage } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImageUploaderProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export default function ImageUploader({ onFilesSelected, disabled = false }: ImageUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFilesSelected(acceptedFiles);
    }
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    multiple: true,
    disabled,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative overflow-hidden
        border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
        transition-all duration-300 ease-in-out
        ${isDragActive
          ? 'border-blue-primary bg-blue-primary/10 shadow-glow-blue scale-[1.01]'
          : 'border-dark-border/50 hover:border-blue-primary/50 bg-dark-tertiary/30 hover:bg-dark-tertiary/50 hover:scale-[1.01]'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br from-blue-primary/5 to-purple-primary/5 transition-opacity duration-300 ${isDragActive ? 'opacity-100' : 'opacity-0'}`} />

      <input {...getInputProps()} />
      <div className="relative flex flex-col items-center space-y-6">
        {/* Icon */}
        <motion.div
          animate={{
            y: isDragActive ? -10 : 0,
            scale: isDragActive ? 1.1 : 1,
          }}
          transition={{ duration: 0.3 }}
          className={`p-6 rounded-2xl transition-all duration-300 ${
            isDragActive
              ? 'bg-gradient-primary shadow-glow-blue'
              : 'bg-dark-secondary/50'
          }`}
        >
          {isDragActive ? (
            <FileImage className="w-12 h-12 text-white" />
          ) : (
            <Upload className="w-12 h-12 text-blue-primary" />
          )}
        </motion.div>

        {/* Text */}
        <div className="space-y-2">
          {isDragActive ? (
            <p className="text-xl font-bold text-blue-primary">
              Drop the images here...
            </p>
          ) : (
            <>
              <p className="text-xl font-bold text-text-primary">
                Drag & drop images here
              </p>
              <p className="text-sm text-text-secondary">
                or click to browse files
              </p>
            </>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2 text-xs text-text-muted">
          <div className="flex items-center gap-2 justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-success" />
            <span>PNG, JPG, JPEG, GIF, BMP, WEBP</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-primary" />
            <span>Max size: 10MB per file</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-primary" />
            <span>Multiple files supported</span>
          </div>
        </div>
      </div>
    </div>
  );
}
