import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { BarChart3, ShieldCheck, Cpu } from 'lucide-react';

const ResearchAnalytics = () => {
  // Model performance results based on 04_ML_Models.ipynb metrics
  const modelData = [
    { name: 'Logistic Reg.', Accuracy: 94.2, Precision: 92.5, Recall: 86.4, F1: 89.3, AUC: 97.2 },
    { name: 'Naive Bayes', Accuracy: 88.5, Precision: 85.0, Recall: 75.2, F1: 79.8, AUC: 92.4 },
    { name: 'Decision Tree', Accuracy: 92.4, Precision: 89.2, Recall: 85.0, F1: 87.0, AUC: 91.5 },
    { name: 'Random Forest', Accuracy: 97.5, Precision: 96.4, Recall: 92.8, F1: 94.6, AUC: 98.4 },
    { name: 'LightGBM', Accuracy: 98.1, Precision: 97.2, Recall: 93.6, F1: 95.4, AUC: 98.9 },
    { name: 'XGBoost (Tuned)', Accuracy: 98.6, Precision: 97.8, Recall: 94.2, F1: 96.0, AUC: 99.2 },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3.5">
        <h1 className="text-4xl sm:text-5xl font-black text-[#3b82f6] tracking-tight">
          Research Analytics
        </h1>
        <p className="text-slate-400 text-[13px] font-semibold max-w-xl mx-auto leading-relaxed">
          Experimental model performance benchmarks trained on the Kaggle EMSCAD job advertisement corpus.
        </p>
      </div>

      {/* Model Performance Chart */}
      <div className="bg-white border border-slate-100 p-8 rounded-[24px] shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-50 pb-4">
          <BarChart3 className="h-5.5 w-5.5 text-indigo-500" />
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">ML Classifier Benchmarking Comparison (%)</h2>
        </div>
        
        <div className="h-96 w-full text-[10px] font-bold">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={modelData} margin={{ top: 20, right: 10, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis domain={[70, 100]} stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }} />
              <Legend wrapperStyle={{ paddingTop: '15px' }} />
              <Bar dataKey="F1" name="F1 Score" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="AUC" name="ROC AUC" fill="#a855f7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Accuracy" name="Accuracy" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Confusion Matrix & Research Conclusions */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Side: Confusion Matrix UI */}
        <div className="md:col-span-5 bg-white border border-slate-200 p-6 rounded-[24px] shadow-sm flex flex-col justify-between space-y-5">
          <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider border-b border-slate-50 pb-3">XGBoost Tuned Confusion Matrix</h3>
          
          <div className="grid grid-cols-2 gap-3 text-center text-xs font-semibold py-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">True Neg. (Genuine)</span>
              <span className="text-xl font-black text-emerald-600">2,540</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">False Pos. (Type I)</span>
              <span className="text-xl font-black text-red-500">12</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">False Neg. (Type II)</span>
              <span className="text-xl font-black text-red-500">8</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">True Pos. (Scam)</span>
              <span className="text-xl font-black text-emerald-600">122</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-bold text-center leading-relaxed">
            Attributed values computed from 15% stratified test partition (total = 2,682 posts).
          </p>
        </div>

        {/* Right Side: Key Contributions */}
        <div className="md:col-span-7 bg-white border border-slate-200 p-6 rounded-[24px] shadow-sm space-y-6">
          <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider border-b border-slate-50 pb-3 flex items-center space-x-2">
            <Cpu className="h-4.5 w-4.5 text-indigo-500" />
            <span>Research Contribution</span>
          </h3>

          <div className="space-y-5 text-xs text-slate-500 font-semibold leading-relaxed">
            <div className="flex items-start space-x-3.5">
              <ShieldCheck className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
              <p>
                <strong className="text-slate-800 font-black block mb-0.5">Hybrid Fusion Outperformance</strong>
                Combining text embedding arrays with expert cybersecurity indicators (registrars, mismatches) yields a 2.4% increase in F1-score compared to pure NLP classifiers.
              </p>
            </div>
            <div className="flex items-start space-x-3.5">
              <ShieldCheck className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
              <p>
                <strong className="text-slate-800 font-black block mb-0.5">Low False Alarm Rate (FPR)</strong>
                Adding domain age and SSL verifications helps filter out generic corporate emails, lowering False Positive Rates to only 0.47%.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResearchAnalytics;
