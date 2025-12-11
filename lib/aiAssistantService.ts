import { createClient } from '@supabase/supabase-js';
import { getMockBankingData } from './mercuryClient';
import { generateMockData } from './commandCenterService';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export type UserIntent = 
  | 'revenue'
  | 'products'
  | 'orders'
  | 'financial'
  | 'profit'
  | 'runway'
  | 'sku'
  | 'trends'
  | 'general';

export interface BusinessData {
  revenue?: {
    total: number;
    d2c: number;
    b2b: number;
    period: string;
  };
  orders?: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  products?: {
    topProducts: Array<{
      name: string;
      sku: string;
      quantity: number;
      revenue: number;
    }>;
    totalProducts: number;
  };
  financial?: {
    totalBalance: number;
    incoming: number;
    outgoing: number;
    netProfitLoss: number;
    monthlyBurn: number;
    cashRunway: number | null;
  };
}

export interface AIResponse {
  response: string;
  data?: BusinessData;
  intent: UserIntent;
}

const intentPatterns: Array<{ patterns: RegExp[]; intent: UserIntent }> = [
  {
    patterns: [
      /revenue/i,
      /sales\s*(summary|total|amount)/i,
      /how\s*much.*made/i,
      /earnings/i,
      /income/i,
    ],
    intent: 'revenue',
  },
  {
    patterns: [
      /top\s*(selling|products|sellers)/i,
      /best\s*(selling|sellers|products)/i,
      /which\s*sku.*best/i,
      /popular\s*products/i,
      /what('s|s|\s*is)\s*selling/i,
    ],
    intent: 'products',
  },
  {
    patterns: [
      /order\s*(count|total|number|volume)/i,
      /how\s*many\s*orders/i,
      /orders?\s*(today|this\s*week|this\s*month)/i,
      /order\s*trends/i,
      /order\s*statistics/i,
    ],
    intent: 'orders',
  },
  {
    patterns: [
      /cash\s*flow/i,
      /bank(ing)?\s*(balance|account)/i,
      /financ(ial|e)/i,
      /money/i,
      /balance/i,
      /transactions/i,
    ],
    intent: 'financial',
  },
  {
    patterns: [
      /profit/i,
      /margin/i,
      /net\s*(income|profit)/i,
      /gross\s*margin/i,
    ],
    intent: 'profit',
  },
  {
    patterns: [
      /runway/i,
      /burn\s*rate/i,
      /how\s*long.*money/i,
      /cash\s*runway/i,
      /months\s*left/i,
    ],
    intent: 'runway',
  },
  {
    patterns: [
      /sku/i,
      /product\s*code/i,
      /item\s*number/i,
    ],
    intent: 'sku',
  },
  {
    patterns: [
      /trend/i,
      /growth/i,
      /comparison/i,
      /over\s*time/i,
      /performance/i,
    ],
    intent: 'trends',
  },
];

export function parseUserIntent(message: string): UserIntent {
  const normalizedMessage = message.toLowerCase().trim();
  
  for (const { patterns, intent } of intentPatterns) {
    for (const pattern of patterns) {
      if (pattern.test(normalizedMessage)) {
        return intent;
      }
    }
  }
  
  return 'general';
}

export async function generateBusinessContext(intent: UserIntent): Promise<BusinessData> {
  const data: BusinessData = {};
  
  try {
    if (intent === 'revenue' || intent === 'trends' || intent === 'general') {
      const stats = generateMockData('30days');
      data.revenue = {
        total: stats.totalRevenue,
        d2c: stats.d2cRevenue,
        b2b: stats.b2bRevenue,
        period: 'Last 30 days',
      };
    }
    
    if (intent === 'orders' || intent === 'trends' || intent === 'general') {
      const stats = generateMockData('30days');
      data.orders = {
        total: stats.ordersThisMonth,
        today: stats.ordersToday,
        thisWeek: stats.ordersThisWeek,
        thisMonth: stats.ordersThisMonth,
      };
    }
    
    if (intent === 'products' || intent === 'sku' || intent === 'general') {
      const stats = generateMockData('30days');
      data.products = {
        topProducts: stats.topProducts.map(p => ({
          name: p.name,
          sku: p.sku,
          quantity: p.quantity,
          revenue: p.revenue,
        })),
        totalProducts: stats.topProducts.length,
      };
    }
    
    if (intent === 'financial' || intent === 'profit' || intent === 'runway') {
      const bankingData = getMockBankingData();
      data.financial = {
        totalBalance: bankingData.totalBalance,
        incoming: bankingData.incomingLast30Days,
        outgoing: bankingData.outgoingLast30Days,
        netProfitLoss: bankingData.netProfitLoss,
        monthlyBurn: bankingData.monthlyBurn,
        cashRunway: bankingData.cashRunway,
      };
    }
  } catch (error) {
    console.error('Error generating business context:', error);
  }
  
  return data;
}

function formatCurrency(cents: number): string {
  return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

export function formatAIResponse(data: BusinessData, intent: UserIntent, originalMessage: string): string {
  switch (intent) {
    case 'revenue': {
      if (!data.revenue) return "I couldn't retrieve revenue data at this time.";
      return `📊 **Revenue Summary (${data.revenue.period})**

Total Revenue: **${formatCurrency(data.revenue.total)}**

**Channel Breakdown:**
• D2C Revenue: ${formatCurrency(data.revenue.d2c)} (${Math.round((data.revenue.d2c / data.revenue.total) * 100)}%)
• B2B Revenue: ${formatCurrency(data.revenue.b2b)} (${Math.round((data.revenue.b2b / data.revenue.total) * 100)}%)

D2C continues to drive the majority of revenue. Consider expanding B2B partnerships to diversify revenue streams.`;
    }
    
    case 'products':
    case 'sku': {
      if (!data.products) return "I couldn't retrieve product data at this time.";
      const top = data.products.topProducts.slice(0, 5);
      const lines = top.map((p, i) => 
        `${i + 1}. **${p.name}** (${p.sku})\n   • ${formatNumber(p.quantity)} units sold | ${formatCurrency(p.revenue)} revenue`
      ).join('\n\n');
      
      return `🏆 **Top Selling Products**

${lines}

**Insight:** ${top[0]?.name || 'Your top product'} is leading sales. Consider featuring it prominently on the homepage or running a bundle promotion.`;
    }
    
    case 'orders': {
      if (!data.orders) return "I couldn't retrieve order data at this time.";
      const avgPerDay = Math.round(data.orders.thisMonth / 30);
      return `📦 **Order Summary**

• Today: **${formatNumber(data.orders.today)}** orders
• This Week: **${formatNumber(data.orders.thisWeek)}** orders
• This Month: **${formatNumber(data.orders.thisMonth)}** orders

**Daily Average:** ${avgPerDay} orders/day

${data.orders.today > avgPerDay 
  ? "📈 Today's orders are above the daily average. Great momentum!" 
  : "💡 Consider running a flash promotion to boost today's orders."}`;
    }
    
    case 'financial': {
      if (!data.financial) return "I couldn't retrieve financial data at this time.";
      return `💰 **Cash Flow Analysis (Last 30 Days)**

**Account Balance:** ${formatCurrency(data.financial.totalBalance * 100)}

**Cash Movement:**
• Incoming: +${formatCurrency(data.financial.incoming * 100)}
• Outgoing: -${formatCurrency(data.financial.outgoing * 100)}
• Net: ${data.financial.netProfitLoss >= 0 ? '+' : ''}${formatCurrency(data.financial.netProfitLoss * 100)}

**Monthly Burn Rate:** ${formatCurrency(data.financial.monthlyBurn * 100)}

${data.financial.netProfitLoss >= 0 
  ? "✅ Positive cash flow this month. Keep up the momentum!" 
  : "⚠️ Negative cash flow. Review expenses or boost revenue."}`;
    }
    
    case 'profit': {
      if (!data.financial) return "I couldn't retrieve profit data at this time.";
      const profitMargin = data.financial.incoming > 0 
        ? Math.round((data.financial.netProfitLoss / data.financial.incoming) * 100)
        : 0;
      
      return `📈 **Profit Analysis**

**Net Profit/Loss (30 days):** ${data.financial.netProfitLoss >= 0 ? '+' : ''}${formatCurrency(data.financial.netProfitLoss * 100)}

**Profit Margin:** ${profitMargin}%

**Breakdown:**
• Total Income: ${formatCurrency(data.financial.incoming * 100)}
• Total Expenses: ${formatCurrency(data.financial.outgoing * 100)}

${profitMargin >= 20 
  ? "✅ Healthy profit margin above 20%." 
  : profitMargin >= 0 
    ? "💡 Consider optimizing costs to improve margins." 
    : "⚠️ Operating at a loss. Immediate cost review recommended."}`;
    }
    
    case 'runway': {
      if (!data.financial) return "I couldn't retrieve runway data at this time.";
      const runway = data.financial.cashRunway;
      
      return `⏳ **Cash Runway Analysis**

**Current Balance:** ${formatCurrency(data.financial.totalBalance * 100)}
**Monthly Burn:** ${formatCurrency(data.financial.monthlyBurn * 100)}
**Estimated Runway:** ${runway ? `**${runway} months**` : 'N/A (positive cash flow)'}

${runway && runway > 12 
  ? "✅ Runway exceeds 12 months. Healthy financial position." 
  : runway && runway > 6 
    ? "💡 6-12 months runway. Consider planning for additional capital." 
    : runway 
      ? "⚠️ Less than 6 months runway. Focus on revenue or reduce burn." 
      : "✅ Positive cash flow - not burning through reserves."}`;
    }
    
    case 'trends': {
      const parts: string[] = ['📊 **Business Trends Overview**\n'];
      
      if (data.revenue) {
        parts.push(`**Revenue:** ${formatCurrency(data.revenue.total)} (${data.revenue.period})`);
      }
      if (data.orders) {
        parts.push(`**Orders:** ${formatNumber(data.orders.thisMonth)} this month`);
      }
      if (data.financial) {
        parts.push(`**Cash Position:** ${formatCurrency(data.financial.totalBalance * 100)}`);
      }
      
      parts.push('\n💡 Overall business metrics are healthy. Consider deepening B2B relationships for sustainable growth.');
      
      return parts.join('\n');
    }
    
    default: {
      const parts: string[] = ['📊 **Business Overview**\n'];
      
      if (data.revenue) {
        parts.push(`**Revenue (30 days):** ${formatCurrency(data.revenue.total)}`);
      }
      if (data.orders) {
        parts.push(`**Orders Today:** ${formatNumber(data.orders.today)}`);
      }
      if (data.products && data.products.topProducts[0]) {
        parts.push(`**Top Product:** ${data.products.topProducts[0].name}`);
      }
      if (data.financial) {
        parts.push(`**Cash Balance:** ${formatCurrency(data.financial.totalBalance * 100)}`);
      }
      
      parts.push('\n💬 Ask me about specific metrics like revenue, orders, products, or cash flow for detailed insights.');
      
      return parts.join('\n');
    }
  }
}

export async function generateAIResponse(message: string): Promise<AIResponse> {
  const intent = parseUserIntent(message);
  const data = await generateBusinessContext(intent);
  const response = formatAIResponse(data, intent, message);
  
  return {
    response,
    data,
    intent,
  };
}

export async function generateOpenAIResponse(message: string, apiKey: string): Promise<AIResponse> {
  const intent = parseUserIntent(message);
  const data = await generateBusinessContext(intent);
  
  try {
    const systemPrompt = `You are a professional business intelligence assistant for Drizzl Wellness, a health food company. 
You provide concise, data-driven insights in a professional tone. Use markdown formatting for clarity.
Always include relevant metrics and actionable recommendations.

Current business data:
${JSON.stringify(data, null, 2)}

Guidelines:
- Be concise and professional
- Use bullet points for lists
- Include specific numbers from the data
- Provide one actionable insight at the end
- Use emojis sparingly for visual hierarchy`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const result = await response.json();
    const aiResponse = result.choices?.[0]?.message?.content || '';

    return {
      response: aiResponse,
      data,
      intent,
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    return generateAIResponse(message);
  }
}
