export interface User {
  userId: string;
  telegramHandle: string;
  baseWalletAddress: string;
}

export interface Proposal {
  proposalId: string;
  title: string;
  description: string;
  createdByUserId: string;
  createdAt: string;
  status: 'active' | 'closed' | 'draft';
  votingDeadline: string;
  votes?: Vote[];
  yesVotes?: number;
  noVotes?: number;
  abstainVotes?: number;
}

export interface Vote {
  voteId: string;
  proposalId: string;
  voterUserId: string;
  voterWalletAddress: string;
  choice: 'yes' | 'no' | 'abstain';
  createdAt: string;
}

export interface AICredit {
  userId: string;
  credits: number;
}

export interface AIResponse {
  type: 'draft' | 'suggestion';
  content: string;
  timestamp: string;
}
