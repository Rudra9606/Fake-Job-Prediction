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
    <div className="relative overflow-hidden min-h-screen pb-24 space-y-28 bg-zinc-950">
      {/* Ambient background glows - Tracle style deep purple theme */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[600px] left-1/4 w-[450px] h-[450px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[1200px] right-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#312e8115_1px,transparent_1px),linear-gradient(to_bottom,#312e8115_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 pt-20 max-w-5xl mx-auto px-4 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 rounded-full bg-purple-950/20 border border-purple-500/20 px-4 py-1.5 text-xs text-purple-300 hover:border-purple-500/40 hover:bg-purple-950/30 transition-all shadow-[0_0_15px_rgba(168,85,247,0.08)]"
        >
          <Sparkles className="h-3.5 w-3.5 animate-pulse text-purple-400" />
          <span className="font-semibold tracking-wide uppercase text-[10px]">Conference-Grade Hybrid AI Framework</span>
        </motion.div>

        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-100 leading-[1.1]"
          >
            Transform Job Scanning <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400">
              Into Trust With AI.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-slate-400 text-sm sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Unlock safe job searching with smart tools that verify corporate domains, 
            detect PII-harvesting scams, and predict textual authenticity in real time.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <Link
            to="/analyze"
            className="flex items-center space-x-2 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 px-8 py-3.5 font-bold text-white shadow-lg shadow-purple-500/10 hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Scan Job Posting</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/scam-awareness"
            className="flex items-center space-x-2 rounded-full bg-zinc-900/80 border border-zinc-800 px-8 py-3.5 font-bold text-slate-300 hover:bg-zinc-850 hover:text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Awareness Center</span>
          </Link>
        </motion.div>
      </section>

      {/* Premium Dashboard Mockup Section (Recreating Tracle's Dashboard Mockup) */}
      <section className="relative z-10 max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="rounded-[24px] border border-zinc-800/80 bg-zinc-950 p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          {/* Dashboard Header Bar */}
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono">FakeJobShield</span>
              </div>
              <div className="hidden sm:flex items-center space-x-1.5 rounded-full bg-purple-950/20 border border-purple-500/20 px-2.5 py-0.5 text-[9px] font-bold text-purple-400">
                <Sparkles className="h-2.5 w-2.5 mr-1" />
                Active Scanner
              </div>
            </div>
            <div className="flex items-center space-x-3 text-[10px] font-mono text-zinc-500">
              <span>IP: 192.168.1.45</span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline">Status: Secured</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Mock Sidebar Navigation */}
            <div className="lg:col-span-3 bg-zinc-900/20 border border-zinc-900/50 rounded-xl p-3 space-y-4">
              <div className="space-y-1.5">
                <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider px-2">Console</div>
                {[
                  { name: 'Dashboard', icon: BarChart3, active: true },
                  { name: 'Job Scanner', icon: Shield, active: false },
                  { name: 'Domain Checker', icon: Globe, active: false },
                  { name: 'Email Checker', icon: Mail, active: false },
                  { name: 'URL Scanner', icon: Link2, active: false },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={idx} 
                      className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-[10px] font-bold transition-all ${
                        item.active 
                          ? 'bg-purple-950/20 border border-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(139,92,246,0.05)]' 
                          : 'text-zinc-400 hover:text-zinc-200'
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
                <div className="bg-zinc-900/35 border border-zinc-900 rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Overall Trust Score</span>
                    <div className="text-2xl font-black text-slate-100 font-mono">88.5%</div>
                    <span className="inline-flex items-center text-[9px] font-bold text-emerald-400">
                      +4.2% Gen Value
                    </span>
                  </div>
                  {/* Mini Circle Gauge */}
                  <div className="relative h-14 w-14">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="35" stroke="#18181b" strokeWidth="10" fill="none" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="35" 
                        stroke="#8b5cf6" 
                        strokeWidth="10" 
                        fill="none" 
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (0.88 * circumference)}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-slate-200">
                      88%
                    </div>
                  </div>
                </div>

                {/* Metric Card 2: Scanned Posts */}
                <div className="bg-zinc-900/35 border border-zinc-900 rounded-xl p-4 space-y-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Audited Posts</span>
                  <div className="text-2xl font-black text-slate-100 font-mono">1,482</div>
                  <div className="text-[9px] text-zinc-400">
                    <span className="text-red-400 font-bold">124 Fraudulent</span> flagged this month
                  </div>
                </div>

                {/* Metric Card 3: Model Accuracy */}
                <div className="bg-zinc-900/35 border border-zinc-900 rounded-xl p-4 space-y-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">AI Accuracy</span>
                  <div className="text-2xl font-black text-indigo-400 font-mono">98.6%</div>
                  <div className="text-[9px] text-zinc-400">Tested on 17,880 dataset entries</div>
                </div>
              </div>

              {/* Chart & Live Status Panel */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Simulated Chart (Like Tracle's wave graph) */}
                <div className="md:col-span-7 bg-zinc-900/35 border border-zinc-900 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-200">Security Scans Trend</h4>
                      <p className="text-[9px] text-zinc-500">Weekly fraudulent vs genuine postings</p>
                    </div>
                    <div className="flex items-center space-x-2 text-[9px] font-bold">
                      <span className="flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-1" /> Genuine</span>
                      <span className="flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mr-1" /> Fraudulent</span>
                    </div>
                  </div>
                  {/* Custom SVG line chart simulation */}
                  <div className="h-28 w-full pt-2">
                    <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      <line x1="0" y1="20" x2="300" y2="20" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="3 3" />
                      <line x1="0" y1="50" x2="300" y2="50" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="3 3" />
                      <line x1="0" y1="80" x2="300" y2="80" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="3 3" />
                      {/* Purple Filled Area */}
                      <path d="M 0 100 L 0 50 Q 50 30 100 65 T 200 40 Q 250 15 300 50 L 300 100 Z" fill="url(#chartGlow)" />
                      {/* Purple Line */}
                      <path d="M 0 50 Q 50 30 100 65 T 200 40 Q 250 15 300 50" fill="none" stroke="#8b5cf6" strokeWidth="2.5" />
                      {/* Cyan Line */}
                      <path d="M 0 90 Q 50 85 100 70 T 200 75 Q 250 85 300 80" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="1 1" />
                    </svg>
                  </div>
                </div>

                {/* Simulated Audit Report (Checklist) */}
                <div className="md:col-span-5 bg-zinc-900/35 border border-zinc-900 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-200">Active Audit Status</h4>
                  <div className="space-y-2">
                    {[
                      { name: "Domain Verification Check", status: "Verified", ok: true },
                      { name: "Upfront Application Fees Check", status: "None Flagged", ok: true },
                      { name: "XGBoost Text Authenticity", status: "99.1% Genuine", ok: true },
                      { name: "Urgency Key Phrases Check", status: "Normal", ok: true }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[9px] border-b border-zinc-900 pb-1.5 last:border-0 last:pb-0">
                        <span className="text-zinc-400 font-medium">{item.name}</span>
                        <span className="font-bold text-emerald-400 flex items-center">
                          <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-2 flex items-center justify-between mt-1.5">
                    <span className="text-[8px] text-zinc-500 font-bold">XAI attributions computed</span>
                    <Link to="/analyze" className="text-purple-400 text-[8px] font-bold hover:underline flex items-center">
                      Run Audit <ChevronRight className="h-3 w-3 ml-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Tech Partners / Monochrome Logos Row (Tracle style) */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-4">
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Trusted by Cybersecurity Research Teams</p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-30 grayscale hover:opacity-40 transition-opacity">
          <div className="flex items-center space-x-1.5">
            <Shield className="h-4 w-4" />
            <span className="font-bold tracking-tight text-sm">ShieldGuard</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Brain className="h-4 w-4" />
            <span className="font-bold tracking-tight text-sm">VerifyNLP</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <FileLock2 className="h-4 w-4" />
            <span className="font-bold tracking-tight text-sm">NetSecure</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Users className="h-4 w-4" />
            <span className="font-bold tracking-tight text-sm">TrustCore</span>
          </div>
        </div>
      </section>

      {/* Powerful Features Bento Grid (Recreating Tracle's Bento Grid) */}
      <section className="max-w-5xl mx-auto px-4 space-y-10 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1 rounded-full bg-purple-950/20 border border-purple-500/10 px-3 py-1 text-[9px] font-bold text-purple-400 uppercase tracking-widest">
            Features
          </div>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight sm:text-4xl">
            Powerful Features to Simplify your Security
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-xs sm:text-sm font-medium">
            Discover how our AI-driven models and cybersecurity rules protect job seekers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Card 1: NLP Classifiers (Similar to AI Automation in screenshot) */}
          <div className="md:col-span-5 bg-zinc-900/10 border border-zinc-800/80 rounded-[20px] p-6 flex flex-col justify-between hover:border-zinc-800 transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-purple-500/5 w-32 h-32 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Brain className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-200">Deep NLP Classifiers</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                  We use optimized TF-IDF, Bidirectional LSTMs, and pre-trained BERT weights to verify text authenticity, flagging suspicious phrases instantly.
                </p>
              </div>
            </div>
            {/* Visual element representing model prediction bubble */}
            <div className="mt-6 border border-zinc-900 bg-zinc-950/40 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-lg bg-purple-500/20 flex items-center justify-center text-[10px] font-bold text-purple-400">AI</div>
                <div className="text-left leading-none">
                  <div className="text-[9px] font-bold text-slate-300">BERT Transformer</div>
                  <div className="text-[8px] text-zinc-500">Scanning content vectors...</div>
                </div>
              </div>
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                99.1% Genuine
              </span>
            </div>
          </div>

          {/* Card 2: Security Checklist (Similar to Smart Insights in screenshot) */}
          <div className="md:col-span-7 bg-zinc-900/10 border border-zinc-800/80 rounded-[20px] p-6 flex flex-col justify-between hover:border-zinc-800 transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-indigo-500/5 w-36 h-36 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all" />
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-200">Cybersecurity Auditing</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                  Inspects emails, WHOIS registries, shortened links, and filters out listings that try to harvest national identifier details.
                </p>
              </div>
            </div>
            {/* Visual Checklist representing task items */}
            <div className="mt-6 space-y-2">
              {[
                { name: "Verify Corporate Domain", active: true },
                { name: "Scan for Processing Fee Flags", active: true },
                { name: "Validate Recruit Email DNS", active: false }
              ].map((task, idx) => (
                <div key={idx} className="flex items-center justify-between border border-zinc-900 bg-zinc-950/40 rounded-xl px-4 py-2 text-[10px]">
                  <span className="text-zinc-300 font-semibold">{task.name}</span>
                  <span className={`h-1.5 w-1.5 rounded-full ${task.active ? 'bg-purple-500 shadow-[0_0_10px_#8b5cf6]' : 'bg-zinc-700'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: XAI / Device Prototype picker (Similar to Generate Prototypes in screenshot) */}
          <div className="md:col-span-6 bg-zinc-900/10 border border-zinc-800/80 rounded-[20px] p-6 flex flex-col justify-between hover:border-zinc-800 transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-cyan-500/5 w-32 h-32 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all" />
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Activity className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-200">Explainable AI (SHAP)</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                  We display exact feature importance scores (Shapley Values) to verify why a post was classified as genuine or high risk.
                </p>
              </div>
            </div>
            {/* Interactive device mock buttons */}
            <div className="mt-6 grid grid-cols-3 gap-2 border border-zinc-900 bg-zinc-950/40 rounded-xl p-2">
              {[
                { name: "Text Features", icon: Laptop, active: true },
                { name: "Metadata", icon: Shield, active: false },
                { name: "Security", icon: Lock, active: false }
              ].map((dev, idx) => {
                const Icon = dev.icon;
                return (
                  <div 
                    key={idx} 
                    className={`flex flex-col items-center justify-center py-2.5 rounded-lg text-[9px] font-bold cursor-pointer transition-all ${
                      dev.active ? 'bg-zinc-900 text-slate-200 border border-zinc-800' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 mb-1" />
                    <span>{dev.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 4: Collaboration tools (Similar to Collaboration Tools in screenshot) */}
          <div className="md:col-span-6 bg-zinc-900/10 border border-zinc-800/80 rounded-[20px] p-6 flex flex-col justify-between hover:border-zinc-800 transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-purple-500/5 w-32 h-32 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Users className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-200">Community Safety Reports</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                  Allows job seekers to upload scam details, building a shared local security list to warn others immediately of active fraud.
                </p>
              </div>
            </div>
            {/* Mock Chat / Collaboration snippets */}
            <div className="mt-6 space-y-1.5 border border-zinc-900 bg-zinc-950/40 rounded-xl p-3">
              <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider">Scam Alerts Feed</div>
              <div className="text-[9px] text-zinc-300 bg-zinc-900/60 p-2 rounded-lg border border-zinc-850">
                ⚠️ <span className="font-bold text-slate-200">hr-team-recruiting@gmail.com</span> flagged. Urgently demanding interview deposit.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started / Work Process Steps (Recreating Tracle's Step cards) */}
      <section className="max-w-5xl mx-auto px-4 space-y-10 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1 rounded-full bg-purple-950/20 border border-purple-500/10 px-3 py-1 text-[9px] font-bold text-purple-400 uppercase tracking-widest">
            Work Process
          </div>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight sm:text-4xl">
            Getting Started with FakeJobShield
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-xs sm:text-sm font-medium">
            Follow these three simple steps to start analyzing recruitment offerings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              step: "Step 01", 
              title: "Input Intelligence", 
              desc: "Paste the raw job advertisement text, recruiter email address, or company domain into our audit console." 
            },
            { 
              step: "Step 02", 
              title: "Compute AI Risk Score", 
              desc: "Our dual-engine model processes the text through NLP transformers while auditing metadata parameters." 
            },
            { 
              step: "Step 03", 
              title: "Review attributions", 
              desc: "Evaluate explainable risk attributions, print detailed XAI diagnostics, and save/download PDF reports." 
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="bg-zinc-900/10 border border-zinc-800/80 rounded-[20px] p-6 hover:border-zinc-800 transition-all flex flex-col justify-between space-y-6 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 bg-purple-500/5 w-24 h-24 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
              <div className="space-y-4">
                <span className="text-[9px] font-bold text-purple-400 bg-purple-950/40 border border-purple-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  {item.step}
                </span>
                <h3 className="text-sm font-bold text-slate-200">{item.title}</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
              <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[9px]">
                <span className="text-zinc-500 font-bold">FakeJobShield V1.0</span>
                <ChevronRight className="h-3.5 w-3.5 text-purple-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6 pt-6 relative z-10">
        <h2 className="text-3xl sm:text-5xl font-black text-slate-100">Start Auditing Advertisements</h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          Scan links, recruiter emails, or paste text to generate trust cards and download verified PDF report sheets.
        </p>
        <div>
          <Link
            to="/analyze"
            className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 px-8 py-3.5 font-bold text-white shadow-lg shadow-purple-500/10 hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Get Started Free</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
