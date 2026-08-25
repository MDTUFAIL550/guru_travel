import React, { useState, useEffect } from 'react';
import { 
  Users, Briefcase, Wind, Check, ArrowRight, ShieldCheck, 
  Car as CarIcon, X, Fuel, Cog, ChevronDown, ChevronUp, Info, Search 
} from 'lucide-react';
import { fleetCategories, fleetData } from '../data/fleet';

export default function FleetSection({ onSelectVehicle }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [isCatalogueOpen, setIsCatalogueOpen] = useState(false);
  const [catalogueSearch, setCatalogueSearch] = useState("");
  const [failedImages, setFailedImages] = useState({});
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicles, setVehicles] = useState(fleetData);

  // Dynamically load active fleet from API with fallback to static fleetData
  useEffect(() => {
    fetch('/api/fleet')
      .then(res => res.json())
      .then(data => {
        if (data?.success && Array.isArray(data.fleet) && data.fleet.length > 0) {
          setVehicles(data.fleet);
        }
      })
      .catch(() => {});
  }, []);

  // Filter fleet by selected category and optional search
  const filteredFleet = vehicles.filter(v => {
    const catMatch = activeCategory === "all" || (v.category || '').toLowerCase() === activeCategory.toLowerCase();
    const searchMatch = !catalogueSearch.trim() || 
      (v.name || '').toLowerCase().includes(catalogueSearch.toLowerCase()) ||
      (v.brand || '').toLowerCase().includes(catalogueSearch.toLowerCase()) ||
      (v.category || '').toLowerCase().includes(catalogueSearch.toLowerCase());
    return catMatch && searchMatch;
  });

  // Featured 4 vehicles on homepage
  const homepageVehicles = vehicles.slice(0, 4);

  // Displayed vehicles based on whether full catalogue is expanded
  const displayedFleet = isCatalogueOpen ? filteredFleet : homepageVehicles;

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
  };

  const handleImageError = (id) => {
    setFailedImages(prev => ({ ...prev, [id]: true }));
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedVehicle(null);
    };
    if (selectedVehicle) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedVehicle]);

  return (
    <section id="fleet" className="py-14 sm:py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Compact & Clean Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2.5">
            <span>CHAUFFEUR-DRIVEN FLEET</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight">
            Choose Your Perfect Ride
          </h2>
          <p className="text-slate-600 mt-2 text-xs sm:text-sm md:text-base leading-relaxed">
            All vehicles are meticulously cleaned, air-conditioned, and dispatched with verified chauffeurs.
          </p>
        </div>

        {/* Catalogue Controls (Category Chips & Search bar when catalogue is open) */}
        {isCatalogueOpen && (
          <div className="space-y-4 mb-8 sm:mb-10 animate-fadeIn">
            {/* Search Input */}
            <div className="max-w-md mx-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={catalogueSearch}
                onChange={(e) => setCatalogueSearch(e.target.value)}
                placeholder="Search car (Dzire, Innova, Scorpio...)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-400 outline-none bg-slate-50 focus:bg-white transition-all"
              />
              {catalogueSearch && (
                <button
                  onClick={() => setCatalogueSearch('')}
                  className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Pills Bar (Horizontal scroll on mobile with zero page overflow) */}
            <div className="flex justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2 pb-2 px-1">
              {fleetCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`min-h-[40px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center space-x-2 shrink-0 ${
                    activeCategory === category.id
                      ? 'bg-amber-400 text-slate-950 shadow-sm transform scale-102'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950'
                  }`}
                >
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Responsive Fleet Grid (1 col mobile, 2 col tablet, 3 col desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {displayedFleet.map((vehicle) => {
            const isFallback = failedImages[vehicle.id];

            return (
              <div
                key={vehicle.id}
                className="bg-slate-50/80 rounded-2xl sm:rounded-3xl border border-slate-200/80 overflow-hidden hover:shadow-premium hover:border-amber-400/60 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Vehicle Image Container */}
                  <div className="relative aspect-[16/10] bg-slate-200 overflow-hidden">
                    {isFallback ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-4">
                        <CarIcon className="w-10 h-10 mb-1 text-amber-400" />
                        <span className="text-xs font-bold text-white text-center">{vehicle.name}</span>
                        <span className="text-[10px] text-slate-400">{vehicle.categoryLabel || vehicle.category}</span>
                      </div>
                    ) : (
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        onError={() => handleImageError(vehicle.id)}
                        className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                        loading="lazy"
                      />
                    )}

                    {/* Top Right Category Pill */}
                    <div className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-sm text-amber-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {vehicle.categoryLabel || vehicle.category}
                    </div>

                    {/* Optional Badge */}
                    {vehicle.badge && (
                      <div className="absolute top-2.5 left-2.5 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                        {vehicle.badge}
                      </div>
                    )}
                  </div>

                  {/* Vehicle Content */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-slate-950 group-hover:text-amber-600 transition-colors">
                        {vehicle.name}
                      </h3>
                      <span className="text-xs font-semibold text-slate-500 shrink-0">
                        {vehicle.capacity}
                      </span>
                    </div>

                    <p className="text-slate-600 text-xs mt-1 line-clamp-2 leading-relaxed">
                      {vehicle.tagline || vehicle.idealFor}
                    </p>

                    {/* Core Specifications */}
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200/60 text-xs text-slate-600">
                      <div className="flex items-center space-x-1.5">
                        <Users className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{vehicle.capacity}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Fuel className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{vehicle.fuel}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Cog className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{vehicle.transmission}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Wind className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Full AC</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions (Min 44px touch targets) */}
                <div className="p-4 sm:p-5 pt-0 mt-2 flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedVehicle(vehicle)}
                    className="flex-1 min-h-[44px] py-2 px-3 rounded-xl font-bold text-xs text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-all flex items-center justify-center space-x-1"
                  >
                    <Info className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    <span>View Details</span>
                  </button>

                  <button
                    onClick={() => onSelectVehicle(vehicle.name)}
                    className="flex-1 min-h-[44px] py-2 px-3 rounded-xl font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all flex items-center justify-center space-x-1 shadow-sm active:scale-95"
                  >
                    <span>Book Ride</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Cars / Collapse Catalogue Button */}
        <div className="mt-8 sm:mt-10 text-center">
          <button
            onClick={() => setIsCatalogueOpen(!isCatalogueOpen)}
            className="inline-flex items-center justify-center min-h-[48px] px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md transition-all active:scale-95 space-x-2"
          >
            <span>{isCatalogueOpen ? "Show Featured Vehicles Only" : `View All ${vehicles.length} Cars`}</span>
            {isCatalogueOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Progressive Disclosure: Vehicle Detail Modal */}
        {selectedVehicle && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3.5 sm:p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedVehicle(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Image */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 mb-4">
                <img
                  src={selectedVehicle.image}
                  alt={selectedVehicle.name}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {selectedVehicle.categoryLabel || selectedVehicle.category}
                </div>
              </div>

              {/* Title & Tagline */}
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                  {selectedVehicle.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {selectedVehicle.tagline}
                </p>
              </div>

              {/* Full Specs Box */}
              <div className="grid grid-cols-2 gap-2.5 my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Capacity</span>
                  <span className="font-bold text-slate-950">{selectedVehicle.capacity}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Luggage Space</span>
                  <span className="font-bold text-slate-950">{selectedVehicle.luggage}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Fuel Type</span>
                  <span className="font-bold text-slate-950">{selectedVehicle.fuel}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Transmission</span>
                  <span className="font-bold text-slate-950">{selectedVehicle.transmission}</span>
                </div>
              </div>

              {/* Ideal Use Cases */}
              <div className="mb-5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Best Suited For:
                </span>
                <p className="text-xs sm:text-sm text-slate-700 bg-amber-50 p-3 rounded-xl border border-amber-200/80">
                  {selectedVehicle.idealFor}
                </p>
              </div>

              {/* Chauffeur Assurance */}
              <div className="flex items-center space-x-2 text-xs text-emerald-700 mb-5 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified Chauffeur • Sanitized Car • Zero Security Deposit</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="py-2.5 px-4 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const vehicleName = selectedVehicle.name;
                    setSelectedVehicle(null);
                    onSelectVehicle(vehicleName);
                  }}
                  className="py-2.5 px-4 rounded-xl font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-sm transition-all flex items-center justify-center space-x-1"
                >
                  <span>Select & Book</span>
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
