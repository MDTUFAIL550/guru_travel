import React from 'react';
import { Phone, MapPin, MessageSquare, Instagram, HeartHandshake, ArrowRight, Compass, ShieldCheck } from 'lucide-react';
import { 
  GURU_PHONE_PRIMARY, 
  GURU_PHONE_PRIMARY_DISPLAY, 
  GURU_PHONE_SECONDARY, 
  GURU_PHONE_SECONDARY_DISPLAY, 
  GURU_INSTAGRAM_URL,
  REYAJ_INSTAGRAM_URL, 
  GURU_ADDRESS, 
  GURU_FOUNDERS, 
  generateWhatsAppUrl 
} from '../utils/whatsappHelper';

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Founders Recognition Banner */}
        <div className="mb-12 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-amber-400 font-bold">Leadership & Central Hub</p>
              <h3 className="text-lg sm:text-xl font-bold text-white">{GURU_FOUNDERS} — Guru Travel</h3>
              <p className="text-xs text-slate-400 italic mt-0.5">"Your journey is our responsibility. Operating from Vaishali to all India."</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href={GURU_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-pink-300 bg-pink-950/60 hover:bg-pink-900/60 border border-pink-700/50 transition-all"
              title="Follow Guru Travel on Instagram"
            >
              <Instagram className="w-4 h-4 mr-2 text-pink-400" />
              <span>@gurutravel2026</span>
            </a>

            <a
              href={REYAJ_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-pink-300 bg-pink-950/60 hover:bg-pink-900/60 border border-pink-700/50 transition-all"
              title="Follow Reyaj on Instagram"
            >
              <Instagram className="w-4 h-4 mr-2 text-pink-400" />
              <span>@crazy__boy__reyaj_</span>
            </a>
          </div>
        </div>

        {/* 2-Column Balanced Direct Contact & Map Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Direct Contact Details & Hotlines (7 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
                <span>24/7 Booking Desk</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Ready to plan your journey?
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-2.5 leading-relaxed">
                Tell us your pickup location and destination. Our team will confirm the best available vehicle for your trip.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-3.5 flex-1 flex flex-col justify-center">
              
              {/* Primary Call */}
              <a
                href={`tel:${GURU_PHONE_PRIMARY}`}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/40 transition-all flex items-center justify-between group shadow-sm hover:shadow"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Primary 24/7 Hotline</span>
                    <span className="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      {GURU_PHONE_PRIMARY_DISPLAY}
                    </span>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-lg bg-slate-800 group-hover:bg-amber-400 group-hover:text-slate-950 text-slate-300 text-xs font-bold transition-all flex items-center">
                  <span>Call</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </a>

              {/* Secondary Call */}
              <a
                href={`tel:${GURU_PHONE_SECONDARY}`}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/40 transition-all flex items-center justify-between group shadow-sm hover:shadow"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-slate-800 text-amber-400 border border-slate-700 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Secondary Hotline</span>
                    <span className="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      {GURU_PHONE_SECONDARY_DISPLAY}
                    </span>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-lg bg-slate-800 group-hover:bg-amber-400 group-hover:text-slate-950 text-slate-300 text-xs font-bold transition-all flex items-center">
                  <span>Call</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </a>

              {/* WhatsApp Support */}
              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-between group shadow-sm hover:shadow"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">WhatsApp Dispatch</span>
                    <span className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                      Chat Now (+91 85788 11081)
                    </span>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-lg bg-emerald-950/60 group-hover:bg-emerald-500 group-hover:text-slate-950 text-emerald-400 border border-emerald-800 group-hover:border-transparent text-xs font-bold transition-all flex items-center">
                  <span>WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </a>

              {/* Operating Base */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-start space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-slate-800 text-amber-400 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Primary Hub & Office</span>
                  <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium leading-relaxed">{GURU_ADDRESS}</p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Operating Hub & Map Box (5 cols) */}
          <div className="lg:col-span-6 bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Compass className="w-4 h-4" />
                  <span>Central Operating Hub</span>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Active Dispatch
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Vaishali District Central Hub
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Centrally positioned to serve Hajipur, Patna Airport (PAT), Patna Junction, Muzaffarpur, Darbhanga, and interstate corridors across India and Nepal.
              </p>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-2xl overflow-hidden border border-slate-800 aspect-[16/10] bg-slate-950 shadow-inner">
              <iframe
                title="Guru Travel Vaishali Bihar Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114972.18567540209!2d85.12784534792694!3d25.986622437637848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed58f7004f2139%3A0xe54e38c35d97f5f8!2sVaishali%2C%20Bihar!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Direct Connect Advisory */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Zero booking fees or app downloads needed.</span>
              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 font-bold hover:underline"
              >
                Instant WhatsApp Quote →
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
