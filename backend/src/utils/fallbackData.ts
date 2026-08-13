export const mockDestinations = [
  {
    id: "dest-paris-1",
    name: "Paris",
    city: "Paris",
    country: "France",
    category: "Cultural",
    price: 1200,
    estimatedBudget: 1200,
    rating: 4.8,
    images: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80,https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80",
    description: "The City of Light is a global center for art, fashion, gastronomy, and culture. Famous for landmarks like the Eiffel Tower, the Louvre Museum, and Notre-Dame Cathedral.",
    continent: "Europe",
    region: "Europe",
    popularAttractions: "Eiffel Tower, Louvre Museum, Notre-Dame, Arc de Triomphe",
    thingsToDo: "Museum visits, Seine cruises, Cafe dining, shopping",
    travelTips: "Buy museum passes in advance. Use the Metro to get around.",
    packages: [
      {
        id: "pkg-paris-1",
        destinationId: "dest-paris-1",
        title: "Classic Parisian Escape",
        durationDays: 5,
        price: 1200,
        inclusions: "4-Star Hotel Accommodation,Skip-the-line Eiffel Tower Tickets,Seine River Cruise,Daily Breakfast",
        exclusions: "Flights, Travel Insurance, Personal shopping",
        activities: "Eiffel Tower tour, Seine cruise, Louvre Museum visit",
        availableDates: "2026-10-15, 2026-11-20",
        itinerary: JSON.stringify({
          destination: 'Paris',
          daysCount: 5,
          totalEstimatedCost: 1200,
          itinerary: [
            { day: 1, theme: 'Welcome to Paris', activities: [{ time: 'Morning', activity: 'Arrival & check-in to hotel', location: 'Hotel Lutetia', cost: 0 }, { time: 'Evening', activity: 'Sunset Seine River Cruise', location: 'River Seine', cost: 30 }] },
            { day: 2, theme: 'Iconic Landmarks', activities: [{ time: 'Morning', activity: 'Guided tour of Eiffel Tower', location: 'Champ de Mars', cost: 45 }, { time: 'Afternoon', activity: 'Walk along Champs-Élysées', location: 'Arc de Triomphe', cost: 0 }] },
            { day: 3, theme: 'Art Masterpieces', activities: [{ time: 'Morning', activity: 'Visit the Louvre Museum', location: 'Louvre Pyramid', cost: 25 }, { time: 'Afternoon', activity: 'Montmartre walk', location: 'Basilica of the Sacré-Cœur', cost: 0 }] }
          ]
        })
      }
    ]
  },
  {
    id: "dest-bali-1",
    name: "Bali",
    city: "Ubud",
    country: "Indonesia",
    category: "Relaxation",
    price: 850,
    estimatedBudget: 850,
    rating: 4.9,
    images: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80,https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    description: "Bali is a tropical paradise famed for its forested volcanic mountains, iconic rice paddies, beaches, and coral reefs. Home to religious sites such as Uluwatu Temple.",
    continent: "Asia",
    region: "Asia",
    popularAttractions: "Uluwatu Temple, Ubud Monkey Forest, Mount Batur",
    thingsToDo: "Spa therapies, beach surfing, scuba diving, rice terrace hiking",
    travelTips: "Carry cash for local markets. Hire a local driver for convenience.",
    packages: [
      {
        id: "pkg-bali-1",
        destinationId: "dest-bali-1",
        title: "Ubud Retreat & Beach Stay",
        durationDays: 6,
        price: 850,
        inclusions: "Boutique Villa with Private Pool,Monkey Forest Excursion,Traditional Balinese Spa treatment,Airport Transfers",
        exclusions: "Flights, Meals not specified",
        activities: "Ubud forest walk, Temple visits, Spa rituals",
        availableDates: "2026-11-05, 2026-12-10",
        itinerary: JSON.stringify({
          destination: 'Bali',
          daysCount: 6,
          totalEstimatedCost: 850,
          itinerary: []
        })
      }
    ]
  },
  {
    id: "dest-tokyo-1",
    name: "Tokyo",
    city: "Tokyo",
    country: "Japan",
    category: "Adventure",
    price: 1500,
    estimatedBudget: 1500,
    rating: 4.7,
    images: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=1200&q=80,https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
    description: "Japan’s busy capital mixes ultra-modern neon skyscrapers with historic Shinto temples. Famed for its culinary scene, high-tech train networks, and vibrant anime subcultures.",
    continent: "Asia",
    region: "Asia",
    popularAttractions: "Shibuya Crossing, Senso-ji Temple, Tokyo Skytree",
    thingsToDo: "Sushi tasting, anime shopping in Akihabara, temple visits",
    travelTips: "Get a JR Pass or IC card. Respect local silence rules in trains.",
    packages: []
  },
  {
    id: "dest-swiss-1",
    name: "Swiss Alps",
    city: "Zermatt",
    country: "Switzerland",
    category: "Adventure",
    price: 2100,
    estimatedBudget: 2100,
    rating: 4.9,
    images: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    description: "The Swiss Alps offer breathtaking winter wonderlands and gorgeous summer Alpine meadows perfect for hiking, skiing, and mountaineering.",
    continent: "Europe",
    region: "Europe",
    popularAttractions: "Matterhorn mountain, Interlaken lakes, Jungfraujoch peaks",
    thingsToDo: "Skiing, alpine cable rides, chocolate tasting, lake cruises",
    travelTips: "Travel passes save on trains. Dress in warm layers.",
    packages: []
  }
];
