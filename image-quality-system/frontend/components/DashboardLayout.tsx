'use client';

import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Images,
  BarChart3,
  Settings,
  Menu,
  X,
  Plus,
  Calendar,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  showDateSelector?: boolean;
  showAddWidget?: boolean;
}

export default function DashboardLayout({
  children,
  title = 'Dashboard',
  showDateSelector = true,
  showAddWidget = true,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Images, label: 'Gallery', active: false },
    { icon: BarChart3, label: 'Analytics', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <div className="min-h-screen bg-dark-primary flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? 280 : 80,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="glass-card h-screen sticky top-0 border-r border-dark-border/30 overflow-hidden"
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <Images className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient">ImageAI</span>
              </motion.div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-dark-tertiary/50 transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-text-secondary" />
              ) : (
                <Menu className="w-5 h-5 text-text-secondary" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-300 group
                  ${
                    item.active
                      ? 'bg-gradient-primary text-white shadow-glow-blue'
                      : 'text-text-secondary hover:bg-dark-tertiary/50 hover:text-text-primary'
                  }
                `}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    item.active ? 'text-white' : 'text-text-secondary group-hover:text-blue-primary'
                  }`}
                />
                {sidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Bottom User Section */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-6 left-6 right-6"
          >
            <div className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-purple flex items-center justify-center text-white font-bold">
                  U
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    User
                  </p>
                  <p className="text-xs text-text-secondary truncate">
                    user@example.com
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="glass-card border-b border-dark-border/30 sticky top-0 z-10 backdrop-blur-xl">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-1">
                  {title}
                </h1>
                <p className="text-text-secondary">
                  Welcome back! Here&apos;s your image quality overview
                </p>
              </div>

              <div className="flex items-center gap-4">
                {showDateSelector && (
                  <button className="glass-card px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-dark-secondary/60 transition-all">
                    <Calendar className="w-4 h-4 text-text-secondary" />
                    <span className="text-sm font-medium text-text-primary">
                      This Month
                    </span>
                  </button>
                )}

                {showAddWidget && (
                  <button className="btn-gradient flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Add Widget</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-auto scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}
