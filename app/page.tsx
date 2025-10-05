'use client';

import { AppShell } from './components/AppShell';
import { ProposalCard } from './components/ProposalCard';
import { DashboardSummary } from './components/DashboardSummary';
import { mockProposals } from '@/lib/mockData';
import { useState } from 'react';

export default function HomePage() {
  const [filter, setFilter] = useState<'active' | 'closed' | 'all'>('active');

  const activeProposals = mockProposals.filter(p => p.status === 'active');
  const closedProposals = mockProposals.filter(p => p.status === 'closed');
  
  const displayProposals = filter === 'all' 
    ? mockProposals 
    : filter === 'active' 
    ? activeProposals 
    : closedProposals;

  const totalVotes = mockProposals.reduce((sum, p) => 
    sum + (p.yesVotes || 0) + (p.noVotes || 0) + (p.abstainVotes || 0), 0
  );

  return (
    <AppShell>
      <div className="space-y-6 pb-24">
        <DashboardSummary 
          activeProposals={activeProposals.length}
          completedProposals={closedProposals.length}
          totalVotes={totalVotes}
        />

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Community Proposals</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 ${
                filter === 'active' 
                  ? 'bg-accent text-white' 
                  : 'bg-surface text-gray-400 hover:bg-opacity-80'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('closed')}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 ${
                filter === 'closed' 
                  ? 'bg-accent text-white' 
                  : 'bg-surface text-gray-400 hover:bg-opacity-80'
              }`}
            >
              Closed
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {displayProposals.map(proposal => (
            <ProposalCard 
              key={proposal.proposalId} 
              proposal={proposal}
              variant={proposal.status === 'active' ? 'active' : 'closed'}
            />
          ))}
        </div>

        {displayProposals.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No {filter} proposals found</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
