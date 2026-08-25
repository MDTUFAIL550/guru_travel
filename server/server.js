import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import { db } from './db.js';
import { requireAdminAuth, JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ==========================================
// 1. PUBLIC HEALTH & CONTACT ENDPOINTS
// ==========================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Guru Travel API',
    business: 'Guru Travel - Vaishali, Bihar',
    tagline: 'Your Journey, Our Responsibility.',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/contact', (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body || {};

    if (!name || !phone || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, Phone, and Message are required fields.'
      });
    }

    const contact = db.saveContact({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : null,
      subject: subject || 'General Enquiry',
      message: message.trim()
    });

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully! Our team will get back to you shortly.',
      contact
    });
  } catch (err) {
    console.error('Contact save error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to send message.'
    });
  }
});

// ==========================================
// 2. PUBLIC CONTENT APIS (Active items only)
// ==========================================

app.get('/api/fleet', (req, res) => {
  try {
    const fleet = db.getFleet(req.query, false);
    return res.json({ success: true, fleet });
  } catch (err) {
    console.error('Public fleet error:', err);
    return res.status(500).json({ success: false, error: 'Failed to load fleet.' });
  }
});

app.get('/api/services', (req, res) => {
  try {
    const services = db.getServices(req.query, false);
    return res.json({ success: true, services });
  } catch (err) {
    console.error('Public services error:', err);
    return res.status(500).json({ success: false, error: 'Failed to load services.' });
  }
});

app.get('/api/locations', (req, res) => {
  try {
    const locations = db.getLocations(req.query, false);
    return res.json({ success: true, locations });
  } catch (err) {
    console.error('Public locations error:', err);
    return res.status(500).json({ success: false, error: 'Failed to load locations.' });
  }
});

app.get('/api/routes', (req, res) => {
  try {
    const routes = db.getRoutes(req.query, false);
    return res.json({ success: true, routes });
  } catch (err) {
    console.error('Public routes error:', err);
    return res.status(500).json({ success: false, error: 'Failed to load routes.' });
  }
});

app.get('/api/destinations', (req, res) => {
  try {
    const destinations = db.getDestinations(req.query, false);
    return res.json({ success: true, destinations });
  } catch (err) {
    console.error('Public destinations error:', err);
    return res.status(500).json({ success: false, error: 'Failed to load destinations.' });
  }
});

// ==========================================
// 3. PUBLIC CUSTOMER BOOKING FLOW
// ==========================================

app.post('/api/bookings', (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      serviceType,
      pickup,
      destination,
      date,
      time,
      passengers,
      vehicle,
      tripType,
      message,
      specialInstructions,
      rentalMode = 'With Driver'
    } = req.body || {};

    const errors = [];
    if (!name || !name.trim()) errors.push('Customer Name is required');
    if (!phone || !phone.trim()) errors.push('Phone Number is required');
    if (!serviceType || !serviceType.trim()) errors.push('Service Type is required');
    if (!pickup || !pickup.trim()) errors.push('Pickup / Origin location is required');
    if (!destination || !destination.trim()) errors.push('Destination is required');
    if (!date || !date.trim()) errors.push('Journey Date is required');
    if (!time || !time.trim()) errors.push('Pickup Time is required');

    if (rentalMode === 'Without Driver' || rentalMode === 'Self-Drive') {
      return res.status(400).json({
        success: false,
        error: 'Self-drive is coming soon. Chauffeur-driven bookings are active.'
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }

    const booking = db.saveBooking({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : null,
      serviceType: serviceType.trim(),
      pickup: pickup.trim(),
      destination: destination.trim(),
      date: date.trim(),
      time: time.trim(),
      passengers: passengers || '3-4',
      vehicle: vehicle || 'Any Vehicle (Best Recommendation)',
      tripType: tripType || 'One-Way',
      specialInstructions: (specialInstructions || message || '').trim() || null,
      rentalMode: 'With Driver'
    });

    return res.status(201).json({
      success: true,
      message: 'Booking enquiry submitted successfully! Guru Travel will contact you shortly.',
      booking
    });
  } catch (err) {
    console.error('Booking save error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to process booking request. Please try contacting via WhatsApp or Phone directly.'
    });
  }
});

app.post('/api/bookings/track', (req, res) => {
  try {
    const { referenceId, phone } = req.body || {};

    if (!referenceId || !referenceId.trim() || !phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Both Reference ID and registered Phone Number are required to track a booking.'
      });
    }

    const booking = db.trackBooking(referenceId, phone);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'No matching booking found. Please verify the Reference ID and Phone Number.'
      });
    }

    return res.json({
      success: true,
      booking
    });
  } catch (err) {
    console.error('Track booking error:', err);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred while looking up the booking.'
    });
  }
});

// ==========================================
// 4. ADMIN AUTHENTICATION
// ==========================================

app.post('/api/admin/login', (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required.'
      });
    }

    if (String(username).trim() !== ADMIN_USERNAME || String(password) !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        error: 'Invalid admin credentials.'
      });
    }

    const token = jwt.sign(
      {
        username: ADMIN_USERNAME,
        role: 'admin'
      },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    return res.json({
      success: true,
      message: 'Admin login successful.',
      token,
      user: {
        username: ADMIN_USERNAME,
        role: 'admin'
      }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred during login.'
    });
  }
});

// ==========================================
// 5. ADMIN BOOKINGS APIS
// ==========================================

app.get('/api/admin/bookings', requireAdminAuth, (req, res) => {
  try {
    const { status, search, date } = req.query;

    const result = db.getBookings({
      status: status || 'all',
      search: search || '',
      date: date || ''
    });

    return res.json({
      success: true,
      total: result.total,
      stats: result.stats,
      bookings: result.bookings
    });
  } catch (err) {
    console.error('Admin get bookings error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve bookings.'
    });
  }
});

app.get('/api/admin/bookings/:referenceId', requireAdminAuth, (req, res) => {
  try {
    const { referenceId } = req.params;
    const booking = db.getBookingByReference(referenceId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: `Booking ${referenceId} not found.`
      });
    }

    return res.json({
      success: true,
      booking
    });
  } catch (err) {
    console.error('Admin get single booking error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve booking.'
    });
  }
});

app.patch('/api/admin/bookings/:referenceId/status', requireAdminAuth, (req, res) => {
  try {
    const { referenceId } = req.params;
    const { status, reason } = req.body || {};

    const validStatuses = ['pending', 'under_review', 'confirmed', 'completed', 'cancelled'];

    if (!status || !validStatuses.includes(String(status).toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const currentBooking = db.getBookingByReference(referenceId);
    if (!currentBooking) {
      return res.status(404).json({
        success: false,
        error: `Booking ${referenceId} not found.`
      });
    }

    const updatedBooking = db.updateBookingStatus(referenceId, status, reason);

    return res.json({
      success: true,
      message: `Booking ${referenceId} status updated to ${status}.`,
      booking: updatedBooking
    });
  } catch (err) {
    console.error('Admin update status error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update booking status.'
    });
  }
});

// Admin Delete Single Booking (Protected)
app.delete('/api/admin/bookings/:referenceId', requireAdminAuth, (req, res) => {
  try {
    const { referenceId } = req.params;
    const deleted = db.deleteBooking(referenceId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: `Booking ${referenceId} not found.`
      });
    }
    return res.json({
      success: true,
      message: `Booking ${referenceId} permanently deleted.`
    });
  } catch (err) {
    console.error('Admin delete booking error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete booking.'
    });
  }
});

// ==========================================
// 6. ADMIN FLEET MANAGEMENT APIS
// ==========================================

app.get('/api/admin/fleet', requireAdminAuth, (req, res) => {
  try {
    const fleet = db.getFleet(req.query, true);
    return res.json({ success: true, fleet });
  } catch (err) {
    console.error('Admin get fleet error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve fleet.' });
  }
});

app.post('/api/admin/fleet', requireAdminAuth, (req, res) => {
  try {
    const { name } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Vehicle name is required.' });
    }
    const vehicle = db.saveVehicle(req.body);
    return res.status(201).json({ success: true, message: 'Vehicle added successfully.', vehicle });
  } catch (err) {
    console.error('Admin add vehicle error:', err);
    return res.status(500).json({ success: false, error: 'Failed to add vehicle.' });
  }
});

app.put('/api/admin/fleet/:id', requireAdminAuth, (req, res) => {
  try {
    const updated = db.updateVehicle(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Vehicle not found.' });
    }
    return res.json({ success: true, message: 'Vehicle updated successfully.', vehicle: updated });
  } catch (err) {
    console.error('Admin update vehicle error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update vehicle.' });
  }
});

app.patch('/api/admin/fleet/:id/status', requireAdminAuth, (req, res) => {
  try {
    const updated = db.toggleVehicleStatus(req.params.id, req.body.active);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Vehicle not found.' });
    }
    return res.json({ success: true, message: `Vehicle ${updated.active ? 'activated' : 'deactivated'}.`, vehicle: updated });
  } catch (err) {
    console.error('Admin toggle vehicle error:', err);
    return res.status(500).json({ success: false, error: 'Failed to toggle vehicle status.' });
  }
});

app.delete('/api/admin/fleet/:id', requireAdminAuth, (req, res) => {
  try {
    const deleted = db.deleteVehicle(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Vehicle not found.' });
    }
    return res.json({ success: true, message: 'Vehicle deleted permanently.' });
  } catch (err) {
    console.error('Admin delete vehicle error:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete vehicle.' });
  }
});

// ==========================================
// 7. ADMIN SERVICES MANAGEMENT APIS
// ==========================================

app.get('/api/admin/services', requireAdminAuth, (req, res) => {
  try {
    const services = db.getServices(req.query, true);
    return res.json({ success: true, services });
  } catch (err) {
    console.error('Admin get services error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve services.' });
  }
});

app.post('/api/admin/services', requireAdminAuth, (req, res) => {
  try {
    const { name } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Service name is required.' });
    }
    const service = db.saveService(req.body);
    return res.status(201).json({ success: true, message: 'Service added successfully.', service });
  } catch (err) {
    console.error('Admin add service error:', err);
    return res.status(500).json({ success: false, error: 'Failed to add service.' });
  }
});

app.put('/api/admin/services/:id', requireAdminAuth, (req, res) => {
  try {
    const updated = db.updateService(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Service not found.' });
    }
    return res.json({ success: true, message: 'Service updated successfully.', service: updated });
  } catch (err) {
    console.error('Admin update service error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update service.' });
  }
});

app.patch('/api/admin/services/:id/status', requireAdminAuth, (req, res) => {
  try {
    const updated = db.toggleServiceStatus(req.params.id, req.body.active);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Service not found.' });
    }
    return res.json({ success: true, message: `Service ${updated.active ? 'activated' : 'deactivated'}.`, service: updated });
  } catch (err) {
    console.error('Admin toggle service error:', err);
    return res.status(500).json({ success: false, error: 'Failed to toggle service status.' });
  }
});

app.delete('/api/admin/services/:id', requireAdminAuth, (req, res) => {
  try {
    const deleted = db.deleteService(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Service not found.' });
    }
    return res.json({ success: true, message: 'Service deleted permanently.' });
  } catch (err) {
    console.error('Admin delete service error:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete service.' });
  }
});

// ==========================================
// 8. ADMIN LOCATIONS MANAGEMENT APIS
// ==========================================

app.get('/api/admin/locations', requireAdminAuth, (req, res) => {
  try {
    const locations = db.getLocations(req.query, true);
    return res.json({ success: true, locations });
  } catch (err) {
    console.error('Admin get locations error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve locations.' });
  }
});

app.post('/api/admin/locations', requireAdminAuth, (req, res) => {
  try {
    const { name } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Location name is required.' });
    }
    const location = db.saveLocation(req.body);
    return res.status(201).json({ success: true, message: 'Location added successfully.', location });
  } catch (err) {
    console.error('Admin add location error:', err);
    return res.status(500).json({ success: false, error: 'Failed to add location.' });
  }
});

app.put('/api/admin/locations/:id', requireAdminAuth, (req, res) => {
  try {
    const updated = db.updateLocation(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Location not found.' });
    }
    return res.json({ success: true, message: 'Location updated successfully.', location: updated });
  } catch (err) {
    console.error('Admin update location error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update location.' });
  }
});

app.patch('/api/admin/locations/:id/status', requireAdminAuth, (req, res) => {
  try {
    const updated = db.toggleLocationStatus(req.params.id, req.body.active);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Location not found.' });
    }
    return res.json({ success: true, message: `Location ${updated.active ? 'activated' : 'deactivated'}.`, location: updated });
  } catch (err) {
    console.error('Admin toggle location error:', err);
    return res.status(500).json({ success: false, error: 'Failed to toggle location status.' });
  }
});

app.delete('/api/admin/locations/:id', requireAdminAuth, (req, res) => {
  try {
    const deleted = db.deleteLocation(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Location not found.' });
    }
    return res.json({ success: true, message: 'Location deleted permanently.' });
  } catch (err) {
    console.error('Admin delete location error:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete location.' });
  }
});

// ==========================================
// 9. ADMIN ROUTES MANAGEMENT APIS
// ==========================================

app.get('/api/admin/routes', requireAdminAuth, (req, res) => {
  try {
    const routes = db.getRoutes(req.query, true);
    return res.json({ success: true, routes });
  } catch (err) {
    console.error('Admin get routes error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve routes.' });
  }
});

app.post('/api/admin/routes', requireAdminAuth, (req, res) => {
  try {
    const { origin, destination } = req.body || {};
    if (!origin || !destination) {
      return res.status(400).json({ success: false, error: 'Both Origin (From) and Destination (To) are required.' });
    }
    const route = db.saveRoute(req.body);
    return res.status(201).json({ success: true, message: 'Route added successfully.', route });
  } catch (err) {
    console.error('Admin add route error:', err);
    return res.status(500).json({ success: false, error: 'Failed to add route.' });
  }
});

app.put('/api/admin/routes/:id', requireAdminAuth, (req, res) => {
  try {
    const updated = db.updateRoute(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Route not found.' });
    }
    return res.json({ success: true, message: 'Route updated successfully.', route: updated });
  } catch (err) {
    console.error('Admin update route error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update route.' });
  }
});

app.patch('/api/admin/routes/:id/status', requireAdminAuth, (req, res) => {
  try {
    const updated = db.toggleRouteStatus(req.params.id, req.body.active);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Route not found.' });
    }
    return res.json({ success: true, message: `Route ${updated.active ? 'activated' : 'deactivated'}.`, route: updated });
  } catch (err) {
    console.error('Admin toggle route error:', err);
    return res.status(500).json({ success: false, error: 'Failed to toggle route status.' });
  }
});

app.delete('/api/admin/routes/:id', requireAdminAuth, (req, res) => {
  try {
    const deleted = db.deleteRoute(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Route not found.' });
    }
    return res.json({ success: true, message: 'Route deleted permanently.' });
  } catch (err) {
    console.error('Admin delete route error:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete route.' });
  }
});

// ==========================================
// 10. ADMIN DESTINATIONS MANAGEMENT APIS
// ==========================================

app.get('/api/admin/destinations', requireAdminAuth, (req, res) => {
  try {
    const destinations = db.getDestinations(req.query, true);
    return res.json({ success: true, destinations });
  } catch (err) {
    console.error('Admin get destinations error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve destinations.' });
  }
});

app.post('/api/admin/destinations', requireAdminAuth, (req, res) => {
  try {
    const { name } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Destination name is required.' });
    }
    const destination = db.saveDestination(req.body);
    return res.status(201).json({ success: true, message: 'Destination added successfully.', destination });
  } catch (err) {
    console.error('Admin add destination error:', err);
    return res.status(500).json({ success: false, error: 'Failed to add destination.' });
  }
});

app.put('/api/admin/destinations/:id', requireAdminAuth, (req, res) => {
  try {
    const updated = db.updateDestination(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Destination not found.' });
    }
    return res.json({ success: true, message: 'Destination updated successfully.', destination: updated });
  } catch (err) {
    console.error('Admin update destination error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update destination.' });
  }
});

app.patch('/api/admin/destinations/:id/status', requireAdminAuth, (req, res) => {
  try {
    const updated = db.toggleDestinationStatus(req.params.id, req.body.active);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Destination not found.' });
    }
    return res.json({ success: true, message: `Destination ${updated.active ? 'activated' : 'deactivated'}.`, destination: updated });
  } catch (err) {
    console.error('Admin toggle destination error:', err);
    return res.status(500).json({ success: false, error: 'Failed to toggle destination status.' });
  }
});

app.delete('/api/admin/destinations/:id', requireAdminAuth, (req, res) => {
  try {
    const deleted = db.deleteDestination(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Destination not found.' });
    }
    return res.json({ success: true, message: 'Destination deleted permanently.' });
  } catch (err) {
    console.error('Admin delete destination error:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete destination.' });
  }
});

// ==========================================
// 11. STATIC SPA SERVING
// ==========================================

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Guru Travel API & Admin Server running on http://localhost:${PORT}`);
});
