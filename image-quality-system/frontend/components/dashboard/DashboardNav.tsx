'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, LayoutDashboard, Upload, Settings } from 'lucide-react';
import { UserButton, useUser } from '@clerk/nextjs';

export default function DashboardNav() {
  const pathname = usePathname();
  const { user } = useUser();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Upload, label: 'Upload', href: '/upload' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-primary/80 backdrop-blur-xl border-b border-dark-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-blue-primary group-hover:text-purple-primary transition-colors" />
              <div className="absolute inset-0 bg-blue-primary/20 blur-xl group-hover:bg-purple-primary/20 transition-colors" />
            </div>
            <span className="text-xl font-bold text-gradient">ImageAI</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                    active
                      ? 'text-text-primary bg-dark-secondary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-dark-secondary/50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                  {active && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-gradient-primary opacity-10 rounded-lg"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-dark-secondary rounded-lg">
              <div className="text-sm">
                <div className="text-text-primary font-medium">{user?.firstName || user?.username || 'User'}</div>
                <div className="text-text-muted text-xs">{user?.primaryEmailAddress?.emailAddress}</div>
              </div>
            </div>

            {/* Clerk User Button */}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10'
                }
              }}
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex gap-2 pb-3 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all duration-300 ${
                  active
                    ? 'text-text-primary bg-dark-secondary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-dark-secondary/50'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
                {active && (
                  <motion.div
                    layoutId="activeMobileNav"
                    className="absolute inset-0 bg-gradient-primary opacity-10 rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
