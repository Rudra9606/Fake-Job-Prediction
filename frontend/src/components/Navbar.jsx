import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { Shield, LogIn, UserPlus, LogOut, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-[#E3EAF5] py-4 select-none">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10">
        <div className="flex h-12 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="h-10 w-10 rounded-xl bg-[#081B2F] flex items-center justify-center transition-all shadow-sm">
                <Shield className="h-5.5 w-5.5 text-[#A7F08C]" />
              </div>
              <span className="font-extrabold tracking-tight text-lg text-[#132238]">
                Fake Job <span className="text-[#6B7280]">Shield</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-xs font-bold tracking-wider uppercase">
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
                  className={`relative py-2 transition-all flex items-center ${
                    active 
                      ? 'text-[#081B2F] font-extrabold' 
                      : 'text-[#6B7280] hover:text-[#081B2F]'
                  }`}
                >
                  <span>{link.name}</span>
                  {active && (
                    <motion.div 
                      layoutId="navActiveLineLanding"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#081B2F] rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1.5 rounded-xl border border-[#E3EAF5] bg-[#F7FAFD] px-4.5 py-2.5 text-xs font-bold text-[#132238] hover:bg-[#E3EAF5]/50 transition-all shadow-sm"
                >
                  <LayoutDashboard className="h-4 w-4 text-[#132238]" />
                  <span>Dashboard</span>
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="hidden sm:inline-flex rounded-xl bg-[#E8F8F0] border border-[#BCE8D1] px-4.5 py-2.5 text-xs font-bold text-[#2E855A] hover:bg-[#d1fae5] transition-all"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 rounded-xl border border-red-200 bg-red-50 px-4.5 py-2.5 text-xs font-bold text-[#E74C3C] hover:bg-red-100 transition-all cursor-pointer"
                >
                  <LogOut className="h-4 w-4 text-[#E74C3C]" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="flex items-center space-x-1.5 rounded-xl border border-[#E3EAF5] bg-white px-4.5 py-2.5 text-xs font-bold text-[#132238] hover:bg-slate-50 transition-all"
                >
                  <LogIn className="h-4 w-4 text-[#132238]" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1.5 rounded-xl bg-[#081B2F] hover:bg-[#102840] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
                >
                  <UserPlus className="h-4 w-4 text-white" />
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
