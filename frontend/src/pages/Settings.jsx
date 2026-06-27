import React, { useState } from 'react';
import { Settings, Shield, Sliders, Bell, Globe, Key, User, Save, RefreshCcw, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('security');
  const [sensitivity, setSensitivity] = useState(85);
  const [autoLock, setAutoLock] = useState(true);
  const [adminPasskey, setAdminPasskey] = useState('admin123');

  // Operator connections count
  const [followingCount] = useState(() => {
    const saved = localStorage.getItem('fs_followed_users');
    return saved ? JSON.parse(saved).length : 0;
  });
  const [followersCount] = useState(() => {
    return followingCount > 0 ? followingCount + 2 : 3;
  });

  const [toast, setToast] = useState(false);
  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 rounded-xl bg-[#0D1B2A] text-white border border-[#E3EAF5] shadow-xl px-5 py-3 text-xs font-bold flex items-center space-x-2"
          >
            <ShieldCheck className="h-4 w-4 text-[#A7F08C]" />
            <span>System configuration saved successfully.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#132238] tracking-tight">Platform System Settings</h1>
        <p className="text-xs text-[#6B7280] font-semibold mt-1">
          Configure real-time monitoring sensitivity parameters, operator access credentials, and external api scanners.
        </p>
      </div>

      {/* Grid wrapper */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Side: Navigation tabs */}
        <div className="md:col-span-3 space-y-1.5">
          {[
            { id: 'profile', label: 'Operator Profile', icon: User },
            { id: 'security', label: 'Security Engine', icon: Shield },
            { id: 'integrations', label: 'API Integrations', icon: Globe }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all transform hover:translate-x-1 ${
                  active
                    ? 'bg-[#A7F08C] text-[#0D1B2A] shadow-sm'
                    : 'text-[#6B7280] hover:text-[#0D1B2A] hover:bg-[#C8F7AE]/30'
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side: Tab Contents */}
        <div className="md:col-span-9 bg-white border border-[#E3EAF5] rounded-[20px] p-6 shadow-sm flex flex-col justify-between min-h-[360px]">
          <div>
            {activeTab === 'profile' && (
              <div className="space-y-5 animate-fadeIn">
                <h3 className="text-xs font-bold text-[#132238] border-b border-[#E3EAF5] pb-3.5 uppercase tracking-wider">
                  Operator Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-[#6B7280]">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider block">Full Name</label>
                    <input type="text" defaultValue="Rudra Joshi" className="w-full text-[#132238] font-semibold" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider block">Security Title</label>
                    <input type="text" defaultValue="Security Lead" className="w-full text-[#132238] font-semibold" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[9px] uppercase tracking-wider block">Contact Email</label>
                    <input type="email" defaultValue="rudra.joshi@fakejobshield.com" className="w-full text-[#132238] font-semibold" />
                  </div>
                </div>

                {/* Followers & Following Stats */}
                <div className="mt-6 pt-5 border-t border-[#E3EAF5]">
                  <h4 className="text-[10px] font-bold text-[#132238] uppercase tracking-wider mb-3">Operator Network Connection</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#F7FAFD] border border-[#E3EAF5] text-center">
                      <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider block">Following</span>
                      <span className="text-xl font-bold text-[#132238] mt-1 block">{followingCount} Operators</span>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F7FAFD] border border-[#E3EAF5] text-center">
                      <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider block">Followers</span>
                      <span className="text-xl font-bold text-[#132238] mt-1 block">{followersCount} Operators</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xs font-bold text-[#132238] border-b border-[#E3EAF5] pb-3.5 uppercase tracking-wider">
                  Heuristic Scanner Parameters
                </h3>

                {/* Threat sensitivity slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-[#132238]">Audit Sensitivity Index</span>
                    <span className="text-blue-600">{sensitivity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sensitivity}
                    onChange={(e) => setSensitivity(e.target.value)}
                    className="w-full h-1.5 bg-[#F5F8FC] rounded-lg appearance-none cursor-pointer accent-[#081B2F] border border-[#E3EAF5]"
                  />
                  <p className="text-[10px] text-[#6B7280] font-semibold leading-relaxed">
                    Increasing heuristic thresholds triggers alert logs faster, reducing falsified posts at the cost of higher false positive reviews.
                  </p>
                </div>

                {/* Password authorization */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-[#6B7280]">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider block flex items-center space-x-1.5">
                      <Key className="h-3.5 w-3.5 text-[#0D1B2A]" />
                      <span>Lockdown Override Key</span>
                    </label>
                    <input
                      type="password"
                      value={adminPasskey}
                      onChange={(e) => setAdminPasskey(e.target.value)}
                      className="w-full text-[#132238] font-mono"
                    />
                  </div>
                  <div className="space-y-1.5 flex flex-col justify-end">
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7FAFD] border border-[#E3EAF5]">
                      <span className="text-[10.5px] font-bold text-[#132238]">Auto-Lockdown Trigger</span>
                      <button
                        type="button"
                        onClick={() => setAutoLock(!autoLock)}
                        className={`w-9 h-5.5 rounded-full p-0.5 transition-colors flex items-center cursor-pointer shrink-0 ${
                          autoLock ? 'bg-[#43B97F]' : 'bg-slate-200'
                        }`}
                      >
                        <div className={`bg-white h-4.5 w-4.5 rounded-full shadow-sm transition-transform duration-200 ${
                          autoLock ? 'transform translate-x-3.5' : ''
                        }`}></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-5 animate-fadeIn">
                <h3 className="text-xs font-bold text-[#132238] border-b border-[#E3EAF5] pb-3.5 uppercase tracking-wider">
                  Threat Feed Registry APIs
                </h3>
                <div className="grid grid-cols-1 gap-4 text-xs font-bold text-[#6B7280]">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider block">VirusTotal Enterprise API Hash</label>
                    <input type="password" placeholder="vt_api_xxxxxxxxxxxxxxxxxxxxxx" className="w-full text-[#132238] font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider block">Shodan Intelligence Token</label>
                    <input type="password" placeholder="sh_api_xxxxxxxxxxxxxxxxxxxxxx" className="w-full text-[#132238] font-mono" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 mt-6 border-t border-[#E3EAF5] flex items-center justify-between">
            <button
              onClick={() => {
                setSensitivity(85);
                setAutoLock(true);
                setAdminPasskey('admin123');
              }}
              className="flex items-center space-x-1.5 text-[#6B7280] hover:text-[#0D1B2A] text-xs font-bold cursor-pointer transition-colors"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={showToast}
              className="flex items-center space-x-1.5 bg-[#081B2F] hover:bg-[#102840] text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-md"
            >
              <Save className="h-4 w-4 text-[#A7F08C]" />
              <span>Save System Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
