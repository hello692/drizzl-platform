import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getProductDetails, generateMockCostData, ProductDetails } from '../../../../lib/productIntelService';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  if (req.method === 'GET') {
    try {
      if (id.startsWith('demo-')) {
        const demoProduct = getDemoProduct(id);
        if (!demoProduct) {
          return res.status(404).json({ error: 'Product not found' });
        }
        const details = getProductDetails(demoProduct);
        return res.status(200).json({ product: details, demo_mode: true });
      }

      const { data: product, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Product not found' });
        }
        throw error;
      }

      let costData = null;
      let ingredientsData = null;

      try {
        const { data: costs } = await supabaseAdmin
          .from('product_costs')
          .select('*')
          .eq('product_id', id)
          .single();
        costData = costs;
      } catch {}

      try {
        const { data: ingredients } = await supabaseAdmin
          .from('product_ingredients')
          .select('*')
          .eq('product_id', id);
        ingredientsData = ingredients;
      } catch {}

      const details = getProductDetails(product);

      if (costData) {
        details.cost_per_unit = costData.cost_per_unit;
        details.ingredients_cost = costData.ingredients_cost;
        details.packaging_cost = costData.packaging_cost;
        details.labor_cost = costData.labor_cost;
        
        const priceD2C = product.price_cents / 100;
        const priceWholesale = product.wholesale_price_cents / 100;
        const d2cMargin = priceD2C - costData.cost_per_unit;
        const wholesaleMargin = priceWholesale - costData.cost_per_unit;
        
        details.margin = Math.round(d2cMargin * 100) / 100;
        details.margin_percent = priceD2C > 0 ? Math.round((d2cMargin / priceD2C) * 1000) / 10 : 0;
        details.profit_analysis.d2c_margin = details.margin;
        details.profit_analysis.d2c_margin_percent = details.margin_percent;
        details.profit_analysis.wholesale_margin = Math.round(wholesaleMargin * 100) / 100;
        details.profit_analysis.wholesale_margin_percent = priceWholesale > 0 
          ? Math.round((wholesaleMargin / priceWholesale) * 1000) / 10 : 0;
      }

      if (ingredientsData && ingredientsData.length > 0) {
        details.ingredients = ingredientsData.map(ing => ({
          id: ing.id,
          product_id: ing.product_id,
          ingredient_name: ing.ingredient_name,
          weight_grams: ing.weight_grams,
          cost_per_gram: 0,
          nutrition_data: ing.nutrition_data || {},
          supplier: ing.supplier,
        }));
      }

      return res.status(200).json({ product: details, demo_mode: false });

    } catch (error) {
      console.error('Error fetching product details:', error);
      return res.status(500).json({ error: 'Failed to fetch product details' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { 
        cost_per_unit, 
        ingredients_cost, 
        packaging_cost, 
        labor_cost 
      } = req.body;

      if (id.startsWith('demo-')) {
        return res.status(200).json({ 
          success: true, 
          message: 'Demo mode - changes not persisted',
          demo_mode: true 
        });
      }

      const { data: existingCost } = await supabaseAdmin
        .from('product_costs')
        .select('id')
        .eq('product_id', id)
        .single();

      const costData = {
        product_id: id,
        cost_per_unit: cost_per_unit || 0,
        ingredients_cost: ingredients_cost || 0,
        packaging_cost: packaging_cost || 0,
        labor_cost: labor_cost || 0,
        margin_per_unit: 0,
        updated_at: new Date().toISOString(),
      };

      const { data: product } = await supabaseAdmin
        .from('products')
        .select('price_cents')
        .eq('id', id)
        .single();

      if (product) {
        costData.margin_per_unit = (product.price_cents / 100) - cost_per_unit;
      }

      if (existingCost) {
        const { error } = await supabaseAdmin
          .from('product_costs')
          .update(costData)
          .eq('product_id', id);

        if (error) throw error;
      } else {
        const { error } = await supabaseAdmin
          .from('product_costs')
          .insert(costData);

        if (error) {
          if (error.code === '42P01') {
            return res.status(200).json({ 
              success: true, 
              message: 'Product costs table not set up - using mock data',
              demo_mode: true 
            });
          }
          throw error;
        }
      }

      return res.status(200).json({ success: true, demo_mode: false });

    } catch (error) {
      console.error('Error updating product costs:', error);
      return res.status(200).json({ 
        success: true, 
        message: 'Could not save to database - operating in demo mode',
        demo_mode: true 
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function getDemoProduct(id: string) {
  const demoProducts: Record<string, any> = {
    'demo-1': {
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
    'demo-2': {
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
    'demo-3': {
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
    'demo-4': {
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
    'demo-5': {
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
    'demo-6': {
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
    'demo-7': {
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
    'demo-8': {
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
  };
  
  return demoProducts[id] || null;
}
