import React, { useState, useEffect } from 'react';
import { 
  MapPin, Navigation, Compass, Globe, ArrowRight, X, 
  ShieldCheck, Info, Clock, CheckCircle2, ChevronDown, ChevronUp, Search 
} from 'lucide-react';
import { destinationGroups } from '../data/destinations';
import { apiUrl } from '../utils/adminAuth';

export default function DestinationsSection({ onSelectDestination }) {
  const [activeTab, setActiveTab] = useState(0);
  const [isCatalogueOpen, setIsCatalogueOpen] = useState(false);
  const [destSearch, setDestSearch] = useState('');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [groups, setGroups] = useState(destinationGroups);

  // Dynamically load active destinations from API with fallback
  useEffect(() => {
    fetch(apiUrl('/api/destinations'))
      .then(res => res.json())
      .then(data => {
        if (data?.success && Array.isArray(data.destinations) && data.destinations.length > 0) {
          // Group by region
          const regionMap = {};
          data.destinations.forEach(item => {
            const reg = item.region || 'Bihar Regional Network';
            if (!regionMap[reg]) {
              regionMap[reg] = {
                region: reg,
                description: item.description || '',
                routes: []
              };
            }
            regionMap[reg].routes.push({
              name: item.name,
              distance: item.distance || '',
              type: item.type || '',
              highlight: item.highlight || item.description || ''
            });
          });
          const groupedList = Object.values(regionMap);
          if (groupedList.length > 0) {
            setGroups(groupedList);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedDestination(null);
    };
    if (selectedDestination) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedDestination]);

  const currentGroup = groups[activeTab] || groups[0] || destinationGroups[0];

  // Filter routes in current group by search
  const filteredRoutes = currentGroup.routes.filter(r => 
    !destSearch.trim() || 
    r.name.toLowerCase().includes(destSearch.toLowerCase()) ||
    (r.type || '').toLowerCase().includes(destSearch.toLowerCase()) ||
    (r.highlight || '').toLowerCase().includes(destSearch.toLowerCase())
  );

  // Homepage displays initial 6 featured destinations of the group
  const displayedRoutes = isCatalogueOpen ? filteredRoutes : filteredRoutes.slice(0, 6);

  const totalDestinationsCount = groups.reduce((acc, g) => acc + (g.routes?.length || 0), 0);

  return (
    <section id="destinations" className="py-14 sm:py-20 bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2.5">
            <span>Service Coverage</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Where We Operate
          </h2>
          <p className="text-slate-400 mt-2 text-xs sm:text-sm md:text-base leading-relaxed">
            From our primary operating hub in <strong>Vaishali, Bihar</strong>, Guru Travel provides safe, comfortable chauffeur-driven service across Bihar districts, Indian metros, and Himalayan international corridors.
          </p>
        </div>

        {/* Region Tabs (Horizontal scroll on mobile) */}
        <div className="flex justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2 mb-6 sm:mb-8 pb-2 px-1">
          {groups.map((group, index) => (
            <button
              key={group.region}
              onClick={() => setActiveTab(index)}
              className={`min-h-[40px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center space-x-2 shrink-0 ${
                activeTab === index
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {index === 0 && <MapPin className="w-3.5 h-3.5" />}
              {index === 1 && <Navigation className="w-3.5 h-3.5" />}
              {index === 2 && <Globe className="w-3.5 h-3.5" />}
              <span>{group.region}</span>
            </button>
          ))}
        </div>

        {/* Search when catalogue is opened */}
        {isCatalogueOpen && (
          <div className="max-w-md mx-auto relative mb-6 animate-fadeIn">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={destSearch}
              onChange={(e) => setDestSearch(e.target.value)}
              placeholder="Search destination (Patna, Gaya, Bodh Gaya, Nepal...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-amber-400 outline-none transition-all"
            />
            {destSearch && (
              <button
                onClick={() => setDestSearch('')}
                className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Region Description */}
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8 text-xs sm:text-sm text-slate-400">
          {currentGroup.description}
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {displayedRoutes.map((dest, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700">
                    {dest.type}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {dest.distance}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {dest.highlight}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setSelectedDestination(dest)}
                  className="text-xs text-slate-400 hover:text-white font-medium underline py-1"
                >
                  Coverage Info
                </button>
                <button
                  onClick={() => onSelectDestination(dest.name)}
                  className="min-h-[36px] inline-flex items-center text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-xl transition-colors space-x-1"
                >
                  <span>Book Ride</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Explore All Destinations / Collapse Button */}
        <div className="mt-8 sm:mt-10 text-center">
          <button
            onClick={() => setIsCatalogueOpen(!isCatalogueOpen)}
            className="inline-flex items-center justify-center min-h-[48px] px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md transition-all active:scale-95 space-x-2"
          >
            <span>{isCatalogueOpen ? "Show Featured Destinations Only" : `Explore All Destinations (${totalDestinationsCount})`}</span>
            {isCatalogueOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Progressive Disclosure: Destination Detail Modal */}
        {selectedDestination && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3.5 sm:p-4">
            <div className="bg-slate-900 rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-slate-800 text-white relative animate-fadeIn max-h-[90vh] overflow-y-auto">
              
              <button
                onClick={() => setSelectedDestination(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2 text-amber-400 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">{selectedDestination.type}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white mb-1">
                {selectedDestination.name}
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Operating Corridor from Vaishali & Patna Hubs
              </p>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs mb-4">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Estimated Distance:</span>
                  <strong className="text-white font-mono">{selectedDestination.distance}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Route Specialty:</span>
                  <strong className="text-white">{selectedDestination.highlight}</strong>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                Chauffeur-driven vehicles are available for one-way drops, same-day round trips, and multi-day packages to {selectedDestination.name}.
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setSelectedDestination(null)}
                  className="py-2.5 px-4 rounded-xl font-bold text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const destName = selectedDestination.name;
                    setSelectedDestination(null);
                    onSelectDestination(destName);
                  }}
                  className="py-2.5 px-4 rounded-xl font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-sm transition-all flex items-center justify-center space-x-1"
                >
                  <span>Book Destination</span>
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
