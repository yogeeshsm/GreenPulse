export interface Ingredient {
  name: string;
  carbonIntensity: number;
  waterIntensity: number;
  landUse: number;
  riskFactors: string[];
  percentage: number;
}

export interface NutritionData {
  sugar: number;
  saturatedFat: number;
  sodium: number;
  additives: string[];
}

export interface PackagingData {
  type: 'mono-plastic' | 'composite' | 'biodegradable' | 'glass' | 'metal' | 'e-waste';
  material: string;
  recyclability: number;
  instructions: string;
}

export interface ESGData {
  hasSustainabilityReport: boolean;
  hasEthicalCertification: boolean;
  carbonNeutralGoal: boolean;
  transparencyScore: number;
}

export interface ScoreBreakdown {
  carbon: number;
  water: number;
  energy: number;
  ingredientSustainability: number;
  health: number;
  packaging: number;
  esg: number;
}

export interface ProductData {
  id: string;
  name: string;
  brand: string;
  manufacturer: string;
  country: string;
  category: string;
  type: 'food' | 'non-food'; // Discriminator
  ingredients?: Ingredient[]; // Optional for non-food
  materials?: string[]; // For non-food (e.g., ["Wood", "Polyester"])
  nutrition?: NutritionData; // Optional for non-food
  packaging: PackagingData;
  esg: ESGData;
  certifications: string[];
  image?: string;
}

export interface AlternativeProduct {
  id: string;
  name: string;
  brand: string;
  sustainableScore: number;
  carbonReduction: number;
  packagingImprovement: string;
  healthImprovement: string;
  image?: string;
}

export interface AnalysisResult {
  product: ProductData;
  sustainableScore: number;
  scoreLabel: string;
  scoreBreakdown: ScoreBreakdown;
  carbonTotal: number;
  waterTotal: number;
  healthScore: number;
  dataConfidence: 'High' | 'Medium' | 'Estimated';
  aiSummary: string;
  alternatives: AlternativeProduct[];
  disposalGuidance: {
    classification: string;
    recyclable: boolean;
    instructions: string;
  };
}

export interface ChartData {
  subject: string;
  A: number;
  fullMark: number;
}

export interface BarChartData {
  name: string;
  value: number;
  color: string;
}
