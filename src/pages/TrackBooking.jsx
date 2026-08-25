import React, { useState } from 'react';
import { 
  Search, ArrowLeft, ShieldCheck, CheckCircle2, Clock, XCircle, 
  MapPin, Calendar, Car, Phone, User, MessageSquare, AlertCircle, 
  HelpCircle, Loader2, Copy, Check 
} from 'lucide-react';
import { GURU_PHONE_PRIMARY, GURU_PHONE_PRIMARY_DISPLAY, generateWhatsAppUrl } from '../utils/whatsappHelper';

function findInClientCache(refId, phone) {
  try {
    const raw = localStorage.getItem('guru_travel_bookings_cache');
    if (!raw) return null;
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return null;

    const normRef = String(refId).trim().toUpperCase();
    const cleanP = String(phone).replace(/[^0-9]/g, '');

    return list.find(b => {
      const bRef = (b.referenceId || b.id || '').toUpperCase();
      if (bRef !== normRef) return false;
      const bPhone = String(b.phone || '').replace(/[^0-9]/g, '');
      return bPhone.endsWith(cleanP) || cleanP.endsWith(bPhone);
    }) || null;
  } catch (e) {
    return null;
  }
}

export default function TrackBooking({ onNavigateHome }) {
  const [referenceId, setReferenceId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setError(null);
    setBooking(null);

    const ref = referenceId.trim().toUpperCase();
    const ph = phone.trim();

    if (!ref || !ph) {
      setError('Please provide both Reference ID (e.g. GT-MT7EFESR) and Phone Number.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/bookings/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referenceId: ref, phone: ph })
      });

      let data = null;
      try {
        data = await response.json();
      } catch (jsonErr) {
        data = null;
      }

      if (response.ok && data?.success && data?.booking) {
        setBooking(data.booking);
      } else {
        // Fallback to client-side storage
        const cached = findInClientCache(ref, ph);
        if (cached) {
          setBooking(cached);
        } else {
          setError(data?.error || 'No matching booking found. Please verify your Reference ID and Phone Number.');
        }
      }
    } catch (err) {
      console.warn('Network error while tracking, checking client cache:', err);
      const cached = findInClientCache(ref, ph);
      if (cached) {
        setBooking(cached);
      } else {
        setError('No matching booking found. If your booking was submitted recently, please verify your Reference ID and Phone Number.');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyRef = () => {
    if (booking?.referenceId && navigator.clipboard) {
      navigator.clipboard.writeText(booking.referenceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const StatusCard = ({ status }) => {
    const s = (status || 'pending').toLowerCase();

    const config = {
      pending: {
        title: 'Booking Request Received',
        desc: 'Our Vaishali central dispatch desk is reviewing vehicle schedule and calculating best fare.',
        badge: 'bg-amber-100 text-amber-900 border-amber-300',
        icon: Clock,
        iconColor: 'text-amber-600 bg-amber-50'
      },
      under_review: {
        title: 'Under Review & Chauffeur Assignment',
        desc: 'We are matching your vehicle preference with available drivers in the Vaishali/Bihar sector.',
        badge: 'bg-sky-100 text-sky-900 border-sky-300',
        icon: Clock,
        iconColor: 'text-sky-600 bg-sky-50'
      },
      confirmed: {
        title: 'Booking Confirmed!',
        desc: 'Your ride is confirmed! Driver and car details will be sent to your WhatsApp number before pickup time.',
        badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        icon: CheckCircle2,
        iconColor: 'text-emerald-600 bg-emerald-50'
      },
      completed: {
        title: 'Trip Completed',
        desc: 'Thank you for choosing Guru Travel. We hope you had a pleasant and safe journey.',
        badge: 'bg-indigo-100 text-indigo-900 border-indigo-300',
        icon: CheckCircle2,
        iconColor: 'text-indigo-600 bg-indigo-50'
      },
      cancelled: {
        title: 'Booking Cancelled',
        desc: 'This booking request has been cancelled. If you have any questions, please contact our 24/7 hotline.',
        badge: 'bg-rose-100 text-rose-900 border-rose-300',
        icon: XCircle,
        iconColor: 'text-rose-600 bg-rose-50'
      }
    };

    const current = config[s] || config.pending;
    const Icon = current.icon;

    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${current.iconColor} border border-current/20`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-950 text-base">{current.title}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{current.desc}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${current.badge} hidden sm:inline-block`}>
            {status}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Top Navbar */}
      <header className="bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          <button
            onClick={onNavigateHome || (() => { window.location.pathname = '/'; })}
            className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Return to Homepage</span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm">
              GT
            </div>
            <span className="font-extrabold text-sm text-white">Guru Travel</span>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Customer Self-Service</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Track Your Booking Status
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Enter your Reference ID (e.g. <strong>GT-MT7EFESR</strong>) and the registered phone number to check live status.
          </p>
        </div>

        {/* Tracking Input Card */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleTrack} className="space-y-4">
            
            {error && (
              <div className="p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-200 text-xs flex items-start space-x-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Reference ID */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Reference ID
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. GT-MT7EFESR"
                    value={referenceId}
                    onChange={(e) => setReferenceId(e.target.value.toUpperCase())}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono text-amber-400 placeholder-slate-500 focus:border-amber-400 outline-none uppercase"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Registered Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9334520459"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-md shadow-amber-400/20 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Looking up Booking...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Check Live Status</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* Search Results Display */}
        {booking && (
          <div className="bg-white text-slate-900 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
            
            {/* Top Bar of Result */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Booking Reference
                </span>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="text-xl font-mono font-black text-slate-950">
                    {booking.referenceId}
                  </span>
                  <button
                    onClick={copyRef}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Copy Reference"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] text-slate-500 block">Customer Name</span>
                <span className="font-bold text-slate-900 text-sm">{booking.name}</span>
              </div>
            </div>

            {/* Status Summary Banner */}
            <StatusCard status={booking.status} />

            {/* Trip Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center text-slate-500 font-bold uppercase text-[11px]">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-amber-500" />
                  <span>Route Information</span>
                </div>
                <p className="font-bold text-slate-950 text-sm">{booking.pickup} → {booking.destination}</p>
                <p className="text-slate-600 text-xs">{booking.serviceType}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center text-slate-500 font-bold uppercase text-[11px]">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-amber-500" />
                  <span>Schedule</span>
                </div>
                <p className="font-bold text-slate-950 text-sm">{booking.date} at {booking.time}</p>
                <p className="text-slate-600 text-xs">{booking.tripType} (With Dedicated Driver)</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 sm:col-span-2">
                <div className="flex items-center text-slate-500 font-bold uppercase text-[11px]">
                  <Car className="w-3.5 h-3.5 mr-1 text-amber-500" />
                  <span>Vehicle & Passenger Details</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold text-slate-950">{booking.vehicle}</p>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-200 text-slate-800">
                    {booking.passengers} Passengers
                  </span>
                </div>
              </div>

            </div>

            {/* Support Actions */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-500">
                Need urgent modification or driver updates?
              </p>
              <a
                href={generateWhatsAppUrl({
                  name: booking.name,
                  phone: booking.phone,
                  pickup: booking.pickup,
                  destination: booking.destination,
                  referenceId: booking.referenceId,
                  serviceType: booking.serviceType
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-xs text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-colors"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                <span>Chat with Dispatch Team</span>
              </a>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}
