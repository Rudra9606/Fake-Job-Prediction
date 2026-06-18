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
    <nav className="sticky top-0 z-50 w-full bg-zinc-900/40 backdrop-blur-md border-b border-zinc-800 py-4">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10">
        <div className="flex h-12 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Shield className="h-5 w-5 text-purple-400" />
              </div>
              <span className="bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent font-black tracking-tight text-lg">
                FakeJobShield
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-400 tracking-wide uppercase">
            {[
              { name: 'Home', path: '/' },
              { name: 'About', path: '/about' },
              { name: 'Features', path: '/features' },
              { name: 'Scam Center', path: '/scam-awareness' },
              { name: 'Community Reports', path: '/community-reports' }
            ].map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`hover:text-purple-400 transition-colors relative py-1.5 ${active ? 'text-purple-400 font-bold' : ''}`}
                >
                  {link.name}
                  {active && (
                    <motion.div 
                      layoutId="navActiveLine"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-500 rounded-full"
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
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-zinc-100 transition-all cursor-pointer flex items-center justify-center"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 text-indigo-500 transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1.5 rounded-xl border border-white/5 bg-zinc-900/50 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-zinc-900 hover:text-white transition-all"
                >
                  <LayoutDashboard className="h-4 w-4 text-purple-400" />
                  <span>Dashboard</span>
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="hidden sm:inline-flex rounded-xl bg-purple-500/10 border border-purple-500/20 px-3.5 py-2 text-xs font-bold text-purple-400 hover:bg-purple-500/20 transition-all"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 rounded-xl border border-red-500/10 bg-red-500/5 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/login"
                  className="flex items-center space-x-1.5 rounded-xl border border-white/5 bg-zinc-900/50 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-zinc-800 transition-all"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 hover:brightness-105 active:scale-95 transition-all"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
