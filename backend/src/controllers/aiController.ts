import { Request, Response } from 'express';
import * as aiService from '../services/aiService.js';
import prisma from '../utils/prisma.js';

// Helper to format itinerary for frontend
const formatItinerary = (itin: any) => {
  if (!itin) return null;
  return {
    ...itin,
    interests: itin.interests ? itin.interests.split(',') : [],
    generatedPlanJson: itin.generatedPlanJson ? JSON.parse(itin.generatedPlanJson) : null
  };
};

// @desc    Generate a customized AI itinerary
// @route   POST /api/ai/generate-itinerary
// @access  Public (Optional auth)
export const handleGenerateItinerary = async (req: Request, res: Response): Promise<any> => {
  try {
    const { destination, days, budget, interests } = req.body;
    const userId = req.user?.id; // Optional: attached via auth protect if token present

    if (!destination || !days || !budget) {
      return res.status(400).json({ message: 'Please provide destination, days, and budget.' });
    }

    const daysCount = parseInt(days);
    const budgetVal = parseFloat(budget);

    if (isNaN(daysCount) || daysCount <= 0 || daysCount > 30) {
      return res.status(400).json({ message: 'Days count must be between 1 and 30.' });
    }

    if (isNaN(budgetVal) || budgetVal <= 0) {
      return res.status(400).json({ message: 'Budget must be a positive number.' });
    }

    const interestsArr = Array.isArray(interests) ? interests : [];

    const plan = await aiService.generateItinerary({
      destination,
      days: daysCount,
      budget: budgetVal,
      interests: interestsArr,
    });

    // Save to database if user is logged in
    let savedItinerary = null;
    if (userId) {
      const interestsStr = interestsArr.join(',');
      const planStr = JSON.stringify(plan);

      savedItinerary = await prisma.aIItinerary.create({
        data: {
          userId,
          destination,
          days: daysCount,
          budget: budgetVal,
          interests: interestsStr,
          generatedPlanJson: planStr,
        },
      });
    }

    return res.status(200).json({
      message: 'Itinerary generated successfully',
      itinerary: plan,
      savedId: savedItinerary ? savedItinerary.id : null,
    });
  } catch (error: any) {
    console.error('AI Itinerary handler error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Estimate trip budget
// @route   POST /api/ai/estimate-budget
// @access  Public
export const handleEstimateBudget = async (req: Request, res: Response): Promise<any> => {
  try {
    const { destination, duration, travelStyle } = req.body;

    if (!destination || !duration || !travelStyle) {
      return res.status(400).json({ message: 'Please provide destination, duration, and travelStyle.' });
    }

    const durationDays = parseInt(duration);
    if (isNaN(durationDays) || durationDays <= 0 || durationDays > 60) {
      return res.status(400).json({ message: 'Duration must be a valid number of days (1-60).' });
    }

    const budgetEstimate = await aiService.estimateBudget({
      destination,
      duration: durationDays,
      travelStyle,
    });

    return res.status(200).json(budgetEstimate);
  } catch (error: any) {
    console.error('AI Budget handler error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Chat with travel chatbot assistant
// @route   POST /api/ai/chat
// @access  Public
export const handleChat = async (req: Request, res: Response): Promise<any> => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'Please provide a valid messages array.' });
    }

    // Format check for messages array items
    const formattedMessages = messages.map((msg: any) => ({
      role: (msg.role === 'assistant' ? 'assistant' : msg.role === 'system' ? 'system' : 'user') as 'user' | 'assistant' | 'system',
      content: String(msg.content || ''),
    }));

    const responseText = await aiService.chatWithAssistant(formattedMessages);

    return res.status(200).json({ response: responseText });
  } catch (error: any) {
    console.error('AI Chat handler error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Get user generated AI itineraries
// @route   GET /api/ai/my-itineraries
// @access  Private
export const getMyItineraries = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const itineraries = await prisma.aIItinerary.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(itineraries.map(formatItinerary));
  } catch (error: any) {
    console.error('Get my itineraries error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
