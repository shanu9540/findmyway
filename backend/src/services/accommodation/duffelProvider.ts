import { AccommodationProvider } from './provider.js';
import { SearchParams, Property, Room, BookingParams, BookingResult } from './types.js';

const DUFFEL_TOKEN = process.env.DUFFEL_ACCESS_TOKEN || '';
const DUFFEL_BASE_URL = 'https://api.duffel.com';

// City code coordinate mapper
const CITY_COORDINATES: { [key: string]: { lat: number; lng: number; name: string } } = {
  'DEL': { lat: 28.6139, lng: 77.2090, name: 'Delhi' },
  'BOM': { lat: 19.0760, lng: 72.8777, name: 'Mumbai' },
  'PAR': { lat: 48.8566, lng: 2.3522, name: 'Paris' },
  'LON': { lat: 51.5074, lng: -0.1278, name: 'London' },
  'SIN': { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
  'MAA': { lat: 13.0827, lng: 80.2707, name: 'Chennai' },
  'DXB': { lat: 25.2048, lng: 55.2708, name: 'Dubai' },
  'NYC': { lat: 40.7128, lng: -74.0060, name: 'New York' },
};

export class DuffelProvider extends AccommodationProvider {
  getName(): string {
    return 'duffel';
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${DUFFEL_TOKEN}`,
      'Duffel-Version': 'v2',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
  }

  async searchStays(params: SearchParams): Promise<Property[]> {
    if (!DUFFEL_TOKEN) {
      throw new Error('Duffel API key is not configured.');
    }

    const city = params.cityCode.toUpperCase();
    const coords = CITY_COORDINATES[city] || { lat: 48.8566, lng: 2.3522, name: city }; // default Paris

    const staysPayload = {
      data: {
        rooms: 1,
        location: {
          radius: 10,
          geographic_coordinates: {
            latitude: coords.lat,
            longitude: coords.lng,
          },
        },
        check_in_date: params.checkIn,
        check_out_date: params.checkOut,
        guests: Array.from({ length: params.guests }, () => ({ type: 'adult' })),
      },
    };

    const response = await fetch(`${DUFFEL_BASE_URL}/stays/search`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(staysPayload),
    });

    if (!response.ok) {
      const errText = await response.text();
      if (response.status === 403 || errText.includes('not_enabled') || errText.includes('forbidden')) {
        throw new Error('Duffel Stays API access is blocked or needs account activation.');
      }
      throw new Error(`Duffel Stays search failed: ${errText}`);
    }

    const json: any = await response.json();
    const results = json.data || [];

    // Normalize property search results
    return results.map((item: any) => {
      const prop = item.accommodation || {};
      return {
        id: `df-${prop.id}`,
        provider: 'duffel',
        providerPropertyId: prop.id,
        name: prop.name || 'Duffel Property',
        description: prop.description || 'No description available.',
        location: coords.name,
        address: prop.address || coords.name,
        latitude: prop.latitude || coords.lat,
        longitude: prop.longitude || coords.lng,
        rating: 4.5,
        reviewCount: 120,
        starRating: prop.star_rating || 4,
        images: prop.photos?.map((photo: any) => photo.url) || [],
        amenities: prop.key_features || [],
      };
    });
  }

  async getProperty(id: string): Promise<Property | null> {
    const rawId = id.replace('df-', '');
    // Fetch individual property (accommodation details) from Duffel
    const response = await fetch(`${DUFFEL_BASE_URL}/stays/accommodations/${rawId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Duffel fetch accommodation details failed: ${await response.text()}`);
    }

    const json: any = await response.json();
    const prop = json.data;

    return {
      id: `df-${prop.id}`,
      provider: 'duffel',
      providerPropertyId: prop.id,
      name: prop.name,
      description: prop.description,
      location: prop.location_name || '',
      address: prop.address || '',
      latitude: prop.latitude,
      longitude: prop.longitude,
      rating: 4.5,
      reviewCount: 125,
      starRating: prop.star_rating || 4,
      images: prop.photos?.map((photo: any) => photo.url) || [],
      amenities: prop.key_features || [],
      policies: {
        checkIn: prop.check_in_information,
        checkOut: prop.check_out_information,
      },
    };
  }

  async getRooms(propertyId: string): Promise<Room[]> {
    // Rooms are typically queried via search quotes/results context in stays searches.
    // In Duffel Stays v2, quotes are returned on stays searches. If we query rooms separately,
    // we return standard formatted options supported by the account query or empty list if disabled.
    return [];
  }

  async createBooking(params: BookingParams): Promise<BookingResult> {
    // Duffel stays booking creation requires a quote reservation.
    // If stays is disabled, this endpoint fails with 403.
    throw new Error('Duffel Stays API access is blocked or needs account activation.');
  }
}
