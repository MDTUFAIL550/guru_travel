import React from 'react';
import { ShieldCheck, Clock, MapPin, Phone, MessageSquare, Instagram, ArrowRight, Check } from 'lucide-react';
import { 
  GURU_PHONE_PRIMARY, 
  GURU_PHONE_PRIMARY_DISPLAY, 
  GURU_PHONE_SECONDARY, 
  GURU_PHONE_SECONDARY_DISPLAY, 
  GURU_INSTAGRAM_URL,
  REYAJ_INSTAGRAM_URL, 
  generateWhatsAppUrl 
} from '../utils/whatsappHelper';

export default function Hero({ onBookClick, onExploreFleet, onCallClick }) {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white pt-8 pb-14 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-24">
      {/* Subtle ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
        <div className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full bg-amber-500/30 blur-3xl"></div>
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] rounded-full bg-slate-700/40 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
            
            {/* Single Elegant Trust Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-300">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="font-medium">Trusted Chauffeur-Driven Travel in Bihar</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Your Journey.<br />
              <span className="text-amber-400">Our Responsibility.</span>
            </h1>

            {/* Concise Supporting Description */}
            <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Reliable cars and experienced drivers for airport transfers, railway pickups, family trips, 
              corporate travel and long-distance journeys.
            </p>

            {/* Representative Destinations Tags */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-400 pt-1">
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">Patna</span>
              <span className="text-slate-600 select-none">•</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">Vaishali</span>
              <span className="text-slate-600 select-none">•</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">Hajipur</span>
              <span className="text-slate-600 select-none">•</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">Muzaffarpur</span>
              <span className="text-slate-600 select-none">•</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">Darbhanga</span>
              <span className="text-slate-600 select-none">•</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">Delhi</span>
              <span className="text-slate-600 select-none">•</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">Kolkata</span>
              <span className="text-slate-600 select-none">•</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">Nepal</span>
            </div>

            {/* Dual Primary CTA Hierarchy (Touch Friendly >= 48px) */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onBookClick}
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md transition-all transform hover:-translate-y-0.5 active:scale-98 text-sm"
              >
                <span>Book a Ride</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>

              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/60 transition-all active:scale-98 text-sm"
              >
                <MessageSquare className="w-4 h-4 mr-2 text-emerald-400" />
                <span>WhatsApp Us</span>
              </a>

              <button
                type="button"
                onClick={onCallClick ? onCallClick : () => { window.location.href = `tel:${GURU_PHONE_PRIMARY}`; }}
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center px-5 py-3.5 rounded-xl font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all active:scale-98 text-sm"
              >
                <Phone className="w-4 h-4 mr-2 text-amber-400" />
                <span>Call Now</span>
              </button>
            </div>

            {/* Compact Trust Row */}
            <div className="pt-3 border-t border-slate-900 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-400">
              <div className="flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-amber-400" />
                <span>Experienced Drivers</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-amber-400" />
                <span>Clean & Sanitized Cars</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-amber-400" />
                <span>24/7 Support</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual & Leadership Recognition */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
              
              {/* Official Guru Travel Banner */}
              <div className="relative aspect-[16/10] sm:aspect-[16/11] overflow-hidden">
                <img
                  src="/guru-travel-banner.jpg"
                  alt="Guru Travel - Vaishali Bihar Chauffeur Car Rental"
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-102"
                />
              </div>

              {/* Bottom Card Footer with Management Note */}
              <div className="p-3.5 sm:p-4 bg-slate-900/95 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div>
                  <p className="text-xs font-bold text-white tracking-wide">REYAJ & SUJEET</p>
                  <p className="text-[11px] text-slate-400">Primary Hub • Vaishali, Bihar</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                  <a
                    href={GURU_INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-medium text-pink-400 hover:text-pink-300 transition-colors"
                    title="Follow Guru Travel on Instagram (@gurutravel2026)"
                  >
                    <Instagram className="w-3.5 h-3.5 mr-1" />
                    <span>@gurutravel2026</span>
                  </a>

                  <span className="text-slate-700 select-none hidden sm:inline">•</span>

                  <a
                    href={REYAJ_INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-medium text-pink-400 hover:text-pink-300 transition-colors"
                    title="Follow Reyaj on Instagram (@crazy__boy__reyaj_)"
                  >
                    <Instagram className="w-3.5 h-3.5 mr-1" />
                    <span>@crazy__boy__reyaj_</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
