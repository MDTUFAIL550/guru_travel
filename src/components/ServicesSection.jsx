import React, { useState, useEffect } from 'react';
import { 
  Plane, Train, Building, Compass, MapPin, Globe, ArrowRight, Check, 
  X, ShieldCheck, CheckCircle2, Phone, MessageSquare, Car, Layers 
} from 'lucide-react';
import { servicesData } from '../data/services';

const iconMap = {
  Plane: Plane,
  Train: Train,
  Building: Building,
  Compass: Compass,
  MapPin: MapPin,
  Globe: Globe,
  Car: Car
};

export default function ServicesSection({ onSelectService }) {
  const [services, setServices] = useState(servicesData);
  const [selectedService, setSelectedService] = useState(null);
  const [showAllServicesModal, setShowAllServicesModal] = useState(false);

  // Dynamically load active services from API with fallback to static servicesData
  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (data?.success && Array.isArray(data.services) && data.services.length > 0) {
          setServices(data.services);
        }
      })
      .catch(() => {});
  }, []);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedService(null);
        setShowAllServicesModal(false);
      }
    };
    if (selectedService || showAllServicesModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedService, showAllServicesModal]);

  // Homepage featured services (top 6)
  const featuredServices = services.slice(0, 6);

  return (
    <section id="services" className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2.5">
            <span>Our Service Portfolio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight">
            Reliable Travel Across Bihar & Beyond
          </h2>
          <p className="text-slate-600 mt-2 text-xs sm:text-sm md:text-base leading-relaxed">
            Punctual airport pickups, railway station drops, district travel, outstation journeys, and Nepal cross-border tours.
          </p>
        </div>

        {/* Services Grid — Progressive Disclosure Clean Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {featuredServices.map((service) => {
            const IconComponent = iconMap[service.icon] || MapPin;

            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-subtle hover:shadow-premium hover:border-amber-400/60 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors shadow-sm">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    {service.badge && (
                      <span className="text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-950 mb-1.5 group-hover:text-amber-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">
                    {service.description}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedService(service)}
                    className="text-xs font-bold text-slate-600 hover:text-amber-700 transition-colors underline py-1"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => onSelectService(service.shortName || service.name)}
                    className="min-h-[40px] inline-flex items-center text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-3.5 py-2 rounded-xl transition-all shadow-sm active:scale-95 space-x-1"
                  >
                    <span>Book Service</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Explore All Services CTA (Visible when catalogue has services) */}
        {services.length > 6 && (
          <div className="mt-8 sm:mt-10 text-center">
            <button
              onClick={() => setShowAllServicesModal(true)}
              className="inline-flex items-center justify-center min-h-[48px] px-7 py-3 rounded-2xl font-bold text-xs sm:text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md transition-all active:scale-95 space-x-2"
            >
              <Layers className="w-4 h-4" />
              <span>Explore All Services ({services.length})</span>
            </button>
          </div>
        )}

        {/* Modal 1: Single Service Detail Modal */}
        {selectedService && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3.5 sm:p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
                  {React.createElement(iconMap[selectedService.icon] || MapPin, { className: "w-6 h-6" })}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-amber-600 tracking-wider">
                    {selectedService.category} Service
                  </span>
                  <h3 className="text-xl font-black text-slate-950 leading-tight">
                    {selectedService.name}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                {selectedService.description}
              </p>

              {/* Key Features List */}
              {selectedService.features && selectedService.features.length > 0 && (
                <div className="mb-4 bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                  <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider mb-2">
                    What's Included:
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedService.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Popular Routes */}
              {selectedService.popularFrom && (
                <div className="mb-5">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Frequent Operating Corridors:
                  </span>
                  <p className="text-xs text-slate-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200/80">
                    {selectedService.popularFrom}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedService(null)}
                  className="py-2.5 px-4 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    const serviceName = selectedService.shortName || selectedService.name;
                    setSelectedService(null);
                    onSelectService(serviceName);
                  }}
                  className="py-2.5 px-4 rounded-xl font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-sm transition-all flex items-center justify-center space-x-1"
                >
                  <span>Request Booking</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Modal 2: Complete Services Catalogue Modal */}
        {showAllServicesModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3.5 sm:p-6">
            <div className="bg-slate-900 rounded-3xl max-w-4xl w-full p-5 sm:p-8 border border-slate-800 text-white relative animate-fadeIn max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowAllServicesModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                  <Layers className="w-3 h-3" />
                  <span>Complete Portfolio</span>
                </div>
                <h3 className="text-2xl font-black text-white">
                  All Guru Travel Services
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Chauffeur-driven travel across Bihar, Indian Metros, and Nepal.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((srv) => {
                  const Icon = iconMap[srv.icon] || MapPin;
                  return (
                    <div
                      key={srv.id}
                      className="bg-slate-950 rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col justify-between group hover:border-amber-400/60 transition-all"
                    >
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-amber-400">{srv.category}</span>
                            <h4 className="font-bold text-sm text-white">{srv.name}</h4>
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">{srv.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setShowAllServicesModal(false);
                            setSelectedService(srv);
                          }}
                          className="text-xs font-bold text-slate-400 hover:text-white underline"
                        >
                          View Specs
                        </button>
                        <button
                          onClick={() => {
                            setShowAllServicesModal(false);
                            onSelectService(srv.shortName || srv.name);
                          }}
                          className="inline-flex items-center text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-3.5 py-1.5 rounded-xl transition-all shadow-sm"
                        >
                          <span>Select</span>
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
