import { Database } from './database';

export interface CreditTransaction {
  userId: string;
  amount: number;
  type: 'earn' | 'spend';
  reason: string;
  timestamp: string;
}

export class AICreditManager {
  private static readonly DEFAULT_CREDITS = 10;
  private static readonly MAX_CREDITS = 100;

  static async getUserCredits(userId: string): Promise<number> {
    return await Database.getUserCredits(userId);
  }

  static async canUseCredits(userId: string, amount: number = 1): Promise<boolean> {
    const credits = await this.getUserCredits(userId);
    return credits >= amount;
  }

  static async deductCredits(userId: string, amount: number = 1, reason: string = 'AI generation'): Promise<boolean> {
    const canDeduct = await this.canUseCredits(userId, amount);
    if (!canDeduct) {
      return false;
    }

    return await Database.deductCredits(userId, amount);
  }

  static async addCredits(userId: string, amount: number = 1, reason: string = 'Reward'): Promise<void> {
    const currentCredits = await this.getUserCredits(userId);
    const newCredits = Math.min(currentCredits + amount, this.MAX_CREDITS);
    await Database.addCredits(userId, newCredits - currentCredits);
  }

  static async resetCredits(userId: string): Promise<void> {
    await Database.addCredits(userId, this.DEFAULT_CREDITS);
  }

  static getCreditCost(action: 'draft' | 'suggestion' | 'analysis'): number {
    switch (action) {
      case 'draft':
        return 2; // More expensive as it generates longer content
      case 'suggestion':
        return 1; // Standard cost
      case 'analysis':
        return 1; // Standard cost
      default:
        return 1;
    }
  }

  static getCreditReward(action: 'vote' | 'create_proposal' | 'referral'): number {
    switch (action) {
      case 'vote':
        return 1; // Reward participation
      case 'create_proposal':
        return 3; // Reward contribution
      case 'referral':
        return 5; // Reward bringing new users
      default:
        return 0;
    }
  }
}

