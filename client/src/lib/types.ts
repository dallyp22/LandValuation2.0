export interface PropertyFormData {
  propertyDescription: string;
  acreage: number;
  location: string;
  irrigated: boolean;
  tillable: boolean;
  cropType: string;
}

export interface ValuationState {
  isLoading: boolean;
  data: ValuationResult | null;
  error: string | null;
}

export interface ComparableSale {
  description: string;
  location: string;
  date: string;
  pricePerAcre: number;
  totalPrice: number;
  acreage: number;
  features: string[];
  sourceUrl?: string;
}

export interface ValuationResult {
  property: {
    acreage: number;
    location: string;
    features: string[];
  };
  valuation: {
    p10: number;
    p50: number;
    p90: number;
    totalValue: number;
    pricePerAcre: number;
  };
  analysis: {
    narrative: string;
    keyFactors: string[];
    confidence: number;
  };
  comparableSales: ComparableSale[];
  sources: Array<{
    title: string;
    organization: string;
    url: string;
  }>;
  timestamp: string;
}
