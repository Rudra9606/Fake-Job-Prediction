import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { authSuccess, logout } from './store/authSlice';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';


// Import Pages
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import JobAnalysis from './pages/JobAnalysis';
import Results from './pages/Results';
import DetailedReport from './pages/DetailedReport';
import XAIDashboard from './pages/XAIDashboard';
import DomainVerification from './pages/DomainVerification';
import EmailVerification from './pages/EmailVerification';
import URLScanner from './pages/URLScanner';
import ScamAwareness from './pages/ScamAwareness';
import CommunityReporting from './pages/CommunityReporting';
import ResearchAnalytics from './pages/ResearchAnalytics';
import UserDashboard from './pages/UserDashboard';
import Contact from './pages/Contact';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// New Pages aligned with Dabang design
import NetworkAnalysis from './pages/NetworkAnalysis';
import PolicyManager from './pages/PolicyManager';
import AuditLogs from './pages/AuditLogs';
import SettingsPage from './pages/Settings';
import UserDirectory from './pages/UserDirectory';


import { Bell, Search, Shield, History, Cloud, ShieldAlert, Sparkles } from 'lucide-react';

// Layout wrapper for pages containing Sidebar + Content area
const AppLayout = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
      const res = await axios.get(`${apiBaseUrl}/api/auth/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
      const res = await axios.put(`${apiBaseUrl}/api/auth/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Threat Overview';
      case '/analyze': return 'Asset Inventory';
      case '/network-analysis': return 'Network Analysis';
      case '/domain-verify': return 'Domain Check';
      case '/policy-manager': return 'Policy Manager';
      case '/audit-logs': return 'Audit Logs';
      case '/settings': return 'Settings';
      case '/analytics': return 'Research Analytics';
      default: return 'Dashboard';
    }
  };
  
  // Interactive administrator lockdown states
  const [isLockedDown, setIsLockedDown] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [lockdownError, setLockdownError] = useState('');

  // Deploy patch states
  const [deployingPatch, setDeployingPatch] = useState(false);
  const [patchProgress, setPatchProgress] = useState(0);
  const [patchStatus, setPatchStatus] = useState('Initiating payload...');

  const handleUnlock = (e) => {
    e.preventDefault();
    if (passkey === 'admin123' || passkey === 'rudra') {
      setIsLockedDown(false);
      setPasskey('');
      setLockdownError('');
    } else {
      setLockdownError('Invalid administrator authorization key.');
    }
  };

  const handleDeployPatch = () => {
    setDeployingPatch(true);
    setPatchProgress(0);
    setPatchStatus('Initializing deployment container...');
    
    const intervals = [
      { progress: 20, status: 'Verifying registry hashes...' },
      { progress: 45, status: 'Re-indexing heuristic databases...' },
      { progress: 70, status: 'Reloading firewall filter tables...' },
      { progress: 90, status: 'Executing post-install unit diagnostics...' },
      { progress: 100, status: 'Security patch v4.2.8 deployed successfully!' }
    ];
    
    intervals.forEach((step, idx) => {
      setTimeout(() => {
        setPatchProgress(step.progress);
        setPatchStatus(step.status);
      }, (idx + 1) * 800);
    });
  };

  const handleExportReport = () => {
    // Generate a mockup threat report
    const reportData = {
      platform: "Fake Job Shield Threat Intelligence Report",
      timestamp: new Date().toISOString(),
      systemStatus: "PROTECTED",
      activeSurveillance: "14 endpoints secure",
      auditsCompleted: 12842,
      threatsBlocked: 42,
      compiledBy: "Rudra Joshi (Security Lead)"
    };
    
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(reportData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `FakeJobShield_Threat_Report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F5F8FC]">
      {/* Sidebar - left */}
      <Sidebar onLockdown={() => setIsLockedDown(true)} />
      
      {/* Main content area - right */}
      <div className="flex-grow flex flex-col min-w-0 overflow-x-hidden">
        {isLockedDown ? (
          <div className="flex-grow flex items-center justify-center p-6 animate-fadeIn">
            <div className="w-full max-w-md bg-white border border-red-200 rounded-[20px] p-8 shadow-lg text-center space-y-6">
              <div className="h-16 w-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-[#E74C3C] mx-auto animate-pulse">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-[#132238] uppercase tracking-tight">System Lockdown Active</h2>
                <p className="text-xs text-[#6B7280] font-medium leading-relaxed">
                  Threat Containment Protocol 104-A is currently engaged. All external network interfaces, forensic audit engines, and database synchronization queries have been isolated to protect credentials.
                </p>
                <div className="text-[10px] text-[#94A3B8] font-mono tracking-wider">
                  Authorization Hint: admin123
                </div>
              </div>
              <form onSubmit={handleUnlock} className="space-y-4">
                {lockdownError && (
                  <div className="text-[10px] text-[#E74C3C] font-bold bg-red-50 border border-red-100 rounded-lg py-2 px-3">
                    {lockdownError}
                  </div>
                )}
                <input
                  type="password"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="Enter admin key to unlock"
                  className="w-full rounded-xl bg-[#F7FAFD] border border-[#E3EAF5] px-4 py-3 text-center text-[#132238] placeholder-[#94A3B8] focus:outline-none focus:border-blue-500 transition-colors shadow-sm text-xs font-semibold"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#081B2F] hover:bg-[#102840] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                >
                  Unlock System
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            {/* Redesigned Sticky Top Navbar (70px height) */}
            <header className="sticky top-0 z-30 flex h-[70px] w-full items-center justify-between bg-white border-b border-[#E3EAF5] px-6 md:px-10 shrink-0 select-none">
              {/* Left: Breadcrumbs / Title */}
              <div className="flex items-center space-x-3">
                <span className="text-[11px] font-bold tracking-widest text-[#94A3B8] uppercase">PLATFORM</span>
                <span className="text-[#94A3B8] text-xs">/</span>
                <span className="text-sm font-bold text-[#132238] tracking-tight">{getPageTitle()}</span>
              </div>
              
              {/* Middle: Incident Search bar */}
              <div className="relative max-w-xs w-full hidden lg:block">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#94A3B8]" />
                <input 
                  type="text" 
                  placeholder="Search incidents..." 
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E3EAF5] bg-[#F7FAFD] text-xs focus:outline-none text-[#132238] placeholder-[#94A3B8] transition-all"
                />
              </div>
              
              {/* Right: Header Controls */}
              <div className="flex items-center space-x-4">
                {/* Security Status Badge */}
                <div className="h-8 px-3.5 rounded-full bg-[#E8F8F0] text-[#2E855A] text-[9px] font-bold uppercase tracking-wider flex items-center space-x-2 border border-[#BCE8D1]">
                  <span className="h-2 w-2 rounded-full bg-[#43B97F] animate-pulse"></span>
                  <span className="hidden sm:inline">SYSTEM: PROTECTED</span>
                  <span className="sm:hidden">SECURE</span>
                </div>
                
                {/* Messages Icon */}
                <button 
                  onClick={() => alert('No new notifications or threat briefs.')}
                  className="p-2 rounded-xl border border-[#E3EAF5] bg-[#F7FAFD] text-[#6B7280] hover:text-[#132238] hover:bg-slate-50 transition-all relative cursor-pointer"
                  title="Messages"
                >
                  <Cloud className="h-4 w-4" />
                  <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#43B97F]"></span>
                </button>

                {/* Notification Bell with Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      fetchNotifications();
                    }}
                    className="p-2 rounded-xl border border-[#E3EAF5] bg-[#F7FAFD] text-[#6B7280] hover:text-[#132238] hover:bg-slate-50 transition-all relative cursor-pointer"
                    title="Notifications"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#E74C3C]"></span>
                    )}
                  </button>

                  {/* Dropdown panel */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E3EAF5] rounded-xl shadow-lg py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-[#E3EAF5] flex justify-between items-center">
                        <span className="text-[10px] font-bold text-[#132238] uppercase tracking-wider">Security Alerts</span>
                        {unreadCount > 0 && (
                          <span className="text-[8.5px] font-bold text-[#E74C3C] bg-red-50 border border-red-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {unreadCount} unread
                          </span>
                        )}
                      </div>
                      <div className="max-h-60 overflow-y-auto divide-y divide-[#E3EAF5]/50">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-[10px] text-[#6B7280] font-semibold">
                            No security notifications registered.
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div 
                              key={notif._id} 
                              onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                              className={`px-4 py-2.5 text-left transition-colors cursor-pointer hover:bg-slate-50 ${!notif.isRead ? 'bg-[#F7FAFD]' : ''}`}
                            >
                              <div className="flex items-start space-x-2">
                                <span className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${
                                  notif.type === 'success' ? 'bg-[#43B97F]' : notif.type === 'warning' ? 'bg-[#F6B93B]' : 'bg-blue-500'
                                }`} />
                                <div className="flex-grow min-w-0">
                                  <p className="text-[10.5px] font-semibold text-[#132238] leading-relaxed break-words">{notif.message}</p>
                                  <span className="text-[8px] text-[#6B7280] mt-1 block font-mono">
                                    {new Date(notif.createdAt).toLocaleTimeString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Settings shortcut */}
                <button 
                  onClick={() => navigate('/settings')}
                  className="p-2 rounded-xl border border-[#E3EAF5] bg-[#F7FAFD] text-[#6B7280] hover:text-[#132238] hover:bg-slate-50 transition-all cursor-pointer"
                  title="Settings"
                >
                  <History className="h-4 w-4" />
                </button>
              </div>
            </header>

            {/* Deploy Patch Modal */}
            {deployingPatch && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs">
                <div className="w-full max-w-md bg-white border border-[#E3EAF5] rounded-[20px] p-8 shadow-xl text-center space-y-6 animate-fadeIn">
                  <div className="h-14 w-14 rounded-full bg-[#E8F8F0] border border-[#BCE8D1] flex items-center justify-center text-[#2E855A] mx-auto">
                    <Sparkles className="h-6 w-6 animate-spin text-[#43B97F]" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-[#132238] uppercase tracking-wider">Patch Deployment</h3>
                    <p className="text-xs text-[#6B7280] font-semibold">{patchStatus}</p>
                  </div>
                  
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#43B97F] h-full rounded-full transition-all duration-500" 
                      style={{ width: `${patchProgress}%` }}
                    ></div>
                  </div>

                  {patchProgress === 100 && (
                    <button
                      onClick={() => setDeployingPatch(false)}
                      className="w-full py-3 rounded-xl bg-[#081B2F] hover:bg-[#102840] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                    >
                      Close Window
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Content Container (24px padding on mobile, 32px/40px padding on desktop) */}
            <main className="flex-grow min-w-0 p-6 md:p-8 lg:p-10">
              <Outlet />
            </main>
          </>
        )}
      </div>
    </div>
  );
};

// Simple Layout for Home, About, Login, Register (no Sidebar needed)
const BaseLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow w-full max-w-[1500px] mx-auto px-6 lg:px-10 py-6">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};


const App = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('theme');
  }, []);

  useEffect(() => {
    const verifyTokenOnRefresh = async () => {
      if (token) {
        try {
          const apiBaseUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
          const res = await axios.get(`${apiBaseUrl}/api/auth/me`);
          if (res.data?.success) {
            dispatch(authSuccess({ token, user: res.data.user }));
          }
        } catch (err) {
          console.error("Token expired or invalid on refresh:", err);
          dispatch(logout());
        }
      }
    };
    verifyTokenOnRefresh();
  }, [token, dispatch]);

  return (
    <Router>
      <Routes>
        {/* Pages without sidebar */}
        <Route element={<BaseLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/scam-awareness" element={<ScamAwareness />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/reset_password/:token" element={<ResetPassword />} />
        </Route>

        {/* Pages with sidebar navigation layout - Login Required */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/analyze" element={<JobAnalysis />} />
          <Route path="/results/:id" element={<Results />} />
          <Route path="/detailed-report/:id" element={<DetailedReport />} />
          <Route path="/xai-dashboard/:id" element={<XAIDashboard />} />
          <Route path="/network-analysis" element={<NetworkAnalysis />} />
          <Route path="/domain-verify" element={<DomainVerification />} />
          <Route path="/policy-manager" element={<PolicyManager />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/email-verify" element={<EmailVerification />} />
          <Route path="/url-scan" element={<URLScanner />} />
          <Route path="/community-reports" element={<CommunityReporting />} />
          <Route path="/analytics" element={<ResearchAnalytics />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/directory" element={<UserDirectory />} />

          {/* Protected admin dashboard */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
