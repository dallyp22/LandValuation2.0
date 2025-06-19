import { valuations, sessions, type Valuation, type InsertValuation, type Session, type InsertSession } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Valuation methods
  createValuation(valuation: InsertValuation): Promise<Valuation>;
  getValuation(id: number): Promise<Valuation | undefined>;
  getRecentValuations(limit?: number): Promise<Valuation[]>;
  getValuationsByLocation(location: string, limit?: number): Promise<Valuation[]>;
  
  // Session methods
  createSession(session: InsertSession): Promise<Session>;
  getSession(sessionId: string): Promise<Session | undefined>;
  updateSessionActivity(sessionId: string): Promise<void>;
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

  async createSession(session: InsertSession): Promise<Session> {
    const [result] = await db
      .insert(sessions)
      .values(session)
      .returning();
    return result;
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    const [result] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.sessionId, sessionId));
    return result || undefined;
  }

  async updateSessionActivity(sessionId: string): Promise<void> {
    await db
      .update(sessions)
      .set({ lastActiveAt: new Date() })
      .where(eq(sessions.sessionId, sessionId));
  }
}

export const storage = new DatabaseStorage();
