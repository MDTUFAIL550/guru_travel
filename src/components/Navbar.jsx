import React, { useState, useEffect } from 'react';
import { Phone, Car, Menu, X, Search, ShieldCheck } from 'lucide-react';
import { 
  GURU_PHONE_PRIMARY, 
  GURU_PHONE_PRIMARY_DISPLAY, 
  GURU_INSTAGRAM_URL,
  REYAJ_INSTAGRAM_URL 
} from '../utils/whatsappHelper';

export default function Navbar({ onTrackBooking, onAdminLogin, onCallClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Services', href: '#services' },
    { name: 'Fleet', href: '#fleet' },
    { name: 'Routes', href: '#routes' },
    { name: 'Destinations', href: '#destinations' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      setMobileMenuOpen(false);
      if (href === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleTrackClick = () => {
    setMobileMenuOpen(false);
    if (onTrackBooking) {
      onTrackBooking();
    } else {
      window.location.pathname = '/track-booking';
    }
  };

  const handleAdminClick = () => {
    setMobileMenuOpen(false);
    if (onAdminLogin) {
      onAdminLogin();
    } else {
      window.location.pathname = '/admin/login';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-200">
      {/* Main Navbar */}
      <nav className={`transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-subtle border-b border-slate-200/80 py-2.5 sm:py-3' 
          : 'bg-white border-b border-slate-100 py-3 sm:py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* Brand Logo */}
            <a 
              href="#" 
              onClick={(e) => handleNavClick(e, '#')}
              className="flex items-center space-x-2.5 sm:space-x-3 group shrink-0"
              aria-label="Guru Travel Home"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 shadow-sm group-hover:bg-slate-800 transition-colors shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg md:text-xl font-black tracking-tight text-slate-950 leading-tight">
                  GURU <span className="text-amber-500">TRAVEL</span>
                </span>
                <span className="text-[9px] sm:text-[10px] md:text-[11px] font-medium text-slate-500 tracking-wide">
                  Your Journey, Our Responsibility.
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors py-1"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Desktop Right Button Group */}
            <div className="hidden sm:flex items-center space-x-3 shrink-0">
              
              {/* Admin Button */}
              <button
                onClick={handleAdminClick}
                className="inline-flex items-center justify-center px-4 py-2 min-h-[40px] text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-sm transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-slate-950" />
                <span>Admin</span>
              </button>

              {/* Track Booking Status */}
              <button
                onClick={handleTrackClick}
                className="inline-flex items-center justify-center px-4 py-2 min-h-[40px] text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-500/80 rounded-xl transition-all shadow-sm transform hover:-translate-y-0.5 active:scale-95"
              >
                <Search className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                <span>Track Booking Status</span>
              </button>

            </div>

            {/* Mobile Action Buttons (320px - 1023px) */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 lg:hidden">
              <button
                type="button"
                onClick={onCallClick ? onCallClick : () => { window.location.href = `tel:${GURU_PHONE_PRIMARY}`; }}
                className="w-10 h-10 flex items-center justify-center text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors sm:hidden"
                title="Call Guru Travel Hotline"
                aria-label="Call Guru Travel Hotline"
              >
                <Phone className="w-4 h-4 text-amber-700" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white shadow-xl animate-fadeIn">
            <div className="max-w-7xl mx-auto px-4 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="min-h-[44px] flex items-center px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-amber-600 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              {/* Mobile CTA Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
                
                {/* Admin Button */}
                <button
                  onClick={handleAdminClick}
                  className="w-full min-h-[48px] py-3 px-4 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center justify-between transition-all shadow-sm active:scale-98"
                >
                  <span className="flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-2 text-slate-950" />
                    Admin Portal
                  </span>
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-900">Login</span>
                </button>

                {/* Track Booking Button */}
                <button
                  onClick={handleTrackClick}
                  className="w-full min-h-[48px] py-3 px-4 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-500/80 rounded-xl flex items-center justify-between transition-all shadow-sm active:scale-98"
                >
                  <span className="flex items-center">
                    <Search className="w-4 h-4 mr-2 text-emerald-600" />
                    Track Booking Status
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600">Track</span>
                </button>

              </div>

              {/* Mobile Contact & Instagram Info */}
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2 text-xs text-slate-500">
                <div className="flex items-center justify-between min-h-[36px]">
                  <button 
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onCallClick) onCallClick();
                      else window.location.href = `tel:${GURU_PHONE_PRIMARY}`;
                    }}
                    className="font-bold text-slate-800 flex items-center py-1 hover:text-amber-600"
                  >
                    <Phone className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                    <span>{GURU_PHONE_PRIMARY_DISPLAY}</span>
                  </button>
                  <span className="text-slate-400">Vaishali Hub</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-50 text-[11px]">
                  <a href={GURU_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-pink-600 font-medium flex items-center py-1">
                    @gurutravel2026
                  </a>
                  <a href={REYAJ_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-pink-600 font-medium flex items-center py-1">
                    @crazy__boy__reyaj_
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
