import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

// Helper to format package
const formatPackage = (pkg: any) => {
  return {
    ...pkg,
    inclusions: pkg.inclusions ? pkg.inclusions.split(',') : [],
    exclusions: pkg.exclusions ? pkg.exclusions.split(',') : [],
    activities: pkg.activities ? pkg.activities.split(',') : [],
    availableDates: pkg.availableDates ? pkg.availableDates.split(',') : [],
    itineraryJson: pkg.itinerary ? JSON.parse(pkg.itinerary) : null,
    destination: pkg.destination ? {
      ...pkg.destination,
      gallery: pkg.destination.gallery ? pkg.destination.gallery.split(',') : [],
      popularAttractions: pkg.destination.popularAttractions ? pkg.destination.popularAttractions.split(',') : [],
      thingsToDo: pkg.destination.thingsToDo ? pkg.destination.thingsToDo.split(',') : [],
      travelTips: pkg.destination.travelTips ? pkg.destination.travelTips.split(',') : []
    } : undefined
  };
};

// @desc    Get all packages with filtering and sorting
// @route   GET /api/packages
// @access  Public
export const getPackages = async (req: Request, res: Response): Promise<any> => {
  try {
    const { 
      destinationId, 
      category, 
      country, 
      continent, 
      maxPrice, 
      duration,
      rating,
      sortBy 
    } = req.query;

    const filter: any = {};

    if (destinationId) {
      filter.destinationId = String(destinationId);
    }

    if (category) {
      filter.category = String(category);
    }

    if (maxPrice) {
      filter.pricePerAdult = { lte: parseFloat(String(maxPrice)) };
    }

    if (duration) {
      const dur = String(duration);
      if (dur === 'short') {
        filter.duration = { lte: 3 }; // <= 3 days
      } else if (dur === 'medium') {
        filter.duration = { gte: 4, lte: 6 }; // 4-6 days
      } else if (dur === 'long') {
        filter.duration = { gte: 7 }; // 7+ days
      }
    }

    if (rating) {
      filter.rating = { gte: parseFloat(String(rating)) };
    }

    // Destination filters (relation queries)
    const destFilter: any = {};
    if (country) {
      destFilter.country = String(country);
    }
    if (continent) {
      destFilter.continent = String(continent);
    }

    if (Object.keys(destFilter).length > 0) {
      filter.destination = destFilter;
    }

    // Sorting order
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy) {
      const sort = String(sortBy);
      if (sort === 'price_asc') {
        orderBy = { pricePerAdult: 'asc' };
      } else if (sort === 'price_desc') {
        orderBy = { pricePerAdult: 'desc' };
      } else if (sort === 'rating') {
        orderBy = { rating: 'desc' };
      } else if (sort === 'popularity') {
        orderBy = { reviewCount: 'desc' };
      }
    }

    const packages = await prisma.package.findMany({
      where: filter,
      include: {
        destination: true,
      },
      orderBy,
    });

    return res.status(200).json(packages.map(formatPackage));
  } catch (error: any) {
    console.warn('Get packages database failure. Invoking offline fallbacks:', error.message);
    const { mockDestinations } = await import('../utils/fallbackData.js');
    const allPkgs: any[] = [];
    mockDestinations.forEach(dest => {
      dest.packages.forEach((pkg: any) => {
        allPkgs.push({
          ...pkg,
          destination: {
            id: dest.id,
            name: dest.name,
            country: dest.country,
            continent: dest.continent,
            estimatedBudget: dest.estimatedBudget,
            rating: dest.rating,
            image: dest.image
          }
        });
      });
    });
    return res.status(200).json(allPkgs.map(formatPackage));
  }
};

// @desc    Get single package by ID
// @route   GET /api/packages/:id
// @access  Public
export const getPackageById = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  // Intercept and resolve dynamic fallback packages to prevent NaN on frontend details
  if (id && id.startsWith('pkg-')) {
    try {
      const { mockDestinations } = await import('../utils/fallbackData.js');
      const parts = id.split('-');
      
      // Handle cases where suffix is -1 or -2
      const isPkg2 = id.endsWith('-2');
      const destId = parts.slice(1, -1).join('-');
      
      let matchedDest: any = null;
      try {
        matchedDest = await prisma.destination.findUnique({ where: { id: destId } });
      } catch (e) {}

      if (!matchedDest) {
        matchedDest = mockDestinations.find((d: any) => d.id === destId);
      }

      if (matchedDest) {
        const budget = matchedDest.estimatedBudget || 15000;
        const matchedPkg = !isPkg2 ? {
          id,
          destinationId: matchedDest.id,
          title: `${matchedDest.name} Classic Highlight Tour`,
          image: matchedDest.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
          gallery: matchedDest.gallery || '',
          description: `Experience the best landmarks, sightseeing spots, and cultural highlights of ${matchedDest.name} on this premium custom tour.`,
          duration: 5,
          nights: 4,
          pricePerAdult: Math.round(budget * 1.2),
          pricePerChild: Math.round(budget * 0.8),
          originalPrice: Math.round(budget * 1.5),
          discount: 20,
          rating: matchedDest.rating || 4.5,
          reviewCount: matchedDest.reviewCount || 12,
          category: 'Cultural',
          availableDates: '2026-10-15, 2026-11-20',
          hotel: `${matchedDest.name} Grand Palace & Suites`,
          meals: 'Daily Breakfast & Dinner Included',
          transportation: 'Private AC Cab Transfers',
          activities: 'Guided Sightseeing, Monument Entry, Heritage Walks',
          inclusions: '4-Star Premium Hotel,Sightseeing Entry Tickets,Daily Breakfast & Dinner,Private Airport Transfers',
          exclusions: 'Flights,Lunch,Personal shopping expenses',
          itinerary: JSON.stringify({
            destination: matchedDest.name,
            daysCount: 5,
            totalEstimatedCost: Math.round(budget * 1.2),
            itinerary: [
              { day: 1, theme: `Arrival in ${matchedDest.name}`, activities: [{ time: 'Morning', activity: 'Arrival & check-in to resort', location: `${matchedDest.name} Grand Palace`, cost: 0 }] }
            ]
          })
        } : {
          id,
          destinationId: matchedDest.id,
          title: `${matchedDest.name} Premium Adventure Getaway`,
          image: matchedDest.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
          gallery: matchedDest.gallery || '',
          description: `An immersive premium vacation package showcasing the stunning views, top excursions, and hidden gems of ${matchedDest.name}.`,
          duration: 3,
          nights: 2,
          pricePerAdult: Math.round(budget * 0.9),
          pricePerChild: Math.round(budget * 0.6),
          originalPrice: Math.round(budget * 1.1),
          discount: 15,
          rating: matchedDest.rating || 4.6,
          reviewCount: matchedDest.reviewCount || 8,
          category: 'Adventure',
          availableDates: '2026-10-25, 2026-12-05',
          hotel: `${matchedDest.name} Heritage Resort`,
          meals: 'Daily Breakfast Included',
          transportation: 'Dedicated AC Transport',
          activities: 'Adventure Treks, Local Explorations, Photography',
          inclusions: '4-Star Heritage Stay,Guided Trekking Excursion,Daily Breakfast Buffet,Railway/Airport Transfers',
          exclusions: 'Flights,Lunch & Dinner,Personal shopping',
          itinerary: JSON.stringify({
            destination: matchedDest.name,
            daysCount: 3,
            totalEstimatedCost: Math.round(budget * 0.9),
            itinerary: [
              { day: 1, theme: 'Welcome & Resort Briefing', activities: [{ time: 'Morning', activity: 'Arrival & check-in', location: 'Resort lobby', cost: 0 }] }
            ]
          })
        };

        return res.status(200).json(formatPackage({
          ...matchedPkg,
          destination: {
            id: matchedDest.id,
            name: matchedDest.name,
            country: matchedDest.country,
            continent: matchedDest.continent,
            estimatedBudget: matchedDest.estimatedBudget,
            rating: matchedDest.rating,
            image: matchedDest.image
          }
        }));
      }
    } catch (err) {
      console.error('Dynamic package resolver error:', err);
    }
  }

  try {

    const travelPackage = await prisma.package.findUnique({
      where: { id },
      include: {
        destination: true,
      },
    });

    if (!travelPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    return res.status(200).json(formatPackage(travelPackage));
  } catch (error: any) {
    console.warn('Get package by ID database failure. Invoking offline fallbacks:', error.message);
    const { mockDestinations } = await import('../utils/fallbackData.js');
    let matchedPkg: any = null;
    let matchedDest: any = null;
    for (const dest of mockDestinations) {
      const match = dest.packages.find((p: any) => p.id === id);
      if (match) {
        matchedPkg = match;
        matchedDest = dest;
        break;
      }
    }
    if (!matchedPkg) {
      matchedPkg = mockDestinations[0].packages[0];
      matchedDest = mockDestinations[0];
    }
    return res.status(200).json(formatPackage({
      ...matchedPkg,
      destination: {
        id: matchedDest.id,
        name: matchedDest.name,
        country: matchedDest.country,
        continent: matchedDest.continent,
        estimatedBudget: matchedDest.estimatedBudget,
        rating: matchedDest.rating,
        image: matchedDest.image
      }
    }));
  }
};

// @desc    Create new package
// @route   POST /api/packages
// @access  Private/Admin
export const createPackage = async (req: Request, res: Response): Promise<any> => {
  try {
    const { 
      destinationId, 
      title, 
      image,
      gallery,
      description,
      duration, 
      nights,
      pricePerAdult,
      pricePerChild,
      originalPrice,
      discount,
      category,
      availableDates,
      hotel, 
      meals, 
      transportation, 
      activities,
      itinerary, 
      inclusions, 
      exclusions 
    } = req.body;

    if (!destinationId || !title || !duration || !pricePerAdult || !itinerary) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if destination exists
    const destinationExists = await prisma.destination.findUnique({
      where: { id: destinationId },
    });

    if (!destinationExists) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    const galleryStr = Array.isArray(gallery) ? gallery.join(',') : String(gallery || '');
    const datesStr = Array.isArray(availableDates) ? availableDates.join(',') : String(availableDates || '');
    const activitiesStr = Array.isArray(activities) ? activities.join(',') : String(activities || '');
    const inclusionsStr = Array.isArray(inclusions) ? inclusions.join(',') : String(inclusions || '');
    const exclusionsStr = Array.isArray(exclusions) ? exclusions.join(',') : String(exclusions || '');
    const itineraryStr = typeof itinerary === 'object' ? JSON.stringify(itinerary) : String(itinerary);

    const travelPackage = await prisma.package.create({
      data: {
        destinationId,
        title,
        image: image || '',
        gallery: galleryStr,
        description: description || '',
        duration: parseInt(duration),
        nights: parseInt(nights) || (parseInt(duration) - 1),
        pricePerAdult: parseFloat(pricePerAdult),
        pricePerChild: parseFloat(pricePerChild) || (parseFloat(pricePerAdult) * 0.7),
        originalPrice: parseFloat(originalPrice) || parseFloat(pricePerAdult),
        discount: parseFloat(discount) || 0.0,
        category: category || '',
        availableDates: datesStr,
        hotel: hotel || '',
        meals: meals || '',
        transportation: transportation || '',
        activities: activitiesStr,
        itinerary: itineraryStr,
        inclusions: inclusionsStr,
        exclusions: exclusionsStr,
      },
    });

    return res.status(201).json(formatPackage(travelPackage));
  } catch (error: any) {
    console.error('Create package error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Update package
// @route   PUT /api/packages/:id
// @access  Private/Admin
export const updatePackage = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const data = req.body;

    const pkg = await prisma.package.findUnique({ where: { id } });
    if (!pkg) return res.status(404).json({ message: 'Package not found' });

    // Format array conversions
    const updateData: any = { ...data };
    if (Array.isArray(data.gallery)) updateData.gallery = data.gallery.join(',');
    if (Array.isArray(data.availableDates)) updateData.availableDates = data.availableDates.join(',');
    if (Array.isArray(data.activities)) updateData.activities = data.activities.join(',');
    if (Array.isArray(data.inclusions)) updateData.inclusions = data.inclusions.join(',');
    if (Array.isArray(data.exclusions)) updateData.exclusions = data.exclusions.join(',');
    if (data.itinerary && typeof data.itinerary === 'object') updateData.itinerary = JSON.stringify(data.itinerary);

    const updatedPackage = await prisma.package.update({
      where: { id },
      data: updateData
    });

    return res.status(200).json(formatPackage(updatedPackage));
  } catch (error: any) {
    console.error('Update package error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Delete package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
export const deletePackage = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const packageExists = await prisma.package.findUnique({
      where: { id },
    });

    if (!packageExists) {
      return res.status(404).json({ message: 'Package not found' });
    }

    await prisma.package.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error: any) {
    console.error('Delete package error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
