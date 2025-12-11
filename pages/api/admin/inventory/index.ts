import type { NextApiRequest, NextApiResponse } from 'next';
import {
  generateMockIngredients,
  generateMockPackaging,
  generateMockFinishedGoods,
  IngredientItem,
  PackagingItem,
  FinishedGood,
} from '../../../../lib/inventoryService';

interface InventoryResponse {
  success: boolean;
  data?: {
    ingredients?: IngredientItem[];
    packaging?: PackagingItem[];
    finishedGoods?: FinishedGood[];
  };
  item?: IngredientItem | PackagingItem | FinishedGood;
  error?: string;
  message?: string;
}

let mockIngredients: IngredientItem[] | null = null;
let mockPackaging: PackagingItem[] | null = null;
let mockFinishedGoods: FinishedGood[] | null = null;

function initializeMockData() {
  if (!mockIngredients) {
    mockIngredients = generateMockIngredients();
  }
  if (!mockPackaging) {
    mockPackaging = generateMockPackaging();
  }
  if (!mockFinishedGoods) {
    mockFinishedGoods = generateMockFinishedGoods();
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<InventoryResponse>
) {
  initializeMockData();

  if (req.method === 'GET') {
    const { type } = req.query;

    if (type === 'ingredients') {
      return res.status(200).json({
        success: true,
        data: { ingredients: mockIngredients! },
      });
    }

    if (type === 'packaging') {
      return res.status(200).json({
        success: true,
        data: { packaging: mockPackaging! },
      });
    }

    if (type === 'finished_goods') {
      return res.status(200).json({
        success: true,
        data: { finishedGoods: mockFinishedGoods! },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ingredients: mockIngredients!,
        packaging: mockPackaging!,
        finishedGoods: mockFinishedGoods!,
      },
    });
  }

  if (req.method === 'POST') {
    const { type, item } = req.body;

    if (!type || !item) {
      return res.status(400).json({
        success: false,
        error: 'Missing type or item data',
      });
    }

    const newId = `${type.substring(0, 3)}-${Date.now()}`;

    if (type === 'ingredient') {
      const newItem: IngredientItem = {
        ...item,
        id: newId,
      };
      mockIngredients!.unshift(newItem);
      return res.status(201).json({
        success: true,
        item: newItem,
        message: 'Ingredient added successfully',
      });
    }

    if (type === 'packaging') {
      const newItem: PackagingItem = {
        ...item,
        id: newId,
      };
      mockPackaging!.unshift(newItem);
      return res.status(201).json({
        success: true,
        item: newItem,
        message: 'Packaging item added successfully',
      });
    }

    if (type === 'finished_good') {
      const newItem: FinishedGood = {
        ...item,
        id: newId,
      };
      mockFinishedGoods!.unshift(newItem);
      return res.status(201).json({
        success: true,
        item: newItem,
        message: 'Finished good added successfully',
      });
    }

    return res.status(400).json({
      success: false,
      error: 'Invalid item type',
    });
  }

  if (req.method === 'PATCH') {
    const { type, id, updates } = req.body;

    if (!type || !id || !updates) {
      return res.status(400).json({
        success: false,
        error: 'Missing type, id, or updates',
      });
    }

    if (type === 'ingredient') {
      const index = mockIngredients!.findIndex(item => item.id === id);
      if (index === -1) {
        return res.status(404).json({
          success: false,
          error: 'Ingredient not found',
        });
      }
      mockIngredients![index] = { ...mockIngredients![index], ...updates };
      return res.status(200).json({
        success: true,
        item: mockIngredients![index],
        message: 'Ingredient updated successfully',
      });
    }

    if (type === 'packaging') {
      const index = mockPackaging!.findIndex(item => item.id === id);
      if (index === -1) {
        return res.status(404).json({
          success: false,
          error: 'Packaging item not found',
        });
      }
      mockPackaging![index] = { ...mockPackaging![index], ...updates };
      return res.status(200).json({
        success: true,
        item: mockPackaging![index],
        message: 'Packaging item updated successfully',
      });
    }

    if (type === 'finished_good') {
      const index = mockFinishedGoods!.findIndex(item => item.id === id);
      if (index === -1) {
        return res.status(404).json({
          success: false,
          error: 'Finished good not found',
        });
      }
      mockFinishedGoods![index] = { ...mockFinishedGoods![index], ...updates };
      return res.status(200).json({
        success: true,
        item: mockFinishedGoods![index],
        message: 'Finished good updated successfully',
      });
    }

    return res.status(400).json({
      success: false,
      error: 'Invalid item type',
    });
  }

  if (req.method === 'DELETE') {
    const { type, id } = req.body;

    if (!type || !id) {
      return res.status(400).json({
        success: false,
        error: 'Missing type or id',
      });
    }

    if (type === 'ingredient') {
      mockIngredients = mockIngredients!.filter(item => item.id !== id);
    } else if (type === 'packaging') {
      mockPackaging = mockPackaging!.filter(item => item.id !== id);
    } else if (type === 'finished_good') {
      mockFinishedGoods = mockFinishedGoods!.filter(item => item.id !== id);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid item type',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
    });
  }

  res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
  return res.status(405).json({
    success: false,
    error: `Method ${req.method} Not Allowed`,
  });
}
