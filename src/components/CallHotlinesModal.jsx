import React, { useEffect } from 'react';
import { Phone, MessageSquare, X, ArrowRight, ShieldCheck, Headphones } from 'lucide-react';
import { 
  GURU_PHONE_PRIMARY, 
  GURU_PHONE_PRIMARY_DISPLAY, 
  GURU_PHONE_SECONDARY, 
  GURU_PHONE_SECONDARY_DISPLAY,
  generateWhatsAppUrl 
} from '../utils/whatsappHelper';

export default function CallHotlinesModal({ isOpen, onClose }) {
  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3.5 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-slate-950 text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-800 relative animate-fadeIn max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          aria-label="Close hotline dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/10 text-amber-400 border border-amber-400/30 flex items-center justify-center mx-auto mb-3.5 shadow-sm">
            <Headphones className="w-7 h-7" />
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20 uppercase tracking-wider">
            Direct 24/7 Calling Desk
          </span>
          <h3 className="text-2xl font-black text-white mt-2 tracking-tight">
            Call Guru Travel
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            Choose either hotline number below for instant vehicle confirmation and quotes.
          </p>
        </div>

        {/* Hotlines Cards (Styled exactly according to user images) */}
        <div className="space-y-3.5 my-6">
          
          {/* Primary Hotline Card */}
          <a
            href={`tel:${GURU_PHONE_PRIMARY}`}
            className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 transition-all flex items-center justify-between group shadow-sm hover:shadow active:scale-98"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[11px] text-slate-400 block font-medium">Primary 24/7 Hotline</span>
                <span className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  {GURU_PHONE_PRIMARY_DISPLAY}
                </span>
              </div>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-800 group-hover:bg-amber-400 group-hover:text-slate-950 text-slate-300 text-xs font-bold transition-all flex items-center shrink-0">
              <span>Call</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </a>

          {/* Secondary Hotline Card */}
          <a
            href={`tel:${GURU_PHONE_SECONDARY}`}
            className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 transition-all flex items-center justify-between group shadow-sm hover:shadow active:scale-98"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-xl bg-slate-800 text-amber-400 border border-slate-700 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[11px] text-slate-400 block font-medium">Secondary Hotline</span>
                <span className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  {GURU_PHONE_SECONDARY_DISPLAY}
                </span>
              </div>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-800 group-hover:bg-amber-400 group-hover:text-slate-950 text-slate-300 text-xs font-bold transition-all flex items-center shrink-0">
              <span>Call</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </a>

          {/* WhatsApp Quick Chat */}
          <a
            href={generateWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between group shadow-sm hover:shadow active:scale-98"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[11px] text-slate-400 block font-medium">WhatsApp Dispatch Desk</span>
                <span className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Chat Now (+91 85788 11081)
                </span>
              </div>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950/80 group-hover:bg-emerald-500 group-hover:text-slate-950 text-emerald-400 border border-emerald-800 group-hover:border-transparent text-xs font-bold transition-all flex items-center shrink-0">
              <span>WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </a>

        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-slate-900 text-center text-xs text-slate-500 flex items-center justify-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Vaishali Operating Hub • Available 24/7 Across Bihar & India</span>
        </div>

      </div>
    </div>
  );
}
