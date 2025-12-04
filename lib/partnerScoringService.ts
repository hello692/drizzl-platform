import OpenAI from 'openai';

export interface PartnerApplicationData {
  businessType?: string;
  legalBusinessName?: string;
  city?: string;
  state?: string;
  country?: string;
  yearsInBusiness?: string;
  estimatedMonthlyVolume?: string;
  numberOfLocations?: string;
  averageFootTraffic?: string;
  posSystem?: string;
  hasRefrigeration?: boolean;
  businessEmail?: string;
  decisionMakerName?: string;
  decisionMakerTitle?: string;
  website?: string;
  instagramHandle?: string;
  verificationDocuments?: any[];
}

export interface ScoringResult {
  score: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  explanation: string;
  scoringFactors: {
    businessTypeScore: number;
    locationScore: number;
    volumeScore: number;
    infrastructureScore: number;
    verificationScore: number;
    details: Record<string, any>;
  };
}

const BUSINESS_TYPE_SCORES: Record<string, number> = {
  'cafe': 90,
  'coffee_shop': 90,
  'juice_bar': 95,
  'smoothie_bar': 100,
  'gym': 85,
  'fitness_center': 85,
  'health_food_store': 80,
  'grocery': 75,
  'restaurant': 70,
  'hotel': 65,
  'spa': 70,
  'retail': 60,
  'convenience_store': 55,
  'other': 50,
};

const VOLUME_SCORES: Record<string, number> = {
  'under_500': 40,
  '500_1000': 60,
  '1000_2500': 75,
  '2500_5000': 85,
  '5000_10000': 95,
  'over_10000': 100,
};

const YEARS_SCORES: Record<string, number> = {
  'less_than_1': 40,
  '1_3': 60,
  '3_5': 75,
  '5_10': 90,
  'over_10': 100,
};

function normalizeString(str: string | undefined): string {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

function calculateBusinessTypeScore(businessType: string | undefined): number {
  const normalized = normalizeString(businessType);
  for (const [key, score] of Object.entries(BUSINESS_TYPE_SCORES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return score;
    }
  }
  return 50;
}

function calculateVolumeScore(volume: string | undefined): number {
  const normalized = normalizeString(volume);
  for (const [key, score] of Object.entries(VOLUME_SCORES)) {
    if (normalized.includes(key) || key === normalized) {
      return score;
    }
  }
  if (volume) {
    const numMatch = volume.match(/\d+/);
    if (numMatch) {
      const num = parseInt(numMatch[0]);
      if (num < 500) return 40;
      if (num < 1000) return 60;
      if (num < 2500) return 75;
      if (num < 5000) return 85;
      if (num < 10000) return 95;
      return 100;
    }
  }
  return 50;
}

function calculateYearsScore(years: string | undefined): number {
  const normalized = normalizeString(years);
  for (const [key, score] of Object.entries(YEARS_SCORES)) {
    if (normalized.includes(key)) {
      return score;
    }
  }
  if (years) {
    const numMatch = years.match(/\d+/);
    if (numMatch) {
      const num = parseInt(numMatch[0]);
      if (num < 1) return 40;
      if (num < 3) return 60;
      if (num < 5) return 75;
      if (num < 10) return 90;
      return 100;
    }
  }
  return 50;
}

function calculateInfrastructureScore(data: PartnerApplicationData): number {
  let score = 50;
  
  if (data.hasRefrigeration) score += 20;
  if (data.posSystem && data.posSystem !== 'none') score += 15;
  if (data.numberOfLocations) {
    const locations = parseInt(data.numberOfLocations) || 1;
    score += Math.min(locations * 5, 15);
  }
  
  return Math.min(score, 100);
}

function calculateVerificationScore(data: PartnerApplicationData): number {
  let score = 30;
  
  if (data.businessEmail && data.businessEmail.includes('@') && !data.businessEmail.includes('gmail') && !data.businessEmail.includes('yahoo') && !data.businessEmail.includes('hotmail')) {
    score += 20;
  }
  if (data.website && (data.website.includes('http') || data.website.includes('www'))) {
    score += 20;
  }
  if (data.instagramHandle) {
    score += 10;
  }
  if (data.verificationDocuments && data.verificationDocuments.length > 0) {
    score += 20;
  }
  
  return Math.min(score, 100);
}

function determineRiskLevel(score: number): 'Low' | 'Medium' | 'High' {
  if (score >= 70) return 'Low';
  if (score >= 50) return 'Medium';
  return 'High';
}

function generateExplanation(factors: ScoringResult['scoringFactors'], riskLevel: string): string {
  const parts: string[] = [];
  
  if (factors.businessTypeScore >= 80) {
    parts.push('Strong business type fit for wellness products');
  } else if (factors.businessTypeScore < 60) {
    parts.push('Business type may require additional evaluation');
  }
  
  if (factors.volumeScore >= 80) {
    parts.push('High estimated order volume');
  } else if (factors.volumeScore < 50) {
    parts.push('Lower volume potential - consider starter program');
  }
  
  if (factors.infrastructureScore >= 70) {
    parts.push('Good infrastructure (refrigeration, POS)');
  } else if (factors.infrastructureScore < 50) {
    parts.push('Infrastructure may need enhancement');
  }
  
  if (factors.verificationScore >= 70) {
    parts.push('Well-documented business presence');
  } else if (factors.verificationScore < 50) {
    parts.push('Additional verification recommended');
  }
  
  if (parts.length === 0) {
    return `${riskLevel} risk partner application - standard review recommended.`;
  }
  
  return parts.join('. ') + '.';
}

export function calculatePartnerScore(applicationData: PartnerApplicationData): ScoringResult {
  const businessTypeScore = calculateBusinessTypeScore(applicationData.businessType);
  const volumeScore = calculateVolumeScore(applicationData.estimatedMonthlyVolume);
  const yearsScore = calculateYearsScore(applicationData.yearsInBusiness);
  const infrastructureScore = calculateInfrastructureScore(applicationData);
  const verificationScore = calculateVerificationScore(applicationData);
  const locationScore = applicationData.city && applicationData.state ? 70 : 50;
  
  const weights = {
    businessType: 0.25,
    volume: 0.25,
    years: 0.15,
    infrastructure: 0.15,
    verification: 0.10,
    location: 0.10,
  };
  
  const weightedScore = Math.round(
    businessTypeScore * weights.businessType +
    volumeScore * weights.volume +
    yearsScore * weights.years +
    infrastructureScore * weights.infrastructure +
    verificationScore * weights.verification +
    locationScore * weights.location
  );
  
  const riskLevel = determineRiskLevel(weightedScore);
  
  const scoringFactors = {
    businessTypeScore,
    locationScore,
    volumeScore,
    infrastructureScore,
    verificationScore,
    details: {
      yearsScore,
      businessType: applicationData.businessType,
      volume: applicationData.estimatedMonthlyVolume,
      location: `${applicationData.city || 'Unknown'}, ${applicationData.state || 'Unknown'}`,
      hasRefrigeration: applicationData.hasRefrigeration,
      posSystem: applicationData.posSystem,
      hasWebsite: !!applicationData.website,
      hasInstagram: !!applicationData.instagramHandle,
      documentCount: applicationData.verificationDocuments?.length || 0,
    },
  };
  
  const explanation = generateExplanation(scoringFactors, riskLevel);
  
  return {
    score: weightedScore,
    riskLevel,
    explanation,
    scoringFactors,
  };
}

export async function calculatePartnerScoreWithAI(
  applicationData: PartnerApplicationData
): Promise<ScoringResult> {
  const openaiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiKey) {
    return calculatePartnerScore(applicationData);
  }
  
  try {
    const openai = new OpenAI({ apiKey: openaiKey });
    
    const prompt = `You are an expert B2B partnership analyst for a wellness smoothie company. Analyze this retail partner application and provide a risk assessment.

Application Data:
- Business Type: ${applicationData.businessType || 'Not specified'}
- Business Name: ${applicationData.legalBusinessName || 'Not specified'}
- Location: ${applicationData.city || 'Unknown'}, ${applicationData.state || 'Unknown'}, ${applicationData.country || 'Unknown'}
- Years in Business: ${applicationData.yearsInBusiness || 'Not specified'}
- Estimated Monthly Volume: ${applicationData.estimatedMonthlyVolume || 'Not specified'}
- Number of Locations: ${applicationData.numberOfLocations || '1'}
- Has Refrigeration: ${applicationData.hasRefrigeration ? 'Yes' : 'No/Unknown'}
- POS System: ${applicationData.posSystem || 'Not specified'}
- Website: ${applicationData.website || 'None'}
- Instagram: ${applicationData.instagramHandle || 'None'}
- Has Verification Documents: ${(applicationData.verificationDocuments?.length || 0) > 0 ? 'Yes' : 'No'}

Provide a JSON response with:
1. "score": A number from 0-100 representing partner fit
2. "riskLevel": One of "Low", "Medium", or "High"
3. "explanation": A brief 1-2 sentence explanation of the score

Consider:
- Juice bars, smoothie bars, cafes, and gyms are ideal partners (higher scores)
- Higher volume potential = higher scores
- Longer business history = more reliable
- Good infrastructure (refrigeration, modern POS) = easier operations
- Verified business presence (website, social media, documents) = lower risk

Respond ONLY with valid JSON, no markdown or additional text.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 200,
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const parsed = JSON.parse(content);
      const baseResult = calculatePartnerScore(applicationData);
      
      return {
        score: Math.round((parsed.score + baseResult.score) / 2),
        riskLevel: parsed.riskLevel || baseResult.riskLevel,
        explanation: parsed.explanation || baseResult.explanation,
        scoringFactors: baseResult.scoringFactors,
      };
    }
  } catch (error) {
    console.error('[Scoring] AI scoring failed, falling back to rule-based:', error);
  }
  
  return calculatePartnerScore(applicationData);
}
