import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');
const FLEET_FILE = path.join(DATA_DIR, 'fleet.json');
const SERVICES_FILE = path.join(DATA_DIR, 'services.json');
const LOCATIONS_FILE = path.join(DATA_DIR, 'locations.json');
const ROUTES_FILE = path.join(DATA_DIR, 'routes.json');
const DESTINATIONS_FILE = path.join(DATA_DIR, 'destinations.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadData(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    if (!raw || !raw.trim()) {
      return [];
    }
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
}

function saveData(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

function normalizeStatus(status) {
  if (!status) return 'pending';
  const s = String(status).toLowerCase().trim();
  if (s === 'pending_confirmation') return 'pending';
  if (['pending', 'under_review', 'confirmed', 'completed', 'cancelled'].includes(s)) {
    return s;
  }
  return 'pending';
}

function cleanPhone(p = '') {
  return String(p).replace(/[^0-9]/g, '');
}

export const db = {
  // ==========================================
  // 1. BOOKINGS MANAGEMENT
  // ==========================================
  getBookings: (filters = {}) => {
    const list = loadData(BOOKINGS_FILE);
    
    // Normalize existing records
    const normalized = list.map(b => ({
      referenceId: b.referenceId || b.id,
      id: b.id || b.referenceId,
      status: normalizeStatus(b.status),
      createdAt: b.createdAt || new Date().toISOString(),
      updatedAt: b.updatedAt || b.createdAt || new Date().toISOString(),
      name: b.name || '',
      phone: b.phone || '',
      email: b.email || '',
      serviceType: b.serviceType || 'Bihar Local / Nearby',
      pickup: b.pickup || 'Vaishali',
      destination: b.destination || 'Patna',
      date: b.date || '',
      time: b.time || '10:00',
      passengers: b.passengers || '3-4',
      vehicle: b.vehicle || 'Any Vehicle (Best Recommendation)',
      tripType: b.tripType || 'One-Way',
      specialInstructions: b.specialInstructions || b.message || '',
      rentalMode: b.rentalMode || 'With Driver',
      cancellationReason: b.cancellationReason || null
    }));

    // Calculate live statistics
    const todayStr = new Date().toISOString().split('T')[0];
    const stats = {
      total: normalized.length,
      pending: normalized.filter(b => b.status === 'pending').length,
      under_review: normalized.filter(b => b.status === 'under_review').length,
      confirmed: normalized.filter(b => b.status === 'confirmed').length,
      completed: normalized.filter(b => b.status === 'completed').length,
      cancelled: normalized.filter(b => b.status === 'cancelled').length,
      today: normalized.filter(b => b.date === todayStr || (b.createdAt && b.createdAt.startsWith(todayStr))).length
    };

    let filtered = normalized;

    if (filters.status && filters.status !== 'all') {
      const target = filters.status.toLowerCase().trim();
      filtered = filtered.filter(b => b.status === target);
    }

    if (filters.search) {
      const q = filters.search.trim().toLowerCase();
      const qDigits = cleanPhone(q);
      const isPhoneSearch = qDigits && qDigits.length >= 3 && /^[0-9+\-\s()]+$/.test(filters.search.trim());

      filtered = filtered.filter(b => {
        const refMatch = (b.referenceId || '').toLowerCase().includes(q) || (b.id || '').toLowerCase().includes(q);
        const nameMatch = (b.name || '').toLowerCase().includes(q);
        const phoneMatch = isPhoneSearch ? cleanPhone(b.phone).includes(qDigits) : false;
        return refMatch || nameMatch || phoneMatch;
      });
    }

    if (filters.date) {
      filtered = filtered.filter(b => b.date === filters.date);
    }

    return {
      total: filtered.length,
      bookings: filtered,
      stats
    };
  },

  getBookingByReference: (referenceId) => {
    if (!referenceId) return null;
    const normRef = String(referenceId).trim().toUpperCase();
    const list = loadData(BOOKINGS_FILE);
    const found = list.find(b => 
      (b.referenceId && String(b.referenceId).toUpperCase() === normRef) ||
      (b.id && String(b.id).toUpperCase() === normRef)
    );
    if (!found) return null;

    return {
      referenceId: found.referenceId || found.id,
      id: found.id || found.referenceId,
      status: normalizeStatus(found.status),
      createdAt: found.createdAt || new Date().toISOString(),
      updatedAt: found.updatedAt || found.createdAt || new Date().toISOString(),
      name: found.name || '',
      phone: found.phone || '',
      email: found.email || '',
      serviceType: found.serviceType || 'Bihar Local / Nearby',
      pickup: found.pickup || 'Vaishali',
      destination: found.destination || 'Patna',
      date: found.date || '',
      time: found.time || '10:00',
      passengers: found.passengers || '3-4',
      vehicle: found.vehicle || 'Any Vehicle (Best Recommendation)',
      tripType: found.tripType || 'One-Way',
      specialInstructions: found.specialInstructions || found.message || '',
      rentalMode: found.rentalMode || 'With Driver',
      cancellationReason: found.cancellationReason || null
    };
  },

  saveBooking: (booking) => {
    const list = loadData(BOOKINGS_FILE);
    const refId = 'GT-' + Date.now().toString(36).toUpperCase();
    const nowIso = new Date().toISOString();

    const newBooking = {
      referenceId: refId,
      id: refId,
      status: 'pending',
      createdAt: nowIso,
      updatedAt: nowIso,
      name: booking.name,
      phone: booking.phone,
      email: booking.email || null,
      serviceType: booking.serviceType,
      pickup: booking.pickup,
      destination: booking.destination,
      date: booking.date,
      time: booking.time,
      passengers: booking.passengers || '3-4',
      vehicle: booking.vehicle || 'Any Vehicle (Best Recommendation)',
      tripType: booking.tripType || 'One-Way',
      specialInstructions: booking.specialInstructions || booking.message || null,
      rentalMode: booking.rentalMode || 'With Driver',
      cancellationReason: null
    };

    list.unshift(newBooking);
    saveData(BOOKINGS_FILE, list);
    return newBooking;
  },

  updateBookingStatus: (referenceId, newStatus, reason = null) => {
    if (!referenceId) return null;
    const normRef = String(referenceId).trim().toUpperCase();
    const targetStatus = normalizeStatus(newStatus);
    const list = loadData(BOOKINGS_FILE);

    const index = list.findIndex(b => 
      (b.referenceId && String(b.referenceId).toUpperCase() === normRef) ||
      (b.id && String(b.id).toUpperCase() === normRef)
    );

    if (index === -1) return null;

    const current = list[index];
    const updated = {
      ...current,
      referenceId: current.referenceId || current.id,
      id: current.id || current.referenceId,
      status: targetStatus,
      updatedAt: new Date().toISOString(),
      cancellationReason: targetStatus === 'cancelled' ? (reason || current.cancellationReason || 'Cancelled by admin') : null
    };

    list[index] = updated;
    saveData(BOOKINGS_FILE, list);
    return updated;
  },

  trackBooking: (referenceId, phone) => {
    if (!referenceId || !phone) return null;
    const normRef = String(referenceId).trim().toUpperCase();
    const inputPhoneDigits = cleanPhone(phone);
    const list = loadData(BOOKINGS_FILE);

    const found = list.find(b => {
      const refMatch = (b.referenceId && String(b.referenceId).toUpperCase() === normRef) ||
                       (b.id && String(b.id).toUpperCase() === normRef);
      if (!refMatch) return false;
      const bPhoneDigits = cleanPhone(b.phone);
      return bPhoneDigits.endsWith(inputPhoneDigits) || inputPhoneDigits.endsWith(bPhoneDigits);
    });

    if (!found) return null;

    return {
      referenceId: found.referenceId || found.id,
      name: found.name,
      phone: found.phone,
      serviceType: found.serviceType,
      pickup: found.pickup,
      destination: found.destination,
      date: found.date,
      time: found.time,
      passengers: found.passengers,
      vehicle: found.vehicle,
      tripType: found.tripType,
      status: normalizeStatus(found.status),
      createdAt: found.createdAt,
      updatedAt: found.updatedAt
    };
  },

  deleteBooking: (referenceId) => {
    if (!referenceId) return false;
    const normRef = String(referenceId).trim().toUpperCase();
    let list = loadData(BOOKINGS_FILE);
    const initialLen = list.length;
    list = list.filter(b => 
      (b.referenceId && String(b.referenceId).toUpperCase() !== normRef) &&
      (b.id && String(b.id).toUpperCase() !== normRef)
    );
    if (list.length === initialLen) return false;
    saveData(BOOKINGS_FILE, list);
    return true;
  },

  // ==========================================
  // 2. FLEET MANAGEMENT
  // ==========================================
  getFleet: (filters = {}, includeInactive = false) => {
    let list = loadData(FLEET_FILE);
    if (!includeInactive) {
      list = list.filter(item => item.active !== false);
    }

    if (filters.category && filters.category !== 'all') {
      const cat = filters.category.toLowerCase();
      list = list.filter(item => (item.category || '').toLowerCase() === cat);
    }

    if (filters.search) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(item => 
        (item.name || '').toLowerCase().includes(q) ||
        (item.brand || '').toLowerCase().includes(q) ||
        (item.category || '').toLowerCase().includes(q) ||
        (item.idealFor || '').toLowerCase().includes(q)
      );
    }

    // Sort by displayOrder ascending
    list.sort((a, b) => (Number(a.displayOrder) || 999) - (Number(b.displayOrder) || 999));
    return list;
  },

  getVehicleById: (id) => {
    const list = loadData(FLEET_FILE);
    return list.find(item => item.id === id) || null;
  },

  saveVehicle: (vehicle) => {
    const list = loadData(FLEET_FILE);
    const id = vehicle.id || ('veh-' + Date.now().toString(36));
    
    const newVehicle = {
      id,
      name: String(vehicle.name || '').trim(),
      brand: String(vehicle.brand || (vehicle.name || '').split(' ')[0] || 'Maruti Suzuki').trim(),
      category: String(vehicle.category || 'Sedan').trim(),
      categoryLabel: String(vehicle.categoryLabel || vehicle.category || 'Sedan').trim(),
      image: String(vehicle.image || '/images/fleet/dzire.webp').trim(),
      tagline: String(vehicle.tagline || '').trim(),
      capacity: String(vehicle.capacity || '4 Passengers').trim(),
      luggage: String(vehicle.luggage || '2 Bags').trim(),
      transmission: String(vehicle.transmission || 'Manual').trim(),
      fuel: String(vehicle.fuel || 'Petrol').trim(),
      ac: vehicle.ac !== false,
      withDriver: vehicle.withDriver !== false,
      selfDrive: !!vehicle.selfDrive,
      idealFor: String(vehicle.idealFor || '').trim(),
      badge: String(vehicle.badge || '').trim(),
      active: vehicle.active !== false,
      displayOrder: Number(vehicle.displayOrder) || (list.length + 1)
    };

    list.push(newVehicle);
    saveData(FLEET_FILE, list);
    return newVehicle;
  },

  updateVehicle: (id, updates) => {
    const list = loadData(FLEET_FILE);
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) return null;

    const current = list[idx];
    const updated = {
      ...current,
      ...updates,
      id: current.id, // ID cannot be changed
      displayOrder: Number(updates.displayOrder) || current.displayOrder || (idx + 1)
    };

    list[idx] = updated;
    saveData(FLEET_FILE, list);
    return updated;
  },

  toggleVehicleStatus: (id, active) => {
    const list = loadData(FLEET_FILE);
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) return null;
    list[idx].active = active !== undefined ? !!active : !list[idx].active;
    saveData(FLEET_FILE, list);
    return list[idx];
  },

  deleteVehicle: (id) => {
    let list = loadData(FLEET_FILE);
    const initialLen = list.length;
    list = list.filter(item => item.id !== id);
    if (list.length === initialLen) return false;
    saveData(FLEET_FILE, list);
    return true;
  },

  // ==========================================
  // 3. SERVICES MANAGEMENT
  // ==========================================
  getServices: (filters = {}, includeInactive = false) => {
    let list = loadData(SERVICES_FILE);
    if (!includeInactive) {
      list = list.filter(item => item.active !== false);
    }
    if (filters.search) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(item => 
        (item.name || '').toLowerCase().includes(q) ||
        (item.shortName || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => (Number(a.displayOrder) || 999) - (Number(b.displayOrder) || 999));
    return list;
  },

  getServiceById: (id) => {
    const list = loadData(SERVICES_FILE);
    return list.find(item => item.id === id) || null;
  },

  saveService: (service) => {
    const list = loadData(SERVICES_FILE);
    const id = service.id || ('srv-' + Date.now().toString(36));

    const newService = {
      id,
      name: String(service.name || '').trim(),
      shortName: String(service.shortName || service.name || '').trim(),
      category: String(service.category || 'General').trim(),
      badge: String(service.badge || '').trim(),
      icon: String(service.icon || 'Car').trim(),
      description: String(service.description || '').trim(),
      features: Array.isArray(service.features) ? service.features : (service.features ? String(service.features).split('\n').map(s => s.trim()).filter(Boolean) : []),
      popularFrom: String(service.popularFrom || '').trim(),
      active: service.active !== false,
      displayOrder: Number(service.displayOrder) || (list.length + 1)
    };

    list.push(newService);
    saveData(SERVICES_FILE, list);
    return newService;
  },

  updateService: (id, updates) => {
    const list = loadData(SERVICES_FILE);
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) return null;

    const current = list[idx];
    const features = updates.features !== undefined 
      ? (Array.isArray(updates.features) ? updates.features : String(updates.features).split('\n').map(s => s.trim()).filter(Boolean))
      : current.features;

    const updated = {
      ...current,
      ...updates,
      id: current.id,
      features,
      displayOrder: Number(updates.displayOrder) || current.displayOrder || (idx + 1)
    };

    list[idx] = updated;
    saveData(SERVICES_FILE, list);
    return updated;
  },

  toggleServiceStatus: (id, active) => {
    const list = loadData(SERVICES_FILE);
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) return null;
    list[idx].active = active !== undefined ? !!active : !list[idx].active;
    saveData(SERVICES_FILE, list);
    return list[idx];
  },

  deleteService: (id) => {
    let list = loadData(SERVICES_FILE);
    const initialLen = list.length;
    list = list.filter(item => item.id !== id);
    if (list.length === initialLen) return false;
    saveData(SERVICES_FILE, list);
    return true;
  },

  // ==========================================
  // 4. LOCATIONS MANAGEMENT
  // ==========================================
  getLocations: (filters = {}, includeInactive = false) => {
    let list = loadData(LOCATIONS_FILE);
    if (!includeInactive) {
      list = list.filter(item => item.active !== false);
    }
    if (filters.type && filters.type !== 'all') {
      list = list.filter(item => (item.type || '').toLowerCase() === filters.type.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(item => 
        (item.name || '').toLowerCase().includes(q) ||
        (item.state || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => (Number(a.displayOrder) || 999) - (Number(b.displayOrder) || 999));
    return list;
  },

  getLocationById: (id) => {
    const list = loadData(LOCATIONS_FILE);
    return list.find(item => item.id === id) || null;
  },

  saveLocation: (location) => {
    const list = loadData(LOCATIONS_FILE);
    const id = location.id || ('loc-' + Date.now().toString(36));

    const newLoc = {
      id,
      name: String(location.name || '').trim(),
      state: String(location.state || 'Bihar').trim(),
      type: String(location.type || 'City').trim(),
      description: String(location.description || '').trim(),
      active: location.active !== false,
      displayOrder: Number(location.displayOrder) || (list.length + 1)
    };

    list.push(newLoc);
    saveData(LOCATIONS_FILE, list);
    return newLoc;
  },

  updateLocation: (id, updates) => {
    const list = loadData(LOCATIONS_FILE);
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) return null;

    const current = list[idx];
    const updated = {
      ...current,
      ...updates,
      id: current.id,
      displayOrder: Number(updates.displayOrder) || current.displayOrder || (idx + 1)
    };

    list[idx] = updated;
    saveData(LOCATIONS_FILE, list);
    return updated;
  },

  toggleLocationStatus: (id, active) => {
    const list = loadData(LOCATIONS_FILE);
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) return null;
    list[idx].active = active !== undefined ? !!active : !list[idx].active;
    saveData(LOCATIONS_FILE, list);
    return list[idx];
  },

  deleteLocation: (id) => {
    let list = loadData(LOCATIONS_FILE);
    const initialLen = list.length;
    list = list.filter(item => item.id !== id);
    if (list.length === initialLen) return false;
    saveData(LOCATIONS_FILE, list);
    return true;
  },

  // ==========================================
  // 5. ROUTES MANAGEMENT
  // ==========================================
  getRoutes: (filters = {}, includeInactive = false) => {
    let list = loadData(ROUTES_FILE);
    if (!includeInactive) {
      list = list.filter(item => item.active !== false);
    }
    if (filters.category && filters.category !== 'all') {
      list = list.filter(item => (item.category || '').toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(item => 
        (item.label || '').toLowerCase().includes(q) ||
        (item.origin || '').toLowerCase().includes(q) ||
        (item.destination || '').toLowerCase().includes(q) ||
        (item.type || '').toLowerCase().includes(q) ||
        (item.tagline || '').toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => (Number(a.displayOrder) || 999) - (Number(b.displayOrder) || 999));
    return list;
  },

  getRouteById: (id) => {
    const list = loadData(ROUTES_FILE);
    return list.find(item => item.id === id) || null;
  },

  saveRoute: (route) => {
    const list = loadData(ROUTES_FILE);
    const id = route.id || ('rt-' + Date.now().toString(36));

    const newRoute = {
      id,
      origin: String(route.origin || '').trim(),
      destination: String(route.destination || '').trim(),
      label: String(route.label || `${route.origin} → ${route.destination}`).trim(),
      category: String(route.category || 'bihar').trim(),
      distance: String(route.distance || '').trim(),
      time: String(route.time || '').trim(),
      type: String(route.type || 'Standard Route').trim(),
      tagline: String(route.tagline || '').trim(),
      description: String(route.description || route.tagline || '').trim(),
      active: route.active !== false,
      displayOrder: Number(route.displayOrder) || (list.length + 1)
    };

    list.push(newRoute);
    saveData(ROUTES_FILE, list);
    return newRoute;
  },

  updateRoute: (id, updates) => {
    const list = loadData(ROUTES_FILE);
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) return null;

    const current = list[idx];
    const updated = {
      ...current,
      ...updates,
      id: current.id,
      label: updates.label || (updates.origin && updates.destination ? `${updates.origin} → ${updates.destination}` : current.label),
      displayOrder: Number(updates.displayOrder) || current.displayOrder || (idx + 1)
    };

    list[idx] = updated;
    saveData(ROUTES_FILE, list);
    return updated;
  },

  toggleRouteStatus: (id, active) => {
    const list = loadData(ROUTES_FILE);
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) return null;
    list[idx].active = active !== undefined ? !!active : !list[idx].active;
    saveData(ROUTES_FILE, list);
    return list[idx];
  },

  deleteRoute: (id) => {
    let list = loadData(ROUTES_FILE);
    const initialLen = list.length;
    list = list.filter(item => item.id !== id);
    if (list.length === initialLen) return false;
    saveData(ROUTES_FILE, list);
    return true;
  },

  // ==========================================
  // 6. DESTINATIONS MANAGEMENT
  // ==========================================
  getDestinations: (filters = {}, includeInactive = false) => {
    let list = loadData(DESTINATIONS_FILE);
    if (!includeInactive) {
      list = list.filter(item => item.active !== false);
    }
    if (filters.category && filters.category !== 'all') {
      list = list.filter(item => (item.category || '').toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.region && filters.region !== 'all') {
      list = list.filter(item => (item.region || '').toLowerCase().includes(filters.region.toLowerCase()));
    }
    if (filters.search) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(item => 
        (item.name || '').toLowerCase().includes(q) ||
        (item.region || '').toLowerCase().includes(q) ||
        (item.type || '').toLowerCase().includes(q) ||
        (item.highlight || '').toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => (Number(a.displayOrder) || 999) - (Number(b.displayOrder) || 999));
    return list;
  },

  getDestinationById: (id) => {
    const list = loadData(DESTINATIONS_FILE);
    return list.find(item => item.id === id) || null;
  },

  saveDestination: (destination) => {
    const list = loadData(DESTINATIONS_FILE);
    const id = destination.id || ('dest-' + Date.now().toString(36));

    const newDest = {
      id,
      name: String(destination.name || '').trim(),
      region: String(destination.region || 'Bihar Regional Network').trim(),
      category: String(destination.category || 'Bihar').trim(),
      distance: String(destination.distance || '').trim(),
      type: String(destination.type || '').trim(),
      highlight: String(destination.highlight || '').trim(),
      description: String(destination.description || destination.highlight || '').trim(),
      image: String(destination.image || '').trim(),
      popular: destination.popular !== false,
      active: destination.active !== false,
      displayOrder: Number(destination.displayOrder) || (list.length + 1)
    };

    list.push(newDest);
    saveData(DESTINATIONS_FILE, list);
    return newDest;
  },

  updateDestination: (id, updates) => {
    const list = loadData(DESTINATIONS_FILE);
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) return null;

    const current = list[idx];
    const updated = {
      ...current,
      ...updates,
      id: current.id,
      displayOrder: Number(updates.displayOrder) || current.displayOrder || (idx + 1)
    };

    list[idx] = updated;
    saveData(DESTINATIONS_FILE, list);
    return updated;
  },

  toggleDestinationStatus: (id, active) => {
    const list = loadData(DESTINATIONS_FILE);
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1) return null;
    list[idx].active = active !== undefined ? !!active : !list[idx].active;
    saveData(DESTINATIONS_FILE, list);
    return list[idx];
  },

  deleteDestination: (id) => {
    let list = loadData(DESTINATIONS_FILE);
    const initialLen = list.length;
    list = list.filter(item => item.id !== id);
    if (list.length === initialLen) return false;
    saveData(DESTINATIONS_FILE, list);
    return true;
  },

  // ==========================================
  // 7. CONTACTS
  // ==========================================
  getContacts: () => loadData(CONTACTS_FILE),
  saveContact: (contact) => {
    const list = loadData(CONTACTS_FILE);
    const newContact = {
      id: 'ENQ-' + Date.now().toString(36).toUpperCase(),
      createdAt: new Date().toISOString(),
      ...contact
    };
    list.unshift(newContact);
    saveData(CONTACTS_FILE, list);
    return newContact;
  }
};
