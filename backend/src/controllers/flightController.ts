import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { searchDuffelFlights, createDuffelOrder, getDuffelOffer } from '../services/duffelService.js';

// 1. Search Flights Offer Requests
export const getFlightOffers = async (req: Request, res: Response): Promise<any> => {
  try {
    const { origin, destination, date, returnDate, passengers, cabinClass } = req.query;

    if (!origin || !destination || !date) {
      return res.status(400).json({ message: 'Origin, destination, and departure date are required.' });
    }

    const adultsCount = parseInt(String(passengers || '1')) || 1;
    const flights = await searchDuffelFlights(
      String(origin),
      String(destination),
      String(date),
      returnDate ? String(returnDate) : undefined,
      adultsCount,
      cabinClass ? String(cabinClass) : 'economy'
    );

    return res.status(200).json(flights);
  } catch (error: any) {
    console.error('[Flight Controller Search Error]:', error);
    return res.status(500).json({ message: 'Error querying flights from Duffel API.', error: error.message });
  }
};

// 2. Revalidate Flight Offer
export const revalidateFlightOffer = async (req: Request, res: Response): Promise<any> => {
  try {
    const { offerId } = req.params;
    if (!offerId) {
      return res.status(400).json({ message: 'Offer ID is required.' });
    }

    const offer = await getDuffelOffer(offerId);
    return res.status(200).json(offer);
  } catch (error: any) {
    console.error('[Flight Controller Revalidation Error]:', error);
    return res.status(500).json({ message: 'Error revalidating flight offer with Duffel API.', error: error.message });
  }
};

// 3. Book Flight / Place Duffel Order
export const bookFlight = async (req: Request, res: Response): Promise<any> => {
  try {
    const { offerId, passengers } = req.body;

    if (!offerId || !passengers || !Array.isArray(passengers) || passengers.length === 0) {
      return res.status(400).json({ message: 'Offer ID and a valid list of passengers are required.' });
    }

    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required to book flights.' });
    }

    console.log(`[Flight Controller] Creating order for user: ${userId}, offer: ${offerId}`);
    
    // Call Duffel API order service
    const order = await createDuffelOrder(offerId, passengers, userId);

    // Save Duffel Booking in SQLite database
    const dbBooking = await prisma.duffelBooking.create({
      data: {
        userId: userId,
        provider: 'duffel',
        providerOrderId: order.orderId,
        bookingReference: order.bookingReference,
        status: order.status,
        type: 'flight',
        amount: order.amount,
        currency: order.currency,
        passengerInfo: JSON.stringify(order.passengers),
        itinerary: JSON.stringify(order.itinerary)
      }
    });

    return res.status(201).json({
      message: 'Flight booking successfully confirmed by Duffel.',
      booking: dbBooking,
      order: order
    });

  } catch (error: any) {
    console.error('[Flight Controller Booking Error]:', error);
    return res.status(500).json({
      message: 'Failed to create Duffel flight booking.',
      error: error.message || 'An unknown network error occurred.'
    });
  }
};

// 4. Get User's Duffel Bookings
export const getMyDuffelBookings = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const bookings = await prisma.duffelBooking.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' }
    });

    const parsedBookings = bookings.map((b) => ({
      ...b,
      passengerInfo: JSON.parse(b.passengerInfo),
      itinerary: JSON.parse(b.itinerary)
    }));

    return res.status(200).json(parsedBookings);
  } catch (error: any) {
    console.error('[Flight Controller getMyDuffelBookings Error]:', error);
    return res.status(500).json({ message: 'Error retrieving user bookings.', error: error.message });
  }
};
