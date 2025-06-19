import { z } from "zod";

// Property input schema
export const propertyInputSchema = z.object({
  propertyDescription: z.string().min(10, "Property description must be at least 10 characters"),
  acreage: z.number().min(0.1, "Acreage must be greater than 0"),
  location: z.string().min(2, "Location is required"),
  irrigated: z.boolean().default(false),
  tillable: z.boolean().default(false),
  cropType: z.string().optional(),
});

export type PropertyInput = z.infer<typeof propertyInputSchema>;

// Valuation result schema
export const valuationResultSchema = z.object({
  property: z.object({
    acreage: z.number(),
    location: z.string(),
    features: z.array(z.string()),
  }),
  valuation: z.object({
    p10: z.number(),
    p50: z.number(),
    p90: z.number(),
    totalValue: z.number(),
    pricePerAcre: z.number(),
  }),
  analysis: z.object({
    narrative: z.string(),
    keyFactors: z.array(z.string()),
    confidence: z.number(),
  }),
  comparableSales: z.array(z.object({
    description: z.string(),
    location: z.string(),
    date: z.string(),
    pricePerAcre: z.number(),
    totalPrice: z.number(),
    acreage: z.number(),
    features: z.array(z.string()),
    sourceUrl: z.string().optional(),
  })),
  sources: z.array(z.object({
    title: z.string(),
    organization: z.string(),
    url: z.string(),
  })),
  timestamp: z.string(),
});

export type ValuationResult = z.infer<typeof valuationResultSchema>;

// API response schemas
export const apiErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;
