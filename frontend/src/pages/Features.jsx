import React from 'react';
import { Brain, ShieldCheck, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';

const Features = () => {
  const featuresList = [
    {
      title: 'Natural Language Processing (NLP) Modeling',
      icon: Brain,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      description: 'Extracts TF-IDF features with max_features=10000 and ngram_range=(1,2). The model captures lexical distributions, syntactic styling, and contextual profiles of fraudulent posts (which typically lack detailed descriptions or include suspicious benefits/salary details).',
    },
    {
      title: 'Cybersecurity Expert Indicators',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      description: 'Engineers custom security rule metrics: checks recruiter email domains against public lists, compares email domains against company profiles to flag mismatches, scans websites for registrar ages, detects URL redirect shorteners (bit.ly/goo.gl), and searches for sensitive requests.',
    },
    {
      title: 'Explainable AI (XAI) using SHAP',
      icon: HelpCircle,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      description: 'Applies SHAP TreeExplainer to explain classification outputs. This translates complex model weights into user-friendly explanations, highlighting exactly which words (e.g. "bank account", "processing fee") or flags contributed most to the scam designation.',
    },
    {
      title: 'Dynamic Trust Score Framework',
      icon: FileText,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      description: 'Combines the AI probability, cybersecurity flag penalty, and structural scores using a weighted formula: Trust Score = (1 - Fraud Probability) * 100. Maps output scores to clear risk bands: Trusted (81-100), Low Risk (61-80), Medium Risk (41-60), High Risk (21-40), Highly Fraudulent (0-20).',
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Title */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-bold text-gradient">Framework Core Features</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Deep-dive into the four core pillars of the FakeJobShield architecture.
        </p>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {featuresList.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="glass-panel p-8 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className={`h-12 w-12 rounded-xl ${item.bg} border border-white/5 flex items-center justify-center ${item.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-200">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-500 pt-2 border-t border-white/5">
                <CheckCircle2 className={`h-4 w-4 ${item.color}`} />
                <span>Production-ready research verification module</span>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Features;
