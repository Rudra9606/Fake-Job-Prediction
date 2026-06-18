import React from 'react';
import { Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-zinc-800 bg-zinc-950/75 py-6 text-center text-xs text-slate-500">
      <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-indigo-500/80" />
          <span className="font-semibold text-slate-400">FakeJobShield</span>
          <span>© 2026. All Rights Reserved.</span>
        </div>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">Documentation</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
