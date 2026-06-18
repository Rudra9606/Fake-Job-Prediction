import React from 'react';
import { ShieldAlert, BookOpen, Goal, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      {/* Title */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-bold text-gradient">About FakeJobShield</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Understanding the research motivation and technology behind our hybrid fraud detection framework.
        </p>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-3 text-red-400 font-bold text-lg">
            <ShieldAlert className="h-6 w-6" />
            <h2>The Threat Landscape</h2>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Recruitment scams have surged globally. Fraudulent job posts target vulnerable job seekers to extract sensitive personal data (Aadhaar, PAN, Passports), harvest login credentials, or demand upfront registration and training fees. Traditional defenses rely on reactive spam filters and manual reviews, which fail against sophisticated, dynamically generated scams.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-3 text-indigo-400 font-bold text-lg">
            <Goal className="h-6 w-6" />
            <h2>Our Solution Paradigm</h2>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            FakeJobShield proposes a novel hybrid paradigm. It combines advanced Natural Language Processing (BERT & TF-IDF models) to analyze semantic intent with a cybersecurity verification layer checking registrar records, email configurations, and embedded links. By mapping risk levels to an intuitive Trust Score, the system validates postings in real-time.
          </p>
        </div>
      </section>

      {/* Research Methodology */}
      <section className="glass-panel p-8 rounded-2xl space-y-6">
        <div className="flex items-center space-x-3 text-purple-400 font-bold text-xl">
          <BookOpen className="h-6 w-6" />
          <h2>Research Goals & Contribution</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          The primary objective of this project is to demonstrate that combining textual semantic modeling with rule-based cybersecurity flags (email domains, link redirects, registrar dates) yields a significantly higher detection rate and lower False Positive Rate (FPR) compared to traditional text-only machine learning classifiers.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
            <h4 className="text-slate-400 text-xs font-semibold uppercase">Dataset Corpus</h4>
            <p className="text-indigo-400 font-bold mt-1">EMSCAD (17,880 jobs)</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
            <h4 className="text-slate-400 text-xs font-semibold uppercase">Primary Classifiers</h4>
            <p className="text-indigo-400 font-bold mt-1">XGBoost & LightGBM</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
            <h4 className="text-slate-400 text-xs font-semibold uppercase">Explainability</h4>
            <p className="text-indigo-400 font-bold mt-1">SHAP TreeExplainer</p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 text-indigo-400 font-bold text-lg justify-center">
          <Users className="h-5 w-5" />
          <h2>Project Scope</h2>
        </div>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          FakeJobShield is built as a complete portfolio-ready demonstration of MLOps pipeline integration, combining web engineering (MERN) with cybersecurity rule verification and model packaging.
        </p>
      </section>
    </div>
  );
};

export default About;
