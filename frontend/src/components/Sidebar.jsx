import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { 
  LayoutDashboard, FileText, Globe, ShieldAlert, Activity, 
  History, Users, Settings, HelpCircle, LogOut, Shield, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ onLockdown }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false); // Mobile sidebar state

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Forensics', path: '/analyze', icon: FileText },
    { name: 'Verification', path: '/domain-verify', icon: Globe },
    { name: 'Risk Alerts', path: '/community-reports', icon: ShieldAlert },
    { name: 'Analytics', path: '/network-analysis', icon: Activity },
    { name: 'Reports', path: '/audit-logs', icon: History },
    { name: 'Directory', path: '/directory', icon: Users },
  ];

  // Admin users link
  if (user?.role === 'admin') {
    menuItems.push({ name: 'Users', path: '/admin', icon: Users });
  }

  const secondaryMenuItems = [
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Support', path: '/contact', icon: HelpCircle },
  ];

  const renderNavLinks = (isMobile = false) => {
    const clickHandler = () => {
      if (isMobile) setIsOpen(false);
    };

    return (
      <div className="flex flex-col justify-between h-full">
        <div className="space-y-6 flex-grow">
          {/* Logo Section */}
          <div className="pb-5 border-b border-[#C4D2E8] flex items-center w-full">
            <div className="flex items-center space-x-3 pl-1">
              <div className="h-10 w-10 rounded-xl bg-[#081B2F] flex items-center justify-center shrink-0 shadow-md">
                <Shield className="h-5.5 w-5.5 text-[#A7F08C]" />
              </div>
              <div className="text-left leading-tight">
                <h2 className="font-extrabold text-sm text-[#0D1B2A] tracking-tight">Fake Job Shield</h2>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Enterprise SaaS</span>
              </div>
            </div>
          </div>

          {/* Primary Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={clickHandler}
                  className={({ isActive }) => 
                    `flex items-center rounded-xl py-3 px-4 text-xs font-bold tracking-wide transition-all duration-200 group transform hover:translate-x-2 ${
                      isActive 
                        ? 'bg-[#A7F08C] text-[#0D1B2A] shadow-sm' 
                        : 'text-[#6B7280] hover:text-[#0D1B2A] hover:bg-[#C8F7AE]/45'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`h-4.5 w-4.5 shrink-0 transition-colors duration-205 ${isActive ? 'text-[#0D1B2A]' : 'text-[#6B7280] group-hover:text-[#0D1B2A]'}`} />
                      <span className="ml-3.5 whitespace-nowrap">{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="pt-5 border-t border-[#C4D2E8] space-y-4">
          <div className="space-y-1">
            {secondaryMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={clickHandler}
                  className={({ isActive }) => 
                    `flex items-center rounded-xl py-3 px-4 text-xs font-bold tracking-wide transition-all duration-200 group transform hover:translate-x-2 ${
                      isActive 
                        ? 'bg-[#A7F08C] text-[#0D1B2A] shadow-sm' 
                        : 'text-[#6B7280] hover:text-[#0D1B2A] hover:bg-[#C8F7AE]/45'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`h-4.5 w-4.5 shrink-0 transition-colors duration-205 ${isActive ? 'text-[#0D1B2A]' : 'text-[#6B7280] group-hover:text-[#0D1B2A]'}`} />
                      <span className="ml-3.5 whitespace-nowrap">{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}

            {/* Logout Trigger */}
            <button
              onClick={() => {
                clickHandler();
                handleLogout();
              }}
              className="w-full flex items-center rounded-xl py-3 px-4 text-xs font-bold tracking-wide transition-all duration-200 group transform hover:translate-x-2 text-[#E74C3C] hover:bg-red-50"
            >
              <LogOut className="h-4.5 w-4.5 shrink-0 text-[#E74C3C]" />
              <span className="ml-3.5 whitespace-nowrap">Logout</span>
            </button>
          </div>

          {/* User Profile Card */}
          <div className="flex items-center justify-start space-x-3 p-3 rounded-xl bg-white border border-[#E3EAF5]">
            <div className="h-9 w-9 rounded-full bg-[#081B2F] text-white text-xs font-bold flex items-center justify-center shrink-0">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'RJ'}
            </div>
            <div className="text-left overflow-hidden min-w-0">
              <h4 className="text-[11px] font-bold text-[#132238] leading-tight truncate">{user?.name || 'Rudra Joshi'}</h4>
              <span className="text-[9px] text-[#6B7280] font-semibold block truncate mt-0.5">{user?.role === 'admin' ? 'Security Administrator' : 'Security Analyst'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar - Fixed Left Panel */}
      <aside className="hidden md:flex flex-col shrink-0 sticky top-0 h-screen w-[250px] border-r border-[#E3EAF5] bg-[#DCE7F8] p-5 select-none overflow-hidden transition-all duration-300">
        {renderNavLinks(false)}
      </aside>

      {/* Mobile Header Bar */}
      <header className="md:hidden flex items-center justify-between bg-[#DCE7F8] border-b border-[#E3EAF5] px-5 py-4 w-full sticky top-0 z-40">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-[#081B2F] flex items-center justify-center shadow-sm">
            <Shield className="h-4.5 w-4.5 text-[#A7F08C]" />
          </div>
          <span className="font-extrabold text-sm text-[#0D1B2A] tracking-tight">Fake Job Shield</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 rounded-lg bg-white border border-[#E3EAF5] text-[#0D1B2A] hover:bg-slate-50 transition-all cursor-pointer"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-[#0D1B2A]/40 backdrop-blur-xs z-40"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-0 bottom-0 left-0 w-[270px] bg-[#DCE7F8] border-r border-[#E3EAF5] p-5 z-50 flex flex-col justify-between shadow-2xl"
            >
              {renderNavLinks(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
