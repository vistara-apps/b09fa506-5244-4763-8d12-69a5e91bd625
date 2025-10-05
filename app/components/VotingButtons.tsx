'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Minus } from 'lucide-react';

interface VotingButtonsProps {
  proposalId: string;
  onVote?: (choice: 'yes' | 'no' | 'abstain') => void;
}

export function VotingButtons({ proposalId, onVote }: VotingButtonsProps) {
  const [selectedVote, setSelectedVote] = useState<'yes' | 'no' | 'abstain' | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (choice: 'yes' | 'no' | 'abstain') => {
    setSelectedVote(choice);
    setIsVoting(true);

    // Simulate voting transaction
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (onVote) {
      onVote(choice);
    }

    setIsVoting(false);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold mb-3">Cast Your Vote</h3>
      
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => handleVote('yes')}
          disabled={isVoting}
          className={`vote-yes flex flex-col items-center gap-2 py-4 ${
            selectedVote === 'yes' ? 'ring-2 ring-green-400' : ''
          } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <ThumbsUp className="w-6 h-6" />
          <span className="text-sm font-medium">Yes</span>
        </button>

        <button
          onClick={() => handleVote('no')}
          disabled={isVoting}
          className={`vote-no flex flex-col items-center gap-2 py-4 ${
            selectedVote === 'no' ? 'ring-2 ring-red-400' : ''
          } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <ThumbsDown className="w-6 h-6" />
          <span className="text-sm font-medium">No</span>
        </button>

        <button
          onClick={() => handleVote('abstain')}
          disabled={isVoting}
          className={`vote-abstain flex flex-col items-center gap-2 py-4 ${
            selectedVote === 'abstain' ? 'ring-2 ring-gray-400' : ''
          } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Minus className="w-6 h-6" />
          <span className="text-sm font-medium">Abstain</span>
        </button>
      </div>

      {isVoting && (
        <div className="text-center text-sm text-gray-400 animate-pulse">
          Processing your vote on Base...
        </div>
      )}

      {selectedVote && !isVoting && (
        <div className="text-center text-sm text-accent">
          Vote recorded successfully! ✓
        </div>
      )}
    </div>
  );
}
