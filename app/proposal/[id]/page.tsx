'use client';

import { AppShell } from '@/app/components/AppShell';
import { VotingButtons } from '@/app/components/VotingButtons';
import { mockProposals } from '@/lib/mockData';
import { Clock, User, Calendar, TrendingUp } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function ProposalDetailPage() {
  const params = useParams();
  const proposal = mockProposals.find(p => p.proposalId === params.id);

  if (!proposal) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Proposal Not Found</h2>
          <p className="text-gray-400">The proposal you're looking for doesn't exist.</p>
        </div>
      </AppShell>
    );
  }

  const totalVotes = (proposal.yesVotes || 0) + (proposal.noVotes || 0) + (proposal.abstainVotes || 0);
  const yesPercentage = totalVotes > 0 ? Math.round(((proposal.yesVotes || 0) / totalVotes) * 100) : 0;
  const noPercentage = totalVotes > 0 ? Math.round(((proposal.noVotes || 0) / totalVotes) * 100) : 0;
  const abstainPercentage = totalVotes > 0 ? Math.round(((proposal.abstainVotes || 0) / totalVotes) * 100) : 0;

  const daysLeft = Math.ceil(
    (new Date(proposal.votingDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <AppShell>
      <div className="space-y-6 pb-24">
        {/* Proposal Header */}
        <div className="glass-card p-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold flex-1">{proposal.title}</h1>
            <span className={`ml-3 px-3 py-1 text-xs font-medium rounded-full ${
              proposal.status === 'active' 
                ? 'bg-accent text-white' 
                : 'bg-gray-600 text-white'
            }`}>
              {proposal.status === 'active' ? 'Active' : 'Closed'}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>@community_member</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(proposal.createdAt).toLocaleDateString()}</span>
            </div>
            {proposal.status === 'active' && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{daysLeft} days left</span>
              </div>
            )}
          </div>

          <p className="text-gray-300 leading-relaxed">{proposal.description}</p>
        </div>

        {/* Voting Results */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Voting Results</h3>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <TrendingUp className="w-4 h-4" />
              <span>{totalVotes} total votes</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Yes Votes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-400">Yes</span>
                <span className="text-sm font-bold">{yesPercentage}%</span>
              </div>
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600 transition-all duration-300"
                  style={{ width: `${yesPercentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">{proposal.yesVotes} votes</div>
            </div>

            {/* No Votes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-red-400">No</span>
                <span className="text-sm font-bold">{noPercentage}%</span>
              </div>
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-600 transition-all duration-300"
                  style={{ width: `${noPercentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">{proposal.noVotes} votes</div>
            </div>

            {/* Abstain Votes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-400">Abstain</span>
                <span className="text-sm font-bold">{abstainPercentage}%</span>
              </div>
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-600 transition-all duration-300"
                  style={{ width: `${abstainPercentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">{proposal.abstainVotes} votes</div>
            </div>
          </div>
        </div>

        {/* Voting Buttons */}
        {proposal.status === 'active' && (
          <div className="glass-card p-6">
            <VotingButtons 
              proposalId={proposal.proposalId}
              onVote={(choice) => {
                console.log(`Voted ${choice} on proposal ${proposal.proposalId}`);
              }}
            />
          </div>
        )}
      </div>
    </AppShell>
  );
}
