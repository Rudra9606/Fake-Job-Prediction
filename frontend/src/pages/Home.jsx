import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Brain, ShieldCheck, HelpCircle, BarChart3, ArrowRight, 
  Sparkles, CheckCircle2, ChevronRight, Activity, Users, FileLock2,
  Lock, Globe, Mail, Link2, AlertTriangle, Play, Smartphone, Laptop
} from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  // SVG Gauge calculations for mock dashboard
  const radius = 35;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative overflow-hidden min-h-screen pb-24 space-y-24 bg-[#F5F8FC] text-[#132238] select-none">
      {/* Subtle cybersecurity matrix background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E3EAF5_1px,transparent_1px),linear-gradient(to_bottom,#E3EAF5_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 pt-16 max-w-5xl mx-auto px-4 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 rounded-full bg-[#E8F8F0] border border-[#BCE8D1] px-4 py-1.5 text-xs text-[#2E855A] shadow-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#43B97F]" />
          <span className="font-bold tracking-wide uppercase text-[9.5px]">AI-Powered Cybersecurity Audit Framework</span>
        </motion.div>

        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl sm:text-6xl font-bold tracking-tight text-[#0D1B2A] leading-[1.15]"
          >
            Forensic Job Scanning <br />
            <span className="text-blue-600">Enterprise Scam Protection</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-[#6B7280] text-sm sm:text-base max-w-2xl mx-auto font-semibold leading-relaxed"
          >
            Verify recruiter identities, analyze email DNS registries, and scan listings in real-time using pre-trained BERT transformers and cybersecurity heuristics.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3 pt-3"
        >
          <Link
            to="/analyze"
            className="flex items-center space-x-2 rounded-xl bg-[#081B2F] hover:bg-[#102840] px-8 py-3.5 font-bold text-white shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 border border-transparent"
          >
            <span>Execute Threat Scan</span>
            <ArrowRight className="h-4 w-4 text-[#A7F08C]" />
          </Link>
          <Link
            to="/scam-awareness"
            className="flex items-center space-x-2 rounded-xl bg-white border border-[#E3EAF5] px-8 py-3.5 font-bold text-[#132238] hover:bg-slate-50 transition-all shadow-sm transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Intelligence Center</span>
          </Link>
        </motion.div>
      </section>

      {/* Premium Dashboard Mockup Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="rounded-[20px] border border-[#E3EAF5] bg-white p-4 sm:p-5 shadow-xl relative overflow-hidden"
        >
          {/* Dashboard Header Bar */}
          <div className="flex items-center justify-between border-b border-[#E3EAF5] pb-3 mb-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-xs font-bold text-[#132238] uppercase tracking-wider">Fake Job Shield Console</span>
              </div>
              <div className="hidden sm:flex items-center space-x-1.5 rounded-full bg-[#E8F8F0] border border-[#BCE8D1] px-2.5 py-0.5 text-[9px] font-bold text-[#2E855A]">
                <Sparkles className="h-2.5 w-2.5 mr-1 text-[#43B97F]" />
                Active Monitor
              </div>
            </div>
            <div className="flex items-center space-x-3 text-[10px] font-mono text-[#6B7280]">
              <span>IP: 192.168.1.45</span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline text-[#2E855A]">Status: Securing</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Mock Sidebar Navigation */}
            <div className="lg:col-span-3 bg-[#DCE7F8]/40 border border-[#E3EAF5] rounded-xl p-3 space-y-4">
              <div className="space-y-1.5">
                <div className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider px-2">Console</div>
                {[
                  { name: 'Dashboard', icon: BarChart3, active: true },
                  { name: 'Forensics Check', icon: Shield, active: false },
                  { name: 'Domain Lookup', icon: Globe, active: false },
                  { name: 'Email Audit', icon: Mail, active: false },
                  { name: 'URL Redirects', icon: Link2, active: false },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={idx} 
                      className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-[10px] font-bold transition-all ${
                        item.active 
                          ? 'bg-[#A7F08C] text-[#0D1B2A] shadow-sm' 
                          : 'text-[#6B7280] hover:text-[#0D1B2A] hover:bg-[#C8F7AE]/30'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mock Main Dashboard Area */}
            <div className="lg:col-span-9 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Metric Card 1: Trust Score */}
                <div className="bg-[#F7FAFD] border border-[#E3EAF5] rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">Overall Trust Score</span>
                    <div className="text-2xl font-bold text-[#132238] font-mono">88.5%</div>
                    <span className="inline-flex items-center text-[9px] font-bold text-[#43B97F]">
                      +4.2% verified metrics
                    </span>
                  </div>
                  {/* Mini Circle Gauge */}
                  <div className="relative h-14 w-14">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="35" stroke="#E3EAF5" strokeWidth="10" fill="none" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="35" 
                        stroke="#43B97F" 
                        strokeWidth="10" 
                        fill="none" 
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (0.88 * circumference)}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-[#132238]">
                      88%
                    </div>
                  </div>
                </div>

                {/* Metric Card 2: Scanned Posts */}
                <div className="bg-[#F7FAFD] border border-[#E3EAF5] rounded-xl p-4 space-y-1">
                  <span className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">Audited Listings</span>
                  <div className="text-2xl font-bold text-[#132238] font-mono">1,482</div>
                  <div className="text-[9px] text-[#6B7280]">
                    <span className="text-[#E74C3C] font-bold">124 scam hits</span> intercepted
                  </div>
                </div>

                {/* Metric Card 3: Model Accuracy */}
                <div className="bg-[#F7FAFD] border border-[#E3EAF5] rounded-xl p-4 space-y-1">
                  <span className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">Detection Accuracy</span>
                  <div className="text-2xl font-bold text-blue-600 font-mono">99.4%</div>
                  <div className="text-[9px] text-[#6B7280]">Dataset validation verified</div>
                </div>
              </div>

              {/* Chart & Live Status Panel */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Simulated Chart */}
                <div className="md:col-span-7 bg-[#F7FAFD] border border-[#E3EAF5] rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-[#132238]">Audit Interception Log</h4>
                      <p className="text-[9px] text-[#6B7280]">Weekly scam trend tracking</p>
                    </div>
                    <div className="flex items-center space-x-2 text-[9px] font-bold text-[#6B7280]">
                      <span className="flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-[#43B97F] mr-1" /> Genuine</span>
                      <span className="flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-blue-600 mr-1" /> Scam</span>
                    </div>
                  </div>
                  {/* Custom SVG line chart simulation */}
                  <div className="h-28 w-full pt-2">
                    <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#43B97F" stopOpacity={0.15} />
                          <stop offset="100%" stopColor="#43B97F" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <line x1="0" y1="20" x2="300" y2="20" stroke="#E3EAF5" strokeWidth="0.5" strokeDasharray="3 3" />
                      <line x1="0" y1="50" x2="300" y2="50" stroke="#E3EAF5" strokeWidth="0.5" strokeDasharray="3 3" />
                      <line x1="0" y1="80" x2="300" y2="80" stroke="#E3EAF5" strokeWidth="0.5" strokeDasharray="3 3" />
                      <path d="M 0 100 L 0 50 Q 50 30 100 65 T 200 40 Q 250 15 300 50 L 300 100 Z" fill="url(#chartGlow)" />
                      <path d="M 0 50 Q 50 30 100 65 T 200 40 Q 250 15 300 50" fill="none" stroke="#43B97F" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M 0 90 Q 50 85 100 70 T 200 75 Q 250 85 300 80" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="2 2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                {/* Simulated Audit Report (Checklist) */}
                <div className="md:col-span-5 bg-[#F7FAFD] border border-[#E3EAF5] rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-[#132238]">Active Verification Status</h4>
                  <div className="space-y-2">
                    {[
                      { name: "Domain Registrant Authenticity", status: "Verified", ok: true },
                      { name: "Linguistic Threat Flags Check", status: "Clean", ok: true },
                      { name: "Official Email MX Records Audit", status: "Authenticated", ok: true },
                      { name: "Payment Request Heuristics Check", status: "None Flagged", ok: true }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[9px] border-b border-[#E3EAF5]/60 pb-1.5 last:border-0 last:pb-0">
                        <span className="text-[#6B7280] font-semibold">{item.name}</span>
                        <span className="font-bold text-[#2E855A] flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-1 text-[#43B97F]" />
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white border border-[#E3EAF5] rounded-lg p-2.5 flex items-center justify-between mt-2">
                    <span className="text-[8px] text-[#6B7280] font-bold">XAI analysis complete</span>
                    <Link to="/analyze" className="text-blue-600 text-[8.5px] font-bold hover:underline flex items-center">
                      Scan Advert <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Tech Partners Logos Row */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-4">
        <p className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest">Integrating text analysis with cyber telemetry</p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-50 grayscale hover:opacity-75 transition-opacity">
          <div className="flex items-center space-x-1.5">
            <Shield className="h-4 w-4" />
            <span className="font-bold tracking-tight text-sm text-[#132238]">ShieldGuard</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Brain className="h-4 w-4" />
            <span className="font-bold tracking-tight text-sm text-[#132238]">VerifyNLP</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <FileLock2 className="h-4 w-4" />
            <span className="font-bold tracking-tight text-sm text-[#132238]">NetSecure</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Users className="h-4 w-4" />
            <span className="font-bold tracking-tight text-sm text-[#132238]">TrustCore</span>
          </div>
        </div>
      </section>

      {/* Powerful Features Bento Grid */}
      <section className="max-w-5xl mx-auto px-4 space-y-10 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1 rounded-full bg-[#E3EAF5] px-3.5 py-1 text-[9px] font-bold text-[#0D1B2A] uppercase tracking-wider">
            Features Matrix
          </div>
          <h2 className="text-2xl font-bold text-[#132238] tracking-tight sm:text-3xl">
            Multi-Layer Analysis Platform
          </h2>
          <p className="text-[#6B7280] max-w-xl mx-auto text-xs sm:text-sm font-semibold">
            Evaluate job openings using both semantic deep learning classifiers and live domain reputation registers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: NLP Classifiers */}
          <div className="md:col-span-5 bg-white border border-[#E3EAF5] rounded-[20px] p-6 flex flex-col justify-between hover:translate-y-[-3px] transition-all relative overflow-hidden group shadow-sm">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-[#F7FAFD] border border-[#E3EAF5] flex items-center justify-center text-[#0D1B2A]">
                <Brain className="h-5.5 w-5.5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#132238] uppercase tracking-wide">Deep NLP Semantic Classifiers</h3>
                <p className="text-[11px] text-[#6B7280] leading-relaxed font-semibold">
                  We process post titles, descriptions, and salary requirements using pre-trained BERT weights and LightGBM models to extract threat signals.
                </p>
              </div>
            </div>
            {/* Visual element representing model prediction bubble */}
            <div className="mt-6 border border-[#E3EAF5] bg-[#F7FAFD] rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-lg bg-[#081B2F] flex items-center justify-center text-[9px] font-bold text-white">AI</div>
                <div className="text-left leading-none">
                  <div className="text-[9px] font-bold text-[#132238]">BERT Transformer</div>
                  <div className="text-[8px] text-[#6B7280] font-semibold mt-0.5">Scanning lexical vectors...</div>
                </div>
              </div>
              <span className="text-[9px] font-bold text-[#2E855A] bg-[#E8F8F0] border border-[#BCE8D1] px-2 py-0.5 rounded-full">
                99.1% Confidence
              </span>
            </div>
          </div>

          {/* Card 2: Security Checklist */}
          <div className="md:col-span-7 bg-white border border-[#E3EAF5] rounded-[20px] p-6 flex flex-col justify-between hover:translate-y-[-3px] transition-all relative overflow-hidden group shadow-sm">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-[#F7FAFD] border border-[#E3EAF5] flex items-center justify-center text-[#0D1B2A]">
                <ShieldCheck className="h-5.5 w-5.5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#132238] uppercase tracking-wide">Cybersecurity Telemetry Audits</h3>
                <p className="text-[11px] text-[#6B7280] leading-relaxed font-semibold">
                  Manually audits registrar record ages, link redirect socket parameters, and triggers flags if listings harvest national identity keys.
                </p>
              </div>
            </div>
            {/* Visual Checklist representing task items */}
            <div className="mt-6 space-y-2">
              {[
                { name: "Audit Corporate Registrar Age", active: true },
                { name: "Inspect Redirect Chains for Phishing", active: true },
                { name: "Verify Sender Mail Exchanger (MX) Records", active: false }
              ].map((task, idx) => (
                <div key={idx} className="flex items-center justify-between border border-[#E3EAF5] bg-[#F7FAFD] rounded-xl px-4 py-2 text-[10px]">
                  <span className="text-[#132238] font-bold">{task.name}</span>
                  <span className={`h-1.5 w-1.5 rounded-full ${task.active ? 'bg-blue-600' : 'bg-slate-350'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: XAI */}
          <div className="md:col-span-6 bg-white border border-[#E3EAF5] rounded-[20px] p-6 flex flex-col justify-between hover:translate-y-[-3px] transition-all relative overflow-hidden group shadow-sm">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-[#F7FAFD] border border-[#E3EAF5] flex items-center justify-center text-[#0D1B2A]">
                <Activity className="h-5.5 w-5.5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#132238] uppercase tracking-wide">Explainable AI Attributions (SHAP)</h3>
                <p className="text-[11px] text-[#6B7280] leading-relaxed font-semibold">
                  We render exact lexical feature attributions (Shapley Values) to demonstrate exactly why a posting triggers security warnings.
                </p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2 border border-[#E3EAF5] bg-[#F7FAFD] rounded-xl p-2">
              {[
                { name: "Model Features", icon: Laptop, active: true },
                { name: "Telemetry", icon: Shield, active: false },
                { name: "Lockdown Key", icon: Lock, active: false }
              ].map((dev, idx) => {
                const Icon = dev.icon;
                return (
                  <div 
                    key={idx} 
                    className={`flex flex-col items-center justify-center py-2 rounded-lg text-[9px] font-bold cursor-pointer transition-all ${
                      dev.active ? 'bg-white text-[#132238] border border-[#E3EAF5] shadow-sm' : 'text-[#6B7280] hover:text-[#132238]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 mb-1" />
                    <span>{dev.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 4: Community Safety */}
          <div className="md:col-span-6 bg-white border border-[#E3EAF5] rounded-[20px] p-6 flex flex-col justify-between hover:translate-y-[-3px] transition-all relative overflow-hidden group shadow-sm">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-[#F7FAFD] border border-[#E3EAF5] flex items-center justify-center text-[#0D1B2A]">
                <Users className="h-5.5 w-5.5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#132238] uppercase tracking-wide">Community Incident Logs</h3>
                <p className="text-[11px] text-[#6B7280] leading-relaxed font-semibold">
                  Report suspicious recruitment entities manually, sharing real-time scam updates globally across our security database indices.
                </p>
              </div>
            </div>
            {/* Mock Chat / Collaboration snippets */}
            <div className="mt-6 space-y-1.5 border border-[#E3EAF5] bg-[#F7FAFD] rounded-xl p-3">
              <div className="text-[8px] font-bold text-[#6B7280] uppercase tracking-wider">Threat Intel Feed</div>
              <div className="text-[9px] text-[#132238] bg-white p-2.5 rounded-lg border border-[#E3EAF5]">
                ⚠️ <span className="font-bold text-[#E74C3C]">scam-recruitment@job-agent.net</span> flagged. Urgently requesting security PAN card scans.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Steps */}
      <section className="max-w-5xl mx-auto px-4 space-y-10 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1 rounded-full bg-[#E3EAF5] px-3.5 py-1 text-[9px] font-bold text-[#0D1B2A] uppercase tracking-wider">
            Framework Setup
          </div>
          <h2 className="text-2xl font-bold text-[#132238] tracking-tight sm:text-3xl">
            Assessment Workflow
          </h2>
          <p className="text-[#6B7280] max-w-xl mx-auto text-xs sm:text-sm font-semibold">
            Evaluate listings by executing audits through our three-step framework.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              step: "Step 01", 
              title: "Collect Telemetry", 
              desc: "Paste listing text, website URLs, or recruiter email extensions into our threat scanner module." 
            },
            { 
              step: "Step 02", 
              title: "Execute Hybrid Audit", 
              desc: "Deep learning semantic models process text vectors while heuristics check registrar data registers." 
            },
            { 
              step: "Step 03", 
              title: "Review Risk attributions", 
              desc: "Inspect Shapley explainability charts, detailed checklists, and download official PDF audit reports." 
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-[#E3EAF5] rounded-[20px] p-6 hover:translate-y-[-3px] transition-all flex flex-col justify-between space-y-6 shadow-sm"
            >
              <div className="space-y-4">
                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg uppercase tracking-wider font-mono">
                  {item.step}
                </span>
                <h3 className="text-xs font-bold text-[#132238] uppercase tracking-wide">{item.title}</h3>
                <p className="text-[11px] text-[#6B7280] leading-relaxed font-semibold">
                  {item.desc}
                </p>
              </div>
              <div className="pt-2 border-t border-[#E3EAF5] flex items-center justify-between text-[9px] text-[#6B7280] font-semibold">
                <span>Fake Job Shield Core</span>
                <ChevronRight className="h-3.5 w-3.5 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6 pt-6 relative z-10">
        <h2 className="text-2xl sm:text-4xl font-bold text-[#0D1B2A] tracking-tight">Protect Your Search Network</h2>
        <p className="text-[#6B7280] text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-semibold">
          Check unverified recruiter domains and listing redirections to prevent identity theft.
        </p>
        <div>
          <Link
            to="/analyze"
            className="inline-flex items-center space-x-2 rounded-xl bg-[#081B2F] hover:bg-[#102840] px-8 py-3.5 font-bold text-white shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 border border-transparent"
          >
            <span>Get Started Free</span>
            <ArrowRight className="h-4 w-4 text-[#A7F08C]" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
