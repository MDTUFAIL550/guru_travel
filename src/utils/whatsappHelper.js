import { getRouteServiceType } from './getRouteServiceType.js';

export const GURU_PHONE_PRIMARY = "918578811081";
export const GURU_PHONE_PRIMARY_DISPLAY = "+91 85788 11081";

export const GURU_PHONE_SECONDARY = "919693384849";
export const GURU_PHONE_SECONDARY_DISPLAY = "+91 96933 84849";

export const GURU_INSTAGRAM_URL = "https://www.instagram.com/gurutravel2026/";
export const REYAJ_INSTAGRAM_URL = "https://www.instagram.com/crazy__boy__reyaj_/";
export const GURU_EMAIL = "contact@gurutravel.in";
export const GURU_ADDRESS = "Vaishali District, Bihar, India (Primary Operating Hub)";
export const GURU_FOUNDERS = "Reyaj & Sujeet";

/**
 * Normalizes an Indian mobile number to clean 91XXXXXXXXXX format for wa.me / tel.
 */
export function normalizeIndianPhone(raw = "") {
  let digits = String(raw).replace(/[^0-9]/g, "");
  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  if (digits.length === 10) {
    return "91" + digits;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits;
  }
  return digits || "918578811081";
}

/**
 * Builds plain-text customer-to-Guru WhatsApp enquiry message with ZERO asterisks.
 */
export function buildWhatsAppMessage(booking = {}) {
  const effectivePickup = booking.pickup === 'Other' 
    ? (booking.customPickup || 'Other') 
    : (booking.pickup || 'Vaishali (Primary Hub)');

  const effectiveDestination = booking.destination === 'Other' 
    ? (booking.customDestination || 'Other') 
    : (booking.destination || 'Patna');

  const name = (booking.name || "Customer Enquiry").trim();
  const phone = (booking.phone || "N/A").trim();
  const serviceType = booking.serviceType || getRouteServiceType(effectivePickup, effectiveDestination);
  const date = booking.date || new Date().toISOString().split('T')[0];
  const time = booking.time || "10:00";
  const passengers = booking.passengers || "3-4";
  const vehicle = booking.vehicle || "Any Vehicle (Best Recommendation)";
  const tripType = booking.tripType || "One-Way";
  const specialInstructions = (booking.message || booking.specialInstructions || "").trim();
  const refId = booking.referenceId || booking.id || "";

  const lines = [
    '🚖 NEW BOOKING ENQUIRY - GURU TRAVEL',
    '',
    '---------------------------------',
    ''
  ];

  if (refId) {
    lines.push(`Reference ID: ${refId}`);
  }

  lines.push(
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Route / Service Type: ${serviceType}`,
    `Pickup Location: ${effectivePickup}`,
    `Destination: ${effectiveDestination}`,
    `Journey Date: ${date}`,
    `Pickup Time: ${time}`,
    `Passengers: ${passengers}`,
    `Vehicle Preference: ${vehicle}`,
    `Trip Type: ${tripType}`
  );

  if (specialInstructions) {
    lines.push(`Special Instructions: ${specialInstructions}`);
  }

  lines.push(
    '',
    '---------------------------------',
    '',
    'Please share pricing and confirm vehicle availability from Vaishali hub.'
  );

  return lines.join('\n');
}

/**
 * Generates the clean click-to-chat WhatsApp URL for customer enquiry.
 */
export function generateWhatsAppUrl(bookingData = {}) {
  const phone = "918578811081";

  if (!bookingData.name && !bookingData.serviceType && !bookingData.pickup && !bookingData.destination) {
    const defaultText = "Hello Guru Travel! I would like to inquire about booking a chauffeur-driven cab / travel service from Vaishali/Bihar.";
    return `https://wa.me/${phone}?text=${encodeURIComponent(defaultText)}`;
  }

  const message = buildWhatsAppMessage(bookingData);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}

/**
 * Builds plain-text admin-to-customer confirmation message.
 */
export function buildAdminConfirmationWhatsAppMessage(booking = {}) {
  const refId = booking.referenceId || booking.id || 'GT-CONFIRMED';
  const name = booking.name || 'Customer';
  const pickup = booking.pickup || 'Vaishali';
  const destination = booking.destination || 'Patna';
  const date = booking.date || '';
  const time = booking.time || '10:00';
  const vehicle = booking.vehicle || 'Standard Vehicle';
  const tripType = booking.tripType || 'One-Way';
  const passengers = booking.passengers || '3-4';

  const lines = [
    'GURU TRAVEL - BOOKING UPDATE',
    '',
    `Reference ID: ${refId}`,
    '',
    `Hello ${name},`,
    '',
    'Your booking request has been CONFIRMED.',
    '',
    `Route: ${pickup} → ${destination}`,
    `Date: ${date}`,
    `Time: ${time}`,
    `Vehicle: ${vehicle}`,
    `Trip Type: ${tripType}`,
    `Passengers: ${passengers}`,
    '',
    'Our team will share driver details and further instructions with you.',
    '',
    'Thank you for choosing Guru Travel.',
    '',
    'For assistance:',
    GURU_PHONE_PRIMARY_DISPLAY,
    GURU_PHONE_SECONDARY_DISPLAY
  ];

  return lines.join('\n');
}

/**
 * Generates admin WhatsApp click-to-chat URL targeting the customer's phone number.
 */
export function generateAdminToCustomerWhatsAppUrl(booking = {}) {
  const customerPhone = normalizeIndianPhone(booking.phone);
  const message = buildAdminConfirmationWhatsAppMessage(booking);
  return `https://wa.me/${customerPhone}?text=${encodeURIComponent(message)}`;
}
