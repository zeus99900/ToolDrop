// Shared types for the web app
export type ToolCondition = 'LIKE_NEW' | 'EXCELLENT' | 'GOOD' | 'FAIR';
export type DeliveryOption = 'PICKUP_ONLY' | 'DELIVERY_ONLY' | 'BOTH';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'ACTIVATED' | 'ACTIVE' | 'RETURN_PENDING' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
export type UserRole = 'RENTER' | 'LENDER' | 'BOTH' | 'ADMIN';

export const conditionLabels: Record<ToolCondition, string> = {
  LIKE_NEW: 'Like New',
  EXCELLENT: 'Excellent',
  GOOD: 'Good',
  FAIR: 'Fair',
};

export const conditionColors: Record<ToolCondition, string> = {
  LIKE_NEW: 'bg-emerald-100 text-emerald-700',
  EXCELLENT: 'bg-blue-100 text-blue-700',
  GOOD: 'bg-amber-100 text-amber-700',
  FAIR: 'bg-gray-100 text-gray-600',
};

export const deliveryLabels: Record<DeliveryOption, string> = {
  PICKUP_ONLY: 'Pickup Only',
  DELIVERY_ONLY: 'Delivery Only',
  BOTH: 'Delivery & Pickup',
};

export const bookingStatusLabels: Record<BookingStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  ACTIVATED: 'In Progress',
  ACTIVE: 'Active',
  RETURN_PENDING: 'Return Pending',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  DISPUTED: 'Disputed',
};

export const bookingStatusColors: Record<BookingStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  ACTIVATED: 'bg-emerald-100 text-emerald-700',
  ACTIVE: 'bg-green-100 text-green-700',
  RETURN_PENDING: 'bg-purple-100 text-purple-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-700',
  DISPUTED: 'bg-red-100 text-red-700',
};
