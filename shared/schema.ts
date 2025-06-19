import { z } from "zod";
import { pgTable, serial, text, timestamp, boolean, integer, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

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

// Database Tables
export const valuations = pgTable("valuations", {
  id: serial("id").primaryKey(),
  propertyDescription: text("property_description").notNull(),
  location: text("location").notNull(),
  acreage: decimal("acreage", { precision: 10, scale: 2 }).notNull(),
  irrigated: boolean("irrigated").default(false),
  tillable: boolean("tillable").default(false),
  cropType: text("crop_type"),
  
  // Valuation results
  p10: integer("p10").notNull(),
  p50: integer("p50").notNull(),
  p90: integer("p90").notNull(),
  totalValue: integer("total_value").notNull(),
  pricePerAcre: integer("price_per_acre").notNull(),
  confidence: decimal("confidence", { precision: 3, scale: 2 }).notNull(),
  
  // Analysis and metadata
  narrative: text("narrative").notNull(),
  keyFactors: jsonb("key_factors").$type<string[]>().notNull(),
  comparableSales: jsonb("comparable_sales").$type<any[]>().notNull(),
  sources: jsonb("sources").$type<any[]>().notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});


// Drizzle schemas
export const insertValuationSchema = createInsertSchema(valuations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectValuationSchema = createSelectSchema(valuations);

// Types
export type Valuation = typeof valuations.$inferSelect;
export type InsertValuation = typeof valuations.$inferInsert;
