import { AccommodationProvider } from './provider.js';
import { DuffelProvider } from './duffelProvider.js';
import { MockProvider } from './mockProvider.js';
import { SearchParams, Property, Room, BookingParams, BookingResult } from './types.js';

class AccommodationService {
  private activeProvider: AccommodationProvider;
  private fallbackProvider: MockProvider;

  constructor() {
    const configProvider = process.env.ACCOMMODATION_PROVIDER || 'mock';
    this.fallbackProvider = new MockProvider();

    if (configProvider.toLowerCase() === 'duffel' && process.env.DUFFEL_ACCESS_TOKEN) {
      this.activeProvider = new DuffelProvider();
      console.log('🏨 Accommodation Service initialized with active provider: Duffel');
    } else {
      this.activeProvider = this.fallbackProvider;
      console.log('🏨 Accommodation Service initialized with active provider: Mock (Fallback)');
    }
  }

  async searchStays(params: SearchParams): Promise<Property[]> {
    try {
      return await this.activeProvider.searchStays(params);
    } catch (err: any) {
      // Fallback to Mock if Stays is not enabled at account level or fails
      if (
        this.activeProvider.getName() !== 'mock' &&
        (err.message.includes('blocked') || err.message.includes('not_enabled') || err.message.includes('forbidden') || err.message.includes('403'))
      ) {
        console.warn('⚠️ [Accommodation Service] Duffel Stays is blocked/disabled on this account. Falling back to MockProvider...');
        return await this.fallbackProvider.searchStays(params);
      }
      throw err;
    }
  }

  async getProperty(id: string): Promise<Property | null> {
    try {
      if (id.startsWith('mc-')) {
        return await this.fallbackProvider.getProperty(id);
      }
      return await this.activeProvider.getProperty(id);
    } catch (err: any) {
      if (this.activeProvider.getName() !== 'mock') {
        console.warn('⚠️ [Accommodation Service] Duffel details failed, checking MockProvider...');
        return await this.fallbackProvider.getProperty(id);
      }
      throw err;
    }
  }

  async getRooms(propertyId: string): Promise<Room[]> {
    try {
      if (propertyId.startsWith('mc-')) {
        return await this.fallbackProvider.getRooms(propertyId);
      }
      return await this.activeProvider.getRooms(propertyId);
    } catch (err: any) {
      if (this.activeProvider.getName() !== 'mock') {
        return await this.fallbackProvider.getRooms(propertyId);
      }
      throw err;
    }
  }

  async createBooking(params: BookingParams): Promise<BookingResult> {
    try {
      if (params.propertyId.startsWith('mc-')) {
        return await this.fallbackProvider.createBooking(params);
      }
      return await this.activeProvider.createBooking(params);
    } catch (err: any) {
      if (this.activeProvider.getName() !== 'mock') {
        console.warn('⚠️ [Accommodation Service] Duffel Booking failed, creating booking via MockProvider...');
        return await this.fallbackProvider.createBooking(params);
      }
      throw err;
    }
  }
}

export const accommodationService = new AccommodationService();
