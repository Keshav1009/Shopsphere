import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register, quickLogin } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isLoginTab) {
        await login(email, password);
      } else {
        await register({
          name,
          email,
          password,
          role,
          tech_stack: ['JavaScript', 'React', 'Node.js']
        });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuick = async (selectedRole) => {
    setError(null);
    setLoading(true);
    try {
      await quickLogin(selectedRole);
      onClose();
    } catch (err) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col border border-slate-200 animate-fade-in">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isLoginTab ? 'Sign In to Storefront' : 'Create Developer Account'}
            </h3>
            <p className="text-xs text-slate-500 font-mono">BCA-311 MNB Soft Solutions Auth</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 text-center text-xs border-b border-slate-100">
          <button
            onClick={() => { setIsLoginTab(true); setError(null); }}
            className={`py-3 font-bold border-b-2 transition-colors ${
              isLoginTab ? 'border-mnb-600 text-mnb-600 bg-mnb-50/30' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLoginTab(false); setError(null); }}
            className={`py-3 font-bold border-b-2 transition-colors ${
              !isLoginTab ? 'border-mnb-600 text-mnb-600 bg-mnb-50/30' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Register Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs">
              {error}
            </div>
          )}

          {!isLoginTab && (
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g., Aditya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border rounded-lg outline-none focus:border-mnb-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="developer@mnbsolutions.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border rounded-lg outline-none focus:border-mnb-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border rounded-lg outline-none focus:border-mnb-500"
                required
              />
            </div>
          </div>

          {!isLoginTab && (
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Preferred Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2.5 border rounded-lg outline-none focus:border-mnb-500 bg-white"
              >
                <option value="customer">Customer / Evaluator</option>
                <option value="vendor">Vendor / Hardware Specialist</option>
                <option value="admin">Admin / System Architect</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-mnb-600 hover:bg-mnb-700 text-white font-bold py-2.5 rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
          >
            <span>{loading ? 'Processing...' : isLoginTab ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Logins for Examiner */}
          <div className="pt-3 border-t border-slate-100 text-center space-y-2">
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              1-Click Viva Demo Accounts
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuick('admin')}
                className="py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold border border-indigo-200 transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuick('customer')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold border border-slate-200 transition-colors"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => handleQuick('vendor')}
                className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-bold border border-emerald-200 transition-colors"
              >
                Vendor
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
