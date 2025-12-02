import type { NextApiRequest, NextApiResponse } from 'next';
import { generateAIResponse, generateOpenAIResponse } from '../../../../lib/aiAssistantService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    if (trimmedMessage.length > 1000) {
      return res.status(400).json({ error: 'Message too long (max 1000 characters)' });
    }

    const openAIKey = process.env.OPENAI_API_KEY;
    
    let result;
    if (openAIKey && openAIKey.startsWith('sk-')) {
      result = await generateOpenAIResponse(trimmedMessage, openAIKey);
    } else {
      result = await generateAIResponse(trimmedMessage);
    }

    return res.status(200).json({
      response: result.response,
      data: result.data,
      intent: result.intent,
      isAIPowered: !!(openAIKey && openAIKey.startsWith('sk-')),
    });
  } catch (error) {
    console.error('AI Assistant API error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate response',
      response: "I'm having trouble processing your request. Please try again.",
    });
  }
}
