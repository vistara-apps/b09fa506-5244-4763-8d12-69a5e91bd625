'use client';

import { Sparkles, Lightbulb } from 'lucide-react';

interface AIResponseProps {
  variant: 'draft' | 'suggestion';
  content: string;
}

export function AIResponse({ variant, content }: AIResponseProps) {
  return (
    <div className={`glass-card p-4 ${variant === 'draft' ? 'border-l-4 border-accent' : 'border-l-4 border-primary'}`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          variant === 'draft' ? 'bg-accent' : 'bg-primary'
        }`}>
          {variant === 'draft' ? (
            <Sparkles className="w-5 h-5 text-white" />
          ) : (
            <Lightbulb className="w-5 h-5 text-white" />
          )}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold mb-2">
            {variant === 'draft' ? 'AI Generated Draft' : 'AI Suggestion'}
          </h4>
          <p className="text-sm text-gray-300 leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  );
}
