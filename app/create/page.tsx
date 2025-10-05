'use client';

import { AppShell } from '@/app/components/AppShell';
import { AIResponse } from '@/app/components/AIResponse';
import { useState, useEffect } from 'react';
import { Sparkles, Send, AlertCircle } from 'lucide-react';
import { AIService } from '@/lib/openai';
import { AICreditManager } from '@/lib/ai-credits';
import { Database } from '@/lib/database';
import { AuthService } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function CreateProposalPage() {
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [votingDeadline, setVotingDeadline] = useState('');
  const [aiDraft, setAiDraft] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userCredits, setUserCredits] = useState(10);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setCurrentUser(user);
        if (user) {
          const credits = await AICreditManager.getUserCredits(user.userId);
          setUserCredits(credits);
        }
      } catch (err) {
        console.error('Auth error:', err);
      }
    };

    initAuth();
  }, []);

  const handleGenerateDraft = async () => {
    if (!prompt.trim()) return;
    if (!currentUser) {
      setError('Please authenticate first');
      return;
    }

    // Check credits
    const canUse = await AICreditManager.canUseCredits(currentUser.userId, AICreditManager.getCreditCost('draft'));
    if (!canUse) {
      setError('Insufficient AI credits. You need at least 2 credits to generate a draft.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const generatedContent = await AIService.generateProposalDraft(prompt);

      // Parse the generated content to extract title and description
      const lines = generatedContent.split('\n');
      const titleLine = lines.find(line => line.startsWith('Title:') || line.startsWith('**Title:**'));
      const title = titleLine ? titleLine.replace(/^(Title:|\*\*Title:\*\*)\s*/, '') : `Proposal: ${prompt}`;

      setTitle(title);
      setDescription(generatedContent);
      setAiDraft(generatedContent);

      // Deduct credits
      await AICreditManager.deductCredits(currentUser.userId, AICreditManager.getCreditCost('draft'));
      const newCredits = await AICreditManager.getUserCredits(currentUser.userId);
      setUserCredits(newCredits);

      setAiSuggestions([
        'Consider adding specific budget details',
        'Include a clear success measurement plan',
        'Add timeline milestones'
      ]);
    } catch (err) {
      setError('Failed to generate AI draft. Please try again.');
      console.error('AI generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGetSuggestions = async () => {
    if (!description.trim() || !currentUser) return;

    const canUse = await AICreditManager.canUseCredits(currentUser.userId, AICreditManager.getCreditCost('suggestion'));
    if (!canUse) {
      setError('Insufficient AI credits for suggestions.');
      return;
    }

    try {
      const suggestions = await AIService.generateSuggestions(description, 'description');
      setAiSuggestions(suggestions);

      // Deduct credits
      await AICreditManager.deductCredits(currentUser.userId, AICreditManager.getCreditCost('suggestion'));
      const newCredits = await AICreditManager.getUserCredits(currentUser.userId);
      setUserCredits(newCredits);
    } catch (err) {
      setError('Failed to generate suggestions.');
      console.error('AI suggestions error:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Please authenticate first');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const deadline = votingDeadline ? new Date(votingDeadline).toISOString() : null;

      const proposal = await Database.createProposal({
        title: title.trim(),
        description: description.trim(),
        createdByUserId: currentUser.userId,
        votingDeadline: deadline,
      });

      // Award credits for creating proposal
      await AICreditManager.addCredits(currentUser.userId, AICreditManager.getCreditReward('create_proposal'));
      const newCredits = await AICreditManager.getUserCredits(currentUser.userId);
      setUserCredits(newCredits);

      router.push(`/proposal/${proposal.proposalId}`);
    } catch (err) {
      setError('Failed to submit proposal. Please try again.');
      console.error('Proposal submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 pb-24">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Create New Proposal</h1>
            <p className="text-gray-400">Use AI to draft your proposal or write it manually</p>
          </div>
          {currentUser && (
            <div className="text-right">
              <p className="text-sm text-gray-400">AI Credits</p>
              <p className="text-lg font-semibold text-accent">{userCredits}</p>
            </div>
          )}
        </div>

        {error && (
          <div className="glass-card p-4 border-red-500/20 bg-red-500/10">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {!currentUser && (
          <div className="glass-card p-6 text-center">
            <p className="text-gray-400 mb-4">Please authenticate to create proposals</p>
            <button
              onClick={() => router.push('/auth')}
              className="btn-primary"
            >
              Authenticate
            </button>
          </div>
        )}

        {currentUser && (
          <>
            {/* AI Prompt Input */}
            <div className="glass-card p-6">
              <label className="block text-sm font-medium mb-2">
                Describe your proposal idea
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Create a community garden with $5,000 funding"
                  className="flex-1 bg-surface border border-gray-700 rounded-lg px-4 py-3 text-fg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                  onClick={handleGenerateDraft}
                  disabled={isGenerating || !prompt.trim() || userCredits < 2}
                  className="btn-primary flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate (2 credits)
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                AI will generate a structured proposal draft for you
              </p>
            </div>

            {/* AI Generated Draft */}
            {aiDraft && (
              <AIResponse variant="draft" content={aiDraft} />
            )}

            {/* Proposal Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="glass-card p-6">
                <label className="block text-sm font-medium mb-2">
                  Proposal Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a clear, concise title"
                  required
                  className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-3 text-fg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">
                    Proposal Description *
                  </label>
                  {description.trim() && (
                    <button
                      type="button"
                      onClick={handleGetSuggestions}
                      disabled={userCredits < 1}
                      className="text-xs btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Get AI Suggestions (1 credit)
                    </button>
                  )}
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide detailed information about your proposal..."
                  required
                  rows={8}
                  className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-3 text-fg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />

                {aiSuggestions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-accent">AI Suggestions:</p>
                    {aiSuggestions.map((suggestion, index) => (
                      <AIResponse
                        key={index}
                        variant="suggestion"
                        content={suggestion}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="glass-card p-6">
                <label className="block text-sm font-medium mb-2">
                  Voting Deadline (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={votingDeadline}
                  onChange={(e) => setVotingDeadline(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-3 text-fg focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Leave empty for 7-day default voting period
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !description.trim()}
                className="w-full btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Proposal
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </AppShell>
  );
}
