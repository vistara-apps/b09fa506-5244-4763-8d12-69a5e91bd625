'use client';

import { TrendingUp, Clock, CheckCircle2 } from 'lucide-react';

interface DashboardSummaryProps {
  activeProposals: number;
  completedProposals: number;
  totalVotes: number;
}

export function DashboardSummary({ 
  activeProposals, 
  completedProposals, 
  totalVotes 
}: DashboardSummaryProps) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="glass-card p-4 text-center">
        <Clock className="w-6 h-6 text-accent mx-auto mb-2" />
        <div className="text-2xl font-bold">{activeProposals}</div>
        <div className="text-xs text-gray-400">Active</div>
      </div>

      <div className="glass-card p-4 text-center">
        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
        <div className="text-2xl font-bold">{completedProposals}</div>
        <div className="text-xs text-gray-400">Completed</div>
      </div>

      <div className="glass-card p-4 text-center">
        <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
        <div className="text-2xl font-bold">{totalVotes}</div>
        <div className="text-xs text-gray-400">Total Votes</div>
      </div>
    </div>
  );
}
