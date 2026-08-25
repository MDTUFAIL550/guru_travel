import React, { useState } from 'react';
import { ShieldCheck, Lock, User, AlertCircle, ArrowLeft, Loader2, Car } from 'lucide-react';
import { adminAuth } from '../utils/adminAuth';

export default function AdminLogin({ onLoginSuccess, onNavigateHome }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);

    try {
      const result = await adminAuth.login(username.trim(), password, remember);

      if (result.success) {
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          window.location.pathname = '/admin';
        }
      } else {
        setError(result.error || 'Invalid admin credentials.');
      }
    } catch (err) {
      setError('Unable to connect to Guru Travel server. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Background Accent Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent pointer-events-none blur-3xl"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        
        {/* Back to Site Link */}
        <button
          onClick={onNavigateHome || (() => { window.location.pathname = '/'; })}
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-amber-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Return to Public Website</span>
        </button>

        {/* Brand Header */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-400/20 mb-4">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            GURU TRAVEL
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mt-1">
            Internal Admin Portal
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Vaishali Central Fleet & Booking Management System
          </p>
        </div>
      </div>

      {/* Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-800">
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {error && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-start space-x-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-tight">{error}</span>
              </div>
            )}

            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  name="username"
                  required
                  autoFocus
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all"
                />
              </div>
            </div>

            {/* Remember Option */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-400 focus:ring-amber-400"
                />
                <span className="ml-2">Remember on this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 focus:ring-2 focus:ring-amber-400 transition-all shadow-md shadow-amber-400/20 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Login to Dashboard</span>
              )}
            </button>

          </form>

          {/* Security Notice Footer */}
          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-500">
              Authorized personnel only. All access is audited and logged.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
