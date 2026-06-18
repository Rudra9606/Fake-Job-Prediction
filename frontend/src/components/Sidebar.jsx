import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FileText, ShieldAlert, Globe, Mail, Link2, 
  BarChart3, History, MessageSquare, LayoutDashboard,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    { name: 'Job Scanner', path: '/analyze', icon: FileText },
    { name: 'Domain Checker', path: '/domain-verify', icon: Globe },
    { name: 'Email Checker', path: '/email-verify', icon: Mail },
    { name: 'URL Scanner', path: '/url-scan', icon: Link2 },
    { name: 'Community Reports', path: '/community-reports', icon: ShieldAlert },
    { name: 'Research Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'User Dashboard', path: '/dashboard', icon: History },
    { name: 'Contact & Feedback', path: '/contact', icon: MessageSquare },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ name: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard });
  }

  return (
    <>
      {/* Sidebar - Desktop VisionOS Glass Dock */}
      <motion.aside 
        animate={{ width: isExpanded ? 260 : 76 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="hidden md:flex flex-col shrink-0 sticky top-24 h-[calc(100vh-8rem)] rounded-[32px] border border-zinc-800 bg-zinc-900/30 backdrop-blur-2xl p-4 shadow-lg dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] z-30 select-none justify-between"
      >
        <div className="space-y-6">
          {/* Header Title */}
          <div className="px-3 pb-3 border-b border-zinc-800 flex items-center justify-between">
            <AnimatePresence mode="wait">
              {isExpanded ? (
                <motion.h3 
                  key="expanded-title"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-[10px] font-black text-slate-500 uppercase tracking-widest"
                >
                  Scanners & Tools
                </motion.h3>
              ) : (
                <motion.span 
                  key="collapsed-title"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-black text-slate-500 mx-auto"
                >
                  SHIELD
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2 max-h-[calc(100vh-18rem)] overflow-y-auto pr-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="relative flex items-center rounded-2xl px-4 py-3 text-[11px] font-semibold tracking-wide transition-colors duration-200 text-zinc-400 hover:text-zinc-100 group"
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Sliding Pill Background */}
                      {isActive && (
                        <motion.div
                          layoutId="activeDockBackground"
                          className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl -z-10 shadow-[0_0_20px_rgba(139,92,246,0.08)]"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}

                      {/* Icon */}
                      <Icon className={`h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-purple-400' : 'text-slate-400 group-hover:text-purple-300'}`} />
                      
                      {/* Text */}
                      {isExpanded && (
                        <motion.span 
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="ml-4 whitespace-nowrap"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer: Toggle Button */}
        <div className="pt-4 border-t border-zinc-800 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center h-10 w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 text-slate-400 hover:text-slate-100 cursor-pointer transition-colors"
          >
            {isExpanded ? (
              <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider">
                <ChevronLeft className="h-4 w-4 text-purple-400" />
                <span>Collapse Panel</span>
              </div>
            ) : (
              <ChevronRight className="h-4 w-4 text-purple-400" />
            )}
          </motion.button>
        </div>
      </motion.aside>

      {/* Mobile Floating Bottom Bar */}
      <aside className="md:hidden fixed bottom-4 left-4 right-4 z-40 flex h-16 items-center justify-around rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-xl px-2 shadow-2xl">
        {menuItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center rounded-xl p-2 text-[10px] font-bold transition-all ${
                  isActive
                    ? 'text-purple-400 bg-purple-500/10'
                    : 'text-slate-400'
                }`
              }
            >
              <Icon className="h-5 w-5 mb-0.5" />
            </NavLink>
          );
        })}
      </aside>
    </>
  );
};

export default Sidebar;
