import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing database
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.package.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.user.deleteMany();

  console.log('- Cleaned existing database entries.');

  // 1. Create Destinations
  const paris = await prisma.destination.create({
    data: {
      name: 'Paris',
      country: 'France',
      category: 'Cultural',
      price: 1200,
      images: [
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1509060464153-4466739f78d0?auto=format&fit=crop&w=800&q=80',
      ].join(','),
      rating: 4.8,
      description: 'The City of Light is a global center for art, fashion, gastronomy, and culture. Famous for landmarks like the Eiffel Tower, the Louvre Museum, and Notre-Dame Cathedral.',
    },
  });

  const bali = await prisma.destination.create({
    data: {
      name: 'Bali',
      country: 'Indonesia',
      category: 'Relaxation',
      price: 850,
      images: [
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      ].join(','),
      rating: 4.9,
      description: 'Bali is a tropical paradise famed for its forested volcanic mountains, iconic rice paddies, beaches, and coral reefs. Home to religious sites such as cliffside Uluwatu Temple.',
    },
  });

  const tokyo = await prisma.destination.create({
    data: {
      name: 'Tokyo',
      country: 'Japan',
      category: 'Adventure',
      price: 1500,
      images: [
        'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      ].join(','),
      rating: 4.7,
      description: 'Japan’s busy capital mixes ultra-modern neon skyscrapers with historic Shinto temples. Famed for its culinary scene, high-tech train networks, and vibrant anime subcultures.',
    },
  });

  const alps = await prisma.destination.create({
    data: {
      name: 'Swiss Alps',
      country: 'Switzerland',
      category: 'Adventure',
      price: 2100,
      images: [
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?auto=format&fit=crop&w=800&q=80',
      ].join(','),
      rating: 4.9,
      description: 'The Swiss Alps offer breathtaking winter wonderlands and gorgeous summer Alpine meadows perfect for hiking, skiing, and mountaineering. Experience pure nature.',
    },
  });

  const rome = await prisma.destination.create({
    data: {
      name: 'Rome',
      country: 'Italy',
      category: 'Cultural',
      price: 1100,
      images: [
        'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1529260830199-4455b79753e2?auto=format&fit=crop&w=800&q=80',
      ].join(','),
      rating: 4.6,
      description: 'A vibrant cosmopolitan city with nearly 3,000 years of globally influential art, architecture, and culture. Discover ruins like the Colosseum and the Roman Forum.',
    },
  });

  console.log('- Seeded 5 destinations.');

  // 2. Create Packages
  // Paris Packages
  await prisma.package.create({
    data: {
      destinationId: paris.id,
      title: 'Classic Parisian Escape',
      durationDays: 5,
      price: 1200,
      inclusions: ['4-Star Hotel Accommodation', 'Skip-the-line Eiffel Tower Tickets', 'Seine River Cruise', 'Daily Breakfast'].join(','),
      itineraryJson: JSON.stringify({
        destination: 'Paris',
        daysCount: 5,
        totalEstimatedCost: 1200,
        itinerary: [
          { day: 1, theme: 'Welcome to Paris', activities: [{ time: 'Morning', activity: 'Arrival & check-in to hotel', location: 'Hotel Lutetia', cost: 0 }, { time: 'Evening', activity: 'Sunset Seine River Cruise', location: 'River Seine', cost: 30 }] },
          { day: 2, theme: 'Iconic Landmarks', activities: [{ time: 'Morning', activity: 'Guided tour of Eiffel Tower', location: 'Champ de Mars', cost: 45 }, { time: 'Afternoon', activity: 'Walk along Champs-Élysées', location: 'Arc de Triomphe', cost: 0 }] },
          { day: 3, theme: 'Art Masterpieces', activities: [{ time: 'Morning', activity: 'Visit the Louvre Museum', location: 'Louvre Pyramid', cost: 25 }, { time: 'Afternoon', activity: 'Notre-Dame cathedral exterior and Quartier Latin walk', location: 'Latin Quarter', cost: 0 }] }
        ]
      })
    }
  });

  await prisma.package.create({
    data: {
      destinationId: paris.id,
      title: 'Paris Art & Culinary Tour',
      durationDays: 7,
      price: 1700,
      inclusions: ['Historic Hotel Stay', 'Louvre & Musée d’Orsay Guided Pass', 'Versailles Day Excursion', 'French Cooking Class'].join(','),
      itineraryJson: JSON.stringify({
        destination: 'Paris',
        daysCount: 7,
        totalEstimatedCost: 1700,
        itinerary: []
      })
    }
  });

  // Bali Packages
  await prisma.package.create({
    data: {
      destinationId: bali.id,
      title: 'Ubud Retreat & Beach Stay',
      durationDays: 6,
      price: 850,
      inclusions: ['Boutique Villa with Private Pool', 'Monkey Forest Excursion', 'Traditional Balinese Spa treatment', 'Airport Transfers'].join(','),
      itineraryJson: JSON.stringify({
        destination: 'Bali',
        daysCount: 6,
        totalEstimatedCost: 850,
        itinerary: []
      })
    }
  });

  // Tokyo Packages
  await prisma.package.create({
    data: {
      destinationId: tokyo.id,
      title: 'Tokyo Neon & Temples Tour',
      durationDays: 6,
      price: 1500,
      inclusions: ['Modern Hotel Accommodation', 'Shibuya Crossing guided walk', 'Senso-ji Temple Pass', 'Shinkansen Bullet Train experience'].join(','),
      itineraryJson: JSON.stringify({
        destination: 'Tokyo',
        daysCount: 6,
        totalEstimatedCost: 1500,
        itinerary: []
      })
    }
  });

  console.log('- Seeded curated packages.');
  console.log('🌱 Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
