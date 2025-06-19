import type { Express } from "express";
import { createServer, type Server } from "http";
import { propertyInputSchema, valuationResultSchema } from "../shared/schema";
import { generateLandValuation } from "./services/openai";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Land valuation endpoint
  app.post("/api/valuations", async (req, res) => {
    try {
      // Validate request body
      const validatedData = propertyInputSchema.parse(req.body);
      
      // Generate valuation using OpenAI
      const result = await generateLandValuation(validatedData);
      
      // Store valuation in database
      const storedValuation = await storage.createValuation({
        propertyDescription: validatedData.propertyDescription,
        location: validatedData.location,
        acreage: validatedData.acreage.toString(),
        irrigated: validatedData.irrigated,
        tillable: validatedData.tillable,
        cropType: validatedData.cropType,
        p10: result.valuation.p10,
        p50: result.valuation.p50,
        p90: result.valuation.p90,
        totalValue: result.valuation.totalValue,
        pricePerAcre: result.valuation.pricePerAcre,
        confidence: result.valuation.confidence.toString(),
        narrative: result.analysis.narrative,
        keyFactors: result.analysis.keyFactors,
        comparableSales: result.comparableSales,
        sources: result.sources,
      });
      
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

  // Get recent valuations
  app.get("/api/valuations/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const valuations = await storage.getRecentValuations(limit);
      
      res.json(valuations);
    } catch (error) {
      console.error('Error fetching recent valuations:', error);
      res.status(500).json({
        message: "Failed to fetch recent valuations"
      });
    }
  });

  // Get valuations by location
  app.get("/api/valuations/location/:location", async (req, res) => {
    try {
      const location = req.params.location;
      const limit = parseInt(req.query.limit as string) || 5;
      const valuations = await storage.getValuationsByLocation(location, limit);
      
      res.json(valuations);
    } catch (error) {
      console.error('Error fetching valuations by location:', error);
      res.status(500).json({
        message: "Failed to fetch valuations for location"
      });
    }
  });

  // Get specific valuation
  app.get("/api/valuations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const valuation = await storage.getValuation(id);
      
      if (!valuation) {
        return res.status(404).json({
          message: "Valuation not found"
        });
      }
      
      res.json(valuation);
    } catch (error) {
      console.error('Error fetching valuation:', error);
      res.status(500).json({
        message: "Failed to fetch valuation"
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
