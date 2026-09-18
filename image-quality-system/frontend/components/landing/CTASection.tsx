'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTASection() {
  return (
    <section id="pricing" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dark-secondary" />
      <div className="absolute inset-0 bg-gradient-to-b from-dark-primary to-dark-secondary" />

      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-primary/10 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Main CTA Card */}
          <div className="glass-card p-12 lg:p-16 text-center space-y-8">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center justify-center"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center transform rotate-12">
                  <Sparkles className="text-white" size={40} />
                </div>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="absolute inset-0 bg-gradient-primary rounded-2xl blur-2xl"
                />
              </div>
            </motion.div>

            {/* Heading */}
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-text-primary">
                Ready to Analyze Your Images?
              </h2>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                Join thousands of users leveraging AI-powered image quality analysis.
                Get started in minutes with our intuitive platform.
              </p>
            </div>

            {/* Features List */}
            <div className="flex flex-wrap justify-center gap-6 text-text-secondary">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span>Free tier available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span>Cancel anytime</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/auth/signup"
                className="btn-gradient flex items-center justify-center gap-2 text-lg px-10 py-4"
              >
                Get Started Free
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/auth/signin"
                className="px-10 py-4 border-2 border-dark-border hover:border-purple-primary rounded-xl text-text-primary font-medium transition-all duration-300 hover:shadow-glow-purple"
              >
                Sign In
              </Link>
            </div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="pt-8 border-t border-dark-border/50"
            >
              <p className="text-sm text-text-muted mb-4">Trusted by teams at</p>
              <div className="flex flex-wrap justify-center gap-8 items-center opacity-50">
                {['Company A', 'Company B', 'Company C', 'Company D'].map((company) => (
                  <div key={company} className="text-text-muted font-semibold">
                    {company}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
