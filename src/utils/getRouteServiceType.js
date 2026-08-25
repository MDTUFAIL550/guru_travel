/**
 * Centralized Route & Service Type Classifier for Guru Travel
 * Dynamically determines the service classification based on pickup and destination.
 */

export function getRouteServiceType(pickup = "", destination = "") {
  const p = (pickup || "").toLowerCase().trim();
  const d = (destination || "").toLowerCase().trim();

  // If both empty
  if (!p && !d) {
    return "Bihar Local / Nearby";
  }

  // 1. AIRPORT TRANSFER (Priority 1)
  // If pickup OR destination contains Patna Airport
  const isAirport = (loc) => loc.includes("airport") || loc.includes("(pat)") || loc.includes("patna airport");
  if (isAirport(p) || isAirport(d)) {
    return "Airport Transfer";
  }

  // 2. RAILWAY TRANSFER (Priority 2)
  // If pickup OR destination contains Patna Railway Station or Danapur Railway Station
  const isRailway = (loc) => loc.includes("railway") || loc.includes("danapur railway") || loc.includes("station");
  if (isRailway(p) || isRailway(d)) {
    return "Railway Transfer";
  }

  // 3. NEPAL / SPECIAL LONG-DISTANCE (Priority 3)
  const isSpecialTour = (loc) => 
    loc.includes("nepal") || 
    loc.includes("kathmandu") || 
    loc.includes("pokhara") || 
    loc.includes("lumbini") || 
    loc.includes("janakpur") || 
    loc.includes("darjeeling") || 
    loc.includes("gangtok") || 
    loc.includes("sikkim");

  if (isSpecialTour(p) || isSpecialTour(d)) {
    return "Special / Long-Distance Tour";
  }

  // 4. OUTSTATION / LONG TOUR (Priority 4)
  const isOutstation = (loc) => 
    loc.includes("delhi") || 
    loc.includes("kolkata") || 
    loc.includes("mumbai") || 
    loc.includes("pune") || 
    loc.includes("ranchi") || 
    loc.includes("uttar pradesh") || 
    loc.includes("up") || 
    loc.includes("varanasi") || 
    loc.includes("ayodhya") || 
    loc.includes("lucknow") || 
    loc.includes("gorakhpur") || 
    loc.includes("jharkhand") || 
    loc.includes("deoghar") || 
    loc.includes("dhanbad") ||
    loc.includes("wb") ||
    loc.includes("ncr");

  if (isOutstation(p) || isOutstation(d)) {
    return "Outstation / Long Tour";
  }

  // Helper city matchers
  const hasVaishali = p.includes("vaishali") || d.includes("vaishali");
  const hasMuzaffarpur = p.includes("muzaffarpur") || d.includes("muzaffarpur");
  const hasDarbhanga = p.includes("darbhanga") || d.includes("darbhanga");
  const hasBegusarai = p.includes("begusarai") || d.includes("begusarai");
  const hasHajipur = p.includes("hajipur") || d.includes("hajipur");
  const hasPatna = p.includes("patna") || d.includes("patna");

  // 5. MITHILA CORRIDOR (Priority 5)
  // Dedicated routes between Vaishali, Muzaffarpur, Darbhanga, Begusarai, Hajipur->Darbhanga
  // (Excluding Patna connections which are standard Bihar Local)
  const isMithilaPair = 
    (hasVaishali && hasDarbhanga) ||
    (hasVaishali && hasMuzaffarpur && !hasPatna) ||
    (hasMuzaffarpur && hasDarbhanga) ||
    (hasMuzaffarpur && hasBegusarai) ||
    (hasBegusarai && hasVaishali) ||
    (hasHajipur && hasDarbhanga);

  if (isMithilaPair) {
    return "Mithila Corridor";
  }

  // 6. BIHAR LOCAL / NEARBY (Priority 6)
  const biharLocalCities = [
    "vaishali", "patna", "hajipur", "muzaffarpur", "darbhanga", 
    "begusarai", "lalganj", "chhapra", "biharsarif", "samastipur", 
    "sitamarhi", "siwan", "gaya", "bodh gaya", "rajgir", "nalanda", "kesaria"
  ];

  const isBiharCity = (loc) => biharLocalCities.some(city => loc.includes(city));

  if (isBiharCity(p) || isBiharCity(d)) {
    return "Bihar Local / Nearby";
  }

  // 7. FALLBACK / OTHER (Priority 7)
  return "Other / Route Enquiry";
}
