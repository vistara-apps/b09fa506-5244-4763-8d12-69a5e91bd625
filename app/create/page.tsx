'use client';

import { AppShell } from '@/app/components/AppShell';
import { AIResponse } from '@/app/components/AIResponse';
import { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';

export default function CreateProposalPage() {
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [aiDraft, setAiDraft] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleGenerateDraft = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const generatedTitle = `Community Initiative: ${prompt}`;
    const generatedDescription = `This proposal aims to ${prompt.toLowerCase()}. 

Objective: Establish a comprehensive plan to implement this initiative within our community.

Rationale: This initiative addresses a key community need and will provide significant value to all members. By implementing this proposal, we can enhance community engagement and create lasting positive impact.

Expected Impact:
- Increased community participation
- Enhanced quality of life for residents
- Sustainable long-term benefits
- Strengthened community bonds

Implementation Timeline: 30-60 days
Budget Estimate: To be determined based on community feedback

We encourage all community members to review this proposal and cast their vote.`;

    setTitle(generatedTitle);
    setDescription(generatedDescription);
    setAiDraft(generatedDescription);
    setIsGenerating(false);
    setShowSuggestions(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate proposal submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Proposal submitted successfully! 🎉');
  };

  return (
    <AppShell>
      <div className="space-y-6 pb-24">
        <div>
          <h1 className="text-2xl font-bold mb-2">Create New Proposal</h1>
          <p className="text-gray-400">Use AI to draft your proposal or write it manually</p>
        </div>

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
              disabled={isGenerating || !prompt.trim()}
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate
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
            <label className="block text-sm font-medium mb-2">
              Proposal Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information about your proposal..."
              required
              rows={8}
              className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-3 text-fg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
            
            {showSuggestions && (
              <div className="mt-4">
                <AIResponse 
                  variant="suggestion" 
                  content="Consider adding specific metrics for success and a clear timeline. This will help community members better understand the proposal's impact." 
                />
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <label className="block text-sm font-medium mb-2">
              Voting Deadline *
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-3 text-fg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary flex items-center justify-center gap-2 py-4"
          >
            <Send className="w-5 h-5" />
            Submit Proposal
          </button>
        </form>
      </div>
    </AppShell>
  );
}
