import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Brain, ShieldCheck, HelpCircle, BarChart3, ArrowRight, Sparkles, CheckCircle2, ChevronRight, Activity, Users, FileLock2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="relative overflow-hidden min-h-screen pb-16 space-y-24">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-10 w-[400px] h-[400px] rounded-full bg-cyan-600/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-40 left-10 w-[450px] h-[450px] rounded-full bg-purple-600/5 blur-[130px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 pt-16 max-w-5xl mx-auto px-4 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 rounded-full bg-zinc-900 border border-zinc-800/80 px-4 py-1.5 text-xs text-purple-400 hover:border-purple-500/30 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span className="font-medium">Conference-Grade Hybrid AI Framework</span>
        </motion.div>

        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-100 leading-tight"
          >
            Protect Job Seekers with <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400">
              AI-Powered Fraud Detection
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-slate-400 text-base sm:text-xl max-w-3xl mx-auto font-medium leading-relaxed"
          >
            FakeJobShield combines advanced NLP transformers, Deep Learning models, 
            and expert cybersecurity validation rules to compute real-time Trust Scores 
            and explainable risk attributions.
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
            className="flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 font-bold text-white shadow-xl shadow-purple-500/10 hover:shadow-purple-500/30 hover:scale-[1.03] active:scale-[0.98] transition-all"
          >
            <span>Scan Job Posting</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/analytics"
            className="flex items-center space-x-2 rounded-2xl bg-zinc-950/80 border border-white/5 px-8 py-4 font-bold text-slate-300 hover:bg-zinc-900/60 hover:text-white transition-all hover:scale-[1.03] active:scale-[0.98]"
          >
            <BarChart3 className="h-4 w-4 text-purple-400" />
            <span>Research Metrics</span>
          </Link>
        </motion.div>
      </section>

      {/* Live Interactive Demo Widget */}
      <section className="relative z-10 max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="glass-panel p-6 sm:p-8 rounded-3xl glow-indigo border border-white/5 bg-zinc-950/40 backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-gradient-to-bl from-purple-500/10 to-transparent w-48 h-48 rounded-full blur-2xl" />
          
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="h-3.5 w-3.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Active Scan Simulation</span>
            </div>
            <span className="text-xs text-purple-400 font-mono">ID: FS-90812</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Speedometer Demo */}
            <div className="md:col-span-5 flex flex-col items-center justify-center space-y-4">
              <div className="relative w-44 h-44">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#18181b" strokeWidth="8" fill="none" />
                  <motion.circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke="url(#purpleGradient)" 
                    strokeWidth="8" 
                    fill="none" 
                    strokeDasharray="251.2"
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 * 0.12 }}
                    transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-4xl font-black text-slate-100"
                  >
                    88%
                  </motion.span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Trust Score</span>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1 text-xs font-bold text-emerald-400">
                Highly Trusted
              </span>
            </div>

            {/* Simulated Report Details */}
            <div className="md:col-span-7 space-y-4">
              <h3 className="text-lg font-bold text-slate-100">Simulation: Staff Software Engineer</h3>
              <div className="space-y-2">
                <div className="flex items-start space-x-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Valid corporate domain verified via DNS registry.</span>
                </div>
                <div className="flex items-start space-x-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>No requests for processing fees or ID card harvesting found.</span>
                </div>
                <div className="flex items-start space-x-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>XGBoost classifies textual context as 99.1% genuine.</span>
                </div>
              </div>
              <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Verify your own advertisement details now.</span>
                <Link to="/analyze" className="text-purple-400 hover:text-purple-300 text-xs font-bold flex items-center">
                  <span>Start Scan</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Framework Benchmarks Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">Performance Benchmarks</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Trained on 17,880 recruitment records. Evaluated against rigorous ML standard metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { metric: "98.6%", label: "Hybrid Accuracy", desc: "Combines text classifications with DNS registry age & domain matching checks.", border: "hover:border-purple-500/25" },
            { metric: "99.1%", label: "Model Recall", desc: "Minimal false negatives, ensuring malicious advertisements are actively caught.", border: "hover:border-cyan-500/25" },
            { metric: "12+", label: "Security Vectors", desc: "Evaluates Aadhaar/PAN, OTP request patterns, routing numbers, and registration fee flags.", border: "hover:border-emerald-500/25" },
            { metric: "< 0.8s", label: "Real-time Audits", desc: "Inference pipelines running on uvicorn FastAPI clusters process claims instantly.", border: "hover:border-red-500/25" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className={`bento-card ${stat.border} bg-zinc-950/20 border border-white/5 p-6 rounded-2xl transition-all duration-300`}
            >
              <span className="text-4xl font-black bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent block mb-1">{stat.metric}</span>
              <span className="text-sm font-semibold text-slate-200 block">{stat.label}</span>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Core Technology Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">Technical Architecture</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Three main framework components combined to generate an objective Trust Score.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Brain, title: "Deep NLP Classifiers", color: "text-purple-400", bg: "bg-purple-500/5 border-purple-500/10", desc: "Extracts tf-idf vectors and semantic transformer embeddings from titles, descriptions, and benefits to train an optimized ensemble model." },
            { icon: ShieldCheck, title: "Cybersecurity Audits", color: "text-cyan-400", bg: "bg-cyan-500/5 border-cyan-500/10", desc: "Checks disposable recruiter email domains, WHOIS registry timelines, short-URL chains, and regex patterns harvesting PII details." },
            { icon: HelpCircle, title: "Explainable AI (SHAP)", color: "text-emerald-400", bg: "bg-emerald-500/5 border-emerald-500/10", desc: "Deconstructs XGBoost trees to output Shapley values for words, categoricals, and binary flags, making predictions clear and transparent." }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="glass-panel p-8 rounded-3xl border border-white/5 bg-zinc-950/20 space-y-4 hover:border-white/10 transition-colors">
                <div className={`h-12 w-12 rounded-2xl ${item.bg} border flex items-center justify-center ${item.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-100">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Research Highlights & Testimonial */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="glass-panel rounded-3xl border border-white/5 bg-zinc-950/30 p-8 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
          <div className="space-y-4">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
              <Activity className="h-4 w-4" />
              Research Contribution
            </span>
            <h3 className="text-2xl font-bold text-slate-100 tracking-tight">Mitigating Recruitment Fraud</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Recruitment scams target vulnerable job seekers, harvesting personal info, bank access, or upfront payments. 
              FakeJobShield provides an explainable cybersecurity auditing gateway to systematically flag advertisements before damage occurs.
            </p>
            <div className="flex items-center space-x-6 pt-2">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-cyan-400" />
                <span className="text-xs text-slate-300 font-bold">100% Open-Source</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileLock2 className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-slate-300 font-bold">Secure JWT Integration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6 pt-12 relative z-10">
        <h2 className="text-3xl sm:text-5xl font-black text-slate-100">Start Auditing Advertisements</h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Scan links, recruiter emails, or paste text to generate trust cards and download verified PDF report sheets.
        </p>
        <Link
          to="/analyze"
          className="inline-flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 font-bold text-white shadow-xl shadow-purple-500/10 hover:shadow-purple-500/35 hover:scale-[1.03] active:scale-[0.98] transition-all"
        >
          <span>Get Started Free</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
};

export default Home;
