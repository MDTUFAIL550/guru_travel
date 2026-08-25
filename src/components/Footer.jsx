import React, { useState } from 'react';
import { Car, Phone, MapPin, MessageSquare, Instagram, ChevronDown, ChevronUp } from 'lucide-react';
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

export default function Footer() {
  const [openGroup, setOpenGroup] = useState(null);

  const toggleGroup = (group) => {
    setOpenGroup(openGroup === group ? null : group);
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs sm:text-sm border-t border-slate-800">
      
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Brand & Philosophy (6 cols) */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 border border-slate-800 shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white block leading-none">
                  GURU <span className="text-amber-500">TRAVEL</span>
                </span>
                <span className="text-[10px] font-medium text-slate-400 tracking-wide block mt-0.5">
                  Your Journey, Our Responsibility.
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Founded by <strong>{GURU_FOUNDERS}</strong> in Vaishali, Bihar. Delivering premier 24/7 chauffeur-driven car rentals, airport pickups, and outstation tours.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
              <a
                href={GURU_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-pink-400 hover:text-pink-300 font-medium py-1"
                title="Follow Guru Travel on Instagram"
              >
                <Instagram className="w-3.5 h-3.5 mr-1" />
                <span>@gurutravel2026</span>
              </a>

              <span className="text-slate-700 select-none hidden sm:inline">•</span>

              <a
                href={REYAJ_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-pink-400 hover:text-pink-300 font-medium py-1"
                title="Follow Reyaj on Instagram"
              >
                <Instagram className="w-3.5 h-3.5 mr-1" />
                <span>@crazy__boy__reyaj_</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#services" className="hover:text-amber-400 transition-colors py-1 block">Services Portfolio</a></li>
              <li><a href="#fleet" className="hover:text-amber-400 transition-colors py-1 block">Chauffeur Fleet</a></li>
              <li><a href="#routes" className="hover:text-amber-400 transition-colors py-1 block">Popular Routes</a></li>
              <li><a href="#destinations" className="hover:text-amber-400 transition-colors py-1 block">Destinations & Hubs</a></li>
              <li><a href="#faqs" className="hover:text-amber-400 transition-colors py-1 block">FAQs & Policies</a></li>
            </ul>
          </div>

          {/* Column 3: Contact & Office (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">24/7 Booking Desk</h4>
            
            <div className="space-y-2 text-xs">
              <a 
                href={`tel:${GURU_PHONE_PRIMARY}`}
                className="flex items-center text-slate-300 hover:text-amber-400 transition-colors py-1"
              >
                <Phone className="w-3.5 h-3.5 mr-2 text-amber-400 shrink-0" />
                <span>{GURU_PHONE_PRIMARY_DISPLAY}</span>
              </a>

              <a 
                href={`tel:${GURU_PHONE_SECONDARY}`}
                className="flex items-center text-slate-300 hover:text-amber-400 transition-colors py-1"
              >
                <Phone className="w-3.5 h-3.5 mr-2 text-slate-500 shrink-0" />
                <span>{GURU_PHONE_SECONDARY_DISPLAY}</span>
              </a>

              <a 
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-emerald-400 hover:text-emerald-300 transition-colors py-1"
              >
                <MessageSquare className="w-3.5 h-3.5 mr-2 shrink-0" />
                <span>WhatsApp 24/7 Desk</span>
              </a>

              <div className="flex items-start text-slate-400 pt-1">
                <MapPin className="w-3.5 h-3.5 mr-2 text-amber-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{GURU_ADDRESS}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Lower Footer */}
        <div className="mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Guru Travel (Vaishali, Bihar). All rights reserved.</p>
          <p className="flex items-center space-x-1 justify-center">
            <span>Management:</span>
            <strong className="text-slate-300">{GURU_FOUNDERS}</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
