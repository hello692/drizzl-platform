import { Product } from './supabaseClient';

export interface ProductCost {
  id: string;
  product_id: string;
  cost_per_unit: number;
  margin_per_unit: number;
  ingredients_cost: number;
  packaging_cost: number;
  labor_cost: number;
  updated_at: string;
}

export interface ProductIngredient {
  id: string;
  product_id: string;
  ingredient_name: string;
  weight_grams: number;
  cost_per_gram: number;
  nutrition_data: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
  };
  supplier?: string;
}

export interface ProductWithCosts extends Product {
  cost_per_unit: number;
  margin: number;
  margin_percent: number;
  ingredients_cost: number;
  packaging_cost: number;
  labor_cost: number;
}

export interface ProductDetails extends ProductWithCosts {
  ingredients: ProductIngredient[];
  nutrition_totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  cost_breakdown: {
    ingredients: number;
    packaging: number;
    labor: number;
    overhead: number;
    total: number;
  };
  profit_analysis: {
    d2c_margin: number;
    d2c_margin_percent: number;
    wholesale_margin: number;
    wholesale_margin_percent: number;
    break_even_units: number;
  };
}

const mockIngredients: Record<string, ProductIngredient[]> = {
  smoothies: [
    { id: '1', product_id: '', ingredient_name: 'Organic Bananas', weight_grams: 80, cost_per_gram: 0.003, nutrition_data: { calories: 71, protein: 0.9, carbs: 18, fat: 0.3, fiber: 2, sugar: 12 }, supplier: 'Dole Organics' },
    { id: '2', product_id: '', ingredient_name: 'Organic Spinach', weight_grams: 40, cost_per_gram: 0.008, nutrition_data: { calories: 9, protein: 1.1, carbs: 1.4, fat: 0.2, fiber: 0.9, sugar: 0.2 }, supplier: 'Earthbound Farms' },
    { id: '3', product_id: '', ingredient_name: 'Almond Milk', weight_grams: 120, cost_per_gram: 0.002, nutrition_data: { calories: 18, protein: 0.6, carbs: 0.8, fat: 1.4, fiber: 0, sugar: 0 }, supplier: 'Califia Farms' },
    { id: '4', product_id: '', ingredient_name: 'Plant Protein Blend', weight_grams: 25, cost_per_gram: 0.04, nutrition_data: { calories: 100, protein: 20, carbs: 3, fat: 1.5, fiber: 1, sugar: 0 }, supplier: 'Sunwarrior' },
    { id: '5', product_id: '', ingredient_name: 'Organic Blueberries', weight_grams: 50, cost_per_gram: 0.012, nutrition_data: { calories: 29, protein: 0.4, carbs: 7, fat: 0.2, fiber: 1.2, sugar: 5 }, supplier: 'Driscoll\'s Organic' },
  ],
  bowls: [
    { id: '6', product_id: '', ingredient_name: 'Organic Acai Puree', weight_grams: 100, cost_per_gram: 0.025, nutrition_data: { calories: 70, protein: 1, carbs: 6, fat: 5, fiber: 3, sugar: 2 }, supplier: 'Sambazon' },
    { id: '7', product_id: '', ingredient_name: 'Organic Granola', weight_grams: 40, cost_per_gram: 0.015, nutrition_data: { calories: 180, protein: 4, carbs: 28, fat: 7, fiber: 3, sugar: 8 }, supplier: 'Nature\'s Path' },
    { id: '8', product_id: '', ingredient_name: 'Fresh Strawberries', weight_grams: 60, cost_per_gram: 0.008, nutrition_data: { calories: 19, protein: 0.4, carbs: 4.6, fat: 0.2, fiber: 1.2, sugar: 2.9 }, supplier: 'Cal-Giant' },
    { id: '9', product_id: '', ingredient_name: 'Coconut Flakes', weight_grams: 15, cost_per_gram: 0.02, nutrition_data: { calories: 100, protein: 1, carbs: 4, fat: 9, fiber: 2.5, sugar: 1.5 }, supplier: 'Bob\'s Red Mill' },
    { id: '10', product_id: '', ingredient_name: 'Raw Honey', weight_grams: 15, cost_per_gram: 0.035, nutrition_data: { calories: 46, protein: 0, carbs: 12.5, fat: 0, fiber: 0, sugar: 12.5 }, supplier: 'Local Bee Farm' },
  ],
  'high-protein': [
    { id: '11', product_id: '', ingredient_name: 'Pea Protein Isolate', weight_grams: 35, cost_per_gram: 0.035, nutrition_data: { calories: 120, protein: 27, carbs: 1, fat: 0.5, fiber: 0.5, sugar: 0 }, supplier: 'PURIS' },
    { id: '12', product_id: '', ingredient_name: 'Hemp Seeds', weight_grams: 20, cost_per_gram: 0.045, nutrition_data: { calories: 110, protein: 6.3, carbs: 1.7, fat: 9.8, fiber: 0.8, sugar: 0.3 }, supplier: 'Manitoba Harvest' },
    { id: '13', product_id: '', ingredient_name: 'Cacao Powder', weight_grams: 15, cost_per_gram: 0.03, nutrition_data: { calories: 20, protein: 1, carbs: 3, fat: 0.8, fiber: 2, sugar: 0 }, supplier: 'Navitas Organics' },
    { id: '14', product_id: '', ingredient_name: 'Organic Oat Milk', weight_grams: 150, cost_per_gram: 0.0025, nutrition_data: { calories: 60, protein: 1.5, carbs: 8, fat: 2.5, fiber: 1, sugar: 3.5 }, supplier: 'Oatly' },
    { id: '15', product_id: '', ingredient_name: 'Almond Butter', weight_grams: 25, cost_per_gram: 0.022, nutrition_data: { calories: 163, protein: 5.3, carbs: 5.5, fat: 14, fiber: 2.5, sugar: 1.4 }, supplier: 'Justin\'s' },
  ],
  bites: [
    { id: '16', product_id: '', ingredient_name: 'Medjool Dates', weight_grams: 40, cost_per_gram: 0.018, nutrition_data: { calories: 111, protein: 0.7, carbs: 30, fat: 0, fiber: 2.7, sugar: 27 }, supplier: 'Natural Delights' },
    { id: '17', product_id: '', ingredient_name: 'Cashews', weight_grams: 30, cost_per_gram: 0.025, nutrition_data: { calories: 157, protein: 5.2, carbs: 8.6, fat: 12.4, fiber: 0.9, sugar: 1.7 }, supplier: 'Terrafresh' },
    { id: '18', product_id: '', ingredient_name: 'Dark Chocolate Chips', weight_grams: 15, cost_per_gram: 0.028, nutrition_data: { calories: 80, protein: 0.9, carbs: 9, fat: 4.8, fiber: 1.1, sugar: 6.8 }, supplier: 'Guittard' },
    { id: '19', product_id: '', ingredient_name: 'Chia Seeds', weight_grams: 10, cost_per_gram: 0.032, nutrition_data: { calories: 49, protein: 1.6, carbs: 4.2, fat: 3.1, fiber: 3.4, sugar: 0 }, supplier: 'Spectrum' },
    { id: '20', product_id: '', ingredient_name: 'Vanilla Extract', weight_grams: 2, cost_per_gram: 0.15, nutrition_data: { calories: 6, protein: 0, carbs: 0.3, fat: 0, fiber: 0, sugar: 0.3 }, supplier: 'Nielsen-Massey' },
  ],
  wellness: [
    { id: '21', product_id: '', ingredient_name: 'Turmeric Powder', weight_grams: 5, cost_per_gram: 0.06, nutrition_data: { calories: 15, protein: 0.4, carbs: 3.2, fat: 0.15, fiber: 1, sugar: 0.16 }, supplier: 'Simply Organic' },
    { id: '22', product_id: '', ingredient_name: 'Ginger Root', weight_grams: 8, cost_per_gram: 0.02, nutrition_data: { calories: 6, protein: 0.1, carbs: 1.4, fat: 0.06, fiber: 0.16, sugar: 0.14 }, supplier: 'Frontier Co-op' },
    { id: '23', product_id: '', ingredient_name: 'Lion\'s Mane Powder', weight_grams: 3, cost_per_gram: 0.25, nutrition_data: { calories: 10, protein: 0.6, carbs: 2, fat: 0.1, fiber: 0.5, sugar: 0 }, supplier: 'Four Sigmatic' },
    { id: '24', product_id: '', ingredient_name: 'Ashwagandha Extract', weight_grams: 2, cost_per_gram: 0.35, nutrition_data: { calories: 5, protein: 0.2, carbs: 1, fat: 0, fiber: 0.2, sugar: 0 }, supplier: 'Gaia Herbs' },
    { id: '25', product_id: '', ingredient_name: 'MCT Oil', weight_grams: 10, cost_per_gram: 0.04, nutrition_data: { calories: 90, protein: 0, carbs: 0, fat: 10, fiber: 0, sugar: 0 }, supplier: 'Bulletproof' },
  ],
};

const packagingCosts: Record<string, number> = {
  smoothies: 0.85,
  bowls: 1.25,
  'high-protein': 0.95,
  bites: 0.65,
  wellness: 0.75,
};

const laborCostPerUnit: Record<string, number> = {
  smoothies: 0.45,
  bowls: 0.65,
  'high-protein': 0.55,
  bites: 0.35,
  wellness: 0.40,
};

const overheadRate = 0.15;

export function generateMockIngredients(productId: string, category: string): ProductIngredient[] {
  const baseIngredients = mockIngredients[category] || mockIngredients['smoothies'];
  return baseIngredients.map(ing => ({
    ...ing,
    product_id: productId,
    id: `${productId}-${ing.id}`,
  }));
}

export function calculateIngredientsCost(ingredients: ProductIngredient[]): number {
  return ingredients.reduce((total, ing) => {
    return total + (ing.weight_grams * ing.cost_per_gram);
  }, 0);
}

export function calculateNutritionTotals(ingredients: ProductIngredient[]): ProductDetails['nutrition_totals'] {
  return ingredients.reduce((totals, ing) => {
    return {
      calories: totals.calories + (ing.nutrition_data.calories || 0),
      protein: totals.protein + (ing.nutrition_data.protein || 0),
      carbs: totals.carbs + (ing.nutrition_data.carbs || 0),
      fat: totals.fat + (ing.nutrition_data.fat || 0),
      fiber: totals.fiber + (ing.nutrition_data.fiber || 0),
      sugar: totals.sugar + (ing.nutrition_data.sugar || 0),
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 });
}

export function calculateMargins(product: Product): ProductWithCosts {
  const category = product.category || 'smoothies';
  const ingredients = generateMockIngredients(product.id, category);
  
  const ingredientsCost = calculateIngredientsCost(ingredients);
  const packagingCost = packagingCosts[category] || 0.85;
  const laborCost = laborCostPerUnit[category] || 0.45;
  const subtotal = ingredientsCost + packagingCost + laborCost;
  const overhead = subtotal * overheadRate;
  const costPerUnit = subtotal + overhead;
  
  const priceD2C = product.price_cents / 100;
  const margin = priceD2C - costPerUnit;
  const marginPercent = priceD2C > 0 ? (margin / priceD2C) * 100 : 0;

  return {
    ...product,
    cost_per_unit: Math.round(costPerUnit * 100) / 100,
    margin: Math.round(margin * 100) / 100,
    margin_percent: Math.round(marginPercent * 10) / 10,
    ingredients_cost: Math.round(ingredientsCost * 100) / 100,
    packaging_cost: packagingCost,
    labor_cost: laborCost,
  };
}

export function getProductDetails(product: Product): ProductDetails {
  const category = product.category || 'smoothies';
  const ingredients = generateMockIngredients(product.id, category);
  
  const ingredientsCost = calculateIngredientsCost(ingredients);
  const packagingCost = packagingCosts[category] || 0.85;
  const laborCost = laborCostPerUnit[category] || 0.45;
  const subtotal = ingredientsCost + packagingCost + laborCost;
  const overhead = subtotal * overheadRate;
  const totalCost = subtotal + overhead;
  
  const priceD2C = product.price_cents / 100;
  const priceWholesale = product.wholesale_price_cents / 100;
  
  const d2cMargin = priceD2C - totalCost;
  const d2cMarginPercent = priceD2C > 0 ? (d2cMargin / priceD2C) * 100 : 0;
  
  const wholesaleMargin = priceWholesale - totalCost;
  const wholesaleMarginPercent = priceWholesale > 0 ? (wholesaleMargin / priceWholesale) * 100 : 0;
  
  const fixedCostsPerMonth = 5000;
  const breakEvenUnits = d2cMargin > 0 ? Math.ceil(fixedCostsPerMonth / d2cMargin) : 0;

  return {
    ...product,
    cost_per_unit: Math.round(totalCost * 100) / 100,
    margin: Math.round(d2cMargin * 100) / 100,
    margin_percent: Math.round(d2cMarginPercent * 10) / 10,
    ingredients_cost: Math.round(ingredientsCost * 100) / 100,
    packaging_cost: packagingCost,
    labor_cost: laborCost,
    ingredients,
    nutrition_totals: calculateNutritionTotals(ingredients),
    cost_breakdown: {
      ingredients: Math.round(ingredientsCost * 100) / 100,
      packaging: packagingCost,
      labor: laborCost,
      overhead: Math.round(overhead * 100) / 100,
      total: Math.round(totalCost * 100) / 100,
    },
    profit_analysis: {
      d2c_margin: Math.round(d2cMargin * 100) / 100,
      d2c_margin_percent: Math.round(d2cMarginPercent * 10) / 10,
      wholesale_margin: Math.round(wholesaleMargin * 100) / 100,
      wholesale_margin_percent: Math.round(wholesaleMarginPercent * 10) / 10,
      break_even_units: breakEvenUnits,
    },
  };
}

export function getAIOptimizationSuggestions(products: ProductWithCosts[]): string[] {
  const suggestions: string[] = [];
  
  const lowMarginProducts = products.filter(p => p.margin_percent < 30);
  if (lowMarginProducts.length > 0) {
    suggestions.push(`${lowMarginProducts.length} products have margins below 30%. Consider reviewing ingredient costs or pricing.`);
  }
  
  const highPerformers = products.filter(p => p.margin_percent > 60);
  if (highPerformers.length > 0) {
    suggestions.push(`${highPerformers.length} products have excellent margins (>60%). Consider increasing marketing spend on these SKUs.`);
  }
  
  const categoryMargins: Record<string, number[]> = {};
  products.forEach(p => {
    if (!categoryMargins[p.category]) categoryMargins[p.category] = [];
    categoryMargins[p.category].push(p.margin_percent);
  });
  
  Object.entries(categoryMargins).forEach(([category, margins]) => {
    const avgMargin = margins.reduce((a, b) => a + b, 0) / margins.length;
    if (avgMargin < 35) {
      suggestions.push(`${category.charAt(0).toUpperCase() + category.slice(1)} category has low average margin (${avgMargin.toFixed(1)}%). Review supplier contracts.`);
    }
  });
  
  if (suggestions.length === 0) {
    suggestions.push('All products are performing within healthy margin ranges.');
    suggestions.push('Consider A/B testing price increases on top performers to maximize revenue.');
  }
  
  return suggestions;
}

export function generateMockCostData(product: Product): ProductCost {
  const category = product.category || 'smoothies';
  const ingredients = generateMockIngredients(product.id, category);
  
  const ingredientsCost = calculateIngredientsCost(ingredients);
  const packagingCost = packagingCosts[category] || 0.85;
  const laborCost = laborCostPerUnit[category] || 0.45;
  const subtotal = ingredientsCost + packagingCost + laborCost;
  const overhead = subtotal * overheadRate;
  const costPerUnit = subtotal + overhead;
  
  const priceD2C = product.price_cents / 100;
  const marginPerUnit = priceD2C - costPerUnit;

  return {
    id: `cost-${product.id}`,
    product_id: product.id,
    cost_per_unit: Math.round(costPerUnit * 100) / 100,
    margin_per_unit: Math.round(marginPerUnit * 100) / 100,
    ingredients_cost: Math.round(ingredientsCost * 100) / 100,
    packaging_cost: packagingCost,
    labor_cost: laborCost,
    updated_at: new Date().toISOString(),
  };
}
