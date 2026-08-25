export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const apiUrl = (endpoint) => {
  if (!API_BASE_URL) return endpoint;
  return `${API_BASE_URL}${endpoint}`;
};

const TOKEN_KEY = 'guru_travel_admin_token';
const USER_KEY = 'guru_travel_admin_user';

function getLocalBookings() {
  try {
    const raw = localStorage.getItem('guru_travel_bookings_cache');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalBookings(list) {
  try {
    localStorage.setItem('guru_travel_bookings_cache', JSON.stringify(list));
  } catch {}
}

async function apiRequest(endpoint, options = {}) {
  const token = adminAuth.getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const response = await fetch(apiUrl(endpoint), {
      ...options,
      headers
    });

    if (response.status === 401) {
      adminAuth.logout();
      return { unauthorized: true, error: 'Session expired. Please login again.' };
    }

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (response.ok) {
      return data || { success: true };
    }

    return {
      success: false,
      error: data?.error || `Request failed with status ${response.status}`
    };
  } catch (err) {
    console.warn(`Network error on ${endpoint}:`, err);
    return {
      success: false,
      error: 'Unable to connect to Guru Travel backend. Please try again.'
    };
  }
}

export const adminAuth = {
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  },

  getUser: () => {
    try {
      const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated: () => {
    return !!adminAuth.getToken();
  },

  login: async (username, password, remember = true) => {
    try {
      const response = await fetch(apiUrl('/api/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (response.ok && data?.success && data?.token) {
        const storage = remember ? localStorage : sessionStorage;

        storage.setItem(TOKEN_KEY, data.token);
        storage.setItem(
          USER_KEY,
          JSON.stringify(data.user || { username })
        );

        return {
          success: true,
          user: data.user
        };
      }

      if (response.status === 401 || response.status === 400) {
        return {
          success: false,
          error: data?.error || 'Invalid admin credentials.'
        };
      }

      return {
        success: false,
        error: data?.error || `Backend request failed (${response.status}).`
      };

    } catch (err) {
      console.warn(
        'Network error while connecting to Guru Travel backend:',
        err
      );

      return {
        success: false,
        error: 'Unable to connect to Guru Travel backend. Please try again.'
      };
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },

  getAuthHeaders: () => {
    const token = adminAuth.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  },

  // ==========================================
  // BOOKINGS
  // ==========================================
  getBookings: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.date) params.append('date', filters.date);

    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await apiRequest(`/api/admin/bookings${qs}`);

    if (res.success && Array.isArray(res.bookings)) {
      saveLocalBookings(res.bookings);
      return res;
    }

    if (res.unauthorized) return res;

    // Fallback to local client cache if backend is temporarily offline
    const list = getLocalBookings();
    let filtered = list;

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(b => (b.status || 'pending').toLowerCase() === filters.status.toLowerCase());
    }

    if (filters.search) {
      const q = filters.search.trim().toLowerCase();
      filtered = filtered.filter(b => 
        (b.referenceId || b.id || '').toLowerCase().includes(q) ||
        (b.name || '').toLowerCase().includes(q) ||
        (b.phone || '').includes(q)
      );
    }

    if (filters.date) {
      filtered = filtered.filter(b => b.date === filters.date);
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const stats = {
      total: list.length,
      pending: list.filter(b => (b.status || 'pending') === 'pending').length,
      under_review: list.filter(b => b.status === 'under_review').length,
      confirmed: list.filter(b => b.status === 'confirmed').length,
      completed: list.filter(b => b.status === 'completed').length,
      cancelled: list.filter(b => b.status === 'cancelled').length,
      today: list.filter(b => b.date === todayStr).length
    };

    return {
      success: true,
      total: filtered.length,
      stats,
      bookings: filtered
    };
  },

  getBooking: async (referenceId) => {
    if (!referenceId) return { success: false, error: 'Reference ID required' };
    return apiRequest(`/api/admin/bookings/${encodeURIComponent(referenceId)}`);
  },

  updateStatus: async (referenceId, status, reason = '') => {
    if (!referenceId) return { success: false, error: 'Reference ID required' };
    const res = await apiRequest(`/api/admin/bookings/${encodeURIComponent(referenceId)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason })
    });

    if (res.success && res.booking) {
      const list = getLocalBookings();
      const idx = list.findIndex(b => (b.referenceId || b.id || '').toUpperCase() === referenceId.toUpperCase());
      if (idx !== -1) {
        list[idx] = res.booking;
        saveLocalBookings(list);
      }
    }
    return res;
  },

  deleteBooking: async (referenceId) => {
    if (!referenceId) return { success: false, error: 'Reference ID required' };
    const res = await apiRequest(`/api/admin/bookings/${encodeURIComponent(referenceId)}`, {
      method: 'DELETE'
    });

    if (res.success) {
      const list = getLocalBookings();
      const filtered = list.filter(b => (b.referenceId || b.id || '').toUpperCase() !== referenceId.toUpperCase());
      saveLocalBookings(filtered);
    }
    return res;
  },

  // ==========================================
  // FLEET MANAGEMENT
  // ==========================================
  getFleet: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/api/admin/fleet${qs}`);
  },

  saveVehicle: async (vehicleData) => {
    return apiRequest('/api/admin/fleet', {
      method: 'POST',
      body: JSON.stringify(vehicleData)
    });
  },

  updateVehicle: async (id, vehicleData) => {
    return apiRequest(`/api/admin/fleet/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData)
    });
  },

  toggleVehicleStatus: async (id, active) => {
    return apiRequest(`/api/admin/fleet/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ active })
    });
  },

  deleteVehicle: async (id) => {
    return apiRequest(`/api/admin/fleet/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  // ==========================================
  // SERVICES MANAGEMENT
  // ==========================================
  getServices: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/api/admin/services${qs}`);
  },

  saveService: async (serviceData) => {
    return apiRequest('/api/admin/services', {
      method: 'POST',
      body: JSON.stringify(serviceData)
    });
  },

  updateService: async (id, serviceData) => {
    return apiRequest(`/api/admin/services/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData)
    });
  },

  toggleServiceStatus: async (id, active) => {
    return apiRequest(`/api/admin/services/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ active })
    });
  },

  deleteService: async (id) => {
    return apiRequest(`/api/admin/services/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  // ==========================================
  // LOCATIONS MANAGEMENT
  // ==========================================
  getLocations: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters.search) params.append('search', filters.search);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/api/admin/locations${qs}`);
  },

  saveLocation: async (locationData) => {
    return apiRequest('/api/admin/locations', {
      method: 'POST',
      body: JSON.stringify(locationData)
    });
  },

  updateLocation: async (id, locationData) => {
    return apiRequest(`/api/admin/locations/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(locationData)
    });
  },

  toggleLocationStatus: async (id, active) => {
    return apiRequest(`/api/admin/locations/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ active })
    });
  },

  deleteLocation: async (id) => {
    return apiRequest(`/api/admin/locations/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  // ==========================================
  // ROUTES MANAGEMENT
  // ==========================================
  getRoutes: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/api/admin/routes${qs}`);
  },

  saveRoute: async (routeData) => {
    return apiRequest('/api/admin/routes', {
      method: 'POST',
      body: JSON.stringify(routeData)
    });
  },

  updateRoute: async (id, routeData) => {
    return apiRequest(`/api/admin/routes/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(routeData)
    });
  },

  toggleRouteStatus: async (id, active) => {
    return apiRequest(`/api/admin/routes/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ active })
    });
  },

  deleteRoute: async (id) => {
    return apiRequest(`/api/admin/routes/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  // ==========================================
  // DESTINATIONS MANAGEMENT
  // ==========================================
  getDestinations: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/api/admin/destinations${qs}`);
  },

  saveDestination: async (destData) => {
    return apiRequest('/api/admin/destinations', {
      method: 'POST',
      body: JSON.stringify(destData)
    });
  },

  updateDestination: async (id, destData) => {
    return apiRequest(`/api/admin/destinations/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(destData)
    });
  },

  toggleDestinationStatus: async (id, active) => {
    return apiRequest(`/api/admin/destinations/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ active })
    });
  },

  deleteDestination: async (id) => {
    return apiRequest(`/api/admin/destinations/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  }
};
