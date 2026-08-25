import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import QuickBookingForm from './components/QuickBookingForm';
import ServicesSection from './components/ServicesSection';
import FleetSection from './components/FleetSection';
import RoutesSection from './components/RoutesSection';
import DestinationsSection from './components/DestinationsSection';
import RentalModesSection from './components/RentalModesSection';
import WhyChooseUs from './components/WhyChooseUs';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import FAQSection from './components/FAQSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import BookingSuccessModal from './components/BookingSuccessModal';
import ComingSoonModal from './components/ComingSoonModal';
import CallHotlinesModal from './components/CallHotlinesModal';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import TrackBooking from './pages/TrackBooking';
import { getRouteServiceType } from './utils/getRouteServiceType';
import { adminAuth } from './utils/adminAuth';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  const [selectedService, setSelectedService] = useState('');
  const [selectedPickup, setSelectedPickup] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [showSelfDriveModal, setShowSelfDriveModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);

  // Client-side Router listener for browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBooking = () => {
    if (currentPath !== '/') {
      navigateTo('/');
      setTimeout(() => {
        const el = document.getElementById('book');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return;
    }
    const el = document.getElementById('book');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToFleet = () => {
    if (currentPath !== '/') {
      navigateTo('/');
      setTimeout(() => {
        const el = document.getElementById('fleet');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return;
    }
    const el = document.getElementById('fleet');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSelectService = (serviceName) => {
    setSelectedService(serviceName);
    scrollToBooking();
  };

  const handleSelectVehicle = (vehicleName) => {
    setSelectedVehicle(vehicleName);
    scrollToBooking();
  };

  const handleSelectRoute = (route) => {
    const p = route.origin || '';
    const d = route.destination || '';
    if (p) setSelectedPickup(p);
    if (d) setSelectedDestination(d);
    setSelectedService(getRouteServiceType(p, d));
    scrollToBooking();
  };

  const handleSelectDestination = (destName) => {
    setSelectedDestination(destName);
    const p = selectedPickup || 'Vaishali';
    setSelectedService(getRouteServiceType(p, destName));
    scrollToBooking();
  };

  // Route 1: Admin Login Page
  if (currentPath === '/admin/login') {
    return (
      <AdminLogin
        onLoginSuccess={() => navigateTo('/admin')}
        onNavigateHome={() => navigateTo('/')}
      />
    );
  }

  // Route 2: Admin Dashboard
  if (currentPath === '/admin') {
    if (!adminAuth.isAuthenticated()) {
      return (
        <AdminLogin
          onLoginSuccess={() => navigateTo('/admin')}
          onNavigateHome={() => navigateTo('/')}
        />
      );
    }

    return (
      <AdminDashboard
        onLogout={() => {
          adminAuth.logout();
          navigateTo('/admin/login');
        }}
        onNavigateHome={() => navigateTo('/')}
      />
    );
  }

  // Route 3: Customer Track Booking Page
  if (currentPath === '/track-booking') {
    return (
      <TrackBooking
        onNavigateHome={() => navigateTo('/')}
      />
    );
  }

  // Route 4: Main Landing Page (Chauffeur-first travel portal)
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Sticky Header Navigation */}
      <Navbar
        onTrackBooking={() => navigateTo('/track-booking')}
        onAdminLogin={() => navigateTo('/admin/login')}
        onCallClick={() => setShowCallModal(true)}
      />

      <main className="flex-grow">
        {/* 1. Hero Section */}
        <Hero
          onBookClick={scrollToBooking}
          onExploreFleet={scrollToFleet}
          onCallClick={() => setShowCallModal(true)}
        />

        {/* 2. Instant Booking & Dispatch Enquiry Form */}
        <div id="book" className="scroll-mt-24">
          <QuickBookingForm
            initialService={selectedService}
            initialPickup={selectedPickup}
            initialDestination={selectedDestination}
            initialVehicle={selectedVehicle}
            onBookingCreated={(bookingData) => setConfirmedBooking(bookingData)}
          />
        </div>

        {/* 3. Core Travel Services Portfolio */}
        <ServicesSection
          onSelectService={handleSelectService}
        />

        {/* 4. Complete 15-Vehicle Fleet Showcase */}
        <FleetSection
          onSelectVehicle={handleSelectVehicle}
        />

        {/* 5. Popular Travel Corridors & City Routes */}
        <RoutesSection
          onSelectRoute={handleSelectRoute}
        />

        {/* 6. Where We Operate (Regional Destinations & Coverage) */}
        <DestinationsSection
          onSelectDestination={handleSelectDestination}
        />

        {/* 7. Rental Modes Comparison (With Driver vs Self Drive) */}
        <RentalModesSection
          onBookWithDriver={scrollToBooking}
          onNotifySelfDrive={() => setShowSelfDriveModal(true)}
        />

        {/* 8. Why Choose Guru Travel */}
        <WhyChooseUs />

        {/* 9. How It Works (4 Steps) */}
        <HowItWorks
          onBookClick={scrollToBooking}
        />

        {/* 10. Customer Testimonials */}
        <Testimonials />

        {/* 11. Frequently Asked Questions */}
        <FAQSection />

        {/* 12. Contact & Dedicated Enquiry */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Call & WhatsApp Buttons */}
      <FloatingActions
        onCallClick={() => setShowCallModal(true)}
      />

      {/* Booking Confirmation Modal */}
      {confirmedBooking && (
        <BookingSuccessModal
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
          onTrackBooking={() => navigateTo('/track-booking')}
        />
      )}

      {/* Self-Drive Coming Soon Modal */}
      {showSelfDriveModal && (
        <ComingSoonModal
          onClose={() => setShowSelfDriveModal(false)}
          onSwitchToDriver={scrollToBooking}
        />
      )}

      {/* Direct Hotlines Modal */}
      <CallHotlinesModal
        isOpen={showCallModal}
        onClose={() => setShowCallModal(false)}
      />
    </div>
  );
}
