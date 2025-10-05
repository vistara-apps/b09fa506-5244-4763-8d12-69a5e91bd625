import { userOps, proposalOps, voteOps, aiCreditOps, generateId, isRedisAvailable } from './redis';
import { mockProposals } from './mockData';
import type { User, Proposal, Vote, AICredit } from './types';

// Check if Redis is available, otherwise use mock data
let useRedis = false;

const checkRedisAvailability = async () => {
  useRedis = await isRedisAvailable();
  console.log(`Database: Using ${useRedis ? 'Redis' : 'Mock Data'}`);
};

// Initialize on module load
checkRedisAvailability();

export class Database {
  // User operations
  static async getUser(userId: string): Promise<User | null> {
    if (useRedis) {
      return await userOps.get(userId);
    }
    // Mock implementation - in real app, you'd have a users array
    return null;
  }

  static async createUser(user: Omit<User, 'userId'>): Promise<User> {
    const newUser: User = {
      userId: generateId(),
      ...user,
    };

    if (useRedis) {
      await userOps.set(newUser.userId, newUser);
    }

    return newUser;
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    if (useRedis) {
      const existingUser = await userOps.get(userId);
      if (!existingUser) return null;

      const updatedUser = { ...existingUser, ...updates };
      await userOps.set(userId, updatedUser);
      return updatedUser;
    }

    return null;
  }

  // Proposal operations
  static async getProposal(proposalId: string): Promise<Proposal | null> {
    if (useRedis) {
      return await proposalOps.get(proposalId);
    }

    return mockProposals.find(p => p.proposalId === proposalId) || null;
  }

  static async getAllProposals(): Promise<Proposal[]> {
    if (useRedis) {
      return await proposalOps.getAll();
    }

    return mockProposals;
  }

  static async getActiveProposals(): Promise<Proposal[]> {
    if (useRedis) {
      return await proposalOps.getActive();
    }

    return mockProposals.filter(p => p.status === 'active');
  }

  static async createProposal(proposal: Omit<Proposal, 'proposalId' | 'createdAt' | 'status'>): Promise<Proposal> {
    const newProposal: Proposal = {
      proposalId: generateId(),
      createdAt: new Date().toISOString(),
      status: 'active',
      ...proposal,
    };

    if (useRedis) {
      await proposalOps.set(newProposal.proposalId, newProposal);
    } else {
      // Add to mock data for development
      mockProposals.push(newProposal);
    }

    return newProposal;
  }

  static async updateProposal(proposalId: string, updates: Partial<Proposal>): Promise<Proposal | null> {
    if (useRedis) {
      const existingProposal = await proposalOps.get(proposalId);
      if (!existingProposal) return null;

      const updatedProposal = { ...existingProposal, ...updates };
      await proposalOps.set(proposalId, updatedProposal);
      return updatedProposal;
    } else {
      // Update mock data
      const index = mockProposals.findIndex(p => p.proposalId === proposalId);
      if (index === -1) return null;

      mockProposals[index] = { ...mockProposals[index], ...updates };
      return mockProposals[index];
    }
  }

  static async closeProposal(proposalId: string): Promise<boolean> {
    return await this.updateProposal(proposalId, { status: 'closed' }) !== null;
  }

  // Vote operations
  static async getVote(voteId: string): Promise<Vote | null> {
    if (useRedis) {
      return await voteOps.get(voteId);
    }

    return null;
  }

  static async createVote(vote: Omit<Vote, 'voteId' | 'createdAt'>): Promise<Vote> {
    const newVote: Vote = {
      voteId: generateId(),
      createdAt: new Date().toISOString(),
      ...vote,
    };

    if (useRedis) {
      await voteOps.set(newVote.voteId, newVote);
    }

    return newVote;
  }

  static async hasUserVoted(userId: string, proposalId: string): Promise<boolean> {
    if (useRedis) {
      return await voteOps.hasUserVoted(userId, proposalId);
    }

    return false;
  }

  static async getProposalVotes(proposalId: string): Promise<Vote[]> {
    if (useRedis) {
      return await voteOps.getByProposal(proposalId);
    }

    return [];
  }

  static async getVoteCounts(proposalId: string): Promise<{ yes: number; no: number; abstain: number }> {
    if (useRedis) {
      return await voteOps.getVoteCounts(proposalId);
    }

    // Calculate from mock data
    const proposal = mockProposals.find(p => p.proposalId === proposalId);
    if (!proposal) return { yes: 0, no: 0, abstain: 0 };

    return {
      yes: proposal.yesVotes || 0,
      no: proposal.noVotes || 0,
      abstain: proposal.abstainVotes || 0,
    };
  }

  // AI Credit operations
  static async getUserCredits(userId: string): Promise<number> {
    if (useRedis) {
      return await aiCreditOps.get(userId);
    }

    return 10; // Default credits for mock
  }

  static async deductCredits(userId: string, amount: number = 1): Promise<boolean> {
    if (useRedis) {
      return await aiCreditOps.deduct(userId, amount);
    }

    return true; // Always allow in mock mode
  }

  static async addCredits(userId: string, amount: number = 1): Promise<void> {
    if (useRedis) {
      await aiCreditOps.add(userId, amount);
    }
  }

  // Utility functions
  static generateId(): string {
    return generateId();
  }
}

