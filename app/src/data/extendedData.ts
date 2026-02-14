import type { ProductData } from '@/types';

export const additionalProducts: ProductData[] = [
  {
    id: 'prod-002',
    name: 'Plant-Based Almond Milk',
    brand: 'PureHarvest',
    manufacturer: 'GreenDairy Co.',
    country: 'USA',
    category: 'Dairy Alternative',
    type: 'food',
    ingredients: [
      { name: 'Filtered Water', carbonIntensity: 0.1, waterIntensity: 1, landUse: 0, riskFactors: [], percentage: 85 },
      { name: 'Almonds', carbonIntensity: 2.1, waterIntensity: 3800, landUse: 8.5, riskFactors: ['water-intensive'], percentage: 10 },
      { name: 'Calcium Carbonate', carbonIntensity: 0.5, waterIntensity: 50, landUse: 0.5, riskFactors: [], percentage: 3 },
      { name: 'Sea Salt', carbonIntensity: 0.3, waterIntensity: 20, landUse: 0.1, riskFactors: [], percentage: 2 }
    ],
    nutrition: { sugar: 2, saturatedFat: 0.5, sodium: 120, additives: ['vitamin D2', 'vitamin B12'] },
    packaging: { type: 'composite', material: 'Tetra Pak Carton', recyclability: 65, instructions: 'Rinse and recycle. Separate plastic cap.' },
    esg: { hasSustainabilityReport: true, hasEthicalCertification: true, carbonNeutralGoal: true, transparencyScore: 85 },
    certifications: ['Organic', 'Non-GMO', 'B-Corp']
  },
  {
    id: 'prod-003',
    name: 'Organic Quinoa Granola',
    brand: 'EarthCrunch',
    manufacturer: 'Sustainable Foods Inc.',
    country: 'Peru',
    category: 'Breakfast Cereal',
    type: 'food',
    ingredients: [
      { name: 'Rolled Oats', carbonIntensity: 0.6, waterIntensity: 240, landUse: 3.2, riskFactors: [], percentage: 45 },
      { name: 'Quinoa', carbonIntensity: 1.2, waterIntensity: 420, landUse: 5.5, riskFactors: [], percentage: 20 },
      { name: 'Coconut Sugar', carbonIntensity: 0.9, waterIntensity: 200, landUse: 2.8, riskFactors: [], percentage: 15 },
      { name: 'Coconut Oil', carbonIntensity: 2.8, waterIntensity: 45, landUse: 7.2, riskFactors: [], percentage: 12 },
      { name: 'Dried Cranberries', carbonIntensity: 1.5, waterIntensity: 380, landUse: 4.1, riskFactors: [], percentage: 8 }
    ],
    nutrition: { sugar: 18, saturatedFat: 4, sodium: 85, additives: ['natural flavor'] },
    packaging: { type: 'mono-plastic', material: 'Recyclable Plastic Bag', recyclability: 45, instructions: 'Clean and recycle with soft plastics.' },
    esg: { hasSustainabilityReport: true, hasEthicalCertification: true, carbonNeutralGoal: false, transparencyScore: 72 },
    certifications: ['Organic', 'Fair Trade', 'Carbon Neutral']
  },
  {
    id: 'prod-004',
    name: 'Beyond Burger Plant Patty',
    brand: 'Beyond Meat',
    manufacturer: 'Beyond Meat Inc.',
    country: 'USA',
    category: 'Plant-Based Meat',
    type: 'food',
    ingredients: [
      { name: 'Pea Protein', carbonIntensity: 0.8, waterIntensity: 180, landUse: 2.1, riskFactors: [], percentage: 35 },
      { name: 'Canola Oil', carbonIntensity: 1.4, waterIntensity: 240, landUse: 4.2, riskFactors: [], percentage: 20 },
      { name: 'Coconut Oil', carbonIntensity: 2.8, waterIntensity: 45, landUse: 7.2, riskFactors: [], percentage: 15 },
      { name: 'Mung Bean Protein', carbonIntensity: 0.6, waterIntensity: 160, landUse: 1.8, riskFactors: [], percentage: 15 },
      { name: 'Potato Starch', carbonIntensity: 0.4, waterIntensity: 120, landUse: 1.2, riskFactors: [], percentage: 10 },
      { name: 'Beet Juice Extract', carbonIntensity: 0.5, waterIntensity: 180, landUse: 1.5, riskFactors: [], percentage: 5 }
    ],
    nutrition: { sugar: 0, saturatedFat: 5, sodium: 380, additives: ['natural flavors', 'vitamin B12'] },
    packaging: { type: 'mono-plastic', material: 'Recyclable PP Plastic', recyclability: 70, instructions: 'Rinse and recycle with plastics.' },
    esg: { hasSustainabilityReport: true, hasEthicalCertification: true, carbonNeutralGoal: true, transparencyScore: 88 },
    certifications: ['Non-GMO', 'Kosher', 'Climate Neutral Certified']
  },
  {
    id: 'prod-005',
    name: 'Fair Trade Coffee Beans',
    brand: 'EthicalRoast',
    manufacturer: 'Coffee Collective',
    country: 'Colombia',
    category: 'Coffee',
    type: 'food',
    ingredients: [
      { name: 'Arabica Coffee Beans', carbonIntensity: 4.5, waterIntensity: 8400, landUse: 12.5, riskFactors: ['water-intensive', 'deforestation-risk'], percentage: 100 }
    ],
    nutrition: { sugar: 0, saturatedFat: 0, sodium: 5, additives: [] },
    packaging: { type: 'mono-plastic', material: 'Compostable Bag', recyclability: 90, instructions: 'Compost in industrial facility or home compost.' },
    esg: { hasSustainabilityReport: true, hasEthicalCertification: true, carbonNeutralGoal: true, transparencyScore: 92 },
    certifications: ['Fair Trade', 'Organic', 'Rainforest Alliance', 'Direct Trade']
  },
  {
    id: 'prod-006',
    name: 'Conventional Beef Burger',
    brand: 'MegaMeat',
    manufacturer: 'Industrial Foods Corp.',
    country: 'Brazil',
    category: 'Meat',
    type: 'food',
    ingredients: [
      { name: 'Beef', carbonIntensity: 60, waterIntensity: 15400, landUse: 164, riskFactors: ['high-carbon', 'methane-emissions', 'deforestation-risk', 'water-intensive'], percentage: 95 },
      { name: 'Salt', carbonIntensity: 0.3, waterIntensity: 20, landUse: 0.1, riskFactors: [], percentage: 3 },
      { name: 'Spices', carbonIntensity: 1.2, waterIntensity: 180, landUse: 2.5, riskFactors: [], percentage: 2 }
    ],
    nutrition: { sugar: 0, saturatedFat: 12, sodium: 420, additives: ['preservatives'] },
    packaging: { type: 'composite', material: 'Plastic Tray with Film', recyclability: 15, instructions: 'Not recyclable. Dispose as general waste.' },
    esg: { hasSustainabilityReport: false, hasEthicalCertification: false, carbonNeutralGoal: false, transparencyScore: 25 },
    certifications: []
  }
];

export const scanHistoryItems = [
  { id: 'scan-001', productId: 'prod-001', scannedAt: '2024-01-15T10:30:00Z', score: 62 },
  { id: 'scan-002', productId: 'prod-002', scannedAt: '2024-01-14T16:45:00Z', score: 78 },
  { id: 'scan-003', productId: 'prod-003', scannedAt: '2024-01-13T09:15:00Z', score: 71 },
  { id: 'scan-004', productId: 'prod-004', scannedAt: '2024-01-12T14:20:00Z', score: 82 },
  { id: 'scan-005', productId: 'prod-006', scannedAt: '2024-01-11T11:00:00Z', score: 28 },
];

export const userStats = {
  totalScans: 47,
  averageScore: 68,
  carbonSaved: 124.5,
  waterSaved: 2840,
  productsSwitched: 12,
  streakDays: 8,
  rank: 'Eco Warrior',
  nextRank: 'Planet Guardian',
  progressToNext: 65
};

export const achievements = [
  { id: 'ach-001', name: 'First Scan', description: 'Scanned your first product', icon: '🔍', unlocked: true, unlockedAt: '2024-01-01' },
  { id: 'ach-002', name: 'Eco Explorer', description: 'Scanned 10 different products', icon: '🌱', unlocked: true, unlockedAt: '2024-01-08' },
  { id: 'ach-003', name: 'Smart Switcher', description: 'Switched to 5 better alternatives', icon: '🔄', unlocked: true, unlockedAt: '2024-01-12' },
  { id: 'ach-004', name: 'Carbon Saver', description: 'Saved 100kg of CO₂', icon: '☁️', unlocked: true, unlockedAt: '2024-01-15' },
  { id: 'ach-005', name: 'Water Warrior', description: 'Saved 5,000 liters of water', icon: '💧', unlocked: false, progress: 57 },
  { id: 'ach-006', name: 'Planet Guardian', description: 'Maintained 70+ average score for 30 days', icon: '🌍', unlocked: false, progress: 27 },
  { id: 'ach-007', name: 'Influencer', description: 'Shared 10 products with friends', icon: '📢', unlocked: false, progress: 40 },
  { id: 'ach-008', name: 'Master Scanner', description: 'Scanned 100 products', icon: '🏆', unlocked: false, progress: 47 },
];

export const sustainabilityTips = [
  { id: 'tip-001', category: 'Food', title: 'Choose Local & Seasonal', description: 'Local produce travels less, reducing transport emissions by up to 50%.', impact: 'High' },
  { id: 'tip-002', category: 'Packaging', title: 'Avoid Composite Materials', description: 'Multi-layer packaging is rarely recyclable. Choose glass or paper instead.', impact: 'Medium' },
  { id: 'tip-003', category: 'Health', title: 'Watch for Hidden Sugars', description: 'Products with high sugar content often have higher environmental footprints.', impact: 'Medium' },
  { id: 'tip-004', category: 'Water', title: 'Check Water Footprint', description: 'Nuts and dairy alternatives vary widely in water usage. Almonds use 10x more water than oats.', impact: 'High' },
  { id: 'tip-005', category: 'Carbon', title: 'Plant-Based Proteins', description: 'Switching from beef to plant-based alternatives reduces carbon by 90%.', impact: 'High' },
];

export const esgDetails = {
  carbonNeutralProgress: 78,
  renewableEnergy: 65,
  wasteRecycled: 82,
  waterRecycled: 45,
  ethicalSourcing: 90,
  supplierAudits: 24,
  livingWagePercent: 85,
  diversityScore: 72,
  communityInvestment: 2.4,
  philanthropyPercent: 1.2
};
