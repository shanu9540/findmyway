import { AccommodationProvider } from './provider.js';
import { SearchParams, Property, Room, BookingParams, BookingResult } from './types.js';

// Realistic mock hotels database mapped by city code
const MOCK_HOTELS_DB: { [key: string]: Omit<Property, 'provider'>[] } = {
  'PAR': [
    {
      id: 'mc-par-ritz',
      providerPropertyId: 'par-ritz',
      name: 'Ritz Paris Grand Hotel',
      description: 'Experience unparalleled luxury in the heart of Paris. Located on the Place Vendôme, the Ritz Paris offers elegant rooms, a world-class wellness spa, indoor pool, and fine dining at Michelin-starred restaurants.',
      location: 'Paris',
      address: '15 Place Vendôme, 75001 Paris, France',
      latitude: 48.8681,
      longitude: 2.3294,
      rating: 4.9,
      reviewCount: 412,
      starRating: 5,
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80'
      ],
      amenities: ['Free WiFi', 'Pool', 'Fitness Center', 'Michelin Restaurant', 'Bar', 'Spa & Wellness', '24-hour Room Service']
    },
    {
      id: 'mc-par-pul',
      providerPropertyId: 'par-pul',
      name: 'Pullman Paris Tour Eiffel',
      description: 'Located at the foot of the Eiffel Tower, the Pullman Paris offers modern upscale rooms, private balconies with Eiffel Tower views, and a state-of-the-art fitness center with views of the Trocadéro.',
      location: 'Paris',
      address: '18 Avenue De Suffren, 75015 Paris, France',
      latitude: 48.8556,
      longitude: 2.2931,
      rating: 4.6,
      reviewCount: 950,
      starRating: 4,
      images: [
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80'
      ],
      amenities: ['Eiffel Tower View', 'Free WiFi', 'Restaurant', 'Gym', 'Bar', 'Meeting Rooms', 'Pets Allowed']
    }
  ],
  'DEL': [
    {
      id: 'mc-del-taj',
      providerPropertyId: 'del-taj',
      name: 'Taj Mahal Hotel New Delhi',
      description: 'An iconic landmark in the heart of India\'s capital. Combining Mughal architecture with modern world-class amenities, the hotel features luxury rooms, the award-winning Varq restaurant, and a beautiful outdoor pool.',
      location: 'Delhi',
      address: '1 Mansingh Road, New Delhi, Delhi 110011, India',
      latitude: 28.6056,
      longitude: 77.2253,
      rating: 4.8,
      reviewCount: 680,
      starRating: 5,
      images: [
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1611891487122-207579d67d98?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'
      ],
      amenities: ['Free Valet Parking', 'Luxury Spa', 'Outdoor Pool', '24-hour Dining', 'Lounge Bar', 'Airport Shuttle', 'Butler Service']
    },
    {
      id: 'mc-del-ob',
      providerPropertyId: 'del-ob',
      name: 'The Oberoi New Delhi',
      description: 'Overlooking the historic Humayun\'s Tomb and the Delhi Golf Course, The Oberoi is a clean air hotel offering spacious suites, fine dining, a rooftop bar, and legendary Indian hospitality.',
      location: 'Delhi',
      address: 'Dr Zakir Hussain Marg, New Delhi, Delhi 110003, India',
      latitude: 28.5991,
      longitude: 77.2372,
      rating: 4.9,
      reviewCount: 340,
      starRating: 5,
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20a?auto=format&fit=crop&w=1200&q=80'
      ],
      amenities: ['Air Purification', 'Outdoor & Indoor Pool', 'Spa', 'Rooftop Bar', 'Fitness Center', 'Free WiFi']
    }
  ],
  'BOM': [
    {
      id: 'mc-bom-taj',
      providerPropertyId: 'bom-taj',
      name: 'The Taj Mahal Palace Mumbai',
      description: 'An architectural marvel overlooking the Gateway of India. Opened in 1903, this legendary palace hotel features iconic harbour views, luxury shops, an outdoor pool, and 9 signature restaurants.',
      location: 'Mumbai',
      address: 'Apollo Bandar, Colaba, Mumbai, Maharashtra 400001, India',
      latitude: 18.9218,
      longitude: 72.8333,
      rating: 4.9,
      reviewCount: 1540,
      starRating: 5,
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80'
      ],
      amenities: ['Sea View', 'Outdoor Pool', 'Heritage Wing', 'Luxury Retail', '24-hour Room Service', 'Jiva Spa', 'Free Valet']
    }
  ]
};

// Generic fallback hotel list for unmapped IATA codes
const FALLBACK_HOTELS: Omit<Property, 'provider'>[] = [
  {
    id: 'mc-gen-resort',
    providerPropertyId: 'gen-resort',
    name: 'FindMyWay Vacation Resort',
    description: 'A beautiful vacation hotel featuring comfortable accommodations, premium bedding, dynamic swimming pools, guest reviews, and local destination tours mapping.',
    location: 'Travel Destination',
    address: '100 Beachfront Blvd, Coastal Region',
    latitude: 25.0,
    longitude: 55.0,
    rating: 4.5,
    reviewCount: 88,
    starRating: 4,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Free WiFi', 'Pool', 'Breakfast Included', 'Fitness Gym']
  }
];

export class MockProvider extends AccommodationProvider {
  getName(): string {
    return 'mock';
  }

  // Realistic mock rooms generator
  private getMockRooms(basePrice: number): Room[] {
    return [
      {
        id: 'rm-deluxe',
        name: 'Deluxe Room',
        description: 'Spacious Deluxe Room featuring premium king bed, work desk, high-speed internet, marble bathroom, and flat-screen TV.',
        occupancy: 2,
        beds: '1 King Bed or 2 Twin Beds',
        amenities: ['Free WiFi', 'Air Conditioning', 'Mini Bar', 'Coffee Maker', 'SafeBox', 'Bathrobe'],
        images: [
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
        ],
        rates: [
          {
            id: 'rt-deluxe-prepaid',
            currency: 'INR',
            totalPrice: basePrice,
            basePrice: Math.round(basePrice * 0.85),
            taxes: Math.round(basePrice * 0.10),
            fees: Math.round(basePrice * 0.05),
            cancellationPolicy: 'Non-refundable rate. Full charge applies on cancellation.',
            paymentType: 'prepaid',
            mealPlan: 'Room Only',
            refundable: false
          },
          {
            id: 'rt-deluxe-flex',
            currency: 'INR',
            totalPrice: Math.round(basePrice * 1.15),
            basePrice: basePrice,
            taxes: Math.round(basePrice * 0.10),
            fees: Math.round(basePrice * 0.05),
            cancellationPolicy: 'Free cancellation up to 24 hours before check-in date.',
            paymentType: 'postpaid',
            mealPlan: 'Free Breakfast Included',
            refundable: true
          }
        ]
      },
      {
        id: 'rm-suite',
        name: 'Executive Palace Suite',
        description: 'Luxurious suite offering a separate living salon, panoramic city or harbour view, complimentary club access, and premium marble bathroom amenities.',
        occupancy: 3,
        beds: '1 Royal King Bed',
        amenities: ['Sea/City View', 'Executive Club Lounge Access', 'Free WiFi', 'Welcome Fruits', 'Nespresso Machine'],
        images: [
          'https://images.unsplash.com/photo-1611891487122-207579d67d98?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80'
        ],
        rates: [
          {
            id: 'rt-suite-flex',
            currency: 'INR',
            totalPrice: Math.round(basePrice * 1.8),
            basePrice: Math.round(basePrice * 1.6),
            taxes: Math.round(basePrice * 0.15),
            fees: Math.round(basePrice * 0.05),
            cancellationPolicy: 'Free cancellation up to 48 hours before check-in date.',
            paymentType: 'postpaid',
            mealPlan: 'Free Breakfast and Dinner Buffet Included',
            refundable: true
          }
        ]
      }
    ];
  }

  async searchStays(params: SearchParams): Promise<Property[]> {
    const city = params.cityCode.toUpperCase();
    const rawList = MOCK_HOTELS_DB[city] || FALLBACK_HOTELS;

    // Apply provider tag and dynamically calculate base pricing
    return rawList.map((item) => {
      // Set localized prices based on target city
      const startingPrice = city === 'PAR' ? 32000 : city === 'LON' ? 28000 : 18000;
      const roomsList = this.getMockRooms(startingPrice);
      
      return {
        ...item,
        provider: 'mock',
        rooms: roomsList,
        policies: {
          checkIn: '14:00 (2:00 PM)',
          checkOut: '12:00 (12:00 PM)',
          cancellation: 'Varies by rate type.'
        }
      };
    });
  }

  async getProperty(id: string): Promise<Property | null> {
    const cleanId = id.replace('mc-', '');
    let foundProp: any = null;

    // Search properties in all mock lists
    for (const list of Object.values(MOCK_HOTELS_DB)) {
      const match = list.find((h) => h.providerPropertyId === cleanId);
      if (match) {
        foundProp = match;
        break;
      }
    }

    if (!foundProp) {
      foundProp = FALLBACK_HOTELS.find((h) => h.providerPropertyId === cleanId);
    }

    if (!foundProp) return null;

    const basePrice = foundProp.id.includes('par') ? 32000 : foundProp.id.includes('lon') ? 28000 : 18000;
    const roomsList = this.getMockRooms(basePrice);

    return {
      ...foundProp,
      provider: 'mock',
      rooms: roomsList,
      policies: {
        checkIn: '14:00 (2:00 PM)',
        checkOut: '12:00 (12:00 PM)',
        cancellation: 'Varies by rate selection.'
      }
    };
  }

  async getRooms(propertyId: string): Promise<Room[]> {
    const basePrice = propertyId.includes('par') ? 32000 : propertyId.includes('lon') ? 28000 : 18000;
    return this.getMockRooms(basePrice);
  }

  async createBooking(params: BookingParams): Promise<BookingResult> {
    const prop = await this.getProperty(params.propertyId);
    const rooms = await this.getRooms(params.propertyId);
    const room = rooms.find((r) => r.id === params.roomId) || rooms[0];
    const rate = room.rates.find((rt) => rt.id === params.rateId) || room.rates[0];

    return {
      bookingId: `bk-mock-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      providerReference: `REF-MOCK-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Confirmed',
      totalPrice: rate.totalPrice,
      currency: rate.currency,
      propertyName: prop?.name || 'Vacation Stay',
      roomName: room.name,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      guestName: params.fullName
    };
  }
}
