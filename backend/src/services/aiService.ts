import dotenv from 'dotenv';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

// Helper to determine if we should run in Mock mode
const isMockMode = !OPENAI_API_KEY || OPENAI_API_KEY === 'sk-placeholder' || OPENAI_API_KEY.trim() === '';

interface ItineraryParams {
  destination: string;
  days: number;
  budget: number;
  interests: string[];
}

interface BudgetParams {
  destination: string;
  duration: number;
  travelStyle: string;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Helper to call OpenAI API
async function callOpenAI(messages: ChatMessage[], jsonResponse: boolean = false): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        response_format: jsonResponse ? { type: 'json_object' } : undefined,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${errText}`);
    }

    const data = (await response.json()) as any;
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI call failed:', error);
    throw error;
  }
}

/**
 * Generates a day-by-day travel itinerary.
 */
export const generateItinerary = async (params: ItineraryParams): Promise<any> => {
  const { destination, days, budget, interests } = params;

  if (isMockMode) {
    console.log('🤖 AI Service: Running in MOCK mode for itinerary generation.');
    return generateMockItinerary(destination, days, budget, interests);
  }

  const prompt = `You are an expert travel planner. Generate a highly detailed day-by-day travel itinerary for a trip to ${destination} for ${days} days, with a total budget of $${budget}. The traveler's interests are: ${interests.join(', ')}.
Return the response ONLY as a JSON object with the following structure:
{
  "destination": "${destination}",
  "daysCount": ${days},
  "totalEstimatedCost": number,
  "travelTips": ["tip 1", "tip 2", ...],
  "itinerary": [
    {
      "day": 1,
      "theme": "Theme of the day",
      "activities": [
        {
          "time": "Morning/Afternoon/Evening",
          "activity": "Detailed activity description",
          "location": "Name of the place/spot",
          "cost": number,
          "tip": "Useful tip for this activity"
        }
      ]
    }
  ]
}`;

  const messages: ChatMessage[] = [
    { role: 'system', content: 'You are a structured travel data generator. Always output JSON matching the requested schema.' },
    { role: 'user', content: prompt },
  ];

  try {
    const rawContent = await callOpenAI(messages, true);
    return JSON.parse(rawContent);
  } catch (error) {
    console.warn('AI Itinerary generation failed, falling back to mock.');
    return generateMockItinerary(destination, days, budget, interests);
  }
};

/**
 * Estimates trip budget based on travel style.
 */
export const estimateBudget = async (params: BudgetParams): Promise<any> => {
  const { destination, duration, travelStyle } = params;

  if (isMockMode) {
    console.log('🤖 AI Service: Running in MOCK mode for budget estimation.');
    return generateMockBudget(destination, duration, travelStyle);
  }

  const prompt = `You are a travel finance expert. Estimate a detailed budget breakdown for a trip to ${destination} for ${duration} days with a ${travelStyle} travel style (Budget, Mid-range, or Luxury).
Return the response ONLY as a JSON object with the following structure:
{
  "destination": "${destination}",
  "durationDays": ${duration},
  "travelStyle": "${travelStyle}",
  "currency": "USD",
  "totalEstimatedCost": number,
  "breakdown": {
    "flights": { "cost": number, "description": "Flight estimates" },
    "accommodation": { "cost": number, "description": "Hotel/stay estimates" },
    "food": { "cost": number, "description": "Meals and drinks estimates" },
    "activities": { "cost": number, "description": "Tours and sightseeing estimates" },
    "localTransport": { "cost": number, "description": "Taxis, metro, or car rental estimates" },
    "miscellaneous": { "cost": number, "description": "Insurance, shopping, tips" }
  },
  "savingTips": ["tip 1", "tip 2", ...]
}`;

  const messages: ChatMessage[] = [
    { role: 'system', content: 'You are a travel budget calculator. Always output JSON matching the requested schema.' },
    { role: 'user', content: prompt },
  ];

  try {
    const rawContent = await callOpenAI(messages, true);
    return JSON.parse(rawContent);
  } catch (error) {
    console.warn('AI Budget estimation failed, falling back to mock.');
    return generateMockBudget(destination, duration, travelStyle);
  }
};

/**
 * Responds to a user query in a chat context.
 */
export const chatWithAssistant = async (chatHistory: ChatMessage[]): Promise<string> => {
  if (isMockMode) {
    console.log('🤖 AI Service: Running in MOCK mode for chat assistant.');
    const userMsg = chatHistory[chatHistory.length - 1]?.content || '';
    return getMockChatResponse(userMsg);
  }

  const systemMessage: ChatMessage = {
    role: 'system',
    content: `You are "FindMyWay Assistant", a friendly, helpful, and highly intelligent travel chatbot.
Help the user with destination recommendations, travel tips, hotel recommendations, budgeting advice, or answering questions. Keep your responses concise, well-formatted in markdown, and highly engaging.`,
  };

  const messages = [systemMessage, ...chatHistory];

  try {
    return await callOpenAI(messages, false);
  } catch (error) {
    console.warn('AI Chat failed, falling back to mock.');
    const userMsg = chatHistory[chatHistory.length - 1]?.content || '';
    return getMockChatResponse(userMsg);
  }
};

// ==========================================
// MOCK DATA GENERATION FUNCTIONS (FALLBACKS)
// ==========================================

function generateMockItinerary(destination: string, days: number, budget: number, interests: string[]) {
  const categories = interests.join(', ') || 'Exploration';
  const dailyCost = Math.round(budget / days);

  const itinerary: any[] = [];
  for (let i = 1; i <= days; i++) {
    itinerary.push({
      day: i,
      theme: `Exploring the best of ${destination} - ${categories} Focus`,
      activities: [
        {
          time: 'Morning',
          activity: `Guided tour of the iconic heritage sites and key landmarks in central ${destination}.`,
          location: `${destination} City Center`,
          cost: Math.round(dailyCost * 0.2),
          tip: 'Arrive early to beat the queues and secure the best photography spots.',
        },
        {
          time: 'Afternoon',
          activity: `Immersive experience focusing on ${interests[0] || 'local culture'} including lunch at a traditional cafe.`,
          location: `Old Quarter, ${destination}`,
          cost: Math.round(dailyCost * 0.3),
          tip: 'Try the signature local dish; ask the waiter for chef recommendations.',
        },
        {
          time: 'Evening',
          activity: `Relaxing sunset cruise or walk around the scenic lakeside/coastal path, followed by dinner.`,
          location: `Waterfront District`,
          cost: Math.round(dailyCost * 0.4),
          tip: 'Perfect opportunity to enjoy local music performances.',
        },
      ],
    });
  }

  return {
    destination,
    daysCount: days,
    totalEstimatedCost: budget,
    travelTips: [
      'Use local transit passes for economical travel.',
      'Always keep a small amount of cash handy for street vendors.',
      'Check visa requirements at least two weeks before your travel date.',
    ],
    itinerary,
  };
}

function generateMockBudget(destination: string, duration: number, travelStyle: string) {
  let multiplier = 1;
  if (travelStyle.toLowerCase() === 'luxury') multiplier = 2.5;
  if (travelStyle.toLowerCase() === 'mid-range') multiplier = 1.5;

  const flightCost = Math.round(450 * multiplier);
  const stayCost = Math.round(80 * duration * multiplier);
  const foodCost = Math.round(30 * duration * multiplier);
  const activityCost = Math.round(40 * duration * multiplier);
  const transportCost = Math.round(15 * duration * multiplier);
  const miscCost = Math.round(50 * multiplier);
  const total = flightCost + stayCost + foodCost + activityCost + transportCost + miscCost;

  return {
    destination,
    durationDays: duration,
    travelStyle,
    currency: 'USD',
    totalEstimatedCost: total,
    breakdown: {
      flights: { cost: flightCost, description: 'Roundtrip standard economy tickets' },
      accommodation: { cost: stayCost, description: `Comfortable ${travelStyle} lodging for ${duration} nights` },
      food: { cost: foodCost, description: 'Daily meals, street foods, and refreshments' },
      activities: { cost: activityCost, description: 'Entrance tickets, guided tours, and local excursions' },
      localTransport: { cost: transportCost, description: 'Metro passes, localized taxis, or shuttle rides' },
      miscellaneous: { cost: miscCost, description: 'Travel insurance, local SIM cards, and minor shopping' },
    },
    savingTips: [
      'Book flights mid-week (Tuesdays or Wednesdays) for the lowest fares.',
      'Opt for local homestays or guesthouses to save on accommodation.',
      'Enjoy street-food markets which are both delicious and budget-friendly.',
    ],
  };
}

function getMockChatResponse(userMessage: string): string {
  const query = userMessage.toLowerCase();

  if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
    return `Hello! 👋 I am your **FindMyWay AI Travel Assistant**. How can I help you plan your next adventure today? I can suggest destinations, estimate budgets, or answer general travel questions!`;
  }
  if (query.includes('recommend') || query.includes('suggest') || query.includes('where to go')) {
    return `Here are some popular destinations you might love:
1. 🏔️ **Swiss Alps, Switzerland** - Best for hiking, skiing, and stunning mountain landscapes.
2. 🏖️ **Bali, Indonesia** - Ideal for beach relaxation, surfing, and cultural immersion.
3. 🍜 **Tokyo, Japan** - Perfect for futuristic cityscapes, culinary arts, and historic temples.
4. 🏺 **Rome, Italy** - Great for history lovers, architecture, and world-class food.

Which travel style sounds like your next trip?`;
  }
  if (query.includes('budget') || query.includes('cost') || query.includes('money')) {
    return `To get an estimate of your trip cost, you can use our **AI Budget Estimator** feature on the site! Simply enter your destination, days, and travel style (Budget, Mid-range, or Luxury) to get a granular breakdown of flights, accommodation, food, and activities.`;
  }
  if (query.includes('booking') || query.includes('book') || query.includes('pay')) {
    return `Booking a package is simple! Browse our **Destinations** page, select a curated travel package, enter your preferred dates and travelers count, and proceed to our Stripe-integrated payment screen. Your booking confirmation will be stored on your Dashboard immediately.`;
  }

  return `That sounds interesting! 🌍 As a travel assistant, I recommend research into local weather conditions, cultural etiquette, and booking your activities ahead.
Is there a specific destination like *Paris*, *Tokyo*, or *Bali* you would like me to help you plan an itinerary for?`;
}
