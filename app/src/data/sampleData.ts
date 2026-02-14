import type { ProductData, AlternativeProduct, AnalysisResult } from '@/types';

export const sampleProduct: ProductData = {
  id: 'prod-001',
  name: 'Organic Chocolate Hazelnut Spread',
  brand: 'NutriGreen',
  manufacturer: 'GreenEarth Foods Ltd.',
  country: 'Switzerland',
  category: 'Food Spread',
  type: 'food',
  ingredients: [
    {
      name: 'Cane Sugar',
      carbonIntensity: 0.8,
      waterIntensity: 180,
      landUse: 2.5,
      riskFactors: ['water-intensive'],
      percentage: 45
    },
    {
      name: 'Palm Oil',
      carbonIntensity: 3.2,
      waterIntensity: 15,
      landUse: 8.5,
      riskFactors: ['deforestation-risk', 'biodiversity-impact'],
      percentage: 25
    },
    {
      name: 'Hazelnuts',
      carbonIntensity: 1.5,
      waterIntensity: 850,
      landUse: 4.2,
      riskFactors: ['water-intensive'],
      percentage: 15
    },
    {
      name: 'Cocoa Powder',
      carbonIntensity: 4.1,
      waterIntensity: 2100,
      landUse: 6.8,
      riskFactors: ['deforestation-risk', 'water-intensive'],
      percentage: 10
    },
    {
      name: 'Skimmed Milk Powder',
      carbonIntensity: 9.5,
      waterIntensity: 540,
      landUse: 12.5,
      riskFactors: ['methane-emissions', 'high-carbon'],
      percentage: 5
    }
  ],
  nutrition: {
    sugar: 54,
    saturatedFat: 11,
    sodium: 42,
    additives: ['lecithin', 'vanillin']
  },
  packaging: {
    type: 'glass',
    material: 'Glass Jar with Metal Lid',
    recyclability: 85,
    instructions: 'Rinse and recycle in glass container. Separate metal lid.'
  },
  esg: {
    hasSustainabilityReport: true,
    hasEthicalCertification: true,
    carbonNeutralGoal: true,
    transparencyScore: 78
  },
  certifications: ['Organic', 'Fair Trade', 'Rainforest Alliance']
};

export const alternativeProducts: AlternativeProduct[] = [
  {
    id: 'alt-001',
    name: 'EcoSpread Hazelnut Butter',
    brand: 'PureNature',
    sustainableScore: 78,
    carbonReduction: 32,
    packagingImprovement: '100% recyclable glass',
    healthImprovement: '40% less sugar, no palm oil',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=200&h=200&fit=crop'
  },
  {
    id: 'alt-002',
    name: 'Local Almond Spread',
    brand: 'FarmFresh',
    sustainableScore: 82,
    carbonReduction: 45,
    packagingImprovement: 'Compostable packaging',
    healthImprovement: 'Organic, no additives',
    image: 'https://images.unsplash.com/photo-1505253758473-96b701d2cd03?w=200&h=200&fit=crop'
  },
  {
    id: 'alt-003',
    name: 'DIY Nut Butter Kit',
    brand: 'MakeYourOwn',
    sustainableScore: 91,
    carbonReduction: 68,
    packagingImprovement: 'Zero waste packaging',
    healthImprovement: 'Full control of ingredients',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&h=200&fit=crop'
  }
];

export const analysisResult: AnalysisResult = {
  product: sampleProduct,
  sustainableScore: 62,
  scoreLabel: 'Moderate',
  scoreBreakdown: {
    carbon: 18,
    water: 8,
    energy: 6,
    ingredientSustainability: 9,
    health: 6,
    packaging: 5,
    esg: 10
  },
  carbonTotal: 2.8,
  waterTotal: 485,
  healthScore: 42,
  dataConfidence: 'High',
  aiSummary: 'This product has moderate environmental impact due to dairy methane emissions and cocoa water intensity. Palm oil sourcing presents deforestation risks. However, the glass packaging is highly recyclable and manufacturer demonstrates strong ESG transparency. High sugar content reduces health sustainability.',
  alternatives: alternativeProducts,
  disposalGuidance: {
    classification: 'Recyclable Glass',
    recyclable: true,
    instructions: 'Empty remaining product. Rinse jar thoroughly. Remove metal lid and recycle separately. Place glass jar in glass recycling container.'
  }
};

export const getScoreColor = (score: number): string => {
  if (score >= 85) return '#22c55e';
  if (score >= 70) return '#2dd4bf';
  if (score >= 55) return '#eab308';
  if (score >= 40) return '#f97316';
  return '#ef4444';
};

export const getScoreLabel = (score: number): string => {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 55) return 'Moderate';
  if (score >= 40) return 'Low Sustainability';
  return 'Unsustainable';
};

export const getScoreDescription = (score: number): string => {
  if (score >= 70) return 'Environmentally Responsible Choice';
  if (score >= 50) return 'Moderate Impact – Consider Alternatives';
  return 'High Environmental Impact – Switching Recommended';
};

export const radarData = [
  { subject: 'Carbon', A: 60, fullMark: 100 },
  { subject: 'Water', A: 53, fullMark: 100 },
  { subject: 'Energy', A: 60, fullMark: 100 },
  { subject: 'Packaging', A: 50, fullMark: 100 },
  { subject: 'Health', A: 60, fullMark: 100 },
  { subject: 'ESG', A: 100, fullMark: 100 },
];

export const barChartData = [
  { name: 'Ingredients', value: 35, color: '#2dd4bf' },
  { name: 'Manufacturing', value: 28, color: '#22c55e' },
  { name: 'Packaging', value: 15, color: '#0ea5e9' },
  { name: 'Transport', value: 12, color: '#8b5cf6' },
  { name: 'End of Life', value: 10, color: '#f59e0b' },
];

export const scoreWeights = [
  { label: 'Carbon', weight: 30, score: 18, max: 30 },
  { label: 'Water', weight: 15, score: 8, max: 15 },
  { label: 'Energy', weight: 10, score: 6, max: 10 },
  { label: 'Ingredients', weight: 15, score: 9, max: 15 },
  { label: 'Health', weight: 10, score: 6, max: 10 },
  { label: 'Packaging', weight: 10, score: 5, max: 10 },
  { label: 'ESG', weight: 10, score: 10, max: 10 },
];
