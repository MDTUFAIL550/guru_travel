import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Clock, Award, Compass, HeartHandshake, PhoneCall, 
  ArrowRight, X, CheckCircle2, ChevronDown, ChevronUp, Sparkles 
} from 'lucide-react';

export default function WhyChooseUs() {
  const [selectedReason, setSelectedReason] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const reasons = [
    {
      num: "01",
      icon: Clock,
      title: "24/7 Rapid Dispatch & Support",
      short: "Round-the-clock availability across Vaishali, Patna, and Bihar.",
      description: "Round-the-clock availability across Vaishali, Patna, and Bihar. Early morning airport drops or midnight train arrivals are never delayed. Our dispatch coordinators monitor flight arrival times and traffic conditions to ensure zero waiting time."
    },
    {
      num: "02",
      icon: ShieldCheck,
      title: "Verified & Professional Chauffeurs",
      short: "Local, route-aware background-verified chauffeurs.",
      description: "All drivers are background-verified, licensed, and familiar with both city traffic and long-distance national highway conditions. Trained in courteous guest communication, family safety, and luggage handling."
    },
    {
      num: "03",
      icon: Award,
      title: "Transparent & Honest Pricing",
      short: "Fixed upfront quotes with zero hidden surcharges.",
      description: "No hidden fees, toll surprises, or unexpected surge charges. Custom quotes tailored accurately to your journey requirements, communicated clearly before driver dispatch."
    },
    {
      num: "04",
      icon: Compass,
      title: "Interstate & Nepal Cross-Border Reach",
      short: "Covering Bihar districts, metro corridors, and Nepal tours.",
      description: "From local Bihar districts (Darbhanga, Muzaffarpur, Gaya) to Delhi, Kolkata, UP, and Nepal border tourist circuits (Kathmandu & Pokhara) with complete state road permit management."
    },
    {
      num: "05",
      icon: HeartHandshake,
      title: "Clean, Sanitized & Comfortable Cars",
      short: "Regularly inspected sedans, SUVs, and MPVs with full AC.",
      description: "Modern sedans, SUVs, and MPVs maintained in pristine mechanical and cosmetic condition with full air conditioning, clean upholstery, and safety features for peace of mind."
    },
    {
      num: "06",
      icon: PhoneCall,
      title: "Instant WhatsApp & Direct Call Desk",
      short: "Zero app hassles. Direct access to dispatch management.",
      description: "Zero cumbersome app downloads needed. Connect directly with dispatch founders Reyaj & Sujeet on Call or WhatsApp for quick vehicle booking, modification, and driver updates."
    }
  ];

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedReason(null);
    };
    if (selectedReason) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedReason]);

  return (
    <section id="why-us" className="py-14 sm:py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2.5">
            <span>The Guru Travel Promise</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight">
            Why Travelers Across Bihar Trust Guru Travel
          </h2>
          <p className="text-slate-600 mt-2 text-xs sm:text-sm md:text-base leading-relaxed">
            We treat your journey with utmost responsibility, delivering safety, punctuality, and comfort on every single kilometer.
          </p>
        </div>

        {/* Reasons Grid — Responsive Density */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            // On small mobile screens hide items 4-6 unless expanded
            const isHiddenOnMobile = !isExpanded && index >= 3;

            return (
              <div
                key={reason.num}
                className={`p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:shadow-premium hover:border-amber-400/60 transition-all duration-300 group flex flex-col justify-between ${
                  isHiddenOnMobile ? 'hidden sm:flex' : 'flex'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-lg sm:text-xl font-black text-amber-500 font-mono">
                      {reason.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white text-slate-800 flex items-center justify-center shadow-xs border border-slate-200/80 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-950 mb-1.5 group-hover:text-amber-600 transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {reason.short}
                  </p>
                </div>

                <div className="pt-3.5 mt-2 border-t border-slate-200/60">
                  <button
                    onClick={() => setSelectedReason(reason)}
                    className="text-xs font-bold text-slate-500 group-hover:text-amber-700 transition-colors flex items-center space-x-1 py-1"
                  >
                    <span>Read Full Guarantee</span>
                    <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Progressive Disclosure Toggle */}
        <div className="mt-8 text-center sm:hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-sm transition-all active:scale-95 space-x-1.5"
          >
            <span>{isExpanded ? "Show Top Guarantees Only" : "Why Choose Guru Travel (View All 6)"}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Reason Detail Modal */}
        {selectedReason && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3.5 sm:p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
              
              <button
                onClick={() => setSelectedReason(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
                  {React.createElement(selectedReason.icon, { className: "w-6 h-6" })}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-600 uppercase">
                    Guarantee #{selectedReason.num}
                  </span>
                  <h3 className="text-xl font-black text-slate-950 leading-tight">
                    {selectedReason.title}
                  </h3>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {selectedReason.description}
              </div>

              <div className="flex items-center space-x-2 text-xs text-emerald-700 mb-6 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Standard on all bookings from Vaishali & Patna</span>
              </div>

              <button
                onClick={() => setSelectedReason(null)}
                className="w-full min-h-[44px] py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-sm"
              >
                Understood
              </button>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
