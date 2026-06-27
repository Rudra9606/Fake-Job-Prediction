import React from 'react';
import { Brain, ShieldCheck, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';

const Features = () => {
  const featuresList = [
    {
      title: 'Natural Language Processing (NLP) Modeling',
      icon: Brain,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-100',
      description: 'Extracts TF-IDF features with max_features=10000 and ngram_range=(1,2). The model captures lexical distributions, syntactic styling, and contextual profiles of fraudulent posts (which typically lack detailed descriptions or include suspicious benefits/salary details).',
    },
    {
      title: 'Cybersecurity Expert Indicators',
      icon: ShieldCheck,
      color: 'text-[#43B97F]',
      bg: 'bg-[#E8F8F0] border-[#BCE8D1]',
      description: 'Engineers custom security rule metrics: checks recruiter email domains against public lists, compares email domains against company profiles to flag mismatches, scans websites for registrar ages, detects URL redirect shorteners (bit.ly/goo.gl), and searches for sensitive requests.',
    },
    {
      title: 'Explainable AI (XAI) using SHAP',
      icon: HelpCircle,
      color: 'text-indigo-650',
      bg: 'bg-indigo-50 border-indigo-100',
      description: 'Applies SHAP TreeExplainer to explain classification outputs. This translates complex model weights into user-friendly explanations, highlighting exactly which words (e.g. "bank account", "processing fee") or flags contributed most to the scam designation.',
    },
    {
      title: 'Dynamic Trust Score Framework',
      icon: FileText,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50 border-cyan-100',
      description: 'Combines the AI probability, cybersecurity flag penalty, and structural scores using a weighted formula: Trust Score = (1 - Fraud Probability) * 100. Maps output scores to clear risk bands: Trusted (81-100), Low Risk (61-80), Medium Risk (41-60), High Risk (21-40), Highly Fraudulent (0-20).',
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12 text-[#132238] select-none animate-fadeIn">
      {/* Title */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0D1B2A]">Framework Core Features</h1>
        <p className="text-[#6B7280] max-w-2xl mx-auto font-semibold text-sm">
          Deep-dive into the four core pillars of the Fake Job Shield architecture.
        </p>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {featuresList.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white border border-[#E3EAF5] p-8 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md hover:translate-y-[-3px] transition-all">
              <div className="space-y-4">
                <div className={`h-12 w-12 rounded-xl ${item.bg} border flex items-center justify-center ${item.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#132238]">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed font-semibold">{item.description}</p>
              </div>
              <div className="flex items-center space-x-2 text-xs text-[#6B7280] pt-3 border-t border-[#E3EAF5]">
                <CheckCircle2 className={`h-4.5 w-4.5 ${item.color}`} />
                <span className="font-semibold">Validated research verification module</span>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Features;
