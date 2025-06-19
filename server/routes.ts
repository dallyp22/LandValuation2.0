import type { Express } from "express";
import { createServer, type Server } from "http";
import { propertyInputSchema, valuationResultSchema } from "../shared/schema";
import { generateLandValuation } from "./services/openai";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Land valuation endpoint
  app.post("/api/valuations", async (req, res) => {
    try {
      // Validate request body
      const validatedData = propertyInputSchema.parse(req.body);
      
      // Generate valuation using OpenAI
      const result = await generateLandValuation(validatedData);
      
      // Structure response according to schema
      const response = {
        property: {
          acreage: result.property.acreage,
          location: result.property.location,
          features: result.property.features,
        },
        valuation: {
          p10: result.valuation.p10,
          p50: result.valuation.p50,
          p90: result.valuation.p90,
          totalValue: result.valuation.totalValue,
          pricePerAcre: result.valuation.pricePerAcre,
        },
        analysis: {
          narrative: result.analysis.narrative,
          keyFactors: result.analysis.keyFactors,
          confidence: result.analysis.confidence,
        },
        comparableSales: result.comparableSales,
        sources: result.sources,
        timestamp: result.timestamp,
      };

      // Validate response matches schema
      const validatedResponse = valuationResultSchema.parse(response);
      
      res.json(validatedResponse);
    } catch (error) {
      console.error('Valuation error:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid input data",
          errors: error.errors
        });
      }
      
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to generate valuation"
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
