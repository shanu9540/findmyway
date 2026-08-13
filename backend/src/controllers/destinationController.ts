import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

// Helper to format destination for client
const formatDestination = (dest: any) => {
  return {
    ...dest,
    gallery: dest.gallery ? dest.gallery.split(',') : [],
    popularAttractions: dest.popularAttractions ? dest.popularAttractions.split(',') : [],
    thingsToDo: dest.thingsToDo ? dest.thingsToDo.split(',') : [],
    travelTips: dest.travelTips ? dest.travelTips.split(',') : [],
    packages: dest.packages ? dest.packages.map((pkg: any) => ({
      ...pkg,
      inclusions: pkg.inclusions ? pkg.inclusions.split(',') : [],
      exclusions: pkg.exclusions ? pkg.exclusions.split(',') : [],
      activities: pkg.activities ? pkg.activities.split(',') : [],
      availableDates: pkg.availableDates ? pkg.availableDates.split(',') : [],
      itineraryJson: pkg.itinerary ? JSON.parse(pkg.itinerary) : null
    })) : []
  };
};

// @desc    Get all destinations with optional filters
// @route   GET /api/destinations
// @access  Public
export const getDestinations = async (req: Request, res: Response): Promise<any> => {
  try {
    const { search, category, country, continent, region, maxPrice } = req.query;

    const filter: any = {};

    if (search) {
      filter.OR = [
        { name: { contains: String(search) } },
        { city: { contains: String(search) } },
        { country: { contains: String(search) } },
        { popularAttractions: { contains: String(search) } }
      ];
    }

    if (category) {
      filter.category = { equals: String(category) };
    }

    if (country) {
      filter.country = { equals: String(country) };
    }

    if (continent) {
      filter.continent = { equals: String(continent) };
    }

    if (region) {
      filter.region = { equals: String(region) };
    }

    if (maxPrice) {
      filter.estimatedBudget = { lte: parseFloat(String(maxPrice)) };
    }

    const destinations = await prisma.destination.findMany({
      where: filter,
      include: {
        packages: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Calculate dynamic average rating if reviews exist
    const destinationsWithRatings = destinations.map((dest) => {
      const reviewCount = dest.reviews.length;
      const averageRating =
        reviewCount > 0
          ? dest.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
          : dest.rating;

      const formatted = formatDestination(dest);

      return {
        ...formatted,
        rating: Math.round(averageRating * 10) / 10,
        reviewCount: dest.reviewCount + reviewCount, // Combine seeded count and user reviews
      };
    });

    return res.status(200).json(destinationsWithRatings);
  } catch (error: any) {
    console.warn('Get destinations database failure. Invoking offline fallbacks:', error.message);
    const { mockDestinations } = await import('../utils/fallbackData.js');
    const { search, category, continent, region, maxPrice } = req.query;

    let filtered = [...mockDestinations];

    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.popularAttractions.toLowerCase().includes(q)
      );
    }

    if (category) {
      filtered = filtered.filter(d => d.category.toLowerCase() === String(category).toLowerCase());
    }

    if (region) {
      filtered = filtered.filter(d => d.region.toLowerCase() === String(region).toLowerCase());
    }

    if (continent) {
      filtered = filtered.filter(d => d.continent.toLowerCase() === String(continent).toLowerCase());
    }

    if (maxPrice) {
      filtered = filtered.filter(d => d.estimatedBudget <= parseFloat(String(maxPrice)));
    }

    return res.status(200).json(filtered.map(d => ({
      ...d,
      gallery: d.gallery ? d.gallery.split(',') : [],
      popularAttractions: d.popularAttractions ? d.popularAttractions.split(',') : [],
      thingsToDo: d.thingsToDo ? d.thingsToDo.split(',') : [],
      travelTips: d.travelTips ? d.travelTips.split(',') : [],
      reviews: [],
      packages: d.packages ? d.packages.map((p: any) => ({
        ...p,
        inclusions: p.inclusions ? p.inclusions.split(',') : [],
        exclusions: p.exclusions ? p.exclusions.split(',') : [],
        activities: p.activities ? p.activities.split(',') : [],
        availableDates: p.availableDates ? p.availableDates.split(',') : [],
        itineraryJson: p.itinerary ? JSON.parse(p.itinerary) : null
      })) : []
    })));
  }
};

// @desc    Get single destination by ID
// @route   GET /api/destinations/:id
// @access  Public
export const getDestinationById = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {

    const destination = await prisma.destination.findUnique({
      where: { id },
      include: {
        packages: true,
        reviews: {
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
        },
      },
    });

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    const reviewCount = destination.reviews.length;
    const averageRating =
      reviewCount > 0
        ? destination.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : destination.rating;

    const formatted = formatDestination(destination);

    // If destination has no packages, generate high-quality fallback packages dynamically
    if (!formatted.packages || formatted.packages.length === 0) {
      formatted.packages = [
        {
          id: `pkg-${destination.id}-1`,
          destinationId: destination.id,
          title: `${destination.name} Classic Highlight Tour`,
          image: destination.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
          gallery: destination.gallery || '',
          description: `Experience the best landmarks, sightseeing spots, and cultural highlights of ${destination.name} on this premium custom tour.`,
          duration: 5,
          nights: 4,
          pricePerAdult: Math.round(destination.estimatedBudget * 1.2),
          pricePerChild: Math.round(destination.estimatedBudget * 0.8),
          originalPrice: Math.round(destination.estimatedBudget * 1.5),
          discount: 20,
          rating: destination.rating || 4.5,
          reviewCount: destination.reviewCount || 12,
          category: 'Cultural',
          availableDates: '2026-10-15, 2026-11-20',
          hotel: `${destination.name} Grand Palace & Suites`,
          meals: 'Daily Breakfast & Dinner Included',
          transportation: 'Private AC Cab Transfers',
          activities: 'Guided Sightseeing, Monument Entry, Heritage Walks',
          inclusions: ['4-Star Premium Hotel', 'Sightseeing Entry Tickets', 'Daily Breakfast & Dinner', 'Private Airport Transfers'],
          exclusions: ['Flights', 'Lunch', 'Personal shopping expenses'],
          itineraryJson: {
            destination: destination.name,
            daysCount: 5,
            totalEstimatedCost: Math.round(destination.estimatedBudget * 1.2),
            itinerary: [
              { day: 1, theme: `Arrival in ${destination.name}`, activities: [{ time: 'Morning', activity: 'Arrival & check-in to resort', location: `${destination.name} Grand Palace`, cost: 0 }, { time: 'Evening', activity: 'Sunset Leisure Walk', location: 'City Center', cost: 0 }] },
              { day: 2, theme: 'Guided Landmark Excursion', activities: [{ time: 'Morning', activity: 'Scenic sightseeing tour of top attractions', location: destination.name, cost: 0 }] },
              { day: 3, theme: 'Cultural Highlights & Markets', activities: [{ time: 'Morning', activity: 'Explore local traditional markets and foods', location: 'Local Bazaars', cost: 0 }] },
              { day: 4, theme: 'Leisure Day & Shopping', activities: [{ time: 'Morning', activity: 'Self-guided walks and souvenir shopping', location: 'Local Area', cost: 0 }] },
              { day: 5, theme: 'Departure Transfers', activities: [{ time: 'Morning', activity: 'Check-out & airport drop-off transfers', location: 'Airport', cost: 0 }] }
            ]
          }
        },
        {
          id: `pkg-${destination.id}-2`,
          destinationId: destination.id,
          title: `${destination.name} Premium Adventure Getaway`,
          image: destination.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
          gallery: destination.gallery || '',
          description: `An immersive premium vacation package showcasing the stunning views, top excursions, and hidden gems of ${destination.name}.`,
          duration: 3,
          nights: 2,
          pricePerAdult: Math.round(destination.estimatedBudget * 0.9),
          pricePerChild: Math.round(destination.estimatedBudget * 0.6),
          originalPrice: Math.round(destination.estimatedBudget * 1.1),
          discount: 15,
          rating: destination.rating || 4.6,
          reviewCount: destination.reviewCount || 8,
          category: 'Adventure',
          availableDates: '2026-10-25, 2026-12-05',
          hotel: `${destination.name} Heritage Resort`,
          meals: 'Daily Breakfast Included',
          transportation: 'Dedicated AC Transport',
          activities: 'Adventure Treks, Local Explorations, Photography',
          inclusions: ['4-Star Heritage Stay', 'Guided Trekking Excursion', 'Daily Breakfast Buffet', 'Railway/Airport Transfers'],
          exclusions: ['Flights', 'Lunch & Dinner', 'Personal shopping'],
          itineraryJson: {
            destination: destination.name,
            daysCount: 3,
            totalEstimatedCost: Math.round(destination.estimatedBudget * 0.9),
            itinerary: [
              { day: 1, theme: 'Welcome & Resort Briefing', activities: [{ time: 'Morning', activity: 'Arrival & check-in', location: 'Resort lobby', cost: 0 }] },
              { day: 2, theme: 'Adventure Activity Day', activities: [{ time: 'Morning', activity: 'Guided local adventure activity', location: destination.name, cost: 0 }] },
              { day: 3, theme: 'Farewell Transfers', activities: [{ time: 'Morning', activity: 'Check-out & departure transfers', location: 'Airport', cost: 0 }] }
            ]
          }
        }
      ];
    }

    // Fetch related destinations (same continent, excluding current)
    const related = await prisma.destination.findMany({
      where: {
        continent: destination.continent,
        id: { not: destination.id }
      },
      take: 4,
      select: {
        id: true,
        name: true,
        country: true,
        image: true,
        estimatedBudget: true,
        rating: true
      }
    });

    return res.status(200).json({
      ...formatted,
      rating: Math.round(averageRating * 10) / 10,
      reviewCount: destination.reviewCount + reviewCount,
      relatedDestinations: related
    });
  } catch (error: any) {
    console.warn('Get destination by ID database failure. Invoking offline fallbacks:', error.message);
    const { mockDestinations } = await import('../utils/fallbackData.js');
    const matched = mockDestinations.find(d => d.id === id) || mockDestinations[0];
    return res.status(200).json({
      ...matched,
      gallery: matched.gallery ? matched.gallery.split(',') : [],
      popularAttractions: matched.popularAttractions ? matched.popularAttractions.split(',') : [],
      thingsToDo: matched.thingsToDo ? matched.thingsToDo.split(',') : [],
      travelTips: matched.travelTips ? matched.travelTips.split(',') : [],
      reviews: [],
      packages: matched.packages ? matched.packages.map((p: any) => ({
        ...p,
        inclusions: p.inclusions ? p.inclusions.split(',') : [],
        exclusions: p.exclusions ? p.exclusions.split(',') : [],
        activities: p.activities ? p.activities.split(',') : [],
        availableDates: p.availableDates ? p.availableDates.split(',') : [],
        itineraryJson: p.itinerary ? JSON.parse(p.itinerary) : null
      })) : [],
      relatedDestinations: mockDestinations.filter(d => d.id !== matched.id).slice(0, 3).map(d => ({
        id: d.id,
        name: d.name,
        country: d.country,
        image: d.image,
        estimatedBudget: d.estimatedBudget,
        rating: d.rating
      }))
    });
  }
};

// @desc    Create new destination
// @route   POST /api/destinations
// @access  Private/Admin
export const createDestination = async (req: Request, res: Response): Promise<any> => {
  try {
    const { 
      name, 
      city,
      country, 
      continent,
      description, 
      image, 
      gallery,
      bestTimeToVisit,
      averageDuration,
      estimatedBudget,
      popularAttractions,
      thingsToDo,
      travelTips
    } = req.body;

    if (!name || !country || !continent || !description || !estimatedBudget) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const galleryStr = Array.isArray(gallery) ? gallery.join(',') : String(gallery || '');
    const attractionsStr = Array.isArray(popularAttractions) ? popularAttractions.join(',') : String(popularAttractions || '');
    const thingsStr = Array.isArray(thingsToDo) ? thingsToDo.join(',') : String(thingsToDo || '');
    const tipsStr = Array.isArray(travelTips) ? travelTips.join(',') : String(travelTips || '');

    const destination = await prisma.destination.create({
      data: {
        name,
        city: city || name,
        country,
        continent,
        description,
        image: image || '',
        gallery: galleryStr,
        bestTimeToVisit: bestTimeToVisit || '',
        averageDuration: averageDuration || '',
        estimatedBudget: parseFloat(estimatedBudget),
        popularAttractions: attractionsStr,
        thingsToDo: thingsStr,
        travelTips: tipsStr,
      },
    });

    return res.status(201).json(formatDestination(destination));
  } catch (error: any) {
    console.error('Create destination error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Update destination
// @route   PUT /api/destinations/:id
// @access  Private/Admin
export const updateDestination = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const data = req.body;

    const dest = await prisma.destination.findUnique({ where: { id } });
    if (!dest) return res.status(404).json({ message: 'Destination not found' });

    // Format fields if they are arrays
    const updateData: any = { ...data };
    if (Array.isArray(data.gallery)) updateData.gallery = data.gallery.join(',');
    if (Array.isArray(data.popularAttractions)) updateData.popularAttractions = data.popularAttractions.join(',');
    if (Array.isArray(data.thingsToDo)) updateData.thingsToDo = data.thingsToDo.join(',');
    if (Array.isArray(data.travelTips)) updateData.travelTips = data.travelTips.join(',');
    if (data.estimatedBudget !== undefined) updateData.estimatedBudget = parseFloat(data.estimatedBudget);

    const updated = await prisma.destination.update({
      where: { id },
      data: updateData
    });

    return res.status(200).json(formatDestination(updated));
  } catch (error: any) {
    console.error('Update destination error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Delete destination
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
export const deleteDestination = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const destinationExists = await prisma.destination.findUnique({
      where: { id },
    });

    if (!destinationExists) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    await prisma.destination.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Destination deleted successfully' });
  } catch (error: any) {
    console.error('Delete destination error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Toggle wishlist item
// @route   POST /api/destinations/:id/wishlist
// @access  Private
export const toggleWishlist = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const exists = await prisma.wishlist.findUnique({
      where: {
        userId_destinationId: {
          userId,
          destinationId: id,
        },
      },
    });

    if (exists) {
      await prisma.wishlist.delete({
        where: {
          userId_destinationId: {
            userId,
            destinationId: id,
          },
        },
      });
      return res.status(200).json({ message: 'Removed from wishlist', isWishlisted: false });
    } else {
      await prisma.wishlist.create({
        data: {
          userId,
          destinationId: id,
        },
      });
      return res.status(200).json({ message: 'Added to wishlist', isWishlisted: true });
    }
  } catch (error: any) {
    console.error('Toggle wishlist error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Get user wishlist
// @route   GET /api/destinations/wishlist/my
// @access  Private
export const getMyWishlist = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        destination: {
          include: {
            packages: true,
          },
        },
      },
    });

    return res.status(200).json(wishlist.map(w => formatDestination(w.destination)));
  } catch (error: any) {
    console.error('Get wishlist error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
