import React from 'react';
import { ShieldAlert, BookOpen, Goal, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12 text-[#132238] select-none animate-fadeIn">
      {/* Title */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0D1B2A]">About Fake Job Shield</h1>
        <p className="text-[#6B7280] max-w-2xl mx-auto font-semibold text-sm">
          Understanding the research motivation and technology behind our hybrid fraud detection framework.
        </p>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <div className="bg-white border border-[#E3EAF5] p-6 rounded-2xl space-y-4 shadow-sm">
          <div className="flex items-center space-x-3 text-[#E74C3C] font-bold text-lg">
            <ShieldAlert className="h-6 w-6" />
            <h2>The Threat Landscape</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed font-semibold">
            Recruitment scams have surged globally. Fraudulent job posts target vulnerable job seekers to extract sensitive personal data (Aadhaar, PAN, Passports), harvest login credentials, or demand upfront registration and training fees. Traditional defenses rely on reactive spam filters and manual reviews, which fail against sophisticated, dynamically generated scams.
          </p>
        </div>

        <div className="bg-white border border-[#E3EAF5] p-6 rounded-2xl space-y-4 shadow-sm">
          <div className="flex items-center space-x-3 text-blue-600 font-bold text-lg">
            <Goal className="h-6 w-6" />
            <h2>Our Solution Paradigm</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed font-semibold">
            Fake Job Shield proposes a novel hybrid paradigm. It combines advanced Natural Language Processing (BERT & TF-IDF models) to analyze semantic intent with a cybersecurity verification layer checking registrar records, email configurations, and embedded links. By mapping risk levels to an intuitive Trust Score, the system validates postings in real-time.
          </p>
        </div>
      </section>

      {/* Research Methodology */}
      <section className="bg-white border border-[#E3EAF5] p-8 rounded-2xl space-y-6 shadow-sm">
        <div className="flex items-center space-x-3 text-[#43B97F] font-bold text-xl">
          <BookOpen className="h-6 w-6" />
          <h2>Research Goals & Contribution</h2>
        </div>
        <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed font-semibold">
          The primary objective of this project is to demonstrate that combining textual semantic modeling with rule-based cybersecurity flags (email domains, link redirects, registrar dates) yields a significantly higher detection rate and lower False Positive Rate (FPR) compared to traditional text-only machine learning classifiers.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs">
          <div className="bg-[#F7FAFD] p-4 rounded-xl border border-[#E3EAF5]">
            <h4 className="text-[#6B7280] font-bold uppercase tracking-wider text-[9px]">Dataset Corpus</h4>
            <p className="text-[#081B2F] font-bold mt-1.5 text-xs">EMSCAD (17,880 jobs)</p>
          </div>
          <div className="bg-[#F7FAFD] p-4 rounded-xl border border-[#E3EAF5]">
            <h4 className="text-[#6B7280] font-bold uppercase tracking-wider text-[9px]">Primary Classifiers</h4>
            <p className="text-[#081B2F] font-bold mt-1.5 text-xs">XGBoost & LightGBM</p>
          </div>
          <div className="bg-[#F7FAFD] p-4 rounded-xl border border-[#E3EAF5]">
            <h4 className="text-[#6B7280] font-bold uppercase tracking-wider text-[9px]">Explainability</h4>
            <p className="text-[#081B2F] font-bold mt-1.5 text-xs">SHAP TreeExplainer</p>
          </div>
        </div>
      </section>

      {/* Project Scope */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 text-blue-600 font-bold text-lg justify-center">
          <Users className="h-5 w-5" />
          <h2>Project Scope</h2>
        </div>
        <p className="text-xs sm:text-sm text-[#6B7280] max-w-xl mx-auto font-semibold">
          Fake Job Shield is built as a complete portfolio-ready demonstration of MLOps pipeline integration, combining web engineering (MERN) with cybersecurity rule verification and model packaging.
        </p>
      </section>
    </div>
  );
};

export default About;
