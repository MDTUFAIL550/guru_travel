import React, { useState } from 'react';
import { Key, X, Bell, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ComingSoonModal({ onClose, onSwitchToDriver }) {
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [registered, setRegistered] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phoneOrEmail.trim()) {
      setRegistered(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-fadeIn">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Key Icon */}
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Key className="w-7 h-7 text-amber-700" />
        </div>

        <div className="text-center mb-6">
          <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200 uppercase tracking-wider">
            Coming Soon Feature
          </span>
          <h3 className="text-2xl font-black text-slate-950 mt-2">
            Self-Drive Car Rentals
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Our <strong>Self-Drive / Without Driver</strong> rental service is currently under insurance and fleet onboarding. It is not open for active booking in this release.
          </p>
        </div>

        {/* Chauffeur Alternative Recommendation */}
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm text-slate-800 mb-6 flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-slate-950">Need a ride right now?</p>
            <p className="text-xs text-slate-600 mt-0.5">
              Our <strong>Chauffeur-Driven (With Driver)</strong> service is available 24/7 with zero deposit and stress-free driving!
            </p>
          </div>
        </div>

        {/* Waitlist form */}
        {!registered ? (
          <form onSubmit={handleSubmit} className="space-y-2.5 mb-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Get notified when Self-Drive launches in Bihar:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                placeholder="Mobile number or Email"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
                required
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shrink-0 shadow-sm"
              >
                Notify Me
              </button>
            </div>
          </form>
        ) : (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>You're on the early access waitlist! We'll message you when self-drive is live.</span>
          </div>
        )}

        {/* Action button */}
        <div className="pt-2">
          <button
            onClick={() => {
              onClose();
              if (onSwitchToDriver) onSwitchToDriver();
            }}
            className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-sm transition-all text-sm"
          >
            <span>Proceed With Chauffeur / With Driver</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>

      </div>
    </div>
  );
}
