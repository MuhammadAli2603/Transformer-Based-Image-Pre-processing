'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Image, Zap } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-primary via-dark-primary to-dark-secondary" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-primary/10 via-transparent to-transparent" />

      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute top-20 right-20 w-72 h-72 bg-blue-primary/5 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [90, 0, 90],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute bottom-20 left-20 w-96 h-96 bg-purple-primary/5 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-primary/10 border border-blue-primary/20 rounded-full text-blue-primary text-sm font-medium"
            >
              <Sparkles size={16} />
              <span>Powered by Advanced Computer Vision</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl lg:text-7xl font-bold leading-tight"
            >
              <span className="text-text-primary">AI-Powered</span>
              <br />
              <span className="text-gradient">Image Quality</span>
              <br />
              <span className="text-text-primary">Analysis</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-text-secondary max-w-2xl leading-relaxed"
            >
              Advanced computer vision technology to automatically classify and analyze image quality at scale.
              Get instant, detailed quality metrics for all your images.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/auth/signup"
                className="btn-gradient flex items-center justify-center gap-2 text-lg px-8 py-4"
              >
                Get Started
                <ArrowRight size={20} />
              </Link>
              <a
                href="#how-it-works"
                className="px-8 py-4 border-2 border-dark-border hover:border-blue-primary rounded-xl text-text-primary font-medium transition-all duration-300 hover:shadow-glow-blue text-center"
              >
                Learn More
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-8 pt-4"
            >
              <div>
                <div className="text-3xl font-bold text-gradient">99.9%</div>
                <div className="text-sm text-text-muted">Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gradient">&lt;1s</div>
                <div className="text-sm text-text-muted">Processing Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gradient">10K+</div>
                <div className="text-sm text-text-muted">Images Analyzed</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual Elements */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
            role="presentation"
            aria-label="Quality analysis visualization"
          >
            {/* Main Card */}
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="glass-card p-8 space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <Image className="text-white" size={24} />
                </div>
                <div>
                  <div className="text-sm text-text-muted">Quality Analysis</div>
                  <div className="text-lg font-bold text-text-primary">High Quality</div>
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-secondary">Sharpness</span>
                    <span className="text-success font-medium">92%</span>
                  </div>
                  <div className="h-2 bg-dark-tertiary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '92%' }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className="h-full bg-gradient-success"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-secondary">Brightness</span>
                    <span className="text-success font-medium">88%</span>
                  </div>
                  <div className="h-2 bg-dark-tertiary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '88%' }}
                      transition={{ duration: 1, delay: 1 }}
                      className="h-full bg-gradient-success"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-secondary">Contrast</span>
                    <span className="text-success font-medium">95%</span>
                  </div>
                  <div className="h-2 bg-dark-tertiary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '95%' }}
                      transition={{ duration: 1, delay: 1.2 }}
                      className="h-full bg-gradient-success"
                    />
                  </div>
                </div>
              </div>

              {/* Badge */}
              <div className="flex items-center gap-2 text-success">
                <Zap size={16} className="fill-current" />
                <span className="text-sm font-medium">Processed in 0.8s</span>
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
              className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-primary rounded-2xl shadow-glow-blue flex items-center justify-center"
            >
              <Sparkles className="text-white" size={32} />
            </motion.div>

            <motion.div
              animate={{
                y: [0, 15, 0],
                rotate: [0, -5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-purple rounded-2xl shadow-glow-purple opacity-20"
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-text-muted rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-text-muted rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
