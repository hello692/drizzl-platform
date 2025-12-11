import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { calculateMargins, getAIOptimizationSuggestions, ProductWithCosts } from '../../../../lib/productIntelService';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      if (error.code === '42P01') {
        return res.status(200).json({ 
          products: [],
          suggestions: ['Database tables not set up. Using demo mode.'],
          message: 'Products table not found - showing demo data'
        });
      }
      throw error;
    }

    if (!products || products.length === 0) {
      const demoProducts = generateDemoProducts();
      const productsWithCosts = demoProducts.map(calculateMargins);
      const suggestions = getAIOptimizationSuggestions(productsWithCosts);
      
      return res.status(200).json({
        products: productsWithCosts,
        suggestions,
        demo_mode: true,
        message: 'No products found - showing demo data'
      });
    }

    const productsWithCosts: ProductWithCosts[] = [];
    
    for (const product of products) {
      let costData = null;
      
      try {
        const { data, error: costError } = await supabaseAdmin
          .from('product_costs')
          .select('*')
          .eq('product_id', product.id)
          .single();
        
        if (!costError) {
          costData = data;
        }
      } catch {
      }

      if (costData) {
        const priceD2C = product.price_cents / 100;
        const margin = priceD2C - costData.cost_per_unit;
        const marginPercent = priceD2C > 0 ? (margin / priceD2C) * 100 : 0;
        
        productsWithCosts.push({
          ...product,
          cost_per_unit: costData.cost_per_unit,
          margin: Math.round(margin * 100) / 100,
          margin_percent: Math.round(marginPercent * 10) / 10,
          ingredients_cost: costData.ingredients_cost,
          packaging_cost: costData.packaging_cost,
          labor_cost: costData.labor_cost,
        });
      } else {
        productsWithCosts.push(calculateMargins(product));
      }
    }

    const suggestions = getAIOptimizationSuggestions(productsWithCosts);

    return res.status(200).json({
      products: productsWithCosts,
      suggestions,
      demo_mode: false,
    });

  } catch (error) {
    console.error('Error fetching product intel:', error);
    
    const demoProducts = generateDemoProducts();
    const productsWithCosts = demoProducts.map(calculateMargins);
    const suggestions = getAIOptimizationSuggestions(productsWithCosts);
    
    return res.status(200).json({
      products: productsWithCosts,
      suggestions,
      demo_mode: true,
      message: 'Could not load products - showing demo data'
    });
  }
}

function generateDemoProducts() {
  return [
    {
      id: 'demo-1',
      name: 'Green Power Smoothie',
      slug: 'green-power-smoothie',
      description: 'Energizing blend of spinach, kale, banana, and plant protein',
      category: 'smoothies',
      price_cents: 899,
      wholesale_price_cents: 599,
      hero_image_url: '',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'demo-2',
      name: 'Berry Blast Bowl',
      slug: 'berry-blast-bowl',
      description: 'Antioxidant-rich acai bowl with fresh berries and granola',
      category: 'bowls',
      price_cents: 1199,
      wholesale_price_cents: 799,
      hero_image_url: '',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'demo-3',
      name: 'Chocolate Protein Shake',
      slug: 'chocolate-protein-shake',
      description: 'Rich chocolate smoothie with 25g plant protein',
      category: 'high-protein',
      price_cents: 999,
      wholesale_price_cents: 699,
      hero_image_url: '',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'demo-4',
      name: 'Energy Bites',
      slug: 'energy-bites',
      description: 'No-bake energy balls with dates, nuts, and dark chocolate',
      category: 'bites',
      price_cents: 699,
      wholesale_price_cents: 449,
      hero_image_url: '',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'demo-5',
      name: 'Golden Turmeric Latte',
      slug: 'golden-turmeric-latte',
      description: 'Anti-inflammatory blend with turmeric, ginger, and adaptogens',
      category: 'wellness',
      price_cents: 849,
      wholesale_price_cents: 549,
      hero_image_url: '',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'demo-6',
      name: 'Tropical Paradise Smoothie',
      slug: 'tropical-paradise-smoothie',
      description: 'Mango, pineapple, and coconut milk blend',
      category: 'smoothies',
      price_cents: 849,
      wholesale_price_cents: 549,
      hero_image_url: '',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'demo-7',
      name: 'PB Power Bowl',
      slug: 'pb-power-bowl',
      description: 'Peanut butter acai bowl with banana and hemp seeds',
      category: 'bowls',
      price_cents: 1299,
      wholesale_price_cents: 849,
      hero_image_url: '',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'demo-8',
      name: 'Vanilla Protein Dream',
      slug: 'vanilla-protein-dream',
      description: 'Creamy vanilla shake with 30g protein',
      category: 'high-protein',
      price_cents: 1049,
      wholesale_price_cents: 749,
      hero_image_url: '',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}
