// ─── FEE CALCULATIONS ─────────────────────────────────────

export interface BookingCalculationInput {
  pricePerDay: number;
  pricePerWeek?: number | null;
  pricePerMonth?: number | null;
  totalDays: number;
  deliveryFee?: number;
  damageProtection?: boolean;
  depositAmount: number;
  renterFeePercent?: number;  // default 10%
  lenderFeePercent?: number;  // default 15%
  damageProtectionPercent?: number; // default 15%
}

export interface BookingCalculationResult {
  rentalSubtotal: number;
  deliveryFee: number;
  damageProtectionFee: number;
  renterServiceFee: number;
  depositAmount: number;
  totalCharged: number;
  platformFee: number;
  lenderPayout: number;
}

export function calculateBookingTotal(input: BookingCalculationInput): BookingCalculationResult {
  const {
    pricePerDay,
    pricePerWeek,
    pricePerMonth,
    totalDays,
    deliveryFee = 0,
    damageProtection = false,
    depositAmount,
    renterFeePercent = 10,
    lenderFeePercent = 15,
    damageProtectionPercent = 15,
  } = input;

  // Calculate rental subtotal with optimal pricing
  let rentalSubtotal: number;
  if (pricePerMonth && totalDays >= 28) {
    const months = Math.floor(totalDays / 28);
    const remainingDays = totalDays % 28;
    rentalSubtotal = months * pricePerMonth + remainingDays * pricePerDay;
  } else if (pricePerWeek && totalDays >= 7) {
    const weeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;
    rentalSubtotal = weeks * pricePerWeek + remainingDays * pricePerDay;
  } else {
    rentalSubtotal = totalDays * pricePerDay;
  }

  rentalSubtotal = roundCurrency(rentalSubtotal);

  const damageProtectionFee = damageProtection
    ? roundCurrency(rentalSubtotal * (damageProtectionPercent / 100))
    : 0;

  const renterServiceFee = roundCurrency(rentalSubtotal * (renterFeePercent / 100));
  const lenderFee = roundCurrency(rentalSubtotal * (lenderFeePercent / 100));
  const platformFee = renterServiceFee + lenderFee;
  const lenderPayout = roundCurrency(rentalSubtotal - lenderFee);
  const totalCharged = roundCurrency(
    rentalSubtotal + deliveryFee + damageProtectionFee + renterServiceFee + depositAmount
  );

  return {
    rentalSubtotal,
    deliveryFee,
    damageProtectionFee,
    renterServiceFee,
    depositAmount,
    totalCharged,
    platformFee,
    lenderPayout,
  };
}

// ─── DELIVERY FEE ─────────────────────────────────────────

export function calculateDeliveryFee(
  listingDeliveryFee: number | null,
  distanceKm: number,
  platformDelivery: boolean = false
): number {
  if (!platformDelivery && listingDeliveryFee !== null) {
    return listingDeliveryFee;
  }
  if (distanceKm <= 5) return 4.99;
  if (distanceKm <= 10) return 7.99;
  if (distanceKm <= 20) return 11.99;
  if (distanceKm <= 50) return 17.99;
  return -1; // Out of range
}

// ─── SLUG GENERATION ──────────────────────────────────────

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

export function generateUniqueSlug(title: string, suffix?: string): string {
  const base = generateSlug(title);
  if (suffix) return `${base}-${suffix}`;
  const random = Math.random().toString(36).substring(2, 8);
  return `${base}-${random}`;
}

// ─── CURRENCY HELPERS ─────────────────────────────────────

export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function formatCurrency(amount: number, currency: string = 'CAD'): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency,
  }).format(amount);
}

// ─── DATE HELPERS ─────────────────────────────────────────

export function daysBetween(start: Date, end: Date): number {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// ─── DISTANCE ─────────────────────────────────────────────

export function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// ─── VALIDATION ───────────────────────────────────────────

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidCanadianPostalCode(code: string): boolean {
  return /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(code);
}

export function isValidPhoneNumber(phone: string): boolean {
  return /^\+?1?\d{10,11}$/.test(phone.replace(/[\s()-]/g, ''));
}
