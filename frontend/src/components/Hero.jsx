import React from 'react';
import {
  Cpu,
  Monitor,
  Terminal,
  Shirt,
  Headphones,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Code
} from 'lucide-react';

const categoryPills = [
  { name: 'Developer Hardware', icon: Cpu, count: '6 items' },
  { name: 'Electronics', icon: Monitor, count: '4 items' },
  { name: 'Software Tools', icon: Terminal, count: '2 items' },
  { name: 'Merch', icon: Shirt, count: '3 items' },
  { name: 'Accessories', icon: Headphones, count: '2 items' },
  { name: 'Smart Devices', icon: Sparkles, count: '2 items' },
];

export default function Hero({ selectedCategory, setSelectedCategory, onExploreClick }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-mnb-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mnb-500/10 border border-mnb-400/20 text-mnb-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-mnb-400" />
              <span>Full-Stack E-Commerce & Predictive Intelligence System</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              High-Velocity Storefront for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-mnb-400 via-sky-300 to-indigo-300">
                Modern Developers
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Developed as a Summer Training Internship Project (Paper Code: <strong>BCA-311</strong>) at{' '}
              <strong className="text-white">MNB Soft Solutions Pvt. Ltd.</strong> Featuring modular REST APIs,
              peer-to-peer developer collaboration, and statistical sales forecasting.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-200">
                <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Simulated Checkout</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-200">
                <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>OLS Forecasting</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-200">
                <Code className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>Peer Dev Hub</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-200">
                <ShieldCheck className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Role-Based JWT</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={onExploreClick}
                className="bg-mnb-600 hover:bg-mnb-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-mnb-600/30 flex items-center gap-2 transition-all hover:gap-3"
              >
                <span>Browse Developer Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedCategory('Developer Hardware')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-5 py-3 rounded-xl border border-slate-700 transition-colors"
              >
                Developer Hardware
              </button>
            </div>
          </div>

          {/* Right Column: Promotional Spotlight Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/80 p-6 shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-rose-500/20 text-rose-300 text-xs font-bold px-2.5 py-1 rounded-md border border-rose-500/30">
                  SEASONAL PROMO • UP TO 30% OFF
                </span>
                <span className="text-xs font-mono text-slate-400">SKU: MNB-DEV-1001</span>
              </div>

              <div className="h-44 w-full rounded-xl overflow-hidden mb-4 relative group">
                <img
                  src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80"
                  alt="DevPro Keyboard"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs text-mnb-300 font-semibold uppercase tracking-wider">Top Rated Hardware</p>
                  <p className="text-sm font-bold truncate">DevPro RGB Mechanical Keyboard (Hot-Swappable)</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-white">$127.49</span>
                    <span className="text-slate-400 line-through text-sm">$149.99</span>
                    <span className="bg-emerald-500/20 text-emerald-400 text-xs px-1.5 py-0.5 rounded font-bold">Save 15%</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Free 2-day domestic dispatch for verified interns</p>
                </div>
                <button
                  onClick={onExploreClick}
                  className="bg-white text-slate-900 font-bold px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors text-xs"
                >
                  Quick View
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Horizontal Quick Filter Pills */}
        <div className="mt-10 pt-6 border-t border-slate-800">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Explore Curated Categories
          </p>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === 'All'
                  ? 'bg-mnb-600 text-white shadow-md shadow-mnb-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              All Categories (16+)
            </button>
            {categoryPills.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-mnb-600 text-white shadow-md shadow-mnb-600/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-mnb-400'}`} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
