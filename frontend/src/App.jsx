import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
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


// Layout wrapper for pages containing Sidebar + Content area
const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10 w-full flex-grow flex flex-col md:flex-row gap-8 py-6 pb-20 md:pb-6">
        <Sidebar />
        <main className="flex-grow min-w-0 pb-12 md:pb-0">
          <Outlet />
        </main>
      </div>
      <Footer />
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
    const verifyTokenOnRefresh = async () => {
      if (token) {
        try {
          const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
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
          <Route path="/domain-verify" element={<DomainVerification />} />
          <Route path="/email-verify" element={<EmailVerification />} />
          <Route path="/url-scan" element={<URLScanner />} />
          <Route path="/community-reports" element={<CommunityReporting />} />
          <Route path="/analytics" element={<ResearchAnalytics />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<UserDashboard />} />

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
