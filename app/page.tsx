'use client';

import { AppShell } from './components/AppShell';
import { ProposalCard } from './components/ProposalCard';
import { DashboardSummary } from './components/DashboardSummary';
import { Database } from '@/lib/database';
import { useState, useEffect } from 'react';
import type { Proposal } from '@/lib/types';

export default function HomePage() {
  const [filter, setFilter] = useState<'active' | 'closed' | 'all'>('active');
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProposals = async () => {
      try {
        const allProposals = await Database.getAllProposals();
        setProposals(allProposals);
      } catch (error) {
        console.error('Failed to load proposals:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProposals();
  }, []);

  const activeProposals = proposals.filter(p => p.status === 'active');
  const closedProposals = proposals.filter(p => p.status === 'closed');

  const displayProposals = filter === 'all'
    ? proposals
    : filter === 'active'
    ? activeProposals
    : closedProposals;

  const calculateTotalVotes = async () => {
    let total = 0;
    for (const p of proposals) {
      const votes = await Database.getVoteCounts(p.proposalId);
      total += votes.yes + votes.no + votes.abstain;
    }
    return total;
  };

  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    const updateTotalVotes = async () => {
      const total = await calculateTotalVotes();
      setTotalVotes(total);
    };

    if (proposals.length > 0) {
      updateTotalVotes();
    }
  }, [proposals]);

  if (loading) {
    return (
      <AppShell>
        <div className="space-y-6 pb-24">
          <div className="animate-pulse">
            <div className="h-8 bg-surface rounded-lg mb-4"></div>
            <div className="h-32 bg-surface rounded-lg"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-6 bg-surface rounded-lg mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-surface rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

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
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-accent text-white'
                  : 'bg-surface text-gray-400 hover:bg-opacity-80'
              }`}
            >
              All
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
            {filter === 'active' && (
              <p className="text-sm mt-2">Be the first to create a proposal!</p>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
