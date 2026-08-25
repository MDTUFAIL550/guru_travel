import React, { useState } from 'react';
import { Star, Quote, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonialsData } from '../data/testimonials';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2.5">
            <span>Verified Reviews</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight">
            What Our Travelers Say
          </h2>
          <p className="text-slate-600 mt-2 text-xs sm:text-sm md:text-base leading-relaxed">
            Trusted by families, airport commuters, corporate executives, and pilgrims travelling across Bihar, India, and Nepal.
          </p>
        </div>

        {/* Mobile Horizontal Snap Carousel / Desktop Grid */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible no-scrollbar snap-x snap-mandatory pb-3 px-1">
          {testimonialsData.map((item, idx) => (
            <div
              key={idx}
              className="min-w-[85vw] sm:min-w-0 snap-center bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-subtle hover:shadow-premium border border-slate-200/80 transition-all duration-300 flex flex-col justify-between shrink-0"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex text-amber-400 space-x-0.5">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-slate-200" />
                </div>
                <p className="text-slate-700 text-xs sm:text-sm italic leading-relaxed">
                  "{item.comment}"
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100">
                <p className="font-bold text-slate-950 text-xs sm:text-sm">{item.name}</p>
                <p className="text-xs text-amber-600 font-medium">{item.role}</p>
                <p className="text-[11px] text-slate-400 flex items-center mt-0.5">
                  <MapPin className="w-3 h-3 mr-1 text-slate-400" /> {item.location}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="mt-4 text-center sm:hidden text-[11px] text-slate-400">
          <span>Swipe horizontally for more reviews →</span>
        </div>

      </div>
    </section>
  );
}
