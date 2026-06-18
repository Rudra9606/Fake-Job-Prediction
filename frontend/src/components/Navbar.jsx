import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { Shield, LogIn, UserPlus, LogOut, User, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-zinc-950/40 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800/80 py-4 transition-colors duration-300">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10">
        <div className="flex h-12 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <motion.div 
                whileHover={{ rotate: 15, scale: 1.05 }}
                className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-zinc-900/50 border border-gray-200 dark:border-purple-500/30 flex items-center justify-center transition-all shadow-sm dark:shadow-[0_0_15px_rgba(168,85,247,0.05)]"
              >
                <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </motion.div>
              <span className="font-black tracking-tight text-lg transition-all text-gray-900 dark:text-white">
                Fake<span className="text-purple-600 dark:text-purple-400">Job</span>Shield
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-xs font-bold tracking-wide uppercase">
            {[
              { name: 'Home', path: '/' },
              { name: 'About', path: '/about' },
              { name: 'Features', path: '/features' },
              { name: 'Scam Center', path: '/scam-awareness' }
            ].map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`relative py-1.5 transition-all flex items-center ${
                    active 
                      ? 'text-purple-600 dark:text-purple-400 font-extrabold' 
                      : 'text-gray-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400'
                  }`}
                >
                  <motion.span whileHover={{ y: -1 }} transition={{ duration: 0.2 }}>
                    {link.name}
                  </motion.span>
                  {active && (
                    <motion.div 
                      layoutId="navActiveLine"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-purple-600 dark:bg-purple-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-100/50 dark:bg-zinc-900/40 text-gray-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-zinc-100 transition-all cursor-pointer flex items-center justify-center"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 text-indigo-600 transition-transform duration-300 hover:-rotate-12" />
              )}
            </motion.button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1.5 rounded-xl border border-gray-200 dark:border-zinc-800/80 bg-gray-100/80 dark:bg-zinc-900/50 px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-zinc-300 hover:bg-gray-200/50 dark:hover:bg-zinc-900 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm"
                >
                  <LayoutDashboard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span>Dashboard</span>
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="hidden sm:inline-flex rounded-xl bg-purple-500/10 border border-purple-500/20 px-3.5 py-2.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 transition-all"
                  >
                    Admin Panel
                  </Link>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 rounded-xl border border-red-500/20 dark:border-red-500/10 bg-red-500/5 px-4 py-2.5 text-xs font-bold text-red-500 dark:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/login"
                  className="flex items-center space-x-1.5 rounded-xl border border-gray-200 dark:border-zinc-800/80 bg-gray-100/80 dark:bg-zinc-900/50 px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-zinc-300 hover:bg-gray-200/50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white transition-all"
                >
                  <LogIn className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span>Login</span>
                </Link>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/register"
                    className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 hover:brightness-105 transition-all"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Sign Up</span>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
