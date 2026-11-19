import React, { useState } from 'react';
import {
  ShoppingBag,
  ShoppingCart,
  Heart,
  User,
  ShieldCheck,
  Code2,
  Package,
  Layers,
  Search,
  LogOut,
  ChevronDown,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenAuth,
  onOpenProfile
}) {
  const { user, isAuthenticated, isAdmin, logout, quickLogin } = useAuth();
  const { cartCount, wishlist, setIsCartOpen } = useCart();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      {/* Top Academic Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-mnb-900 to-slate-900 text-white text-xs py-1.5 px-4 text-center flex flex-wrap items-center justify-between gap-2 border-b border-mnb-800">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="bg-mnb-600 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase">
            BCA-311 Project
          </span>
          <span className="font-medium text-slate-200">
            Summer Training Internship Project | <strong className="text-white">MNB Soft Solutions Pvt. Ltd.</strong>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-300">
          <span>Quick Evaluator Demo Logins:</span>
          <button
            onClick={() => quickLogin('admin')}
            className="bg-mnb-700/80 hover:bg-mnb-600 text-white px-2 py-0.5 rounded border border-mnb-500/50 transition-colors"
          >
            Admin (Full Access)
          </button>
          <button
            onClick={() => quickLogin('customer')}
            className="bg-slate-700/80 hover:bg-slate-600 text-white px-2 py-0.5 rounded border border-slate-500/50 transition-colors"
          >
            Customer
          </button>
          <button
            onClick={() => quickLogin('vendor')}
            className="bg-emerald-800/80 hover:bg-emerald-700 text-white px-2 py-0.5 rounded border border-emerald-500/50 transition-colors"
          >
            Vendor
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('storefront')}
            className="flex items-center gap-3 cursor-pointer select-none flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-mnb-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-mnb-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">MNB</span>
                <span className="font-semibold text-lg text-mnb-600 tracking-tight">Storefront</span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono tracking-tight leading-none">
                BCA-311 • E-Commerce
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products by title, SKU, or tech category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-lg border border-slate-200 focus:border-mnb-500 focus:ring-2 focus:ring-mnb-100 transition-all outline-none"
            />
          </div>

          {/* Nav Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('storefront')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'storefront'
                  ? 'bg-mnb-50 text-mnb-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Package className="w-4 h-4" />
              Storefront
            </button>

            <button
              onClick={() => setActiveTab('collaboration')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'collaboration'
                  ? 'bg-mnb-50 text-mnb-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Code2 className="w-4 h-4" />
              Collaboration Hub
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-mnb-50 text-mnb-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              Orders
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200'
                    : 'text-indigo-600 hover:bg-indigo-50/60 font-medium'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Analytics & Forecast
              </button>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Wishlist Indicator */}
            <button
              onClick={() => setActiveTab('storefront')}
              title={`Wishlist (${wishlist.length} items)`}
              className="p-2 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors relative"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-slate-600 hover:text-mnb-600 hover:bg-slate-100 rounded-lg transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-mnb-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-sm font-medium text-slate-800"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-mnb-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                    {user?.name?.[0] || 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[120px] truncate">{user?.name}</span>
                  <span className={`hidden sm:inline text-[10px] px-1.5 py-0.5 rounded font-mono uppercase ${
                    user?.role === 'admin' ? 'bg-purple-100 text-purple-700 font-bold' :
                    user?.role === 'vendor' ? 'bg-emerald-100 text-emerald-700 font-bold' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {user?.role}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenProfile();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Developer & Tech Profile
                    </button>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        setActiveTab('orders');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Layers className="w-4 h-4 text-slate-400" />
                      My Orders & Invoices
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setActiveTab('admin');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 font-medium flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-indigo-500" />
                        Admin Dashboard & Forecast
                      </button>
                    )}
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-mnb-600 hover:bg-mnb-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5"
              >
                <User className="w-4 h-4" />
                Sign In
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 space-y-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-slate-100 text-sm rounded-lg mb-2 outline-none"
            />
            <button
              onClick={() => { setActiveTab('storefront'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'storefront' ? 'bg-mnb-50 text-mnb-600 font-semibold' : 'text-slate-600'
              }`}
            >
              Storefront Catalog
            </button>
            <button
              onClick={() => { setActiveTab('collaboration'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'collaboration' ? 'bg-mnb-50 text-mnb-600 font-semibold' : 'text-slate-600'
              }`}
            >
              Collaboration Hub
            </button>
            <button
              onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'orders' ? 'bg-mnb-50 text-mnb-600 font-semibold' : 'text-slate-600'
              }`}
            >
              My Orders
            </button>
            {isAdmin && (
              <button
                onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 bg-indigo-50"
              >
                Admin Analytics & Forecast
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
