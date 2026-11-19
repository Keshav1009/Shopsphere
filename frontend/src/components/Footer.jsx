import React from 'react';
import { ShoppingBag, Code2, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-mnb-600 flex items-center justify-center text-white font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight">MNB Storefront</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Summer Training Project (Paper Code: <strong>BCA-311</strong>) developed for an internship as a
              <strong> Full Stack Developer Intern</strong> at <strong>MNB Soft Solutions Pvt. Ltd.</strong>
            </p>
          </div>

          {/* Core Modules */}
          <div className="space-y-2">
            <p className="text-white font-bold text-xs uppercase tracking-wider">Functional Modules</p>
            <ul className="space-y-1.5 text-slate-400">
              <li>• User Auth & Tech-Stack Profile</li>
              <li>• E-Commerce Catalog & Multi-Criteria Filtering</li>
              <li>• Shopping Cart & Persistent State</li>
              <li>• Multi-Step Checkout & Tax Invoices</li>
            </ul>
          </div>

          {/* Advanced Capabilities */}
          <div className="space-y-2">
            <p className="text-white font-bold text-xs uppercase tracking-wider">Engineering Highlights</p>
            <ul className="space-y-1.5 text-slate-400">
              <li>• Collaborative Initiatives & Peer Hub</li>
              <li>• OLS Linear Regression Sales Forecasting</li>
              <li>• Automated Days-of-Inventory Intelligence</li>
              <li>• Full REST API & Automated Test Suite</li>
            </ul>
          </div>

          {/* Academic Evaluation Details */}
          <div className="space-y-2">
            <p className="text-white font-bold text-xs uppercase tracking-wider">Academic Metadata</p>
            <p className="text-slate-400">
              Company: <strong className="text-slate-200">MNB Soft Solutions Pvt. Ltd.</strong>
            </p>
            <p className="text-slate-400">
              Course Code: <strong className="text-slate-200">BCA-311 (Summer Project)</strong>
            </p>
            <p className="text-slate-400 font-mono text-[11px]">
              Stack: Node.js 20 • React 18 • SQLite • Tailwind
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© 2026 MNB Soft Solutions Pvt. Ltd. All rights reserved. 100% Original Academic Implementation.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for BCA-311 Viva Demonstration.
          </p>
        </div>
      </div>
    </footer>
  );
}
