'use client';

import { motion } from 'framer-motion';
import { Upload, Cpu, BarChart2, Download } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    number: '01',
    title: 'Upload Images',
    description: 'Drag and drop or select images from your device. Support for all major image formats.',
  },
  {
    icon: Cpu,
    number: '02',
    title: 'AI Analysis',
    description: 'Our advanced computer vision algorithms analyze sharpness, brightness, contrast, and resolution.',
  },
  {
    icon: BarChart2,
    number: '03',
    title: 'Get Results',
    description: 'View detailed quality scores and metrics for each image with smart categorization.',
  },
  {
    icon: Download,
    number: '04',
    title: 'Export Data',
    description: 'Download comprehensive analysis reports in JSON format for further processing.',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dark-primary" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 bg-purple-primary/10 border border-purple-primary/20 rounded-full text-purple-primary text-sm font-medium mb-6"
          >
            How It Works
          </motion.div>
          <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-6">
            Simple Process,
            <br />
            <span className="text-gradient">Powerful Results</span>
          </h2>
          <p className="text-xl text-text-secondary">
            Get started in minutes with our intuitive workflow
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-6xl mx-auto">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-primary via-purple-primary to-blue-primary transform -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative"
                >
                  {/* Card */}
                  <div className="glass-card p-6 h-full hover:bg-dark-secondary/60 transition-all duration-300 group cursor-pointer">
                    {/* Number Badge */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center font-bold text-white shadow-glow-blue">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-dark-tertiary rounded-2xl flex items-center justify-center group-hover:bg-gradient-primary transition-all duration-300">
                        <Icon className="text-blue-primary group-hover:text-white transition-colors" size={32} />
                      </div>
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.3,
                        }}
                        className="absolute inset-0 bg-blue-primary rounded-2xl blur-xl"
                      />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-text-primary mb-3">
                      {step.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow Connector - Desktop */}
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                      className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 translate-x-full z-20"
                    >
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-primary" />
                        <div className="w-1 h-1 rounded-full bg-blue-primary/60" />
                        <div className="w-0.5 h-0.5 rounded-full bg-blue-primary/30" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <a
            href="/auth/signup"
            className="inline-flex items-center btn-gradient text-lg px-10 py-4"
          >
            Start Analyzing Now
          </a>
        </motion.div>
      </div>
    </section>
  );
}
