export interface SearchParams {
  cityCode: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface RoomQueryParams {
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface BookingParams {
  propertyId: string;
  roomId: string;
  rateId: string;
  checkIn: string;
  checkOut: string;
  fullName: string;
  email: string;
  phone: string;
  specialRequests?: string;
  guestsCount: number;
}

export interface Rate {
  id: string;
  currency: string;
  totalPrice: number;
  basePrice: number;
  taxes: number;
  fees: number;
  cancellationPolicy: string;
  paymentType: 'prepaid' | 'postpaid';
  mealPlan: string;
  refundable: boolean;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  occupancy: number;
  beds: string;
  amenities: string[];
  images: string[];
  rates: Rate[];
}

export interface Property {
  id: string;
  provider: 'duffel' | 'mock';
  providerPropertyId: string;
  name: string;
  description: string;
  location: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  starRating: number;
  images: string[];
  amenities: string[];
  rooms?: Room[];
  policies?: {
    checkIn?: string;
    checkOut?: string;
    cancellation?: string;
  };
}

export interface BookingResult {
  bookingId: string;
  providerReference: string;
  status: 'Confirmed' | 'Pending' | 'Failed';
  totalPrice: number;
  currency: string;
  propertyName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guestName: string;
}
