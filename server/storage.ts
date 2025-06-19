// Storage interface for LandIQ application
// Currently stateless - no persistent storage needed for land valuations

export interface IStorage {
  // No storage methods needed for stateless land valuation
}

export class MemStorage implements IStorage {
  constructor() {
    // Stateless implementation
  }
}

export const storage = new MemStorage();
