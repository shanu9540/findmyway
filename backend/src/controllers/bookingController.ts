import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { BookingStatus, Role } from '../types/enums.js';
import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
let stripe: Stripe | null = null;

if (stripeSecret && !stripeSecret.startsWith('your_')) {
  stripe = new Stripe(stripeSecret);
}

// Helper to format booking objects
const formatBooking = (booking: any) => {
  if (!booking) return null;
  return {
    ...booking,
    package: booking.package ? {
      ...booking.package,
      inclusions: booking.package.inclusions ? booking.package.inclusions.split(',') : [],
      exclusions: booking.package.exclusions ? booking.package.exclusions.split(',') : [],
      activities: booking.package.activities ? booking.package.activities.split(',') : [],
      availableDates: booking.package.availableDates ? booking.package.availableDates.split(',') : [],
      itineraryJson: booking.package.itinerary ? JSON.parse(booking.package.itinerary) : null,
      destination: booking.package.destination ? {
        ...booking.package.destination,
        gallery: booking.package.destination.gallery ? booking.package.destination.gallery.split(',') : [],
        popularAttractions: booking.package.destination.popularAttractions ? booking.package.destination.popularAttractions.split(',') : [],
        thingsToDo: booking.package.destination.thingsToDo ? booking.package.destination.thingsToDo.split(',') : [],
        travelTips: booking.package.destination.travelTips ? booking.package.destination.travelTips.split(',') : []
      } : undefined
    } : null
  };
};

import { randomUUID } from 'crypto';

interface MemoryBooking {
  id: string;
  userId: string;
  packageId: string;
  fullName: string;
  email: string;
  phone: string;
  travelDate: Date;
  adultsCount: number;
  childrenCount: number;
  roomsCount: number;
  specialRequests?: string | null;
  subtotal: number;
  taxes: number;
  discount: number;
  totalPrice: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  package: any;
}

export const memoryBookings: MemoryBooking[] = [];

// @desc    Create a new booking and calculate prices dynamically
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req: Request, res: Response): Promise<any> => {
  try {
    const { 
      packageId, 
      travelDate, 
      adultsCount, 
      childrenCount, 
      roomsCount, 
      fullName, 
      email, 
      phone, 
      specialRequests 
    } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!packageId || !travelDate || !fullName || !email || !phone) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Find package details
    let travelPackage: any = null;
    try {
      travelPackage = await prisma.package.findUnique({
        where: { id: packageId },
        include: { destination: true },
      });
    } catch (e) {
      console.warn('Prisma package lookup failed. Using offline fallbacks...');
    }

    if (!travelPackage) {
      // Look up package in mockDestinations
      const { mockDestinations } = await import('../utils/fallbackData.js');
      for (const dest of mockDestinations) {
        const match = dest.packages.find((p: any) => p.id === packageId);
        if (match) {
          travelPackage = {
            ...match,
            destination: dest
          };
          break;
        }
      }
    }

    if (!travelPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    const adults = parseInt(adultsCount) || 1;
    const children = parseInt(childrenCount) || 0;
    const rooms = parseInt(roomsCount) || 1;

    // Calculate subtotal, discount, taxes and total price (in INR)
    const basePrice = travelPackage.originalPrice || 120000;
    const discountPercent = travelPackage.discount || 20;
    const subtotal = (adults * basePrice) + (children * Math.round(basePrice * 0.65));
    const discount = Math.round(subtotal * (discountPercent / 100));
    const taxes = Math.round((subtotal - discount) * 0.10); // 10% tax rate
    const totalPrice = subtotal - discount + taxes;

    try {
      // Create booking in database (status: Confirmed by default for demo checkout flow)
      const booking = await prisma.booking.create({
        data: {
          userId,
          packageId,
          fullName,
          email,
          phone,
          travelDate: new Date(travelDate),
          adultsCount: adults,
          childrenCount: children,
          roomsCount: rooms,
          specialRequests,
          subtotal,
          taxes,
          discount,
          totalPrice,
          status: 'Confirmed',
        },
        include: {
          package: {
            include: {
              destination: true,
            },
          },
        },
      });

      const formattedBooking = formatBooking(booking);

      return res.status(201).json({
        message: 'Booking created and confirmed successfully',
        booking: formattedBooking,
        checkoutUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/booking/mock-pay?bookingId=${booking.id}`,
      });
    } catch (dbErr: any) {
      console.warn('Prisma booking create failed. Using memory fallback:', dbErr.message);
      const bookingId = randomUUID();
      const mockBooking: MemoryBooking = {
        id: bookingId,
        userId,
        packageId,
        fullName,
        email,
        phone,
        travelDate: new Date(travelDate),
        adultsCount: adults,
        childrenCount: children,
        roomsCount: rooms,
        specialRequests,
        subtotal,
        taxes,
        discount,
        totalPrice,
        status: 'Confirmed',
        createdAt: new Date(),
        updatedAt: new Date(),
        package: travelPackage
      };

      memoryBookings.push(mockBooking);

      const formattedBooking = formatBooking(mockBooking);

      return res.status(201).json({
        message: 'Booking created and confirmed successfully',
        booking: formattedBooking,
        checkoutUrl: `/booking/mock-pay?bookingId=${bookingId}`,
      });
    }
  } catch (error: any) {
    console.error('Create booking error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Mock pay a booking (Confirm a booking manually for testing)
// @route   POST /api/bookings/:id/confirm-mock
// @access  Private
export const confirmMockPayment = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    let booking: any = null;
    try {
      booking = await prisma.booking.findUnique({
        where: { id },
      });
    } catch (e) {
      console.warn('Prisma lookup failed in confirmMockPayment. Checking memory store...');
    }

    if (!booking) {
      booking = memoryBookings.find(b => b.id === id);
    }

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to pay for this booking' });
    }

    try {
      const updatedBooking = await prisma.booking.update({
        where: { id },
        data: { status: 'Confirmed' },
        include: {
          package: {
            include: {
              destination: true,
            },
          },
        },
      });

      return res.status(200).json({
        message: 'Booking payment confirmed successfully (Mock Gateway)',
        booking: formatBooking(updatedBooking),
      });
    } catch (dbErr) {
      console.warn('Prisma booking update failed on confirm payment. Saving in memory fallback...');
      booking.status = 'Confirmed';
      return res.status(200).json({
        message: 'Booking payment confirmed successfully (Mock Gateway)',
        booking: formatBooking(booking),
      });
    }
  } catch (error: any) {
    console.error('Confirm mock payment error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Get bookings for logged-in user
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    let bookings: any[] = [];
    try {
      bookings = await prisma.booking.findMany({
        where: { userId },
        include: {
          package: {
            include: {
              destination: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (e) {
      console.warn('Prisma getMyBookings failed. Checking memoryBookings fallback...');
    }

    const userMemBookings = memoryBookings.filter(b => b.userId === userId);
    const combined = [...bookings, ...userMemBookings];
    combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.status(200).json(combined.map(formatBooking));
  } catch (error: any) {
    console.error('Get my bookings error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req: Request, res: Response): Promise<any> => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        package: {
          include: {
            destination: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(bookings.map(formatBooking));
  } catch (error: any) {
    console.error('Get all bookings error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Confirmed', 'Pending', 'Cancelled', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid booking status' });
    }

    const bookingExists = await prisma.booking.findUnique({
      where: { id },
    });

    if (!bookingExists) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: status },
    });

    return res.status(200).json(formatBooking(updatedBooking));
  } catch (error: any) {
    console.error('Update booking status error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
