import type { NextApiRequest, NextApiResponse } from 'next';

const PLACEHOLDER_RESPONSES: Record<string, string[]> = {
  hero: [
    "Fuel Your Day, Naturally. Premium smoothies crafted with organic ingredients for unstoppable energy.",
    "Pure Wellness, Delivered Fresh. Experience the difference of farm-to-blender nutrition.",
    "Elevate Your Morning Ritual. Artisan smoothies designed for modern wellness seekers.",
    "Nature's Best, Blended to Perfection. Discover smoothies that nourish body and soul.",
    "Your Daily Dose of Vitality. Clean ingredients, bold flavors, endless energy.",
  ],
  product: [
    "A harmonious blend of superfoods designed to energize your morning and power your day. Each sip delivers essential vitamins and antioxidants.",
    "Crafted with care using only the finest organic ingredients. This smoothie combines natural sweetness with powerful nutrition.",
    "The perfect balance of protein and flavor. Ideal for post-workout recovery or a satisfying healthy snack.",
    "Experience pure refreshment with this vibrant blend. Packed with vitamins and natural energy boosters.",
    "A delicious way to fuel your wellness journey. Made fresh with premium ingredients you can taste.",
  ],
  email: [
    "Subject: Your Wellness Journey Starts Here\n\nDiscover our new collection of nutrient-packed smoothies, crafted to fuel your best life. Use code FRESH20 for 20% off your first order.",
    "Subject: Fresh Flavors, Just Arrived\n\nWe've been busy in the kitchen! Explore our latest seasonal blends and find your new favorite. Order now for free shipping.",
    "Subject: Time to Refresh Your Routine\n\nElevate your daily nutrition with our curated wellness collection. Premium ingredients, delivered to your door.",
  ],
  social: [
    "Starting the day right means starting with the right fuel. Our new smoothie collection is here to power your wellness journey.",
    "Clean ingredients. Bold flavors. Endless possibilities. Discover why thousands choose Drizzl for their daily nutrition.",
    "Your morning deserves better. Upgrade to premium, organic smoothies that taste as good as they make you feel.",
    "Wellness made delicious. Every sip is a step toward a healthier, happier you.",
  ],
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, contentType = 'hero' } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const openaiKey = process.env.OPENAI_API_KEY;

  if (openaiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a marketing copywriter for Drizzl Wellness, a premium smoothie and wellness brand. Write ${contentType} content that is clean, modern, and health-focused. Keep responses concise and impactful.`,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0]) {
        return res.status(200).json({ suggestion: data.choices[0].message.content });
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
    }
  }

  const responses = PLACEHOLDER_RESPONSES[contentType] || PLACEHOLDER_RESPONSES.hero;
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];

  return res.status(200).json({
    suggestion: randomResponse,
    note: 'Using placeholder response. Connect OpenAI API for real AI generation.',
  });
}
