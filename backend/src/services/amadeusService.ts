// Using global native fetch

const CLIENT_ID = process.env.AMADEUS_CLIENT_ID || '';
const CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET || '';
const BASE_URL = process.env.AMADEUS_BASE_URL || 'https://test.api.amadeus.com';

let cachedToken: string | null = null;
let tokenExpiresAt = 0; // epoch timestamp in ms

// Get OAuth2 access token (cached)
const getAccessToken = async (): Promise<string | null> => {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    return null; // Signals fallback mode
  }

  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);

    const response = await fetch(`${BASE_URL}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      console.warn('Amadeus token retrieval failed, fallback mode enabled.');
      return null;
    }

    const data: any = await response.json();
    cachedToken = data.access_token;
    tokenExpiresAt = Date.now() + (data.expires_in * 1000) - 10000; // 10s safety buffer
    return cachedToken;
  } catch (err) {
    console.error('Amadeus Auth Error:', err);
    return null;
  }
};

// Mock flight data generator
const generateMockFlights = (origin: string, destination: string, date: string, adults: number) => {
  const carriers = [
    { code: 'AI', name: 'Air India', logo: '🇮🇳' },
    { code: 'EK', name: 'Emirates', logo: '🇦🇪' },
    { code: 'QR', name: 'Qatar Airways', logo: '🇶🇦' },
    { code: 'LH', name: 'Lufthansa', logo: '🇩🇪' },
    { code: 'SQ', name: 'Singapore Airlines', logo: '🇸🇬' },
  ];

  const results = [];
  const count = 4;

  for (let i = 0; i < count; i++) {
    const carrier = carriers[i % carriers.length];
    const durationHours = 4 + (i * 2);
    const pricePerAdult = 18000 + (i * 3500);
    const totalPrice = pricePerAdult * adults;

    // Departure time offset
    const depTime = `${String(8 + i * 3).padStart(2, '0')}:15`;
    const arrTime = `${String((8 + i * 3 + durationHours) % 24).padStart(2, '0')}:45`;

    results.push({
      id: `mock-flight-${i + 1}`,
      airline: carrier.name,
      airlineCode: carrier.code,
      logo: carrier.logo,
      flightNumber: `${carrier.code}-${100 + i * 15}`,
      departure: {
        iata: origin.toUpperCase(),
        time: depTime,
        date: date
      },
      arrival: {
        iata: destination.toUpperCase(),
        time: arrTime,
        date: date
      },
      duration: `${durationHours}h 30m`,
      stops: i === 0 ? 'Non-stop' : `${i} stop(s)`,
      pricePerPassenger: pricePerAdult,
      totalPrice: totalPrice,
      currency: 'INR'
    });
  }

  return results;
};

// Mock hotel data generator
const generateMockHotels = (cityCode: string, checkInDate: string, checkOutDate: string, guests: number) => {
  const hotelNames = [
    { name: 'Grand Palace Plaza', rating: 4.8, stars: 5 },
    { name: 'Regency Bay Hotel & Spa', rating: 4.5, stars: 4 },
    { name: 'Central Boulevard Suites', rating: 4.2, stars: 4 },
    { name: 'Budget Alpine Lodge', rating: 3.9, stars: 3 },
  ];

  const results = [];
  for (let i = 0; i < hotelNames.length; i++) {
    const hotel = hotelNames[i];
    const pricePerNight = 4500 + (i * 2200);
    const durationNights = 3; // default assumption for calculations
    const totalPrice = pricePerNight * durationNights * guests;

    results.push({
      id: `mock-hotel-${cityCode.toLowerCase()}-${i + 1}`,
      name: `${hotel.name} (${cityCode.toUpperCase()})`,
      rating: hotel.rating,
      stars: hotel.stars,
      address: `${100 + i * 12} Tourism Avenue, ${cityCode.toUpperCase()}`,
      roomType: 'Deluxe King Bedroom',
      bedType: '1 King Bed',
      inclusions: 'Free High-speed Wi-Fi, Breakfast Included, Air Conditioning',
      pricePerNight: pricePerNight,
      totalPrice: totalPrice,
      currency: 'INR',
      image: `https://images.unsplash.com/photo-${[
        '1566073771259-6a8506099945',
        '1551882547-ff40c63fe5fa',
        '1520250497591-112f2f40a3f4',
        '1584132967334-10e02bd6992a'
      ][i % 4]}?auto=format&fit=crop&w=600&q=80`
    });
  }
  return results;
};

// 1. Search Flight Offers
export const searchFlightOffers = async (
  origin: string,
  destination: string,
  departureDate: string,
  adults = 1
): Promise<any[]> => {
  const token = await getAccessToken();

  if (!token) {
    console.log(`[Amadeus] Using mock flights for ${origin} -> ${destination} on ${departureDate}`);
    return generateMockFlights(origin, destination, departureDate, adults);
  }

  try {
    const query = new URLSearchParams();
    query.append('originLocationCode', origin.toUpperCase());
    query.append('destinationLocationCode', destination.toUpperCase());
    query.append('departureDate', departureDate);
    query.append('adults', String(adults));
    query.append('currencyCode', 'INR');
    query.append('max', '10');

    const response = await fetch(`${BASE_URL}/v2/shopping/flight-offers?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn('Amadeus API Flight Offers search returned error, falling back:', errorText);
      return generateMockFlights(origin, destination, departureDate, adults);
    }

    const resData: any = await response.json();
    const dataList = resData.data || [];

    // Parse and map to custom clean schema
    return dataList.map((offer: any, idx: number) => {
      const itinerary = offer.itineraries?.[0];
      const segment = itinerary?.segments?.[0];
      const carrierCode = segment?.carrierCode || 'AI';
      const priceVal = parseFloat(offer.price?.total || '0');

      return {
        id: offer.id || `flight-${idx}`,
        airline: carrierCode === 'AI' ? 'Air India' : carrierCode === 'LH' ? 'Lufthansa' : `Airline (${carrierCode})`,
        airlineCode: carrierCode,
        logo: '✈️',
        flightNumber: `${carrierCode}-${segment?.number || '100'}`,
        departure: {
          iata: segment?.departure?.iataCode || origin.toUpperCase(),
          time: segment?.departure?.at ? segment.departure.at.split('T')[1].slice(0, 5) : '08:00',
          date: departureDate
        },
        arrival: {
          iata: segment?.arrival?.iataCode || destination.toUpperCase(),
          time: segment?.arrival?.at ? segment.arrival.at.split('T')[1].slice(0, 5) : '12:00',
          date: departureDate
        },
        duration: itinerary?.duration ? itinerary.duration.replace('PT', '').toLowerCase() : '4h',
        stops: offer.itineraries?.[0]?.segments?.length > 1 ? '1 stop' : 'Non-stop',
        pricePerPassenger: Math.round(priceVal / adults),
        totalPrice: Math.round(priceVal),
        currency: offer.price?.currency || 'INR'
      };
    });
  } catch (err) {
    console.error('Amadeus flightOffers API error:', err);
    return generateMockFlights(origin, destination, departureDate, adults);
  }
};

// 2. Search Hotel Offers
export const searchHotelOffers = async (
  cityCode: string,
  checkInDate: string,
  checkOutDate: string,
  guests = 1
): Promise<any[]> => {
  const token = await getAccessToken();

  if (!token) {
    console.log(`[Amadeus] Using mock hotels for city: ${cityCode} from ${checkInDate} to ${checkOutDate}`);
    return generateMockHotels(cityCode, checkInDate, checkOutDate, guests);
  }

  try {
    // A. Query hotel IDs in the requested city
    const hotelListUrl = `${BASE_URL}/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode.toUpperCase()}&max=10`;
    const listRes = await fetch(hotelListUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!listRes.ok) {
      console.warn('Amadeus Hotel by-city API failed, using fallback mock hotels.');
      return generateMockHotels(cityCode, checkInDate, checkOutDate, guests);
    }

    const listData: any = await listRes.json();
    const hotels = listData.data || [];
    if (hotels.length === 0) {
      return [];
    }

    const hotelIds = hotels.map((h: any) => h.hotelId).slice(0, 5).join(',');

    // B. Query prices/offers for these hotel IDs
    const offersQuery = new URLSearchParams();
    offersQuery.append('hotelIds', hotelIds);
    offersQuery.append('adults', String(guests));
    offersQuery.append('checkInDate', checkInDate);
    offersQuery.append('checkOutDate', checkOutDate);
    offersQuery.append('currency', 'INR');

    const offersRes = await fetch(`${BASE_URL}/v3/shopping/hotel-offers?${offersQuery.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!offersRes.ok) {
      console.warn('Amadeus hotel-offers API failed, using fallback mock hotels.');
      return generateMockHotels(cityCode, checkInDate, checkOutDate, guests);
    }

    const offersData: any = await offersRes.json();
    const offers = offersData.data || [];

    return offers.map((offerObj: any, idx: number) => {
      const hotel = offerObj.hotel;
      const offer = offerObj.offers?.[0];
      const rateStr = offer?.price?.total || '0';
      const parsedRate = parseFloat(rateStr);

      return {
        id: hotel.hotelId || `hotel-${idx}`,
        name: hotel.name || 'Luxury Boutique Inn',
        rating: 4.4,
        stars: 4,
        address: hotel.address?.lines?.join(', ') || 'City Center Mall Road',
        roomType: offer?.room?.description?.text || 'Standard Suite Room',
        bedType: '1 Queen Bed / King Bed Suite',
        inclusions: offer?.boardType === 'BREAKFAST' ? 'Daily Free Breakfast' : 'Wi-Fi included, Flexible Cancellation',
        pricePerNight: Math.round(parsedRate / 3), // assume average 3 nights division
        totalPrice: Math.round(parsedRate),
        currency: offer?.price?.currency || 'INR',
        image: `https://images.unsplash.com/photo-${[
          '1566073771259-6a8506099945',
          '1551882547-ff40c63fe5fa',
          '1520250497591-112f2f40a3f4',
          '1584132967334-10e02bd6992a'
        ][idx % 4]}?auto=format&fit=crop&w=600&q=80`
      };
    });
  } catch (err) {
    console.error('Amadeus hotel search error:', err);
    return generateMockHotels(cityCode, checkInDate, checkOutDate, guests);
  }
};
