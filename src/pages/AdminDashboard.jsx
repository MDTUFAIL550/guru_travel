import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, LogOut, Search, Filter, RefreshCw, Calendar, Clock, 
  MapPin, Phone, User, Car, Users, CheckCircle2, XCircle, AlertCircle, 
  Eye, Copy, Check, MessageSquare, PhoneCall, ExternalLink, X, Compass, 
  HelpCircle, ChevronRight, ArrowUpDown, ChevronDown, Sparkles, Plus,
  Edit3, Trash2, ToggleLeft, ToggleRight, LayoutDashboard, Layers,
  Navigation, Globe, Menu, Fuel, Cog, Briefcase, Plane, Train, Building,
  ArrowRight
} from 'lucide-react';
import { adminAuth } from '../utils/adminAuth';
import { 
  GURU_PHONE_PRIMARY_DISPLAY, 
  GURU_PHONE_SECONDARY_DISPLAY, 
  normalizeIndianPhone,
  generateAdminToCustomerWhatsAppUrl 
} from '../utils/whatsappHelper';

export default function AdminDashboard({ onLogout, onNavigateHome }) {
  // Navigation Section State
  const [activeSection, setActiveSection] = useState('bookings'); // 'overview', 'bookings', 'fleet', 'services', 'locations', 'routes', 'destinations'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Data states
  const [bookings, setBookings] = useState([]);
  const [fleet, setFleet] = useState([]);
  const [services, setServices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [destinations, setDestinations] = useState([]);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    under_review: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    today: 0
  });

  // UI / Filter States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Bookings Filters & Modals
  const [bookingSearch, setBookingSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');

  // Content Filters
  const [fleetCategoryFilter, setFleetCategoryFilter] = useState('all');
  const [fleetSearch, setFleetSearch] = useState('');
  const [routesCategoryFilter, setRoutesCategoryFilter] = useState('all');
  const [routesSearch, setRoutesSearch] = useState('');
  const [locationsTypeFilter, setLocationsTypeFilter] = useState('all');
  const [locationsSearch, setLocationsSearch] = useState('');
  const [servicesSearch, setServicesSearch] = useState('');
  const [destinationsCategoryFilter, setDestinationsCategoryFilter] = useState('all');
  const [destinationsSearch, setDestinationsSearch] = useState('');

  // CRUD Modals
  const [editingItem, setEditingItem] = useState(null); // { type: 'fleet'|'services'|'locations'|'routes'|'destinations', isNew: boolean, data: {} }
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type, id, name }

  const currentUser = adminAuth.getUser();

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(text);
      showToast(`Copied Reference ID: ${text}`);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // ==========================================
  // DATA LOADERS
  // ==========================================
  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await adminAuth.getBookings({
        status: statusFilter,
        search: bookingSearch,
        date: dateFilter
      });
      if (res.unauthorized) {
        if (onLogout) onLogout();
        return;
      }
      if (res.success) {
        setBookings(res.bookings || []);
        if (res.stats) setStats(res.stats);
      } else {
        setError(res.error || 'Failed to load bookings.');
      }
    } catch {
      setError('Unable to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  const loadFleet = async () => {
    setLoading(true);
    try {
      const res = await adminAuth.getFleet({
        category: fleetCategoryFilter,
        search: fleetSearch
      });
      if (res.unauthorized) { if (onLogout) onLogout(); return; }
      if (res.success) setFleet(res.fleet || []);
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await adminAuth.getServices({ search: servicesSearch });
      if (res.unauthorized) { if (onLogout) onLogout(); return; }
      if (res.success) setServices(res.services || []);
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async () => {
    setLoading(true);
    try {
      const res = await adminAuth.getLocations({
        type: locationsTypeFilter,
        search: locationsSearch
      });
      if (res.unauthorized) { if (onLogout) onLogout(); return; }
      if (res.success) setLocations(res.locations || []);
    } finally {
      setLoading(false);
    }
  };

  const loadRoutes = async () => {
    setLoading(true);
    try {
      const res = await adminAuth.getRoutes({
        category: routesCategoryFilter,
        search: routesSearch
      });
      if (res.unauthorized) { if (onLogout) onLogout(); return; }
      if (res.success) setRoutes(res.routes || []);
    } finally {
      setLoading(false);
    }
  };

  const loadDestinations = async () => {
    setLoading(true);
    try {
      const res = await adminAuth.getDestinations({
        category: destinationsCategoryFilter,
        search: destinationsSearch
      });
      if (res.unauthorized) { if (onLogout) onLogout(); return; }
      if (res.success) setDestinations(res.destinations || []);
    } finally {
      setLoading(false);
    }
  };

  // Trigger loads based on active section
  useEffect(() => {
    if (activeSection === 'bookings' || activeSection === 'overview') {
      loadBookings();
    }
    if (activeSection === 'fleet' || activeSection === 'overview') {
      loadFleet();
    }
    if (activeSection === 'services' || activeSection === 'overview') {
      loadServices();
    }
    if (activeSection === 'locations' || activeSection === 'overview') {
      loadLocations();
    }
    if (activeSection === 'routes' || activeSection === 'overview') {
      loadRoutes();
    }
    if (activeSection === 'destinations' || activeSection === 'overview') {
      loadDestinations();
    }
  }, [
    activeSection, 
    statusFilter, dateFilter, 
    fleetCategoryFilter, 
    routesCategoryFilter, 
    locationsTypeFilter, 
    destinationsCategoryFilter
  ]);

  // ==========================================
  // BOOKINGS ACTIONS
  // ==========================================
  const handleUpdateBookingStatus = async (refId, newStatus, reason = '') => {
    setActionLoading(true);
    try {
      const res = await adminAuth.updateStatus(refId, newStatus, reason);
      if (res.unauthorized) { if (onLogout) onLogout(); return; }
      if (res.success && res.booking) {
        showToast(`Booking ${refId} updated to ${newStatus.toUpperCase()}`);
        setBookings(prev => prev.map(b => (b.referenceId === refId ? res.booking : b)));
        if (selectedBooking?.referenceId === refId) setSelectedBooking(res.booking);
        loadBookings();
      } else {
        showToast(res.error || 'Failed to update status.');
      }
    } catch {
      showToast('Network error while updating booking status.');
    } finally {
      setActionLoading(false);
      setCancelModalBooking(null);
      setCancellationReason('');
    }
  };

  // ==========================================
  // CONTENT CRUD HANDLERS
  // ==========================================
  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    setActionLoading(true);

    const { type, isNew, data } = editingItem;
    let res = null;

    try {
      if (type === 'fleet') {
        res = isNew ? await adminAuth.saveVehicle(data) : await adminAuth.updateVehicle(data.id, data);
        if (res.success) { showToast(`Vehicle ${isNew ? 'added' : 'updated'} successfully.`); loadFleet(); }
      } else if (type === 'services') {
        res = isNew ? await adminAuth.saveService(data) : await adminAuth.updateService(data.id, data);
        if (res.success) { showToast(`Service ${isNew ? 'added' : 'updated'} successfully.`); loadServices(); }
      } else if (type === 'locations') {
        res = isNew ? await adminAuth.saveLocation(data) : await adminAuth.updateLocation(data.id, data);
        if (res.success) { showToast(`Location ${isNew ? 'added' : 'updated'} successfully.`); loadLocations(); }
      } else if (type === 'routes') {
        res = isNew ? await adminAuth.saveRoute(data) : await adminAuth.updateRoute(data.id, data);
        if (res.success) { showToast(`Route ${isNew ? 'added' : 'updated'} successfully.`); loadRoutes(); }
      } else if (type === 'destinations') {
        res = isNew ? await adminAuth.saveDestination(data) : await adminAuth.updateDestination(data.id, data);
        if (res.success) { showToast(`Destination ${isNew ? 'added' : 'updated'} successfully.`); loadDestinations(); }
      }

      if (res?.unauthorized) { if (onLogout) onLogout(); return; }
      if (res?.success) {
        setEditingItem(null);
      } else {
        showToast(res?.error || 'Failed to save item.');
      }
    } catch {
      showToast('Failed to save data. Please check connection.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (type, id, currentActive) => {
    setActionLoading(true);
    let res = null;
    try {
      if (type === 'fleet') res = await adminAuth.toggleVehicleStatus(id, !currentActive);
      if (type === 'services') res = await adminAuth.toggleServiceStatus(id, !currentActive);
      if (type === 'locations') res = await adminAuth.toggleLocationStatus(id, !currentActive);
      if (type === 'routes') res = await adminAuth.toggleRouteStatus(id, !currentActive);
      if (type === 'destinations') res = await adminAuth.toggleDestinationStatus(id, !currentActive);

      if (res?.unauthorized) { if (onLogout) onLogout(); return; }
      if (res?.success) {
        showToast(`Item ${!currentActive ? 'Activated' : 'Deactivated'}`);
        if (type === 'fleet') loadFleet();
        if (type === 'services') loadServices();
        if (type === 'locations') loadLocations();
        if (type === 'routes') loadRoutes();
        if (type === 'destinations') loadDestinations();
      } else {
        showToast(res?.error || 'Failed to toggle status.');
      }
    } catch {
      showToast('Failed to toggle status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteConfirm) return;
    setActionLoading(true);
    const { type, id } = deleteConfirm;
    let res = null;
    try {
      if (type === 'booking') {
        res = await adminAuth.deleteBooking(id);
        if (res?.success) {
          showToast('Booking deleted successfully.');
          if (selectedBooking && ((selectedBooking.referenceId || selectedBooking.id) === id)) {
            setSelectedBooking(null);
          }
          loadBookings();
        }
      }
      if (type === 'fleet') res = await adminAuth.deleteVehicle(id);
      if (type === 'services') res = await adminAuth.deleteService(id);
      if (type === 'locations') res = await adminAuth.deleteLocation(id);
      if (type === 'routes') res = await adminAuth.deleteRoute(id);
      if (type === 'destinations') res = await adminAuth.deleteDestination(id);

      if (res?.unauthorized) { if (onLogout) onLogout(); return; }
      if (res?.success) {
        if (type !== 'booking') showToast('Item deleted permanently.');
        if (type === 'fleet') loadFleet();
        if (type === 'services') loadServices();
        if (type === 'locations') loadLocations();
        if (type === 'routes') loadRoutes();
        if (type === 'destinations') loadDestinations();
      } else {
        showToast(res?.error || 'Failed to delete item.');
      }
    } catch {
      showToast('Error deleting item.');
    } finally {
      setActionLoading(false);
      setDeleteConfirm(null);
    }
  };

  // Helper badge styling for bookings
  const getStatusBadge = (status) => {
    const s = (status || 'pending').toLowerCase();
    switch (s) {
      case 'confirmed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'under_review':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'completed':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-amber-400 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl animate-fadeIn flex items-center space-x-2">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              GT
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white block leading-none">
                GURU TRAVEL <span className="text-amber-400 text-xs uppercase font-bold">Admin</span>
              </span>
              <span className="text-[10px] text-slate-400">Vaishali Central Hub</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onNavigateHome || (() => { window.location.pathname = '/'; })}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center space-x-1"
          >
            <ExternalLink className="w-3.5 h-3.5 mr-1" />
            <span className="hidden sm:inline">View Public Website</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-950/80 border border-red-800/40 transition-colors flex items-center space-x-1"
          >
            <LogOut className="w-3.5 h-3.5 mr-1" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between pt-16 lg:pt-4`}>
          
          <div className="px-3 space-y-6 overflow-y-auto">
            {/* Close button on mobile */}
            <div className="flex items-center justify-between px-3 lg:hidden mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Navigation Menu</span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overview / Dashboard */}
            <div>
              <button
                onClick={() => { setActiveSection('overview'); setMobileSidebarOpen(false); }}
                className={`w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeSection === 'overview'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </button>
            </div>

            {/* Section 1: Bookings */}
            <div>
              <span className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block mb-2">
                Booking Management
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => { setActiveSection('bookings'); setStatusFilter('all'); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeSection === 'bookings' && statusFilter === 'all'
                      ? 'bg-slate-800 text-white font-bold border-l-2 border-amber-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>All Bookings</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {stats.total}
                  </span>
                </button>

                <button
                  onClick={() => { setActiveSection('bookings'); setStatusFilter('pending'); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl text-xs transition-all ${
                    activeSection === 'bookings' && statusFilter === 'pending'
                      ? 'bg-amber-500/20 text-amber-300 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <span>• Pending Confirmation</span>
                  <span className="text-[10px] font-mono text-amber-400">{stats.pending}</span>
                </button>

                <button
                  onClick={() => { setActiveSection('bookings'); setStatusFilter('under_review'); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl text-xs transition-all ${
                    activeSection === 'bookings' && statusFilter === 'under_review'
                      ? 'bg-blue-500/20 text-blue-300 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <span>• Under Review</span>
                  <span className="text-[10px] font-mono text-blue-400">{stats.under_review}</span>
                </button>

                <button
                  onClick={() => { setActiveSection('bookings'); setStatusFilter('confirmed'); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl text-xs transition-all ${
                    activeSection === 'bookings' && statusFilter === 'confirmed'
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <span>• Confirmed</span>
                  <span className="text-[10px] font-mono text-emerald-400">{stats.confirmed}</span>
                </button>

                <button
                  onClick={() => { setActiveSection('bookings'); setStatusFilter('cancelled'); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl text-xs transition-all ${
                    activeSection === 'bookings' && statusFilter === 'cancelled'
                      ? 'bg-red-500/20 text-red-300 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <span>• Cancelled</span>
                  <span className="text-[10px] font-mono text-red-400">{stats.cancelled}</span>
                </button>

                <button
                  onClick={() => { setActiveSection('bookings'); setStatusFilter('completed'); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl text-xs transition-all ${
                    activeSection === 'bookings' && statusFilter === 'completed'
                      ? 'bg-purple-500/20 text-purple-300 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <span>• Completed</span>
                  <span className="text-[10px] font-mono text-purple-400">{stats.completed}</span>
                </button>
              </div>
            </div>

            {/* Section 2: Website Content Management */}
            <div>
              <span className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block mb-2">
                Website Content
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => { setActiveSection('fleet'); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeSection === 'fleet'
                      ? 'bg-slate-800 text-white font-bold border-l-2 border-amber-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Car className="w-4 h-4 text-amber-400" />
                  <span>Fleet Management</span>
                </button>

                <button
                  onClick={() => { setActiveSection('services'); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeSection === 'services'
                      ? 'bg-slate-800 text-white font-bold border-l-2 border-amber-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Services</span>
                </button>

                <button
                  onClick={() => { setActiveSection('locations'); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeSection === 'locations'
                      ? 'bg-slate-800 text-white font-bold border-l-2 border-amber-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Operational Locations</span>
                </button>

                <button
                  onClick={() => { setActiveSection('routes'); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeSection === 'routes'
                      ? 'bg-slate-800 text-white font-bold border-l-2 border-amber-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Navigation className="w-4 h-4 text-amber-400" />
                  <span>Routes & Corridors</span>
                </button>

                <button
                  onClick={() => { setActiveSection('destinations'); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    activeSection === 'destinations'
                      ? 'bg-slate-800 text-white font-bold border-l-2 border-amber-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Globe className="w-4 h-4 text-amber-400" />
                  <span>Destinations</span>
                </button>
              </div>
            </div>

          </div>

          {/* User info footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-bold">
                A
              </div>
              <div className="truncate">
                <span className="font-bold text-white block leading-none">admin</span>
                <span className="text-[10px] text-emerald-400">Authenticated Admin</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile backdrop */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

          {/* ======================================================== */}
          {/* 1. OVERVIEW / DASHBOARD TAB */}
          {/* ======================================================== */}
          {activeSection === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Executive Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Summary of Guru Travel bookings and live website content datasets.
                </p>
              </div>

              {/* Stats Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                <div 
                  onClick={() => { setActiveSection('bookings'); setStatusFilter('all'); }}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/60 transition-all cursor-pointer"
                >
                  <span className="text-[11px] text-slate-400 font-medium block">Total Bookings</span>
                  <strong className="text-2xl font-black text-white font-mono mt-1 block">{stats.total}</strong>
                </div>

                <div 
                  onClick={() => { setActiveSection('bookings'); setStatusFilter('pending'); }}
                  className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 hover:border-amber-400 transition-all cursor-pointer"
                >
                  <span className="text-[11px] text-amber-300 font-medium block">Pending</span>
                  <strong className="text-2xl font-black text-amber-400 font-mono mt-1 block">{stats.pending}</strong>
                </div>

                <div 
                  onClick={() => { setActiveSection('bookings'); setStatusFilter('confirmed'); }}
                  className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 hover:border-emerald-400 transition-all cursor-pointer"
                >
                  <span className="text-[11px] text-emerald-300 font-medium block">Confirmed</span>
                  <strong className="text-2xl font-black text-emerald-400 font-mono mt-1 block">{stats.confirmed}</strong>
                </div>

                <div 
                  onClick={() => setActiveSection('fleet')}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/60 transition-all cursor-pointer"
                >
                  <span className="text-[11px] text-slate-400 font-medium block">Active Fleet</span>
                  <strong className="text-2xl font-black text-white font-mono mt-1 block">{fleet.filter(f => f.active !== false).length}</strong>
                </div>

                <div 
                  onClick={() => setActiveSection('routes')}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/60 transition-all cursor-pointer"
                >
                  <span className="text-[11px] text-slate-400 font-medium block">Active Routes</span>
                  <strong className="text-2xl font-black text-white font-mono mt-1 block">{routes.filter(r => r.active !== false).length}</strong>
                </div>

                <div 
                  onClick={() => setActiveSection('locations')}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/60 transition-all cursor-pointer"
                >
                  <span className="text-[11px] text-slate-400 font-medium block">Locations</span>
                  <strong className="text-2xl font-black text-white font-mono mt-1 block">{locations.filter(l => l.active !== false).length}</strong>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Recent Bookings Box */}
                <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-base text-white">Recent Booking Requests</h3>
                      <button
                        onClick={() => setActiveSection('bookings')}
                        className="text-xs text-amber-400 hover:underline font-bold"
                      >
                        View All ({bookings.length})
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {bookings.slice(0, 4).map(b => (
                        <div
                          key={b.referenceId}
                          onClick={() => setSelectedBooking(b)}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-xs font-bold text-amber-400">{b.referenceId}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${getStatusBadge(b.status)}`}>
                                {b.status}
                              </span>
                            </div>
                            <span className="text-xs text-white font-medium block mt-1">{b.name} • {b.phone}</span>
                            <span className="text-[11px] text-slate-400">{b.pickup} → {b.destination}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-600" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => setActiveSection('bookings')}
                      className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors"
                    >
                      Manage All Bookings
                    </button>
                  </div>
                </div>

                {/* Content Quick Access Box */}
                <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-white mb-4">Content Datasets</h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <button
                        onClick={() => setActiveSection('fleet')}
                        className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400 text-left transition-all group"
                      >
                        <Car className="w-5 h-5 text-amber-400 mb-2" />
                        <span className="font-bold text-white block group-hover:text-amber-400">Fleet Vehicles</span>
                        <span className="text-slate-400 text-[11px]">{fleet.length} total cars</span>
                      </button>

                      <button
                        onClick={() => setActiveSection('services')}
                        className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400 text-left transition-all group"
                      >
                        <Layers className="w-5 h-5 text-amber-400 mb-2" />
                        <span className="font-bold text-white block group-hover:text-amber-400">Service Types</span>
                        <span className="text-slate-400 text-[11px]">{services.length} services</span>
                      </button>

                      <button
                        onClick={() => setActiveSection('routes')}
                        className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400 text-left transition-all group"
                      >
                        <Navigation className="w-5 h-5 text-amber-400 mb-2" />
                        <span className="font-bold text-white block group-hover:text-amber-400">Travel Corridors</span>
                        <span className="text-slate-400 text-[11px]">{routes.length} routes</span>
                      </button>

                      <button
                        onClick={() => setActiveSection('locations')}
                        className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400 text-left transition-all group"
                      >
                        <MapPin className="w-5 h-5 text-amber-400 mb-2" />
                        <span className="font-bold text-white block group-hover:text-amber-400">Hub Locations</span>
                        <span className="text-slate-400 text-[11px]">{locations.length} locations</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-500">
                    All edits dynamically sync with the public website without touching source code.
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. BOOKINGS MANAGEMENT SECTION */}
          {/* ======================================================== */}
          {activeSection === 'bookings' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white">Booking Management</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Search by Reference ID (e.g. GT-MT7F7BMA), customer name, or phone number.
                  </p>
                </div>

                <button
                  onClick={loadBookings}
                  className="self-start sm:self-auto px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center space-x-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Filters Bar */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') loadBookings(); }}
                    placeholder="Search Reference ID, Customer, Phone..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-amber-400 outline-none"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-amber-400 outline-none"
                >
                  <option value="all">All Statuses ({stats.total})</option>
                  <option value="pending">Pending ({stats.pending})</option>
                  <option value="under_review">Under Review ({stats.under_review})</option>
                  <option value="confirmed">Confirmed ({stats.confirmed})</option>
                  <option value="completed">Completed ({stats.completed})</option>
                  <option value="cancelled">Cancelled ({stats.cancelled})</option>
                </select>

                {/* Date Filter */}
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-amber-400 outline-none"
                />
              </div>

              {/* Bookings Container (Mobile Cards + Desktop Table) */}
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-sm bg-slate-900 rounded-3xl border border-slate-800">
                    No bookings found matching the selected filters.
                  </div>
                ) : (
                  <>
                    {/* 1. Mobile & Tablet Card View (< lg screens) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
                      {bookings.map((booking) => (
                        <div
                          key={booking.referenceId}
                          className="bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-800 shadow-lg flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
                        >
                          {/* Card Header: Ref ID & Status */}
                          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ref ID:</span>
                              <button
                                onClick={() => copyToClipboard(booking.referenceId)}
                                className="font-mono text-xs sm:text-sm font-bold text-amber-400 flex items-center space-x-1 hover:underline py-1 px-1.5 rounded-md bg-slate-950 border border-slate-800"
                                title="Click to copy Reference ID"
                              >
                                <span>{booking.referenceId}</span>
                                {copiedId === booking.referenceId ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400 ml-1" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5 text-slate-400 ml-1" />
                                )}
                              </button>
                            </div>

                            <span className={`px-2.5 py-1 rounded-full border text-[10px] sm:text-xs font-black uppercase tracking-wider ${getStatusBadge(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>

                          {/* Customer & Trip Details */}
                          <div className="space-y-2.5 text-xs">
                            {/* Customer Name & Phone */}
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-[11px] text-slate-400 block font-medium">Customer:</span>
                                <span className="text-sm font-bold text-white block mt-0.5">{booking.name}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[11px] text-slate-400 block font-medium">Contact:</span>
                                <a
                                  href={`tel:${normalizeIndianPhone(booking.phone)}`}
                                  className="text-xs font-bold text-amber-400 hover:underline block mt-0.5"
                                >
                                  {booking.phone}
                                </a>
                              </div>
                            </div>

                            {/* Route */}
                            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Route & Service</span>
                              <span className="text-xs font-bold text-slate-100 block mt-0.5">
                                {booking.pickup} → {booking.destination}
                              </span>
                              <span className="text-[11px] text-amber-400 font-semibold block mt-0.5">
                                {booking.serviceType}
                              </span>
                            </div>

                            {/* Date, Time & Vehicle */}
                            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                              <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800/60">
                                <span className="text-slate-400 block text-[10px]">Date & Time:</span>
                                <span className="font-bold text-white">{booking.date}</span>
                                <span className="text-slate-400 ml-1 font-mono">({booking.time})</span>
                              </div>
                              <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800/60">
                                <span className="text-slate-400 block text-[10px]">Vehicle:</span>
                                <span className="font-bold text-white truncate block">{booking.vehicle}</span>
                              </div>
                            </div>
                          </div>

                          {/* 4 Large Touch-Friendly Mobile Action Buttons (Min 44px touch targets) */}
                          <div className="pt-3 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {/* WhatsApp */}
                            <a
                              href={generateAdminToCustomerWhatsAppUrl(booking)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="min-h-[44px] flex items-center justify-center px-3 py-2 rounded-xl text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-sm active:scale-95 space-x-1.5"
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare className="w-4 h-4 text-emerald-950 shrink-0" />
                              <span>WhatsApp</span>
                            </a>

                            {/* Call */}
                            <a
                              href={`tel:${normalizeIndianPhone(booking.phone)}`}
                              className="min-h-[44px] flex items-center justify-center px-3 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-sm active:scale-95 space-x-1.5"
                              title="Call Customer"
                            >
                              <PhoneCall className="w-4 h-4 text-slate-950 shrink-0" />
                              <span>Call</span>
                            </a>

                            {/* View Details */}
                            <button
                              onClick={() => setSelectedBooking(booking)}
                              className="min-h-[44px] flex items-center justify-center px-3 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-all active:scale-95 space-x-1.5"
                              title="View Full Booking Details"
                            >
                              <Eye className="w-4 h-4 text-slate-300 shrink-0" />
                              <span>Details</span>
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => setDeleteConfirm({
                                type: 'booking',
                                id: booking.referenceId || booking.id,
                                name: booking.name,
                                referenceId: booking.referenceId || booking.id,
                                customer: booking.name,
                                route: `${booking.pickup} → ${booking.destination}`,
                                date: booking.date
                              })}
                              className="min-h-[44px] flex items-center justify-center px-3 py-2 rounded-xl text-xs font-bold text-red-300 bg-red-950/70 hover:bg-red-900/80 border border-red-800/80 transition-all active:scale-95 space-x-1.5"
                              title="Delete Booking"
                            >
                              <Trash2 className="w-4 h-4 text-red-400 shrink-0" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 2. Desktop Table View (>= lg screens) */}
                    <div className="hidden lg:block bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 text-[10px]">
                            <tr>
                              <th className="py-4 px-4">Ref ID</th>
                              <th className="py-4 px-4">Customer</th>
                              <th className="py-4 px-4">Route</th>
                              <th className="py-4 px-4">Date & Time</th>
                              <th className="py-4 px-4">Vehicle</th>
                              <th className="py-4 px-4">Status</th>
                              <th className="py-4 px-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {bookings.map((booking) => (
                              <tr key={booking.referenceId} className="hover:bg-slate-800/40 transition-colors">
                                <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                                  <button
                                    onClick={() => copyToClipboard(booking.referenceId)}
                                    className="flex items-center space-x-1 hover:underline py-1 px-1.5 rounded-md hover:bg-slate-800/60"
                                    title="Click to copy Reference ID"
                                  >
                                    <span>{booking.referenceId}</span>
                                    {copiedId === booking.referenceId ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                                    )}
                                  </button>
                                </td>

                                <td className="py-3.5 px-4">
                                  <span className="font-bold text-white block">{booking.name}</span>
                                  <span className="text-slate-400 text-[11px]">{booking.phone}</span>
                                </td>

                                <td className="py-3.5 px-4">
                                  <span className="text-slate-200 block">{booking.pickup} → {booking.destination}</span>
                                  <span className="text-[10px] text-amber-500/90 font-medium">{booking.serviceType}</span>
                                </td>

                                <td className="py-3.5 px-4">
                                  <span className="text-slate-200 block font-medium">{booking.date}</span>
                                  <span className="text-[11px] text-slate-400">{booking.time}</span>
                                </td>

                                <td className="py-3.5 px-4 text-slate-300">
                                  {booking.vehicle}
                                </td>

                                <td className="py-3.5 px-4">
                                  <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold uppercase ${getStatusBadge(booking.status)}`}>
                                    {booking.status}
                                  </span>
                                </td>

                                <td className="py-3.5 px-4 text-right">
                                  <div className="inline-flex items-center space-x-2">
                                    <a
                                      href={generateAdminToCustomerWhatsAppUrl(booking)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-9 h-9 rounded-xl flex items-center justify-center text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/60 transition-all shadow-xs"
                                      title="WhatsApp Customer"
                                    >
                                      <MessageSquare className="w-4.5 h-4.5 text-emerald-400" />
                                    </a>

                                    <a
                                      href={`tel:${normalizeIndianPhone(booking.phone)}`}
                                      className="w-9 h-9 rounded-xl flex items-center justify-center text-amber-300 bg-amber-950/60 hover:bg-amber-900 border border-amber-700/60 transition-all shadow-xs"
                                      title="Call Customer"
                                    >
                                      <PhoneCall className="w-4.5 h-4.5 text-amber-400" />
                                    </a>

                                    <button
                                      onClick={() => setSelectedBooking(booking)}
                                      className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all shadow-xs"
                                      title="View Details"
                                    >
                                      <Eye className="w-4.5 h-4.5" />
                                    </button>

                                    {/* Visual Separator for Destructive Action */}
                                    <div className="w-[1px] h-4 bg-slate-700 mx-0.5" />

                                    <button
                                      onClick={() => setDeleteConfirm({
                                        type: 'booking',
                                        id: booking.referenceId || booking.id,
                                        name: booking.name,
                                        referenceId: booking.referenceId || booking.id,
                                        customer: booking.name,
                                        route: `${booking.pickup} → ${booking.destination}`,
                                        date: booking.date
                                      })}
                                      className="w-9 h-9 rounded-xl flex items-center justify-center text-red-400 hover:text-red-300 bg-red-950/50 hover:bg-red-900/60 border border-red-800/60 transition-all shadow-xs"
                                      title="Delete Booking"
                                    >
                                      <Trash2 className="w-4.5 h-4.5 text-red-400" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. FLEET MANAGEMENT SECTION */}
          {/* ======================================================== */}
          {activeSection === 'fleet' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white">Fleet Vehicle Management</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Add, edit, reorder, or toggle active status of chauffeur-driven fleet vehicles.
                  </p>
                </div>

                <button
                  onClick={() => setEditingItem({
                    type: 'fleet',
                    isNew: true,
                    data: {
                      name: '',
                      brand: 'Maruti Suzuki',
                      category: 'Sedan',
                      categoryLabel: 'Sedan',
                      capacity: '4 Passengers',
                      luggage: '2 Bags',
                      fuel: 'Petrol / CNG',
                      transmission: 'Manual',
                      image: '/images/fleet/dzire.webp',
                      tagline: '',
                      idealFor: '',
                      badge: '',
                      displayOrder: fleet.length + 1,
                      active: true
                    }
                  })}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all flex items-center space-x-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Vehicle</span>
                </button>
              </div>

              {/* Filter */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={fleetSearch}
                    onChange={(e) => setFleetSearch(e.target.value)}
                    placeholder="Search vehicle by name, brand, specs..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-amber-400 outline-none"
                  />
                </div>

                <select
                  value={fleetCategoryFilter}
                  onChange={(e) => setFleetCategoryFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-amber-400 outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="SUV">SUV</option>
                  <option value="MPV">MPV</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              {/* Grid Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fleet.map((vehicle) => (
                  <div 
                    key={vehicle.id}
                    className={`rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                      vehicle.active !== false
                        ? 'bg-slate-900 border-slate-800'
                        : 'bg-slate-900/50 border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-amber-400">
                          {vehicle.category} • Order #{vehicle.displayOrder}
                        </span>
                        <button
                          onClick={() => handleToggleStatus('fleet', vehicle.id, vehicle.active !== false)}
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border transition-all ${
                            vehicle.active !== false
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300'
                          }`}
                        >
                          {vehicle.active !== false ? 'Active' : 'Inactive'}
                        </button>
                      </div>

                      <div className="flex items-center space-x-3 my-3">
                        <img
                          src={vehicle.image}
                          alt={vehicle.name}
                          className="w-16 h-12 object-cover rounded-xl bg-slate-800 shrink-0"
                          onError={(e) => { e.target.src = '/images/fleet/dzire.webp'; }}
                        />
                        <div>
                          <h4 className="font-bold text-sm text-white">{vehicle.name}</h4>
                          <span className="text-xs text-slate-400">{vehicle.capacity} • {vehicle.fuel}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {vehicle.tagline || vehicle.idealFor}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <div className="text-[11px] text-slate-500">
                        {vehicle.transmission}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingItem({ type: 'fleet', isNew: false, data: { ...vehicle } })}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-amber-400 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all shadow-xs"
                          title="Edit Vehicle"
                        >
                          <Edit3 className="w-4 h-4 text-amber-400" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'fleet', id: vehicle.id, name: vehicle.name })}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-red-400 hover:text-red-300 bg-red-950/50 hover:bg-red-900/60 border border-red-800/60 transition-all shadow-xs"
                          title="Delete Vehicle"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 4. SERVICES MANAGEMENT SECTION */}
          {/* ======================================================== */}
          {activeSection === 'services' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white">Service Management</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage service offerings like Airport Transfers, Outstation, and Local Tours.
                  </p>
                </div>

                <button
                  onClick={() => setEditingItem({
                    type: 'services',
                    isNew: true,
                    data: {
                      name: '',
                      shortName: '',
                      category: 'Transfers',
                      badge: '24/7 Available',
                      icon: 'Plane',
                      description: '',
                      features: ['Meet & greet at doorstep', 'Punctual sanitized AC cab'],
                      popularFrom: '',
                      displayOrder: services.length + 1,
                      active: true
                    }
                  })}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all flex items-center space-x-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                      srv.active !== false ? 'bg-slate-900 border-slate-800' : 'bg-slate-900/50 border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-amber-400">
                          {srv.category} • Order #{srv.displayOrder}
                        </span>
                        <button
                          onClick={() => handleToggleStatus('services', srv.id, srv.active !== false)}
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border transition-all ${
                            srv.active !== false
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-slate-800 text-slate-500 border-slate-700'
                          }`}
                        >
                          {srv.active !== false ? 'Active' : 'Inactive'}
                        </button>
                      </div>

                      <h3 className="font-bold text-base text-white">{srv.name}</h3>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{srv.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">{srv.features?.length || 0} features listed</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingItem({ type: 'services', isNew: false, data: { ...srv, features: Array.isArray(srv.features) ? srv.features.join('\n') : srv.features } })}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-amber-400 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all shadow-xs"
                          title="Edit Service"
                        >
                          <Edit3 className="w-4 h-4 text-amber-400" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'services', id: srv.id, name: srv.name })}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-red-400 hover:text-red-300 bg-red-950/50 hover:bg-red-900/60 border border-red-800/60 transition-all shadow-xs"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 5. LOCATIONS MANAGEMENT SECTION */}
          {/* ======================================================== */}
          {activeSection === 'locations' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white">Operational Locations</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage pickup hubs, transit junctions, airports, and tourist destinations.
                  </p>
                </div>

                <button
                  onClick={() => setEditingItem({
                    type: 'locations',
                    isNew: true,
                    data: {
                      name: '',
                      state: 'Bihar',
                      type: 'City',
                      description: '',
                      displayOrder: locations.length + 1,
                      active: true
                    }
                  })}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all flex items-center space-x-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Location</span>
                </button>
              </div>

              {/* Filter */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={locationsSearch}
                    onChange={(e) => setLocationsSearch(e.target.value)}
                    placeholder="Search location by name, state..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-amber-400 outline-none"
                  />
                </div>

                <select
                  value={locationsTypeFilter}
                  onChange={(e) => setLocationsTypeFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-amber-400 outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="City">City</option>
                  <option value="Airport">Airport</option>
                  <option value="Railway Station">Railway Station</option>
                  <option value="Tourist Destination">Tourist Destination</option>
                  <option value="Border">Border</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Locations Content (Mobile Cards + Desktop Table) */}
              <div className="space-y-4">
                {/* 1. Mobile Cards (< md screens) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 md:hidden">
                  {locations.map((loc) => (
                    <div
                      key={loc.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                        loc.active !== false ? 'bg-slate-900 border-slate-800' : 'bg-slate-900/50 border-slate-800/60 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-amber-400">
                            #{loc.displayOrder} • {loc.type}
                          </span>
                          <button
                            onClick={() => handleToggleStatus('locations', loc.id, loc.active !== false)}
                            className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border transition-all ${
                              loc.active !== false
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-slate-800 text-slate-500 border-slate-700'
                            }`}
                          >
                            {loc.active !== false ? 'Active' : 'Inactive'}
                          </button>
                        </div>

                        <h3 className="font-bold text-sm text-white">{loc.name}</h3>
                        <span className="text-xs text-slate-400 block mt-0.5">{loc.state}</span>
                        {loc.description && (
                          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                            {loc.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setEditingItem({ type: 'locations', isNew: false, data: { ...loc } })}
                          className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:text-amber-400 hover:bg-slate-700 border border-slate-700 font-bold text-xs flex items-center space-x-1.5 transition-all"
                        >
                          <Edit3 className="w-4 h-4 text-amber-400" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'locations', id: loc.id, name: loc.name })}
                          className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-red-950/50 text-red-300 hover:bg-red-900/60 border border-red-800/60 font-bold text-xs flex items-center space-x-1.5 transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 2. Desktop Table (>= md screens) */}
                <div className="hidden md:block bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 text-[10px]">
                      <tr>
                        <th className="py-4 px-4">Order</th>
                        <th className="py-4 px-4">Location Name</th>
                        <th className="py-4 px-4">State / Region</th>
                        <th className="py-4 px-4">Type</th>
                        <th className="py-4 px-4">Description</th>
                        <th className="py-4 px-4">Status</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {locations.map((loc) => (
                        <tr key={loc.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-amber-400">#{loc.displayOrder}</td>
                          <td className="py-3.5 px-4 font-bold text-white">{loc.name}</td>
                          <td className="py-3.5 px-4 text-slate-300">{loc.state}</td>
                          <td className="py-3.5 px-4">
                            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                              {loc.type}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">{loc.description}</td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleStatus('locations', loc.id, loc.active !== false)}
                              className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border transition-all ${
                                loc.active !== false
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : 'bg-slate-800 text-slate-500 border-slate-700'
                              }`}
                            >
                              {loc.active !== false ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center space-x-2">
                              <button
                                onClick={() => setEditingItem({ type: 'locations', isNew: false, data: { ...loc } })}
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-amber-400 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all shadow-xs"
                                title="Edit Location"
                              >
                                <Edit3 className="w-4 h-4 text-amber-400" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm({ type: 'locations', id: loc.id, name: loc.name })}
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-red-400 hover:text-red-300 bg-red-950/50 hover:bg-red-900/60 border border-red-800/60 transition-all shadow-xs"
                                title="Delete Location"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 6. ROUTES MANAGEMENT SECTION */}
          {/* ======================================================== */}
          {activeSection === 'routes' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white">Routes & Travel Corridors</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage operational origin-to-destination corridors and outstation travel.
                  </p>
                </div>

                <button
                  onClick={() => setEditingItem({
                    type: 'routes',
                    isNew: true,
                    data: {
                      origin: '',
                      destination: '',
                      label: '',
                      category: 'bihar',
                      distance: '50 km',
                      time: '~1.5 hours',
                      type: 'Direct Route',
                      tagline: '',
                      description: '',
                      displayOrder: routes.length + 1,
                      active: true
                    }
                  })}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all flex items-center space-x-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Route</span>
                </button>
              </div>

              {/* Filters */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={routesSearch}
                    onChange={(e) => setRoutesSearch(e.target.value)}
                    placeholder="Search routes by origin, destination, tagline..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-amber-400 outline-none"
                  />
                </div>

                <select
                  value={routesCategoryFilter}
                  onChange={(e) => setRoutesCategoryFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-amber-400 outline-none"
                >
                  <option value="all">All Corridors</option>
                  <option value="bihar">Bihar Local</option>
                  <option value="hubs">Patna Airport & Railway Hubs</option>
                  <option value="outstation">Outstation & Interstate</option>
                  <option value="special">Nepal & Himalayan</option>
                </select>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {routes.map((rt) => (
                  <div
                    key={rt.id}
                    className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                      rt.active !== false ? 'bg-slate-900 border-slate-800' : 'bg-slate-900/50 border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-amber-400">
                          {rt.category} • #{rt.displayOrder}
                        </span>
                        <button
                          onClick={() => handleToggleStatus('routes', rt.id, rt.active !== false)}
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border transition-all ${
                            rt.active !== false
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-slate-800 text-slate-500 border-slate-700'
                          }`}
                        >
                          {rt.active !== false ? 'Active' : 'Inactive'}
                        </button>
                      </div>

                      <h3 className="font-bold text-sm text-white flex items-center my-2">
                        <span>{rt.origin}</span>
                        <ArrowRight className="w-3.5 h-3.5 mx-1.5 text-amber-400 shrink-0" />
                        <span>{rt.destination}</span>
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {rt.tagline || rt.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2 border-t border-slate-800">
                        <span>Dist: <strong className="text-white font-mono">{rt.distance}</strong></span>
                        <span>Time: <strong className="text-white font-mono">{rt.time}</strong></span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">{rt.type}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingItem({ type: 'routes', isNew: false, data: { ...rt } })}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-amber-400 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all shadow-xs"
                          title="Edit Route"
                        >
                          <Edit3 className="w-4 h-4 text-amber-400" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'routes', id: rt.id, name: rt.label || `${rt.origin} → ${rt.destination}` })}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-red-400 hover:text-red-300 bg-red-950/50 hover:bg-red-900/60 border border-red-800/60 transition-all shadow-xs"
                          title="Delete Route"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 7. DESTINATIONS MANAGEMENT SECTION */}
          {/* ======================================================== */}
          {activeSection === 'destinations' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white">Destination Management</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage destination highlights, coverage regions, and interstate travel spots.
                  </p>
                </div>

                <button
                  onClick={() => setEditingItem({
                    type: 'destinations',
                    isNew: true,
                    data: {
                      name: '',
                      region: 'Bihar Regional Network',
                      category: 'Bihar',
                      distance: '100 km',
                      type: 'City Destination',
                      highlight: '',
                      description: '',
                      displayOrder: destinations.length + 1,
                      active: true
                    }
                  })}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all flex items-center space-x-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Destination</span>
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {destinations.map((dest) => (
                  <div
                    key={dest.id}
                    className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                      dest.active !== false ? 'bg-slate-900 border-slate-800' : 'bg-slate-900/50 border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-amber-400">
                          {dest.region} • #{dest.displayOrder}
                        </span>
                        <button
                          onClick={() => handleToggleStatus('destinations', dest.id, dest.active !== false)}
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border transition-all ${
                            dest.active !== false
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-slate-800 text-slate-500 border-slate-700'
                          }`}
                        >
                          {dest.active !== false ? 'Active' : 'Inactive'}
                        </button>
                      </div>

                      <h3 className="font-bold text-base text-white my-1">{dest.name}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{dest.highlight || dest.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-mono">{dest.distance}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingItem({ type: 'destinations', isNew: false, data: { ...dest } })}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-amber-400 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all shadow-xs"
                          title="Edit Destination"
                        >
                          <Edit3 className="w-4 h-4 text-amber-400" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'destinations', id: dest.id, name: dest.name })}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-red-400 hover:text-red-300 bg-red-950/50 hover:bg-red-900/60 border border-red-800/60 transition-all shadow-xs"
                          title="Delete Destination"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: BOOKING DETAIL DRAWER */}
      {/* ======================================================== */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-800 text-white relative animate-fadeIn max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-mono font-bold text-amber-400">Reference ID:</span>
              <strong className="font-mono text-sm tracking-wider">{selectedBooking.referenceId}</strong>
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-2xl font-black text-white">{selectedBooking.name}</h2>
              <span className={`px-3 py-1 rounded-full border text-xs font-extrabold uppercase ${getStatusBadge(selectedBooking.status)}`}>
                {selectedBooking.status}
              </span>
            </div>

            <div className="space-y-4 my-6 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[11px]">Phone Number</span>
                  <a href={`tel:${selectedBooking.phone}`} className="font-bold text-amber-400 hover:underline">{selectedBooking.phone}</a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Email</span>
                  <span className="font-medium text-slate-300">{selectedBooking.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Pickup Location</span>
                  <span className="font-bold text-white">{selectedBooking.pickup}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Destination</span>
                  <span className="font-bold text-white">{selectedBooking.destination}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Date & Time</span>
                  <span className="font-medium text-slate-200">{selectedBooking.date} at {selectedBooking.time}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Vehicle Preference</span>
                  <span className="font-medium text-slate-200">{selectedBooking.vehicle}</span>
                </div>
              </div>

              {selectedBooking.specialInstructions && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Customer Instructions:</span>
                  <p className="text-slate-300 italic">{selectedBooking.specialInstructions}</p>
                </div>
              )}

              {selectedBooking.cancellationReason && (
                <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-200">
                  <span className="text-red-400 block text-[10px] uppercase font-bold mb-1">Cancellation Reason:</span>
                  <p>{selectedBooking.cancellationReason}</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleUpdateBookingStatus(selectedBooking.referenceId, 'confirmed')}
                  disabled={actionLoading || selectedBooking.status === 'confirmed'}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors disabled:opacity-40"
                >
                  ✓ Confirm Booking
                </button>

                <button
                  onClick={() => handleUpdateBookingStatus(selectedBooking.referenceId, 'under_review')}
                  disabled={actionLoading || selectedBooking.status === 'under_review'}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors disabled:opacity-40"
                >
                  Under Review
                </button>

                <button
                  onClick={() => handleUpdateBookingStatus(selectedBooking.referenceId, 'completed')}
                  disabled={actionLoading || selectedBooking.status === 'completed'}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors disabled:opacity-40"
                >
                  Mark Completed
                </button>

                <button
                  onClick={() => {
                    setCancelModalBooking(selectedBooking);
                  }}
                  disabled={actionLoading || selectedBooking.status === 'cancelled'}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-red-950 hover:bg-red-900 text-red-300 font-bold text-xs border border-red-800 transition-colors disabled:opacity-40"
                >
                  Cancel Booking
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={generateAdminToCustomerWhatsAppUrl(selectedBooking)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900 text-xs font-bold flex items-center justify-center space-x-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Customer</span>
                </a>
                <a
                  href={`tel:${normalizeIndianPhone(selectedBooking.phone)}`}
                  className="py-2.5 rounded-xl bg-slate-800 text-white hover:bg-slate-700 text-xs font-bold flex items-center justify-center space-x-1.5"
                >
                  <PhoneCall className="w-4 h-4 text-amber-400" />
                  <span>Call Customer</span>
                </a>
              </div>

              {/* Destructive Delete Button */}
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    const b = selectedBooking;
                    setDeleteConfirm({
                      type: 'booking',
                      id: b.referenceId || b.id,
                      name: b.name,
                      referenceId: b.referenceId || b.id,
                      customer: b.name,
                      route: `${b.pickup} → ${b.destination}`,
                      date: b.date
                    });
                  }}
                  className="w-full py-2.5 rounded-xl bg-red-950/30 hover:bg-red-950/70 text-red-400 border border-red-800/40 hover:border-red-700/60 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Booking</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: CANCEL BOOKING REASON */}
      {/* ======================================================== */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-800 text-white relative animate-fadeIn">
            <h3 className="text-lg font-bold text-white mb-2">Cancel Booking {cancelModalBooking.referenceId}</h3>
            <p className="text-xs text-slate-400 mb-4">Please provide a reason for cancellation:</p>
            <textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="e.g. Customer requested cancellation, Vehicle unavailable..."
              rows={3}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-amber-400 outline-none mb-4"
            />
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCancelModalBooking(null)}
                className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
              >
                Go Back
              </button>
              <button
                onClick={() => handleUpdateBookingStatus(cancelModalBooking.referenceId, 'cancelled', cancellationReason)}
                className="py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: ADD/EDIT CONTENT MODAL */}
      {/* ======================================================== */}
      {editingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3.5 sm:p-4">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-800 text-white relative animate-fadeIn max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingItem(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-white mb-1">
              {editingItem.isNew ? 'Add New' : 'Edit'} {editingItem.type.toUpperCase()}
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Structured data editor. Updates will instantly appear on the public website.
            </p>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              
              {/* FLEET FIELDS */}
              {editingItem.type === 'fleet' && (
                <>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Vehicle Name</label>
                    <input
                      type="text"
                      required
                      value={editingItem.data.name || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, name: e.target.value } })}
                      placeholder="e.g. Toyota Rumion"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Brand</label>
                      <input
                        type="text"
                        value={editingItem.data.brand || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, brand: e.target.value } })}
                        placeholder="e.g. Toyota"
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Category</label>
                      <select
                        value={editingItem.data.category || 'Sedan'}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, category: e.target.value, categoryLabel: e.target.value } })}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                      >
                        <option value="Sedan">Sedan</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="SUV">SUV</option>
                        <option value="MPV">MPV</option>
                        <option value="Premium">Premium</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Passenger Capacity</label>
                      <input
                        type="text"
                        value={editingItem.data.capacity || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, capacity: e.target.value } })}
                        placeholder="e.g. 6+1 Seats"
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Luggage Space</label>
                      <input
                        type="text"
                        value={editingItem.data.luggage || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, luggage: e.target.value } })}
                        placeholder="e.g. 3 Bags"
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Fuel Type</label>
                      <input
                        type="text"
                        value={editingItem.data.fuel || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, fuel: e.target.value } })}
                        placeholder="e.g. Petrol / CNG"
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Transmission</label>
                      <input
                        type="text"
                        value={editingItem.data.transmission || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, transmission: e.target.value } })}
                        placeholder="e.g. Manual / Automatic"
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Image Path / URL</label>
                    <input
                      type="text"
                      value={editingItem.data.image || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, image: e.target.value } })}
                      placeholder="e.g. /images/fleet/innova.webp or https://..."
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Tagline / Short Feature</label>
                    <input
                      type="text"
                      value={editingItem.data.tagline || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, tagline: e.target.value } })}
                      placeholder="e.g. Premium 7-seater for family highway journeys."
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Best Suited For</label>
                    <input
                      type="text"
                      value={editingItem.data.idealFor || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, idealFor: e.target.value } })}
                      placeholder="e.g. Outstation Tours, Patna Airport, Weddings"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Display Order</label>
                      <input
                        type="number"
                        value={editingItem.data.displayOrder || 1}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, displayOrder: parseInt(e.target.value) || 1 } })}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Badge (Optional)</label>
                      <input
                        type="text"
                        value={editingItem.data.badge || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, badge: e.target.value } })}
                        placeholder="e.g. New Addition"
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* SERVICES FIELDS */}
              {editingItem.type === 'services' && (
                <>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Service Full Name</label>
                    <input
                      type="text"
                      required
                      value={editingItem.data.name || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, name: e.target.value } })}
                      placeholder="e.g. Patna Airport Pickup / Drop"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Short Name</label>
                      <input
                        type="text"
                        value={editingItem.data.shortName || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, shortName: e.target.value } })}
                        placeholder="e.g. Airport Transfer"
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Category</label>
                      <input
                        type="text"
                        value={editingItem.data.category || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, category: e.target.value } })}
                        placeholder="e.g. Transfers / Outstation"
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Description</label>
                    <textarea
                      rows={3}
                      value={editingItem.data.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, description: e.target.value } })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Features List (One per line)</label>
                    <textarea
                      rows={3}
                      value={editingItem.data.features || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, features: e.target.value } })}
                      placeholder="24/7 flight timing coordination&#10;Meet & greet at terminal"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Display Order</label>
                      <input
                        type="number"
                        value={editingItem.data.displayOrder || 1}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, displayOrder: parseInt(e.target.value) || 1 } })}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Badge</label>
                      <input
                        type="text"
                        value={editingItem.data.badge || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, badge: e.target.value } })}
                        placeholder="e.g. 24/7 Available"
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* LOCATIONS FIELDS */}
              {editingItem.type === 'locations' && (
                <>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Location Name</label>
                    <input
                      type="text"
                      required
                      value={editingItem.data.name || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, name: e.target.value } })}
                      placeholder="e.g. Vaishali / Patna"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">State / Region</label>
                      <input
                        type="text"
                        value={editingItem.data.state || 'Bihar'}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, state: e.target.value } })}
                        placeholder="e.g. Bihar"
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Location Type</label>
                      <select
                        value={editingItem.data.type || 'City'}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, type: e.target.value } })}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                      >
                        <option value="City">City</option>
                        <option value="Airport">Airport</option>
                        <option value="Railway Station">Railway Station</option>
                        <option value="Tourist Destination">Tourist Destination</option>
                        <option value="Border">Border</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Description</label>
                    <textarea
                      rows={3}
                      value={editingItem.data.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, description: e.target.value } })}
                      placeholder="e.g. Primary Guru Travel operating headquarters and rapid dispatch hub"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Display Order</label>
                    <input
                      type="number"
                      value={editingItem.data.displayOrder || 1}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, displayOrder: parseInt(e.target.value) || 1 } })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                    />
                  </div>
                </>
              )}

              {/* ROUTES FIELDS */}
              {editingItem.type === 'routes' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">From (Origin)</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.origin || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, origin: e.target.value } })}
                        placeholder="e.g. Vaishali"
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">To (Destination)</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.destination || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, destination: e.target.value } })}
                        placeholder="e.g. Patna"
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Category</label>
                      <select
                        value={editingItem.data.category || 'bihar'}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, category: e.target.value } })}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                      >
                        <option value="bihar">Bihar Local</option>
                        <option value="hubs">Patna Hubs</option>
                        <option value="outstation">Outstation</option>
                        <option value="special">Nepal & Himalayan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Route Type</label>
                      <input
                        type="text"
                        value={editingItem.data.type || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, type: e.target.value } })}
                        placeholder="e.g. Commercial Corridor"
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Distance</label>
                      <input
                        type="text"
                        value={editingItem.data.distance || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, distance: e.target.value } })}
                        placeholder="e.g. 35 km"
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Travel Time</label>
                      <input
                        type="text"
                        value={editingItem.data.time || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, time: e.target.value } })}
                        placeholder="e.g. ~1 hour"
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Tagline</label>
                    <input
                      type="text"
                      value={editingItem.data.tagline || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, tagline: e.target.value } })}
                      placeholder="e.g. Fast 4-lane highway connect between Patna and north trade hub."
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Display Order</label>
                    <input
                      type="number"
                      value={editingItem.data.displayOrder || 1}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, displayOrder: parseInt(e.target.value) || 1 } })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                    />
                  </div>
                </>
              )}

              {/* DESTINATIONS FIELDS */}
              {editingItem.type === 'destinations' && (
                <>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Destination Name</label>
                    <input
                      type="text"
                      required
                      value={editingItem.data.name || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, name: e.target.value } })}
                      placeholder="e.g. Bodh Gaya / Kathmandu"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Region</label>
                      <input
                        type="text"
                        value={editingItem.data.region || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, region: e.target.value } })}
                        placeholder="e.g. Bihar Regional Network"
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Category</label>
                      <select
                        value={editingItem.data.category || 'Bihar'}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, category: e.target.value } })}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                      >
                        <option value="Bihar">Bihar</option>
                        <option value="Interstate">Interstate</option>
                        <option value="Nepal">Nepal</option>
                        <option value="Tourism">Tourism</option>
                        <option value="Pilgrimage">Pilgrimage</option>
                        <option value="Corporate">Corporate</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Distance</label>
                      <input
                        type="text"
                        value={editingItem.data.distance || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, distance: e.target.value } })}
                        placeholder="e.g. 135 km"
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Destination Type</label>
                      <input
                        type="text"
                        value={editingItem.data.type || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, type: e.target.value } })}
                        placeholder="e.g. Cultural & Airport Hub"
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Highlight / Description</label>
                    <textarea
                      rows={2}
                      value={editingItem.data.highlight || editingItem.data.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, highlight: e.target.value, description: e.target.value } })}
                      placeholder="e.g. Direct Airport & Mithila Connect"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Display Order</label>
                    <input
                      type="number"
                      value={editingItem.data.displayOrder || 1}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, displayOrder: parseInt(e.target.value) || 1 } })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-amber-400"
                    />
                  </div>
                </>
              )}

              {/* Submit Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Save & Publish'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: DELETE CONFIRMATION */}
      {/* ======================================================== */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-sm w-full p-6 border border-slate-800 text-white relative animate-fadeIn text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-950 text-red-400 border border-red-800/80 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              {deleteConfirm.type === 'booking' ? 'Delete Booking?' : 'Permanently Delete?'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Are you sure you want to permanently delete this {deleteConfirm.type === 'booking' ? 'booking' : 'item'}?
            </p>

            {deleteConfirm.type === 'booking' ? (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2.5 mb-4">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Reference ID:</span>
                  <strong className="font-mono text-amber-400">{deleteConfirm.referenceId}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Customer:</span>
                  <strong className="text-white">{deleteConfirm.customer}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Route:</span>
                  <span className="text-slate-200">{deleteConfirm.route}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Journey Date:</span>
                  <span className="text-slate-200">{deleteConfirm.date}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-300 font-bold mb-4">
                "{deleteConfirm.name}"
              </p>
            )}

            <p className="text-[11px] text-red-400 font-semibold mb-5">
              This action cannot be undone.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteItem}
                disabled={actionLoading}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs disabled:opacity-50 transition-colors"
              >
                {actionLoading ? 'Deleting...' : (deleteConfirm.type === 'booking' ? 'Delete Booking' : 'Yes, Delete')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
