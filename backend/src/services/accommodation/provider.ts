import { SearchParams, Property, Room, BookingParams, BookingResult } from './types.js';

export abstract class AccommodationProvider {
  abstract getName(): string;
  abstract searchStays(params: SearchParams): Promise<Property[]>;
  abstract getProperty(id: string): Promise<Property | null>;
  abstract getRooms(propertyId: string): Promise<Room[]>;
  abstract createBooking(params: BookingParams): Promise<BookingResult>;
}
