import { valuations, type Valuation, type InsertValuation } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Valuation methods
  createValuation(valuation: InsertValuation): Promise<Valuation>;
  getValuation(id: number): Promise<Valuation | undefined>;
  getRecentValuations(limit?: number): Promise<Valuation[]>;
  getValuationsByLocation(location: string, limit?: number): Promise<Valuation[]>;
}

export class DatabaseStorage implements IStorage {
  async createValuation(valuation: InsertValuation): Promise<Valuation> {
    const [result] = await db
      .insert(valuations)
      .values(valuation)
      .returning();
    return result;
  }

  async getValuation(id: number): Promise<Valuation | undefined> {
    const [result] = await db
      .select()
      .from(valuations)
      .where(eq(valuations.id, id));
    return result || undefined;
  }

  async getRecentValuations(limit: number = 10): Promise<Valuation[]> {
    return await db
      .select()
      .from(valuations)
      .orderBy(desc(valuations.createdAt))
      .limit(limit);
  }

  async getValuationsByLocation(location: string, limit: number = 5): Promise<Valuation[]> {
    return await db
      .select()
      .from(valuations)
      .where(eq(valuations.location, location))
      .orderBy(desc(valuations.createdAt))
      .limit(limit);
  }

}

export const storage = new DatabaseStorage();
