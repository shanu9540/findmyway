import { Request, Response } from 'express';
import { accommodationService } from '../services/accommodation/index.js';

export const getStays = async (req: Request, res: Response): Promise<any> => {
  try {
    const { cityCode, checkIn, checkOut, guests } = req.query;

    if (!cityCode || !checkIn || !checkOut) {
      return res.status(400).json({ message: 'Parameters cityCode, checkIn, and checkOut are required.' });
    }

    const guestsCount = parseInt(String(guests || '1')) || 1;

    const properties = await accommodationService.searchStays({
      cityCode: String(cityCode),
      checkIn: String(checkIn),
      checkOut: String(checkOut),
      guests: guestsCount
    });

    return res.status(200).json(properties);
  } catch (error: any) {
    console.error('[Stay Controller Search Error]:', error);
    return res.status(500).json({
      message: 'Failed to search accommodations from provider.',
      error: error.message
    });
  }
};

export const getStayDetails = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Stay ID is required.' });
    }

    const property = await accommodationService.getProperty(id);
    if (!property) {
      return res.status(404).json({ message: 'Accommodation not found.' });
    }

    return res.status(200).json(property);
  } catch (error: any) {
    console.error('[Stay Controller Details Error]:', error);
    return res.status(500).json({
      message: 'Failed to retrieve stay details.',
      error: error.message
    });
  }
};

export const getStayRooms = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Stay ID is required.' });
    }

    const rooms = await accommodationService.getRooms(id);
    return res.status(200).json(rooms);
  } catch (error: any) {
    console.error('[Stay Controller Rooms Error]:', error);
    return res.status(500).json({
      message: 'Failed to retrieve room plans.',
      error: error.message
    });
  }
};

export const bookStay = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      propertyId,
      roomId,
      rateId,
      checkIn,
      checkOut,
      fullName,
      email,
      phone,
      specialRequests,
      guests
    } = req.body;

    if (!propertyId || !roomId || !rateId || !checkIn || !checkOut || !fullName || !email || !phone) {
      return res.status(400).json({ message: 'Missing required booking confirmation fields.' });
    }

    const guestsCount = parseInt(String(guests || '1')) || 1;

    const result = await accommodationService.createBooking({
      propertyId,
      roomId,
      rateId,
      checkIn,
      checkOut,
      fullName,
      email,
      phone,
      specialRequests,
      guestsCount
    });

    return res.status(201).json(result);
  } catch (error: any) {
    console.error('[Stay Controller Booking Error]:', error);
    return res.status(500).json({
      message: 'Failed to create stay booking with provider.',
      error: error.message
    });
  }
};
