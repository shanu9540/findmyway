import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { Role } from '../types/enums.js';

// Helper to format booking objects
const formatBooking = (booking: any) => {
  if (!booking) return null;
  return {
    ...booking,
    package: booking.package ? {
      ...booking.package,
      inclusions: booking.package.inclusions ? booking.package.inclusions.split(',') : [],
      itineraryJson: booking.package.itineraryJson ? JSON.parse(booking.package.itineraryJson) : null,
      destination: booking.package.destination ? {
        ...booking.package.destination,
        images: booking.package.destination.images ? booking.package.destination.images.split(',') : []
      } : undefined
    } : null
  };
};

// @desc    Get dashboard analytics stats
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
export const getDashboardStats = async (req: Request, res: Response): Promise<any> => {
  try {
    // 1. Total bookings count
    const totalBookings = await prisma.booking.count();

    // 2. Total revenue (sum of totalPrice for CONFIRMED bookings)
    const revenueAggregate = await prisma.booking.aggregate({
      where: {
        status: 'CONFIRMED',
      },
      _sum: {
        totalPrice: true,
      },
    });
    const totalRevenue = revenueAggregate._sum.totalPrice || 0;

    // 3. Total users count
    const totalUsers = await prisma.user.count();

    // 4. Total destinations count
    const totalDestinations = await prisma.destination.count();

    // 5. Popular packages / destinations breakdown
    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
        package: {
          include: { destination: true },
        },
      },
    });

    // Simple analysis of popular categories
    const destinations = await prisma.destination.findMany({
      include: {
        _count: {
          select: { reviews: true },
        },
      },
    });

    return res.status(200).json({
      stats: {
        totalBookings,
        totalRevenue,
        totalUsers,
        totalDestinations,
      },
      recentBookings: recentBookings.map(formatBooking),
      destinations: destinations.map(d => ({
        id: d.id,
        name: d.name,
        country: d.country,
        price: d.estimatedBudget,
        rating: d.rating,
        images: d.image ? [d.image] : [],
        reviewsCount: d._count.reviews,
      })),
    });
  } catch (error: any) {
    console.error('Get dashboard stats error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(users);
  } catch (error: any) {
    console.error('Get admin users error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ message: 'Invalid user role' });
    }

    const userExists = await prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error('Update user role error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.user?.id) {
      return res.status(400).json({ message: 'You cannot delete your own admin account.' });
    }

    const userExists = await prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    await prisma.user.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Delete user error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
