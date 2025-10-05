'use client';

import { type Proposal } from '@/lib/types';
import { Clock, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

interface ProposalCardProps {
  proposal: Proposal;
  variant?: 'active' | 'closed';
}

export function ProposalCard({ proposal, variant = 'active' }: ProposalCardProps) {
  const totalVotes = (proposal.yesVotes || 0) + (proposal.noVotes || 0) + (proposal.abstainVotes || 0);
  const yesPercentage = totalVotes > 0 ? Math.round(((proposal.yesVotes || 0) / totalVotes) * 100) : 0;
  
  const daysLeft = Math.ceil(
    (new Date(proposal.votingDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Link href={`/proposal/${proposal.proposalId}`}>
      <div className={`proposal-card ${variant === 'closed' ? 'opacity-75' : ''}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">{proposal.title}</h3>
            <p className="text-sm text-gray-400 line-clamp-2">{proposal.description}</p>
          </div>
          {variant === 'active' && (
            <span className="ml-3 px-3 py-1 bg-accent text-white text-xs font-medium rounded-full">
              Active
            </span>
          )}
          {variant === 'closed' && (
            <span className="ml-3 px-3 py-1 bg-gray-600 text-white text-xs font-medium rounded-full">
              Closed
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{totalVotes} votes</span>
          </div>
          {variant === 'active' && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{daysLeft}d left</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>{yesPercentage}% yes</span>
          </div>
        </div>

        {/* Vote Progress Bar */}
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${yesPercentage}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
