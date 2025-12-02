export interface IngredientItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  expirationDate: string | null;
  lotNumber: string;
  supplier: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'expiring_soon' | 'expired';
}

export interface PackagingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface FinishedGood {
  id: string;
  batchNumber: string;
  productName: string;
  quantity: number;
  manufactureDate: string;
  expirationDate: string;
  location: string;
  status: 'available' | 'reserved' | 'shipped';
}

export interface ProductionBatch {
  id: string;
  batchNumber: string;
  productName: string;
  targetQuantity: number;
  actualQuantity: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'qa_hold';
  startTime: string;
  endTime: string | null;
  shift: string;
}

export interface BurnRateData {
  ingredientId: string;
  ingredientName: string;
  dailyUsage: number;
  weeklyUsage: number;
  currentStock: number;
  daysUntilRestock: number;
  predictedRestockDate: string;
}

export interface ProductionMetrics {
  totalBatchesToday: number;
  completedBatches: number;
  inProgressBatches: number;
  qaHoldBatches: number;
  efficiency: number;
  goalUnits: number;
  actualUnits: number;
}

export function checkLowStock<T extends { quantity: number; minThreshold: number }>(
  items: T[]
): T[] {
  return items.filter(item => item.quantity <= item.minThreshold);
}

export function checkExpirations(
  items: IngredientItem[],
  daysThreshold: number = 30
): IngredientItem[] {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
  
  return items.filter(item => {
    if (!item.expirationDate) return false;
    const expDate = new Date(item.expirationDate);
    return expDate <= thresholdDate;
  });
}

export function calculateBurnRate(
  ingredientId: string,
  historicalUsage: { date: string; quantity: number }[]
): number {
  if (historicalUsage.length === 0) return 0;
  
  const totalUsage = historicalUsage.reduce((sum, usage) => sum + usage.quantity, 0);
  return totalUsage / historicalUsage.length;
}

export function predictRestockDate(
  currentStock: number,
  dailyBurnRate: number,
  minThreshold: number
): string {
  if (dailyBurnRate <= 0) return 'N/A';
  
  const daysUntilThreshold = Math.floor((currentStock - minThreshold) / dailyBurnRate);
  const restockDate = new Date();
  restockDate.setDate(restockDate.getDate() + daysUntilThreshold);
  
  return restockDate.toISOString().split('T')[0];
}

export function getIngredientStatus(item: { quantity: number; minThreshold: number; expirationDate: string | null }): IngredientItem['status'] {
  if (item.quantity === 0) return 'out_of_stock';
  
  if (item.expirationDate) {
    const expDate = new Date(item.expirationDate);
    const now = new Date();
    if (expDate < now) return 'expired';
    
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    if (expDate <= thirtyDaysFromNow) return 'expiring_soon';
  }
  
  if (item.quantity <= item.minThreshold) return 'low_stock';
  return 'in_stock';
}

export function getPackagingStatus(item: { quantity: number; minThreshold: number }): PackagingItem['status'] {
  if (item.quantity === 0) return 'out_of_stock';
  if (item.quantity <= item.minThreshold) return 'low_stock';
  return 'in_stock';
}

export function generateMockIngredients(): IngredientItem[] {
  const ingredients = [
    { name: 'Organic Acai Puree', unit: 'kg', supplier: 'Amazon Organics Co.' },
    { name: 'Frozen Blueberries', unit: 'kg', supplier: 'Berry Fresh Farms' },
    { name: 'Organic Spinach', unit: 'kg', supplier: 'Green Valley Produce' },
    { name: 'Almond Butter', unit: 'kg', supplier: 'Nutty Delights Inc.' },
    { name: 'Organic Banana', unit: 'kg', supplier: 'Tropical Harvest' },
    { name: 'Chia Seeds', unit: 'kg', supplier: 'SuperSeeds LLC' },
    { name: 'Coconut Water', unit: 'L', supplier: 'Pacific Coconut Co.' },
    { name: 'Organic Mango', unit: 'kg', supplier: 'Tropical Harvest' },
    { name: 'Hemp Protein Powder', unit: 'kg', supplier: 'Plant Power Proteins' },
    { name: 'Organic Oats', unit: 'kg', supplier: 'Golden Grain Mills' },
    { name: 'Cacao Powder', unit: 'kg', supplier: 'Cacao Direct' },
    { name: 'Maple Syrup', unit: 'L', supplier: 'Vermont Maple Co.' },
  ];

  return ingredients.map((ing, index) => {
    const quantity = Math.floor(Math.random() * 500) + 10;
    const minThreshold = Math.floor(Math.random() * 50) + 20;
    
    const expDate = new Date();
    const daysToAdd = Math.floor(Math.random() * 90) - 15;
    expDate.setDate(expDate.getDate() + daysToAdd);
    
    const item = {
      id: `ing-${index + 1}`,
      name: ing.name,
      quantity,
      unit: ing.unit,
      minThreshold,
      expirationDate: expDate.toISOString().split('T')[0],
      lotNumber: `LOT-${2024}${String(index + 1).padStart(4, '0')}`,
      supplier: ing.supplier,
      status: 'in_stock' as IngredientItem['status'],
    };
    
    item.status = getIngredientStatus(item);
    return item;
  });
}

export function generateMockPackaging(): PackagingItem[] {
  const packaging = [
    { name: 'Smoothie Cups (16oz)', unit: 'pcs' },
    { name: 'Smoothie Cups (24oz)', unit: 'pcs' },
    { name: 'Dome Lids (16oz)', unit: 'pcs' },
    { name: 'Dome Lids (24oz)', unit: 'pcs' },
    { name: 'Flat Lids', unit: 'pcs' },
    { name: 'Paper Straws', unit: 'pcs' },
    { name: 'Product Labels', unit: 'pcs' },
    { name: 'Shipping Boxes (Small)', unit: 'pcs' },
    { name: 'Shipping Boxes (Medium)', unit: 'pcs' },
    { name: 'Shipping Boxes (Large)', unit: 'pcs' },
    { name: 'Ice Packs', unit: 'pcs' },
    { name: 'Insulated Liners', unit: 'pcs' },
  ];

  return packaging.map((pkg, index) => {
    const quantity = Math.floor(Math.random() * 5000) + 100;
    const minThreshold = Math.floor(Math.random() * 500) + 200;
    
    const item = {
      id: `pkg-${index + 1}`,
      name: pkg.name,
      quantity,
      unit: pkg.unit,
      minThreshold,
      status: 'in_stock' as PackagingItem['status'],
    };
    
    item.status = getPackagingStatus(item);
    return item;
  });
}

export function generateMockFinishedGoods(): FinishedGood[] {
  const products = [
    'Berry Blast Smoothie',
    'Green Power Bowl',
    'Tropical Sunrise',
    'Chocolate Protein Shake',
    'Acai Supreme Bowl',
    'Mango Tango Smoothie',
  ];
  
  const locations = ['Warehouse A', 'Warehouse B', 'Cold Storage 1', 'Cold Storage 2'];
  const statuses: FinishedGood['status'][] = ['available', 'reserved', 'shipped'];

  const goods: FinishedGood[] = [];
  
  for (let i = 0; i < 15; i++) {
    const manufactureDate = new Date();
    manufactureDate.setDate(manufactureDate.getDate() - Math.floor(Math.random() * 14));
    
    const expirationDate = new Date(manufactureDate);
    expirationDate.setDate(expirationDate.getDate() + 30);
    
    goods.push({
      id: `fg-${i + 1}`,
      batchNumber: `BATCH-${2024}${String(i + 1).padStart(5, '0')}`,
      productName: products[Math.floor(Math.random() * products.length)],
      quantity: Math.floor(Math.random() * 500) + 50,
      manufactureDate: manufactureDate.toISOString().split('T')[0],
      expirationDate: expirationDate.toISOString().split('T')[0],
      location: locations[Math.floor(Math.random() * locations.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }
  
  return goods;
}

export function generateMockProductionBatches(): ProductionBatch[] {
  const products = [
    'Berry Blast Smoothie',
    'Green Power Bowl',
    'Tropical Sunrise',
    'Chocolate Protein Shake',
    'Acai Supreme Bowl',
  ];
  
  const statuses: ProductionBatch['status'][] = ['scheduled', 'in_progress', 'completed', 'qa_hold'];
  const shifts = ['Morning (6AM-2PM)', 'Afternoon (2PM-10PM)', 'Night (10PM-6AM)'];
  
  const batches: ProductionBatch[] = [];
  
  for (let i = 0; i < 8; i++) {
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - Math.floor(Math.random() * 12));
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const targetQuantity = Math.floor(Math.random() * 300) + 100;
    const actualQuantity = status === 'completed' 
      ? Math.floor(targetQuantity * (0.9 + Math.random() * 0.15))
      : status === 'in_progress'
        ? Math.floor(targetQuantity * Math.random() * 0.7)
        : 0;
    
    batches.push({
      id: `pb-${i + 1}`,
      batchNumber: `PB-${2024}${String(i + 1).padStart(4, '0')}`,
      productName: products[Math.floor(Math.random() * products.length)],
      targetQuantity,
      actualQuantity,
      status,
      startTime: startTime.toISOString(),
      endTime: status === 'completed' 
        ? new Date(startTime.getTime() + Math.random() * 4 * 60 * 60 * 1000).toISOString()
        : null,
      shift: shifts[Math.floor(Math.random() * shifts.length)],
    });
  }
  
  return batches;
}

export function generateMockBurnRates(): BurnRateData[] {
  const ingredients = generateMockIngredients();
  
  return ingredients.slice(0, 6).map(ing => {
    const dailyUsage = Math.floor(Math.random() * 20) + 5;
    const currentStock = ing.quantity;
    const daysUntilRestock = Math.floor((currentStock - ing.minThreshold) / dailyUsage);
    
    return {
      ingredientId: ing.id,
      ingredientName: ing.name,
      dailyUsage,
      weeklyUsage: dailyUsage * 7,
      currentStock,
      daysUntilRestock: Math.max(0, daysUntilRestock),
      predictedRestockDate: predictRestockDate(currentStock, dailyUsage, ing.minThreshold),
    };
  });
}

export function generateMockProductionMetrics(): ProductionMetrics {
  const totalBatches = Math.floor(Math.random() * 15) + 5;
  const completed = Math.floor(totalBatches * 0.6);
  const inProgress = Math.floor(totalBatches * 0.25);
  const qaHold = totalBatches - completed - inProgress;
  
  const goalUnits = 2000;
  const actualUnits = Math.floor(goalUnits * (0.7 + Math.random() * 0.35));
  
  return {
    totalBatchesToday: totalBatches,
    completedBatches: completed,
    inProgressBatches: inProgress,
    qaHoldBatches: qaHold,
    efficiency: Math.round((actualUnits / goalUnits) * 100),
    goalUnits,
    actualUnits,
  };
}

export function generateRestockAlerts(): { ingredient: string; daysLeft: number; urgency: 'critical' | 'warning' | 'info' }[] {
  const burnRates = generateMockBurnRates();
  
  return burnRates
    .filter(br => br.daysUntilRestock < 14)
    .map(br => {
      const urgency: 'critical' | 'warning' | 'info' = br.daysUntilRestock <= 3 ? 'critical' : br.daysUntilRestock <= 7 ? 'warning' : 'info';
      return {
        ingredient: br.ingredientName,
        daysLeft: br.daysUntilRestock,
        urgency,
      };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);
}
