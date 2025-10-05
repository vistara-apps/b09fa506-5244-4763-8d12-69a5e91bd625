import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Key prefixes for different data types
const KEYS = {
  USER: 'user:',
  PROPOSAL: 'proposal:',
  VOTE: 'vote:',
  AI_CREDIT: 'ai_credit:',
  PROPOSAL_VOTES: 'proposal_votes:',
  USER_PROPOSALS: 'user_proposals:',
  USER_VOTES: 'user_votes:',
} as const;

// User operations
export const userOps = {
  async get(userId: string) {
    const data = await redis.get(`${KEYS.USER}${userId}`);
    return data as any;
  },

  async set(userId: string, user: any) {
    await redis.set(`${KEYS.USER}${userId}`, user);
  },

  async exists(userId: string) {
    return await redis.exists(`${KEYS.USER}${userId}`);
  },

  async getAll() {
    const keys = await redis.keys(`${KEYS.USER}*`);
    if (keys.length === 0) return [];
    const users = await redis.mget(...keys);
    return users.filter(Boolean);
  },
};

// Proposal operations
export const proposalOps = {
  async get(proposalId: string) {
    const data = await redis.get(`${KEYS.PROPOSAL}${proposalId}`);
    return data as any;
  },

  async set(proposalId: string, proposal: any) {
    await redis.set(`${KEYS.PROPOSAL}${proposalId}`, proposal);
    // Add to user's proposals
    await redis.sadd(`${KEYS.USER_PROPOSALS}${proposal.createdByUserId}`, proposalId);
  },

  async getAll() {
    const keys = await redis.keys(`${KEYS.PROPOSAL}*`);
    if (keys.length === 0) return [];
    const proposals = await redis.mget(...keys);
    return proposals.filter(Boolean);
  },

  async getActive() {
    const allProposals = await this.getAll();
    return allProposals.filter((p: any) => p.status === 'active');
  },

  async getByUser(userId: string) {
    const proposalIds = await redis.smembers(`${KEYS.USER_PROPOSALS}${userId}`);
    if (proposalIds.length === 0) return [];
    const keys = proposalIds.map(id => `${KEYS.PROPOSAL}${id}`);
    const proposals = await redis.mget(...keys);
    return proposals.filter(Boolean);
  },

  async updateStatus(proposalId: string, status: string) {
    const proposal = await this.get(proposalId);
    if (proposal) {
      proposal.status = status;
      await this.set(proposalId, proposal);
    }
  },
};

// Vote operations
export const voteOps = {
  async get(voteId: string) {
    const data = await redis.get(`${KEYS.VOTE}${voteId}`);
    return data as any;
  },

  async set(voteId: string, vote: any) {
    await redis.set(`${KEYS.VOTE}${voteId}`, vote);
    // Add to proposal votes
    await redis.sadd(`${KEYS.PROPOSAL_VOTES}${vote.proposalId}`, voteId);
    // Add to user votes
    await redis.sadd(`${KEYS.USER_VOTES}${vote.voterUserId}`, voteId);
  },

  async getByProposal(proposalId: string) {
    const voteIds = await redis.smembers(`${KEYS.PROPOSAL_VOTES}${proposalId}`);
    if (voteIds.length === 0) return [];
    const keys = voteIds.map(id => `${KEYS.VOTE}${id}`);
    const votes = await redis.mget(...keys);
    return votes.filter(Boolean);
  },

  async getByUser(userId: string) {
    const voteIds = await redis.smembers(`${KEYS.USER_VOTES}${userId}`);
    if (voteIds.length === 0) return [];
    const keys = voteIds.map(id => `${KEYS.VOTE}${id}`);
    const votes = await redis.mget(...keys);
    return votes.filter(Boolean);
  },

  async hasUserVoted(userId: string, proposalId: string) {
    const userVotes = await this.getByUser(userId);
    return userVotes.some((vote: any) => vote.proposalId === proposalId);
  },

  async getVoteCounts(proposalId: string) {
    const votes = await this.getByProposal(proposalId);
    return votes.reduce(
      (counts: any, vote: any) => {
        counts[vote.choice]++;
        return counts;
      },
      { yes: 0, no: 0, abstain: 0 }
    );
  },
};

// AI Credit operations
export const aiCreditOps = {
  async get(userId: string) {
    const data = await redis.get(`${KEYS.AI_CREDIT}${userId}`);
    return data ? parseInt(data as string) : 10; // Default 10 credits
  },

  async set(userId: string, credits: number) {
    await redis.set(`${KEYS.AI_CREDIT}${userId}`, credits.toString());
  },

  async deduct(userId: string, amount: number = 1) {
    const currentCredits = await this.get(userId);
    if (currentCredits >= amount) {
      await this.set(userId, currentCredits - amount);
      return true;
    }
    return false;
  },

  async add(userId: string, amount: number = 1) {
    const currentCredits = await this.get(userId);
    await this.set(userId, currentCredits + amount);
  },
};

// Utility functions
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const isRedisAvailable = async () => {
  try {
    await redis.ping();
    return true;
  } catch {
    return false;
  }
};

export default redis;

