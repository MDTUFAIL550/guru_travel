import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import { GURU_PHONE_PRIMARY, generateWhatsAppUrl } from '../utils/whatsappHelper';

export default function FloatingActions({ onCallClick }) {
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col space-y-2.5 sm:space-y-3 items-end pointer-events-none">
      {/* WhatsApp Floating CTA */}
      <a
        href={generateWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all pointer-events-auto"
        title="Chat on WhatsApp (+91 85788 11081)"
        aria-label="Chat on WhatsApp (+91 85788 11081)"
      >
        <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
      </a>

      {/* Direct Phone Call CTA */}
      <button
        type="button"
        onClick={onCallClick ? onCallClick : () => { window.location.href = `tel:${GURU_PHONE_PRIMARY}`; }}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-950 border border-slate-800 text-amber-400 hover:bg-slate-900 flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all pointer-events-auto"
        title="Call 24/7 Hotline (+91 85788 11081 / +91 96933 84849)"
        aria-label="Call Guru Travel Hotlines"
      >
        <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  );
}
