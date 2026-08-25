import React, { useState } from 'react';
import { CheckCircle2, MessageSquare, Phone, X, Calendar, MapPin, Car, User, Copy, Check, Search, ShieldCheck } from 'lucide-react';
import { GURU_PHONE_PRIMARY, GURU_PHONE_PRIMARY_DISPLAY, generateWhatsAppUrl } from '../utils/whatsappHelper';

export default function BookingSuccessModal({ booking, onClose, onTrackBooking }) {
  const [copied, setCopied] = useState(false);

  if (!booking) return null;

  const refId = booking.referenceId || booking.id || 'GT-CONFIRMED';

  const copyRef = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(refId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3.5 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-8 shadow-2xl border border-slate-200 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-sm">
          <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
        </div>

        <div className="text-center mb-5">
          <span className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
            Booking Request Received
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-950 mt-2 tracking-tight">
            Enquiry Submitted Successfully!
          </h3>
          
          {/* Reference ID Banner */}
          <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 inline-flex items-center space-x-2">
            <span className="text-xs text-amber-900 font-medium">Reference ID:</span>
            <strong className="text-slate-950 font-mono text-sm tracking-wider font-extrabold">{refId}</strong>
            <button
              onClick={copyRef}
              className="p-1 hover:bg-amber-100 rounded text-amber-800 transition-colors"
              title="Copy Reference ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Booking Summary Box */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5 text-xs sm:text-sm text-slate-700 mb-5">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <span className="text-slate-500 font-medium">Service Type:</span>
            <span className="font-bold text-slate-950">{booking.serviceType}</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <span className="text-slate-500 font-medium">Route:</span>
            <span className="font-semibold text-slate-950 text-right">{booking.pickup} → {booking.destination}</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <span className="text-slate-500 font-medium">Schedule:</span>
            <span className="font-semibold text-slate-950">{booking.date} at {booking.time}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Vehicle Preference:</span>
            <span className="font-semibold text-slate-950">{booking.vehicle || 'Standard'}</span>
          </div>
        </div>

        {/* Next Steps Advisory */}
        <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 mb-5 space-y-1">
          <p className="font-bold text-slate-950">Important Dispatch Information:</p>
          <p>• This is a booking enquiry request. Our Vaishali dispatch desk will review vehicle availability and confirm pricing with you by Call/WhatsApp.</p>
          <p>• Zero prepayment is needed right now.</p>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <a
            href={generateWhatsAppUrl(booking)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[48px] inline-flex items-center justify-center px-5 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all text-sm"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            <span>Chat on WhatsApp for Instant Confirmation</span>
          </a>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => {
                onClose();
                if (onTrackBooking) onTrackBooking();
                else window.location.pathname = '/track-booking';
              }}
              className="min-h-[44px] py-2.5 px-3 rounded-xl font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors text-xs flex items-center justify-center space-x-1"
            >
              <Search className="w-3.5 h-3.5 mr-1 text-slate-500" />
              <span>Track Live Status</span>
            </button>

            <button
              onClick={onClose}
              className="min-h-[44px] py-2.5 px-3 rounded-xl font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors text-xs"
            >
              Done & Return
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
