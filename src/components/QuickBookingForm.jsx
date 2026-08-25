import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, Users, Car, Phone, User, Mail, Send, 
  AlertCircle, CheckCircle2, MessageSquare, ArrowRight, Info, 
  Compass, ShieldCheck, ChevronDown, ChevronUp, Sparkles 
} from 'lucide-react';
import { generateWhatsAppUrl, buildWhatsAppMessage } from '../utils/whatsappHelper.js';
import { getRouteServiceType } from '../utils/getRouteServiceType.js';
import { apiUrl } from '../utils/adminAuth.js';

export const PICKUP_LOCATIONS = [
  "Vaishali (Primary Hub)",
  "Patna",
  "Patna Airport (PAT)",
  "Patna Railway Station",
  "Danapur Railway Station",
  "Hajipur",
  "Muzaffarpur",
  "Darbhanga",
  "Chhapra",
  "Begusarai",
  "Other"
];

export const DESTINATION_LOCATIONS = [
  "Vaishali",
  "Patna",
  "Hajipur",
  "Muzaffarpur",
  "Darbhanga",
  "Begusarai",
  "Lalganj",
  "Chhapra",
  "Biharsarif",
  "Delhi / NCR",
  "Kolkata / WB",
  "Mumbai",
  "Pune",
  "Ranchi / Jharkhand",
  "Uttar Pradesh (Varanasi / Ayodhya)",
  "Jharkhand (Deoghar)",
  "Nepal (Kathmandu / Pokhara)",
  "Darjeeling",
  "Gangtok (Sikkim)",
  "Other"
];

export const VEHICLE_OPTIONS = [
  "Any Vehicle (Best Recommendation)",
  "Maruti Suzuki Dzire",
  "Tata Tigor",
  "Honda City",
  "Maruti Suzuki Baleno",
  "Maruti Suzuki Fronx",
  "Maruti Suzuki Brezza",
  "Maruti Suzuki S-Cross",
  "Mahindra Scorpio",
  "Mahindra Scorpio-N",
  "Mahindra XUV 500",
  "Mahindra Bolero",
  "Mahindra Thar",
  "Maruti Suzuki Ertiga",
  "Toyota Innova",
  "BMW"
];

function saveToClientCache(b) {
  try {
    const raw = localStorage.getItem('guru_travel_bookings_cache');
    const list = raw ? JSON.parse(raw) : [];
    const normalized = {
      referenceId: b.referenceId || b.id,
      id: b.id || b.referenceId,
      status: b.status || 'pending',
      createdAt: b.createdAt || new Date().toISOString(),
      updatedAt: b.updatedAt || new Date().toISOString(),
      ...b
    };
    const filtered = list.filter(item => (item.referenceId !== normalized.referenceId && item.id !== normalized.id));
    filtered.unshift(normalized);
    localStorage.setItem('guru_travel_bookings_cache', JSON.stringify(filtered));
  } catch (e) {
    console.warn('Unable to write to client cache:', e);
  }
}

export default function QuickBookingForm({ 
  initialService = "", 
  initialPickup = "", 
  initialVehicle = "", 
  initialDestination = "", 
  onBookingCreated,
  onSelfDriveNotice 
}) {
  const initialP = initialPickup || PICKUP_LOCATIONS[0];
  const initialD = initialDestination || DESTINATION_LOCATIONS[1];
  const initialDerivedService = initialService || getRouteServiceType(initialP, initialD);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: initialDerivedService,
    pickup: initialP,
    destination: initialD,
    customPickup: '',
    customDestination: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    passengers: '3-4',
    vehicle: initialVehicle || VEHICLE_OPTIONS[0],
    tripType: 'One-Way',
    message: '',
    rentalMode: 'With Driver'
  });

  const [showMoreOptions, setShowMoreOptions] = useState(Boolean(initialVehicle || initialService));
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  // Sync prop changes from external route/vehicle selection
  useEffect(() => {
    if (initialPickup || initialDestination || initialService) {
      setFormData(prev => {
        const nextPickup = initialPickup || prev.pickup;
        const nextDest = initialDestination || prev.destination;
        const nextService = initialService || getRouteServiceType(nextPickup, nextDest);
        return {
          ...prev,
          pickup: nextPickup,
          destination: nextDest,
          serviceType: nextService
        };
      });
    }
  }, [initialPickup, initialDestination, initialService]);

  useEffect(() => {
    if (initialVehicle) {
      setFormData(prev => ({ ...prev, vehicle: initialVehicle }));
      setShowMoreOptions(true);
    }
  }, [initialVehicle]);

  const getEffectiveLocations = (current = formData) => {
    const effP = current.pickup === 'Other' ? (current.customPickup || 'Other') : current.pickup;
    const effD = current.destination === 'Other' ? (current.customDestination || 'Other') : current.destination;
    return { effP, effD };
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please enter your full name';
    if (!formData.phone.trim()) {
      errs.phone = 'Please enter your contact phone number';
    } else if (!/^[0-9+ -]{10,14}$/.test(formData.phone.trim())) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.pickup) errs.pickup = 'Please select a pickup point';
    if (formData.pickup === 'Other' && !formData.customPickup.trim()) {
      errs.customPickup = 'Please enter custom pickup location';
    }
    if (!formData.destination) errs.destination = 'Please select a destination';
    if (formData.destination === 'Other' && !formData.customDestination.trim()) {
      errs.customDestination = 'Please enter custom destination';
    }
    if (!formData.date) errs.date = 'Please pick a date';
    if (!formData.time) errs.time = 'Please pick a pickup time';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const nextState = { ...prev, [name]: value };
      if (['pickup', 'destination', 'customPickup', 'customDestination'].includes(name)) {
        const { effP, effD } = getEffectiveLocations(nextState);
        nextState.serviceType = getRouteServiceType(effP, effD);
      }
      return nextState;
    });

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleRentalModeChange = (mode) => {
    if (mode === 'Without Driver') {
      if (onSelfDriveNotice) {
        onSelfDriveNotice();
      }
      return;
    }
    setFormData(prev => ({ ...prev, rentalMode: mode }));
  };

  const handleSendWhatsApp = (e) => {
    e.preventDefault();
    const { effP, effD } = getEffectiveLocations();
    const finalServiceType = getRouteServiceType(effP, effD);

    const whatsappPayload = {
      ...formData,
      pickup: effP,
      destination: effD,
      serviceType: finalServiceType,
      specialInstructions: formData.message
    };

    const whatsappUrl = generateWhatsAppUrl(whatsappPayload);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setLoading(true);

    const { effP, effD } = getEffectiveLocations();
    const finalServiceType = getRouteServiceType(effP, effD);

    const submissionPayload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || null,
      serviceType: finalServiceType,
      pickup: effP,
      destination: effD,
      date: formData.date,
      time: formData.time,
      passengers: formData.passengers,
      vehicle: formData.vehicle,
      tripType: formData.tripType,
      message: formData.message.trim() || null,
      rentalMode: formData.rentalMode
    };

    try {
      const response = await fetch(apiUrl('/api/bookings'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionPayload)
      });

      let result = null;
      try {
        result = await response.json();
      } catch (jsonErr) {
        result = null;
      }

      if (response.ok && result?.success && result?.booking) {
        saveToClientCache(result.booking);
        if (onBookingCreated) {
          onBookingCreated(result.booking);
        }
      } else {
        // Fallback local booking if backend temporarily offline
        const fallbackRef = 'GT-' + Date.now().toString(36).toUpperCase();
        const fallbackBooking = {
          ...submissionPayload,
          referenceId: fallbackRef,
          id: fallbackRef,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        saveToClientCache(fallbackBooking);
        if (onBookingCreated) {
          onBookingCreated(fallbackBooking);
        }
      }
    } catch (err) {
      console.warn('Booking network submit warning, using local reservation:', err);
      const fallbackRef = 'GT-' + Date.now().toString(36).toUpperCase();
      const fallbackBooking = {
        ...submissionPayload,
        referenceId: fallbackRef,
        id: fallbackRef,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      saveToClientCache(fallbackBooking);
      if (onBookingCreated) {
        onBookingCreated(fallbackBooking);
      }
    } finally {
      setLoading(false);
    }
  };

  const { effP, effD } = getEffectiveLocations();
  const currentServiceType = formData.serviceType || getRouteServiceType(effP, effD);

  return (
    <section id="book" className="relative -mt-6 sm:-mt-8 max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 z-20">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-premium border border-slate-200/80 overflow-hidden">
        
        {/* Top Header & Rental Mode Switcher */}
        <div className="bg-slate-900 px-4 py-4 sm:px-8 sm:py-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white">
                Book Your Ride / Request Route
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Chauffeur-driven vehicles dispatched from our Vaishali operating hub across Bihar and long-distance tours.
            </p>
          </div>

          {/* Rental Mode Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => handleRentalModeChange('With Driver')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                formData.rentalMode === 'With Driver'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              With Driver (Active)
            </button>
            <button
              type="button"
              onClick={() => handleRentalModeChange('Without Driver')}
              className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-400 hover:text-amber-300 flex items-center transition-all"
            >
              <span>Self-Drive</span>
              <span className="ml-1.5 text-[10px] bg-slate-800 text-amber-400 px-1.5 py-0.2 rounded border border-slate-700">
                Soon
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic Route Classification Bar */}
        <div className="bg-slate-50 px-4 py-2.5 sm:px-8 sm:py-3.5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Classification:
            </span>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-slate-900 text-amber-400 font-bold text-xs shadow-sm">
              <Compass className="w-3 h-3" />
              <span>{currentServiceType}</span>
            </div>
            <span className="text-[11px] text-slate-500 hidden md:inline">
              (Auto-identified from {effP} → {effD})
            </span>
          </div>

          <div className="text-[11px] text-slate-600 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Dedicated Chauffeur & Sanitized Fleet</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate className="p-4 sm:p-7 md:p-8 space-y-5">
          
          {apiError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Core Required Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            
            {/* Customer Name */}
            <div>
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  data-gramm="false"
                  data-enable-grammarly="false"
                  className={`w-full min-h-[44px] pl-10 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:ring-2 focus:ring-amber-400 outline-none transition-all ${
                    errors.name ? 'border-red-400 bg-red-50/40' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Phone Number (WhatsApp) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="e.g., 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  data-gramm="false"
                  data-enable-grammarly="false"
                  className={`w-full min-h-[44px] pl-10 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:ring-2 focus:ring-amber-400 outline-none transition-all ${
                    errors.phone ? 'border-red-400 bg-red-50/40' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
            </div>

            {/* Pickup Location */}
            <div>
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Pickup Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <select
                  name="pickup"
                  value={formData.pickup}
                  onChange={handleChange}
                  className={`w-full min-h-[44px] pl-10 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-white focus:ring-2 focus:ring-amber-400 outline-none transition-all ${
                    errors.pickup ? 'border-red-400 bg-red-50/40' : 'border-slate-300'
                  }`}
                >
                  {PICKUP_LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              {formData.pickup === 'Other' && (
                <input
                  type="text"
                  name="customPickup"
                  placeholder="Enter custom pickup address"
                  value={formData.customPickup}
                  onChange={handleChange}
                  data-gramm="false"
                  data-enable-grammarly="false"
                  className="mt-2 w-full min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-400 outline-none"
                />
              )}
              {errors.pickup && <p className="text-[11px] text-red-500 mt-1">{errors.pickup}</p>}
            </div>

            {/* Destination Location */}
            <div>
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Destination <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-amber-500 absolute left-3.5 top-3 pointer-events-none" />
                <select
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  className={`w-full min-h-[44px] pl-10 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-white focus:ring-2 focus:ring-amber-400 outline-none transition-all ${
                    errors.destination ? 'border-red-400 bg-red-50/40' : 'border-slate-300'
                  }`}
                >
                  {DESTINATION_LOCATIONS.map(dest => (
                    <option key={dest} value={dest}>{dest}</option>
                  ))}
                </select>
              </div>
              {formData.destination === 'Other' && (
                <input
                  type="text"
                  name="customDestination"
                  placeholder="Enter custom destination city"
                  value={formData.customDestination}
                  onChange={handleChange}
                  data-gramm="false"
                  data-enable-grammarly="false"
                  className="mt-2 w-full min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-400 outline-none"
                />
              )}
              {errors.destination && <p className="text-[11px] text-red-500 mt-1">{errors.destination}</p>}
            </div>

            {/* Journey Date */}
            <div>
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Journey Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full min-h-[44px] pl-10 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:ring-2 focus:ring-amber-400 outline-none transition-all ${
                    errors.date ? 'border-red-400 bg-red-50/40' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.date && <p className="text-[11px] text-red-500 mt-1">{errors.date}</p>}
            </div>

            {/* Pickup Time */}
            <div>
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Pickup Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`w-full min-h-[44px] pl-10 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:ring-2 focus:ring-amber-400 outline-none transition-all ${
                    errors.time ? 'border-red-400 bg-red-50/40' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.time && <p className="text-[11px] text-red-500 mt-1">{errors.time}</p>}
            </div>

          </div>

          {/* Progressive Disclosure Toggle for Secondary Fields */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-amber-700 bg-slate-100 hover:bg-amber-50 border border-slate-200 transition-all focus:outline-none"
            >
              <span>{showMoreOptions ? "Hide Extra Options" : "+ More Options (Vehicle, Passengers, Trip Type, Instructions, Email)"}</span>
              {showMoreOptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Expandable Optional Fields */}
          {showMoreOptions && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                
                {/* Vehicle Preference */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Vehicle Preference
                  </label>
                  <div className="relative">
                    <Car className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <select
                      name="vehicle"
                      value={formData.vehicle}
                      onChange={handleChange}
                      className="w-full min-h-[44px] pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 text-xs sm:text-sm bg-white outline-none transition-all"
                    >
                      {VEHICLE_OPTIONS.map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Passengers */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Passengers Count
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <select
                      name="passengers"
                      value={formData.passengers}
                      onChange={handleChange}
                      className="w-full min-h-[44px] pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 text-xs sm:text-sm bg-white outline-none transition-all"
                    >
                      <option value="1-2">1 - 2 Passengers (Sedan / Hatchback)</option>
                      <option value="3-4">3 - 4 Passengers (Sedan / Compact SUV)</option>
                      <option value="5-7">5 - 7 Passengers (Innova / Scorpio / Ertiga)</option>
                      <option value="8+">8+ Passengers (Multiple Vehicles)</option>
                    </select>
                  </div>
                </div>

                {/* Trip Type (One-Way / Round-Trip) */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Trip Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['One-Way', 'Round-Trip'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, tripType: type }))}
                        className={`min-h-[44px] py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                          formData.tripType === type
                            ? 'bg-amber-100 border-amber-500 text-slate-950 font-bold shadow-sm'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email Address (Optional) */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Address <span className="text-slate-400 font-normal">(Optional for booking voucher receipt)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      placeholder="e.g. name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full min-h-[44px] pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                  </div>
                </div>

                {/* Special Instructions */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Special Instructions / Landmarks <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="message"
                    placeholder="e.g. Flight arrival timing, 3 luggage bags, near landmark..."
                    value={formData.message}
                    onChange={handleChange}
                    data-gramm="false"
                    data-enable-grammarly="false"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-400 outline-none transition-all"
                  />
                </div>

              </div>
            </div>
          )}

          {/* Form Action Controls */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] sm:text-xs text-slate-600 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Chauffeur & pricing quote confirmed on Call/WhatsApp. Zero prepayment required.</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center px-5 py-3 rounded-xl font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-all text-xs sm:text-sm shadow-sm active:scale-98"
              >
                <MessageSquare className="w-4 h-4 mr-2 text-emerald-600" />
                <span>Send on WhatsApp</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center px-7 py-3 rounded-xl font-black text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md transition-all disabled:opacity-50 text-xs sm:text-sm active:scale-98"
              >
                {loading ? (
                  <span className="inline-flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1.5">
                    <span>Submit Booking Request</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </section>
  );
}
