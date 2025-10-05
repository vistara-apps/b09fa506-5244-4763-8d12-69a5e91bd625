import { createPublicClient, http, createWalletClient, type Hash, type Address } from 'viem';
import { base } from 'viem/chains';
import { Database } from './database';
import type { Vote } from './types';

// Base RPC client
const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://developer-rpc.base.org/'),
});

export interface VoteTransaction {
  proposalId: string;
  choice: 'yes' | 'no' | 'abstain';
  voterAddress: Address;
  signature?: string;
  transactionHash?: Hash;
}

export class VotingService {
  static async submitVote(voteData: VoteTransaction): Promise<{ success: boolean; transactionHash?: Hash; error?: string }> {
    try {
      // Check if user has already voted
      const existingVote = await Database.hasUserVoted(voteData.voterAddress, voteData.proposalId);
      if (existingVote) {
        return { success: false, error: 'User has already voted on this proposal' };
      }

      // Create vote record
      const vote: Omit<Vote, 'voteId' | 'createdAt'> = {
        proposalId: voteData.proposalId,
        voterUserId: voteData.voterAddress, // Using address as user ID for now
        voterWalletAddress: voteData.voterAddress,
        choice: voteData.choice,
      };

      await Database.createVote(vote);

      // In a real implementation, you would submit this to a smart contract
      // For now, we'll simulate a transaction hash
      const mockTransactionHash = `0x${Math.random().toString(16).substr(2, 64)}` as Hash;

      return {
        success: true,
        transactionHash: mockTransactionHash,
      };
    } catch (error) {
      console.error('Voting error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown voting error',
      };
    }
  }

  static async getProposalResults(proposalId: string): Promise<{
    yes: number;
    no: number;
    abstain: number;
    total: number;
  }> {
    const counts = await Database.getVoteCounts(proposalId);
    const total = counts.yes + counts.no + counts.abstain;

    return {
      ...counts,
      total,
    };
  }

  static async verifyVote(transactionHash: Hash): Promise<boolean> {
    try {
      // In a real implementation, you would verify the transaction on-chain
      // For now, we'll just check if it exists in our database
      const votes = await Database.getProposalVotes(''); // This would need to be filtered by tx hash
      return votes.length > 0;
    } catch (error) {
      console.error('Vote verification error:', error);
      return false;
    }
  }

  static async getUserVotingHistory(userId: string): Promise<Vote[]> {
    return await Database.getProposalVotes(''); // This would need proper filtering
  }

  static async getVotingDeadline(proposalId: string): Promise<Date | null> {
    const proposal = await Database.getProposal(proposalId);
    if (!proposal?.votingDeadline) return null;

    return new Date(proposal.votingDeadline);
  }

  static async isVotingOpen(proposalId: string): Promise<boolean> {
    const deadline = await this.getVotingDeadline(proposalId);
    if (!deadline) return false;

    return new Date() < deadline;
  }

  static async closeExpiredProposals(): Promise<string[]> {
    const activeProposals = await Database.getActiveProposals();
    const now = new Date();
    const expiredIds: string[] = [];

    for (const proposal of activeProposals) {
      if (proposal.votingDeadline && new Date(proposal.votingDeadline) < now) {
        await Database.closeProposal(proposal.proposalId);
        expiredIds.push(proposal.proposalId);
      }
    }

    return expiredIds;
  }
}

// Smart contract interaction (placeholder for future implementation)
export class VotingContract {
  private static readonly CONTRACT_ADDRESS = '0x...' as Address; // Would be deployed contract address

  static async submitVoteOnChain(voteData: VoteTransaction): Promise<Hash> {
    // This would interact with a deployed voting contract on Base
    // For now, return a mock hash
    return `0x${Math.random().toString(16).substr(2, 64)}` as Hash;
  }

  static async getProposalVotesOnChain(proposalId: string): Promise<{ yes: number; no: number; abstain: number }> {
    // This would read vote counts from the smart contract
    return { yes: 0, no: 0, abstain: 0 };
  }
}

