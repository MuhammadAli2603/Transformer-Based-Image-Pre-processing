'use client';

import { motion } from 'framer-motion';
import { Zap, BarChart3, Layers, Target } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Instant Quality Detection',
    description: 'Analyze images in seconds with our advanced AI algorithms. Get instant feedback on image quality metrics.',
    gradient: 'from-blue-primary to-blue-secondary',
  },
  {
    icon: BarChart3,
    title: 'Detailed Metrics',
    description: 'Comprehensive quality scores including sharpness, brightness, contrast, and resolution analysis.',
    gradient: 'from-purple-primary to-purple-secondary',
  },
  {
    icon: Layers,
    title: 'Batch Processing',
    description: 'Upload and analyze multiple images at once. Process up to 20 images simultaneously for faster workflow.',
    gradient: 'from-blue-secondary to-purple-primary',
  },
  {
    icon: Target,
    title: 'Smart Categorization',
    description: 'Automatic classification into High, Normal, and Bad quality categories based on comprehensive analysis.',
    gradient: 'from-purple-secondary to-blue-primary',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dark-secondary" />
      <div className="absolute inset-0 bg-gradient-to-b from-dark-primary to-dark-secondary" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 bg-blue-primary/10 border border-blue-primary/20 rounded-full text-blue-primary text-sm font-medium mb-6"
          >
            Features
          </motion.div>
          <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-6">
            Everything You Need for
            <br />
            <span className="text-gradient">Image Quality Analysis</span>
          </h2>
          <p className="text-xl text-text-secondary">
            Powerful features designed to make image quality assessment effortless and accurate
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="glass-card p-8 group hover:bg-dark-secondary/60 transition-all duration-300 cursor-pointer"
              >
                {/* Icon */}
                <div className="relative mb-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                  >
                    <Icon className="text-white" size={32} />
                  </div>
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
                  />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-gradient transition-all">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect Line */}
                <div className="mt-6 h-1 bg-dark-tertiary rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${feature.gradient}`}
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
