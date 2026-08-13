const DUFFEL_TOKEN = process.env.DUFFEL_ACCESS_TOKEN || '';
const DUFFEL_BASE_URL = 'https://api.duffel.com';

// Custom header builder for Duffel API v2
const getHeaders = () => {
  return {
    'Authorization': `Bearer ${DUFFEL_TOKEN}`,
    'Duffel-Version': 'v2',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
};

// 1. Search Flight Offers
export const searchDuffelFlights = async (
  origin: string,
  destination: string,
  departureDate: string,
  returnDate?: string,
  adults = 1,
  cabinClass = 'economy'
): Promise<any> => {
  if (!DUFFEL_TOKEN) {
    throw new Error('Duffel API Access Token is not configured in backend env.');
  }

  try {
    const slices = [
      {
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        departure_date: departureDate
      }
    ];

    if (returnDate) {
      slices.push({
        origin: destination.toUpperCase(),
        destination: origin.toUpperCase(),
        departure_date: returnDate
      });
    }

    const payload = {
      data: {
        slices,
        passengers: Array.from({ length: adults }, () => ({ type: 'adult' })),
        cabin_class: cabinClass
      }
    };

    console.log('[Duffel] Creating Offer Request:', JSON.stringify(payload));
    const response = await fetch(`${DUFFEL_BASE_URL}/air/offer_requests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[Duffel Error] HTTP ${response.status}:`, errText);
      throw new Error(`Duffel Flight search failed: ${errText}`);
    }

    const resJson: any = await response.json();
    const offerRequest = resJson.data;
    const offers = offerRequest?.offers || [];

    // Map to standardized format
    const results = offers.map((offer: any) => {
      const carrier = offer.owner || {};
      const segmentsList: any[] = [];
      
      offer.slices?.forEach((slice: any) => {
        slice.segments?.forEach((seg: any) => {
          segmentsList.push({
            airline: seg.operating_carrier?.name || carrier.name,
            airlineCode: seg.operating_carrier?.iata_code || carrier.iata_code,
            flightNumber: seg.operating_carrier_flight_number || seg.marketing_carrier_flight_number,
            departure: {
              iata: seg.origin?.iata_code,
              time: seg.departing_at ? seg.departing_at.split('T')[1].slice(0, 5) : '',
              date: seg.departing_at ? seg.departing_at.split('T')[0] : ''
            },
            arrival: {
              iata: seg.destination?.iata_code,
              time: seg.arriving_at ? seg.arriving_at.split('T')[1].slice(0, 5) : '',
              date: seg.arriving_at ? seg.arriving_at.split('T')[0] : ''
            },
            duration: seg.duration ? seg.duration.replace('PT', '').toLowerCase() : ''
          });
        });
      });

      // Sum slices duration
      const totalDurationMin = offer.slices?.reduce((sum: number, sl: any) => {
        // Duffel duration is ISO8601 (e.g. PT2H15M)
        const matches = sl.duration?.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
        const hours = matches ? parseInt(matches[1] || '0') : 0;
        const mins = matches ? parseInt(matches[2] || '0') : 0;
        return sum + (hours * 60 + mins);
      }, 0) || 0;

      const durationStr = `${Math.floor(totalDurationMin / 60)}h ${totalDurationMin % 60}m`;

      return {
        id: offer.id,
        airline: carrier.name || 'Partner Airline',
        airlineCode: carrier.iata_code || 'XX',
        logo: carrier.logo_symbol_url || null,
        flightNumber: segmentsList[0]?.flightNumber ? `${carrier.iata_code}-${segmentsList[0].flightNumber}` : 'FL-900',
        departure: segmentsList[0]?.departure || { iata: origin.toUpperCase(), time: '08:00', date: departureDate },
        arrival: segmentsList[segmentsList.length - 1]?.arrival || { iata: destination.toUpperCase(), time: '12:00', date: departureDate },
        duration: durationStr,
        stops: segmentsList.length > 1 ? `${segmentsList.length - 1} stop(s)` : 'Non-stop',
        pricePerPassenger: Math.round(parseFloat(offer.total_amount) / adults),
        totalPrice: Math.round(parseFloat(offer.total_amount)),
        currency: offer.total_currency || 'INR',
        passengers: offer.passengers?.map((p: any) => ({ id: p.id, type: p.type })) || [],
        slicesCount: offer.slices?.length || 1,
        baggage: offer.passenger_baggage_allowances || 'Standard cabin bag included'
      };
    });

    return results;

  } catch (err: any) {
    console.error('[Duffel searchDuffelFlights Catch Error]:', err.message);
    throw err;
  }
};

// 2. Revalidate / Retrieve Offer details
export const getDuffelOffer = async (offerId: string): Promise<any> => {
  if (!DUFFEL_TOKEN) {
    throw new Error('Duffel API Access Token is not configured.');
  }

  try {
    const response = await fetch(`${DUFFEL_BASE_URL}/air/offers/${offerId}`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[Duffel Offer Revalidation Error] HTTP ${response.status}:`, errText);
      throw new Error(`Duffel Offer retrieval failed: ${errText}`);
    }

    const resJson: any = await response.json();
    return resJson.data;
  } catch (err: any) {
    console.error('[Duffel getDuffelOffer Catch Error]:', err.message);
    throw err;
  }
};

// 3. Create Duffel Order
export const createDuffelOrder = async (
  offerId: string,
  passengersData: any[],
  userId: string
): Promise<any> => {
  if (!DUFFEL_TOKEN) {
    throw new Error('Duffel API Access Token is not configured.');
  }

  try {
    // A. Revalidate and get the latest offer mappings (specifically the passenger IDs from Duffel)
    console.log(`[Duffel] Revalidating offer ${offerId} before order creation...`);
    const offer = await getDuffelOffer(offerId);

    if (!offer) {
      throw new Error('Selected Duffel offer could not be loaded or is expired.');
    }

    const duffelPassengers = offer.passengers || [];
    if (duffelPassengers.length !== passengersData.length) {
      throw new Error(`Passenger count mismatch. Offer expects ${duffelPassengers.length} but received ${passengersData.length}.`);
    }

    // B. Build mapped passengers payload
    const passengersPayload = passengersData.map((p, index) => {
      const duffelPassenger = duffelPassengers[index];
      if (!duffelPassenger) {
        throw new Error('Could not match passenger record to Duffel offer passenger list.');
      }

      const passengerObj: any = {
        id: duffelPassenger.id,
        title: p.title?.toLowerCase() || 'mr',
        first_name: p.firstName,
        last_name: p.lastName,
        gender: p.gender?.toLowerCase() === 'male' ? 'm' : 'f',
        born_on: p.bornOn, // YYYY-MM-DD
        email: p.email,
        phone_number: p.phoneNumber,
        nationality: p.nationality?.toUpperCase() || 'IN'
      };

      // Passport details if needed
      if (p.passportNumber && p.passportExpiry) {
        passengerObj.identity_documents = [
          {
            type: 'passport',
            unique_identifier: p.passportNumber,
            issuing_country_code: p.passportIssuingCountry || p.nationality?.toUpperCase() || 'IN',
            expires_on: p.passportExpiry
          }
        ];
      }

      return passengerObj;
    });

    // C. Build payments block (Duffel test-mode expects payment type "balance")
    const totalAmount = offer.total_amount;
    const currency = offer.total_currency;

    const payload = {
      data: {
        selected_offers: [offerId],
        passengers: passengersPayload,
        payments: [
          {
            type: 'balance',
            currency: currency,
            amount: totalAmount
          }
        ]
      }
    };

    console.log('[Duffel] Posting Order Payload:', JSON.stringify(payload));
    const response = await fetch(`${DUFFEL_BASE_URL}/air/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[Duffel Order Failure] HTTP ${response.status}:`, errText);
      throw new Error(`Duffel Order Creation Failed: ${errText}`);
    }

    const resJson: any = await response.json();
    const order = resJson.data;

    return {
      orderId: order.id,
      bookingReference: order.booking_reference || 'PNR-PENDING',
      status: order.live_mode ? 'Confirmed' : 'Confirmed (Test Mode)',
      amount: parseFloat(order.total_amount),
      currency: order.total_currency,
      passengers: order.passengers,
      itinerary: order.slices,
      createdAt: order.created_at
    };

  } catch (err: any) {
    console.error('[Duffel createDuffelOrder Catch Error]:', err.message);
    throw err;
  }
};

// 4. Stays (Hotels) search checks
export const searchDuffelStays = async (
  cityCode: string,
  checkIn: string,
  checkOut: string,
  guests = 1
): Promise<any> => {
  if (!DUFFEL_TOKEN) {
    throw new Error('Duffel API Access Token is not configured.');
  }

  // We perform a real stays check to see if stays is enabled
  try {
    const staysPayload = {
      data: {
        rooms: 1,
        location: {
          radius: 10,
          geographic_coordinates: {
            latitude: 48.8566, // Default Paris checks
            longitude: 2.3522
          }
        },
        check_in_date: checkIn,
        check_out_date: checkOut,
        guests: Array.from({ length: guests }, () => ({ type: 'adult' }))
      }
    };

    const staysRes = await fetch(`${DUFFEL_BASE_URL}/stays/search`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(staysPayload)
    });

    if (!staysRes.ok) {
      const staysErr = await staysRes.text();
      console.warn(`[Duffel Stays Error Response]: ${staysErr}`);
      if (staysRes.status === 403 || staysErr.includes('not_enabled') || staysErr.includes('forbidden') || staysErr.includes('access_denied')) {
        throw new Error('Duffel Stays API access is blocked or needs account activation.');
      }
      throw new Error(`Duffel Stays search returned status ${staysRes.status}: ${staysErr}`);
    }

    const resJson: any = await staysRes.json();
    return resJson.data || [];
  } catch (err: any) {
    console.error('[Duffel searchDuffelStays Catch Error]:', err.message);
    throw err;
  }
};
