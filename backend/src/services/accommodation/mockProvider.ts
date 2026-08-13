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
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80'
      ],
      amenities: ['Sea View', 'Outdoor Pool', 'Heritage Wing', 'Luxury Retail', '24-hour Room Service', 'Jiva Spa', 'Free Valet']
    }
  ]
};

// Generic fallback hotel list for unmapped IATA codes (Expanded to 25 detailed properties)
const FALLBACK_HOTELS: Omit<Property, 'provider'>[] = [
  {
    id: 'mc-gen-marriott',
    providerPropertyId: 'gen-marriott',
    name: 'Marriott Resort & Convention Centre',
    description: 'A grand retreat providing panoramic city skyline views, premium bedding, dynamic swimming pools, guest reviews, and local destination tours.',
    location: 'Travel Destination',
    address: '101 Executive Parkway, Coastal Region',
    latitude: 25.1,
    longitude: 55.1,
    rating: 4.7,
    reviewCount: 220,
    starRating: 5,
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'],
    amenities: ['Free WiFi', 'Pool', 'Breakfast Included', 'Gym', 'Spa']
  },
  {
    id: 'mc-gen-hilton',
    providerPropertyId: 'gen-hilton',
    name: 'Hilton Premium Towers',
    description: 'Modern elegant business and family hotel situated right in the city center. Featuring luxury lounge, dining options, and high-speed internet.',
    location: 'Travel Destination',
    address: '202 Central Avenue, Coastal Region',
    latitude: 25.2,
    longitude: 55.2,
    rating: 4.6,
    reviewCount: 310,
    starRating: 4,
    images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80'],
    amenities: ['Free WiFi', 'Parking', 'Restaurant', 'Gym', 'Lounge']
  },
  {
    id: 'mc-gen-sheraton',
    providerPropertyId: 'gen-sheraton',
    name: 'Sheraton Plaza Landmark',
    description: 'A stylish and comfortable city landmark perfect for couples, families, and business trips. Enjoy premium dining options and customized guides.',
    location: 'Travel Destination',
    address: '303 Plaza Boulevard, Coastal Region',
    latitude: 25.3,
    longitude: 55.3,
    rating: 4.5,
    reviewCount: 180,
    starRating: 4,
    images: ['https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80'],
    amenities: ['Free WiFi', 'Swimming Pool', 'Room Service', 'Bar']
  },
  {
    id: 'mc-gen-hyatt',
    providerPropertyId: 'gen-hyatt',
    name: 'Hyatt Regency Executive Suites',
    description: 'Spacious suites and luxury apartments with full amenities, kitchenettes, and modern smart features. Ideal for extended stays.',
    location: 'Travel Destination',
    address: '404 Skyline Heights, Coastal Region',
    latitude: 25.4,
    longitude: 55.4,
    rating: 4.8,
    reviewCount: 195,
    starRating: 5,
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80'],
    amenities: ['Kitchenette', 'Free WiFi', 'Pool', 'Laundry', 'Lounge']
  },
  {
    id: 'mc-gen-radisson',
    providerPropertyId: 'gen-radisson',
    name: 'Radisson Blu Luxury Suites',
    description: 'Bold, stylish and individual resort. Featuring direct beach access, wellness spa, and outdoor sports arena.',
    location: 'Travel Destination',
    address: '505 Waterfront Road, Coastal Region',
    latitude: 25.5,
    longitude: 55.5,
    rating: 4.4,
    reviewCount: 240,
    starRating: 4,
    images: ['https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80'],
    amenities: ['Beach Access', 'Pool', 'Free WiFi', 'Spa', 'Sports Court']
  },
  {
    id: 'mc-gen-fourseasons',
    providerPropertyId: 'gen-fourseasons',
    name: 'Four Seasons Elite Villa',
    description: 'Ultra-luxury private villa resort. Offering butler service, private infinity pool, and exclusive dining privileges.',
    location: 'Travel Destination',
    address: '606 Sanctuary Heights, Coastal Region',
    latitude: 25.6,
    longitude: 55.6,
    rating: 4.9,
    reviewCount: 88,
    starRating: 5,
    images: ['https://images.unsplash.com/photo-1611891487122-207579d67d98?auto=format&fit=crop&w=1200&q=80'],
    amenities: ['Private Pool', 'Butler', 'Free WiFi', 'Michelin Star Chef', 'Spa']
  },
  {
    id: 'mc-gen-shangrila',
    providerPropertyId: 'gen-shangrila',
    name: 'Shangri-La Heritage Palace',
    description: 'Combining traditional classic heritage themes with premium comfort. Offering local heritage walks, authentic dining, and relaxing therapies.',
    location: 'Travel Destination',
    address: '707 Castle Hill, Coastal Region',
    latitude: 25.7,
    longitude: 55.7,
    rating: 4.8,
    reviewCount: 165,
    starRating: 5,
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'],
    amenities: ['Heritage Walk', 'Free WiFi', 'Pool', 'Authentic Dining', 'Spa']
  },
  {
    id: 'mc-gen-intercontinental',
    providerPropertyId: 'gen-intercontinental',
    name: 'InterContinental Beachside Retreat',
    description: 'Waterfront beach resort with private balconies, cabanas, international buffet restaurant, and watersports center.',
    location: 'Travel Destination',
    address: '808 Shoreline Parkway, Coastal Region',
    latitude: 25.8,
    longitude: 55.8,
    rating: 4.7,
    reviewCount: 345,
    starRating: 5,
    images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'],
    amenities: ['Beachfront', 'Watersports', 'Buffet', 'Free WiFi', 'Cabanas']
  },
  {
    id: 'mc-gen-westin',
    providerPropertyId: 'gen-westin',
    name: 'Westin Wellness Garden Hotel',
    description: 'Dedicated to your well-being. Wellness garden hotel offering yoga sessions, organic meals, and organic spa treatments.',
    location: 'Travel Destination',
    address: '909 Wellness Road, Coastal Region',
    latitude: 25.9,
    longitude: 55.9,
    rating: 4.6,
    reviewCount: 140,
    starRating: 4,
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'],
    amenities: ['Yoga Garden', 'Organic Dining', 'Free WiFi', 'Wellness Spa']
  },
  {
    id: 'mc-gen-lemeridien',
    providerPropertyId: 'gen-lemeridien',
    name: 'Le Meridien Cosmopolitan Suites',
    description: 'Chic European-inspired design hotel offering luxury beds, coffee culture, and art exhibitions.',
    location: 'Travel Destination',
    address: '1010 Boulevard d\'Art, Coastal Region',
    latitude: 26.0,
    longitude: 56.0,
    rating: 4.5,
    reviewCount: 125,
    starRating: 4,
    images: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20a?auto=format&fit=crop&w=1200&q=80'],
    amenities: ['Coffee House', 'Art Gallery', 'Free WiFi', 'Gym', 'Pool']
  },
  {
    id: 'mc-gen-kempinski',
    providerPropertyId: 'gen-kempinski',
    name: 'Kempinski Royal Grandeur',
    description: 'Palatial design and grand styling. Kempinski Royal Grandeur offers luxury dining halls, wellness clubs, and scenic view terraces.',
    location: 'Travel Destination',
    address: '1111 Royal View Road, Coastal Region',
    latitude: 26.1,
    longitude: 56.1,
    rating: 4.8,
    reviewCount: 202,
    starRating: 5,
    images: ['https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80'],
    amenities: ['Palace Gardens', 'Spa', 'Free WiFi', 'Lounge Bar', 'Valet']
  },
  {
    id: 'mc-gen-stregis',
    providerPropertyId: 'gen-stregis',
    name: 'St. Regis Oasis Retreat',
    description: 'Experience refined living. Features signature St. Regis Butler Service, customized suites, and direct oasis pool view balconies.',
    location: 'Travel Destination',
    address: '1212 Oasis Boulevard, Coastal Region',
    latitude: 26.2,
    longitude: 56.2,
    rating: 4.9,
    reviewCount: 94,
    starRating: 5,
    images: ['https://images.unsplash.com/photo-1611891487122-207579d67d98?auto=format&fit=crop&w=1200&q=80'],
    amenities: ['Butler Service', 'Pool Access', 'Free WiFi', 'Rooftop Bar']
  },
  {
    id: 'mc-gen-whotel',
    providerPropertyId: 'gen-whotel',
    name: 'W Hotel Urban Escape',
    description: 'Trendsetting luxury hotel with vibrant social spaces, rooftop DJ deck, infinity pools, and signature design guest rooms.',
    location: 'Travel Destination',
    address: '1313 Neon Street, Coastal Region',
    latitude: 26.3,
    longitude: 56.3,
    rating: 4.7,
    reviewCount: 290,
    starRating: 5,
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'],
    amenities: ['Rooftop DJ', 'Infinity Pool', 'Free WiFi', 'Modern Bar', 'Gym']
  },
  {
    id: 'mc-gen-mandarin',
    providerPropertyId: 'gen-mandarin',
    name: 'Mandarin Oriental Garden Palace',
    description: 'Quiet sanctuary offering award-winning spa treatments, elegant rooms, and tranquil oriental gardens.',
    location: 'Travel Destination',
    address: '1414 Tranquil Way, Coastal Region',
    latitude: 26.4,
    longitude: 56.4,
    rating: 4.8,
    reviewCount: 110,
    starRating: 5,
    images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80'],
    amenities: ['Zen Gardens', 'Luxury Spa', 'Free WiFi', 'Fine Dining', 'Pool']
  },
  {
    id: 'mc-gen-novotel',
    providerPropertyId: 'gen-novotel',
    name: 'Novotel Premium Family Resort',
    description: 'Perfect for family and kid vacations. Kids play areas, family pool, all-day multi-cuisine restaurant, and free breakfast.',
    location: 'Travel Destination',
    address: '1515 Family Fun Park, Coastal Region',
    latitude: 26.5,
    longitude: 56.5,
    rating: 4.4,
    reviewCount: 420,
    starRating: 4,
    images: ['https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80'],
    amenities: ['Kids Club', 'Family Pool', 'All Day Dining', 'Free WiFi']
  },
  {
    id: 'mc-gen-ibis',
    providerPropertyId: 'gen-ibis',
    name: 'Ibis Budget Smart Stay',
    description: 'Affordable, clean and cozy city center hotel offering smart rooms, breakfast buffet, and friendly 24/7 service.',
    location: 'Travel Destination',
    address: '1616 Economy Avenue, Coastal Region',
    latitude: 26.6,
    longitude: 56.6,
    rating: 4.1,
    reviewCount: 560,
    starRating: 3,
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80'],
    amenities: ['Free WiFi', 'Breakfast Buffet', 'Air Conditioning', 'Pets Allowed']
  },
  {
    id: 'mc-gen-fairfield',
    providerPropertyId: 'gen-fairfield',
    name: 'Fairfield Inn & Suites',
    description: 'Clean, reliable and highly-rated business hotel offering comfortable bedding, free breakfast, and high speed internet.',
    location: 'Travel Destination',
    address: '1717 Corporate Drive, Coastal Region',
    latitude: 26.7,
    longitude: 56.7,
    rating: 4.3,
    reviewCount: 150,
    starRating: 3,
    images: ['https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80'],
    amenities: ['Free WiFi', 'Breakfast Included', 'Gym', 'Business Center']
  },
  {
    id: 'mc-gen-courtyard',
    providerPropertyId: 'gen-courtyard',
    name: 'Courtyard Luxury Plaza',
    description: 'Stylish business hotel featuring courtyard cafe, fire pits, fitness room, and high-speed workspaces.',
    location: 'Travel Destination',
    address: '1818 Courtyard Way, Coastal Region',
    latitude: 26.8,
    longitude: 56.8,
    rating: 4.5,
    reviewCount: 165,
    starRating: 4,
    images: ['https://images.unsplash.com/photo-1611891487122-207579d67d98?auto=format&fit=crop&w=1200&q=80'],
    amenities: ['Courtyard Cafe', 'Fire Pit Workspace', 'Free WiFi', 'Gym']
  },
  {
    id: 'mc-gen-holidayinn',
    providerPropertyId: 'gen-holidayinn',
    name: 'Holiday Inn Vacation Club',
    description: 'Large family suites, mini-waterpark, kids eat free program, and daily resort activities and sports games.',
    location: 'Travel Destination',
    address: '1919 Resort Highway, Coastal Region',
    latitude: 26.9,
    longitude: 56.9,
    rating: 4.3,
    reviewCount: 380,
    starRating: 4,
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'],
    amenities: ['Mini Waterpark', 'Kids Eat Free', 'Free WiFi', 'Sports Court']
  },
  {
    id: 'mc-gen-crowneplaza',
    providerPropertyId: 'gen-crowneplaza',
    name: 'Crowne Plaza Grand Palace',
    description: 'Elegant architectural detailing. Features grand ballrooms, fine dining bars, wellness spas, and high quality butler services.',
    location: 'Travel Destination',
    address: '2020 Palace Avenue, Coastal Region',
    latitude: 27.0,
    longitude: 57.0,
    rating: 4.6,
    reviewCount: 220,
    starRating: 5,
    images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'],
    amenities: ['Grand Ballroom', 'Fine Dining', 'Free WiFi', 'Spa & Wellness']
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
            id: 'rt-deluxe-breakfast',
            currency: 'INR',
            totalPrice: Math.round(basePrice * 1.15),
            basePrice: Math.round(basePrice * 0.95),
            taxes: Math.round(basePrice * 0.12),
            fees: Math.round(basePrice * 0.08),
            cancellationPolicy: 'Free cancellation up to 24 hours before check-in date.',
            paymentType: 'postpaid',
            mealPlan: 'Free Breakfast Buffet Included',
            refundable: true
          }
        ]
      },
      {
        id: 'rm-suite',
        name: 'Executive Garden Suite',
        description: 'Luxury suite featuring a private balcony overlooking beautifully landscaped gardens, cozy lounge area, and premium amenities.',
        occupancy: 3,
        beds: '1 King Bed + 1 Rollaway Bed',
        amenities: ['Private Balcony', 'Free WiFi', 'Espresso Machine', 'Luxury Spa tub', 'Minibar', 'Separate Living Room'],
        images: [
          'https://images.unsplash.com/photo-1611891487122-207579d67d98?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
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
    
    const citySpecific = MOCK_HOTELS_DB[city] || [];
    const fallbackFormatted = FALLBACK_HOTELS.map((h) => {
      // Map nice location details dynamically based on queried city name
      const localizedLocation = city === 'BOM' || city === 'MUM' ? 'Mumbai' 
        : city === 'DEL' ? 'Delhi' 
        : city === 'AGR' ? 'Agra' 
        : city === 'GOI' ? 'Goa' 
        : city === 'PAR' ? 'Paris'
        : city === 'LON' ? 'London'
        : 'Travel Destination';
      
      const localizedAddress = h.address.replace('Coastal Region', 
        city === 'BOM' || city === 'MUM' ? 'Colaba, Mumbai, Maharashtra, India'
        : city === 'DEL' ? 'Connaught Place, New Delhi, India'
        : city === 'AGR' ? 'Taj East Gate Road, Agra, India'
        : city === 'GOI' ? 'Calangute Beach Road, Goa, India'
        : `${city} Central Plaza`
      );

      return {
        ...h,
        id: `${h.id}-${city.toLowerCase()}`,
        location: localizedLocation,
        address: localizedAddress
      };
    });

    const combinedList = [...citySpecific, ...fallbackFormatted];

    // Apply provider tag and dynamically calculate base pricing
    return combinedList.map((item) => {
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
    const baseId = cleanId.split('-')[0];
    let foundProp: any = null;

    // Search properties in all mock lists
    for (const list of Object.values(MOCK_HOTELS_DB)) {
      const match = list.find((h) => h.providerPropertyId === cleanId || h.providerPropertyId === baseId);
      if (match) {
        foundProp = match;
        break;
      }
    }

    if (!foundProp) {
      foundProp = FALLBACK_HOTELS.find((h) => h.providerPropertyId === cleanId || h.providerPropertyId === baseId);
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
