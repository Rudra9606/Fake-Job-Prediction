import React from 'react';
import { Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/60 py-6 text-center text-xs text-slate-550 dark:text-slate-500 transition-colors">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-blue-600 dark:text-blue-405" />
          <span className="font-semibold text-slate-700 dark:text-slate-400">Fake Job Shield</span>
          <span>© 2026. All Rights Reserved.</span>
        </div>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Documentation</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
