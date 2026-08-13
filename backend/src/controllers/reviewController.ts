import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

// @desc    Create a new review for a destination
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req: Request, res: Response): Promise<any> => {
  try {
    const { destinationId, rating, comment } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!destinationId || rating === undefined || !comment) {
      return res.status(400).json({ message: 'Please provide destinationId, rating, and comment.' });
    }

    const ratingVal = parseInt(rating);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    // Verify destination exists
    const destination = await prisma.destination.findUnique({
      where: { id: destinationId },
    });

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found.' });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId,
        destinationId,
        rating: ratingVal,
        comment,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // Recalculate average rating for the destination
    const allReviews = await prisma.review.findMany({
      where: { destinationId },
      select: { rating: true },
    });

    const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.destination.update({
      where: { id: destinationId },
      data: {
        rating: Math.round(averageRating * 10) / 10,
      },
    });

    return res.status(201).json(review);
  } catch (error: any) {
    console.error('Create review error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Get reviews for a specific destination
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req: Request, res: Response): Promise<any> => {
  try {
    const { destinationId } = req.query;

    if (!destinationId) {
      return res.status(400).json({ message: 'Please specify destinationId query parameter.' });
    }

    const reviews = await prisma.review.findMany({
      where: { destinationId: String(destinationId) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(reviews);
  } catch (error: any) {
    console.error('Get reviews error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
