import React from 'react';
import { MousePointerClick, CalendarCheck, Send, Car, ArrowRight } from 'lucide-react';

export default function HowItWorks({ onBookClick }) {
  const steps = [
    {
      step: "01",
      icon: MousePointerClick,
      title: "Choose Your Ride",
      description: "Select from our verified vehicle fleet or tell us your preferred service (Airport, Outstation, Local)."
    },
    {
      step: "02",
      icon: CalendarCheck,
      title: "Enter Trip Details",
      description: "Provide pickup location, destination, date, time, and passenger count."
    },
    {
      step: "03",
      icon: Send,
      title: "Confirm on WhatsApp",
      description: "Submit online or send instantly to our 24/7 dispatch desk on WhatsApp."
    },
    {
      step: "04",
      icon: Car,
      title: "Enjoy Your Journey",
      description: "Receive your sanitized car and verified chauffeur details on time. Relax and travel safely."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Simple 4-Step Process</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            How Booking With Guru Travel Works
          </h2>
          <p className="text-slate-400 mt-2.5 text-xs sm:text-sm md:text-base leading-relaxed">
            Fast, transparent, and direct. We get you on the road in minutes without complicated app downloads.
          </p>
        </div>

        {/* Timeline Grid (1 col on mobile, 2 col on tablet, 4 col on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-amber-500/80 font-mono">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 text-slate-700 pointer-events-none">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
