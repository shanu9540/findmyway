import { Request, Response } from 'express';
import { searchDuffelStays } from '../services/duffelService.js';

export const getHotelOffers = async (req: Request, res: Response): Promise<any> => {
  try {
    const { cityCode, checkIn, checkOut, guests } = req.query;

    if (!cityCode || !checkIn || !checkOut) {
      return res.status(400).json({ message: 'City code, check-in, and check-out dates are required.' });
    }

    const guestsCount = parseInt(String(guests || '1')) || 1;
    
    // Attempt to query real Duffel Stays
    try {
      const hotels = await searchDuffelStays(
        String(cityCode),
        String(checkIn),
        String(checkOut),
        guestsCount
      );

      return res.status(200).json(hotels);
    } catch (duffelErr: any) {
      console.warn('[Hotel Controller] Duffel API query failed, falling back to local Mock Stays Provider:', duffelErr.message);
      const { MockProvider } = await import('../services/accommodation/mockProvider.js');
      const mockProviderInstance = new MockProvider();
      const mockHotels = await mockProviderInstance.searchStays({
        cityCode: String(cityCode),
        checkIn: String(checkIn),
        checkOut: String(checkOut),
        guests: guestsCount
      });
      return res.status(200).json(mockHotels);
    }
  } catch (error: any) {
    console.error('[Hotel Controller Error]:', error);
    
    if (error.message.includes('access is blocked') || error.message.includes('not enabled') || error.message.includes('403')) {
      return res.status(403).json({
        message: 'Duffel Stays API access is disabled for this account. Stays access needs to be enabled by Duffel sales.',
        error: error.message
      });
    }

    return res.status(500).json({
      message: 'Failed to query hotel offers from Duffel API.',
      error: error.message
    });
  }
};
