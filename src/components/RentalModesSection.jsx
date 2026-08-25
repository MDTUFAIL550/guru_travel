import React, { useState, useEffect } from 'react';
import { 
  UserCheck, Key, CheckCircle2, Clock, AlertTriangle, ShieldCheck, 
  ArrowRight, X, Sparkles, HeartHandshake, PhoneCall, Check 
} from 'lucide-react';

export default function RentalModesSection({ onBookWithDriver, onNotifySelfDrive }) {
  const [showDriverDetails, setShowDriverDetails] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowDriverDetails(false);
    };
    if (showDriverDetails) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showDriverDetails]);

  return (
    <section id="rental-modes" className="py-20 bg-slate-100/70 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Rental Options</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Chauffeur-Driven Travel. Zero Hassle.
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
            We operate fully chauffeured rentals to guarantee maximum road safety, punctual timings, and zero navigation stress.
          </p>
        </div>

        {/* Comparison Cards — Progressive Disclosure */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Option 1: With Driver (ACTIVE) */}
          <div className="bg-white rounded-3xl p-7 sm:p-8 border-2 border-slate-900 shadow-premium relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 bg-slate-900 text-amber-400 text-[11px] font-bold px-3.5 py-1 rounded-bl-xl uppercase tracking-wider">
              Active • 24/7 Available
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mb-5 shadow-sm">
                <UserCheck className="w-6 h-6 text-amber-700" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-950">
                With Driver (Chauffeur-Driven)
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Sit back, relax, and let our verified, licensed, and experienced local chauffeurs handle the traffic, tolls, and navigation.
              </p>

              {/* Concise Highlights */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold flex items-center">
                  <Check className="w-4 h-4 mr-1 text-emerald-600" />
                  Zero Security Deposit
                </span>
                <button
                  onClick={() => setShowDriverDetails(true)}
                  className="text-amber-800 hover:text-amber-950 font-bold underline transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={onBookWithDriver}
                className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-sm transition-all text-sm"
              >
                <span>Book With Driver Now</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          {/* Option 2: Without Driver / Self-Drive (COMING SOON) */}
          <div className="bg-white/80 rounded-3xl p-7 sm:p-8 border border-slate-200 shadow-subtle relative overflow-hidden flex flex-col justify-between opacity-95">
            <div className="absolute top-0 right-0 bg-slate-200 text-slate-700 text-[11px] font-bold px-3.5 py-1 rounded-bl-xl uppercase tracking-wider">
              Coming Soon
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mb-5">
                <Key className="w-6 h-6" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Self-Drive (Without Driver)
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Drive yourself! Currently under technical, insurance, and fleet preparation. Coming in a future update.
              </p>

              {/* Concise Status */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>In-progress roadmap</span>
                <button
                  onClick={onNotifySelfDrive}
                  className="text-slate-700 hover:text-slate-950 font-bold underline transition-colors"
                >
                  Learn More
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={onNotifySelfDrive}
                className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all text-sm"
              >
                <span>Notify Me When Ready</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Driver Details Modal (Progressive Disclosure) */}
      {showDriverDetails && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowDriverDetails(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-fadeIn max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowDriverDetails(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-sm">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Active Operational Model
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
                  Chauffeur-Driven Service Standards
                </h3>
              </div>
            </div>

            {/* Inclusions */}
            <div className="space-y-3 my-6 text-xs sm:text-sm text-slate-700">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-950 block">Route & Traffic Expertise:</strong>
                  <span>Experienced on all Bihar highways, Patna urban corridors, and rural bypasses.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-950 block">Zero Deposit & Licence Risk:</strong>
                  <span>No security deposit, credit card hold, or driving licence deposit required.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-950 block">Punctual Arrival Tracking:</strong>
                  <span>Live tracking for airport and railway station drops so you never miss a connection.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-950 block">Family & Luggage Assistance:</strong>
                  <span>Courteous assistance with bags, child safety, and clean AC vehicle interiors.</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => setShowDriverDetails(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Close Details
              </button>

              <button
                onClick={() => {
                  setShowDriverDetails(false);
                  onBookWithDriver();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-md text-xs sm:text-sm"
              >
                <span>Book With Driver Now</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
