import React, { useState, useEffect } from 'react';
import { 
  MapPin, Navigation, Compass, Globe, Plane, Train, ArrowRight, 
  MessageSquare, Phone, Clock, Info, X, ShieldCheck, ChevronDown, 
  ChevronUp, Check, Search 
} from 'lucide-react';
import { routeCategories, routesData } from '../data/routes';
import { GURU_PHONE_PRIMARY, GURU_PHONE_PRIMARY_DISPLAY, generateWhatsAppUrl } from '../utils/whatsappHelper';
import { getRouteServiceType } from '../utils/getRouteServiceType';

export default function RoutesSection({ onSelectRoute }) {
  const [activeTab, setActiveTab] = useState('all');
  const [isCatalogueOpen, setIsCatalogueOpen] = useState(false);
  const [routeSearch, setRouteSearch] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [allRoutes, setAllRoutes] = useState(() => {
    return [
      ...routesData.bihar,
      ...routesData.hubs,
      ...routesData.outstation,
      ...routesData.special
    ];
  });

  const tabIcons = {
    all: Compass,
    bihar: MapPin,
    hubs: Plane,
    outstation: Navigation,
    special: Globe
  };

  // Dynamically load active routes from API with fallback
  useEffect(() => {
    fetch('/api/routes')
      .then(res => res.json())
      .then(data => {
        if (data?.success && Array.isArray(data.routes) && data.routes.length > 0) {
          setAllRoutes(data.routes);
        }
      })
      .catch(() => {});
  }, []);

  // Filter routes by selected category and search
  const filteredRoutes = allRoutes.filter(r => {
    const catMatch = activeTab === 'all' || (r.category || '').toLowerCase() === activeTab.toLowerCase();
    const searchMatch = !routeSearch.trim() ||
      (r.origin || '').toLowerCase().includes(routeSearch.toLowerCase()) ||
      (r.destination || '').toLowerCase().includes(routeSearch.toLowerCase()) ||
      (r.label || '').toLowerCase().includes(routeSearch.toLowerCase()) ||
      (r.tagline || '').toLowerCase().includes(routeSearch.toLowerCase());
    return catMatch && searchMatch;
  });

  // Top 6 popular routes on homepage
  const homepageRoutes = allRoutes.slice(0, 6);

  // Displayed routes based on whether catalogue is opened
  const displayedRoutes = isCatalogueOpen ? filteredRoutes : homepageRoutes;

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedRoute(null);
    };
    if (selectedRoute) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedRoute]);

  return (
    <section id="routes" className="py-14 sm:py-20 bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2.5">
            <span>Operational Corridors</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Popular Routes & Travel Corridors
          </h2>
          <p className="text-slate-400 mt-2 text-xs sm:text-sm md:text-base leading-relaxed">
            Reliable point-to-point and round-trip transfers across Bihar districts, airport hubs, metros, and Nepal border routes.
          </p>
        </div>

        {/* Catalogue Controls (Search & Category Pills when catalogue is opened) */}
        {isCatalogueOpen && (
          <div className="space-y-4 mb-8 sm:mb-10 animate-fadeIn">
            {/* Search Input */}
            <div className="max-w-md mx-auto relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={routeSearch}
                onChange={(e) => setRouteSearch(e.target.value)}
                placeholder="Search route (Patna, Vaishali, Muzaffarpur, Nepal...)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-400 outline-none transition-all"
              />
              {routeSearch && (
                <button
                  onClick={() => setRouteSearch('')}
                  className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Categories Tab Bar (Horizontal scroll on mobile with zero page overflow) */}
            <div className="flex justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2 pb-2 px-1">
              {routeCategories.map((cat) => {
                const Icon = tabIcons[cat.id] || Compass;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleTabChange(cat.id)}
                    className={`min-h-[40px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center space-x-2 shrink-0 ${
                      activeTab === cat.id
                        ? 'bg-amber-400 text-slate-950 shadow-sm transform scale-102'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Routes Grid (1 col mobile, 2 col tablet, 3 col desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {displayedRoutes.map((route) => (
            <div
              key={route.id}
              className="bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                    {route.type}
                  </span>
                  <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{route.time}</span>
                  </div>
                </div>

                {/* Route Header */}
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors flex items-center">
                  <span>{route.origin}</span>
                  <ArrowRight className="w-4 h-4 mx-2 text-amber-500 shrink-0" />
                  <span>{route.destination}</span>
                </h3>

                <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed line-clamp-2">
                  {route.tagline || route.description}
                </p>

                {/* Route Metadata */}
                <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800">
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    Distance: <strong className="text-white ml-1 font-mono">{route.distance}</strong>
                  </span>
                  <button
                    onClick={() => setSelectedRoute(route)}
                    className="text-amber-400 hover:text-amber-300 font-bold underline transition-colors py-1"
                  >
                    Details
                  </button>
                </div>
              </div>

              {/* Action Button (Min 44px touch target) */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => onSelectRoute(route)}
                  className="w-full min-h-[44px] inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-sm transition-all active:scale-95 space-x-1"
                >
                  <span>Book This Route</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Explore All Routes / Collapse Button */}
        <div className="mt-8 sm:mt-10 text-center">
          <button
            onClick={() => setIsCatalogueOpen(!isCatalogueOpen)}
            className="inline-flex items-center justify-center min-h-[48px] px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md transition-all active:scale-95 space-x-2"
          >
            <span>{isCatalogueOpen ? "Show Popular Routes Only" : `Explore All ${allRoutes.length} Routes`}</span>
            {isCatalogueOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Progressive Disclosure: Route Detail Modal */}
        {selectedRoute && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3.5 sm:p-4">
            <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-800 text-white relative animate-fadeIn max-h-[90vh] overflow-y-auto">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedRoute(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="mb-4">
                <span className="text-[10px] uppercase font-extrabold text-amber-400 tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                  {selectedRoute.type}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-3 flex items-center flex-wrap">
                  <span>{selectedRoute.origin}</span>
                  <ArrowRight className="w-5 h-5 mx-2 text-amber-400 shrink-0" />
                  <span>{selectedRoute.destination}</span>
                </h3>
              </div>

              {/* Highlights Box */}
              <div className="grid grid-cols-2 gap-3 my-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated Distance</span>
                  <span className="font-bold text-white text-sm font-mono">{selectedRoute.distance}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Average Travel Time</span>
                  <span className="font-bold text-white text-sm font-mono">{selectedRoute.time}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                {selectedRoute.description || selectedRoute.tagline}
              </p>

              {/* Route Assurances */}
              <div className="space-y-2 mb-6 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Point-to-Point direct chauffeur pickup</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Toll, permit & highway route assistance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Transparent upfront pricing with zero surge</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedRoute(null)}
                  className="py-2.5 px-4 rounded-xl font-bold text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const r = selectedRoute;
                    setSelectedRoute(null);
                    onSelectRoute(r);
                  }}
                  className="py-2.5 px-4 rounded-xl font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-sm transition-all flex items-center justify-center space-x-1"
                >
                  <span>Book This Route</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
