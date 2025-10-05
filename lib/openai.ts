import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIResponse {
  type: 'draft' | 'suggestion';
  content: string;
  timestamp: string;
}

export class AIService {
  static async generateProposalDraft(prompt: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert at creating well-structured community proposals. Generate a comprehensive proposal draft based on the user's idea.

Structure the proposal with:
1. Title: Clear and concise
2. Objective: What the proposal aims to achieve
3. Rationale: Why this is important
4. Expected Impact: Benefits to the community
5. Implementation: How it will be executed
6. Budget/Resources: What's needed
7. Timeline: When it will happen
8. Success Metrics: How to measure success

Keep it professional, persuasive, and community-focused. Use clear language that community members can understand.`,
          },
          {
            role: 'user',
            content: `Create a proposal draft for: ${prompt}`,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || 'Failed to generate proposal draft.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate AI proposal draft');
    }
  }

  static async generateSuggestions(text: string, context: 'title' | 'description'): Promise<string[]> {
    try {
      const contextPrompt = context === 'title'
        ? 'Generate 3 alternative titles for this proposal that are clearer and more engaging:'
        : 'Generate 3 suggestions to improve this proposal description for clarity, impact, and persuasiveness:';

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert proposal editor. Provide constructive suggestions to improve community proposals. Focus on clarity, impact, feasibility, and community benefit.`,
          },
          {
            role: 'user',
            content: `${contextPrompt}\n\n"${text}"`,
          },
        ],
        max_tokens: 500,
        temperature: 0.6,
      });

      const response = completion.choices[0]?.message?.content || '';
      // Split into individual suggestions
      return response.split('\n').filter(line => line.trim().length > 0).slice(0, 3);
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate AI suggestions');
    }
  }

  static async analyzeProposal(text: string): Promise<{
    clarity: number;
    impact: number;
    feasibility: number;
    suggestions: string[];
  }> {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Analyze this proposal and provide scores (1-10) for clarity, impact, and feasibility. Also provide 2-3 specific suggestions for improvement. Return as JSON with keys: clarity, impact, feasibility, suggestions.`,
          },
          {
            role: 'user',
            content: `Analyze this proposal:\n\n${text}`,
          },
        ],
        max_tokens: 300,
        temperature: 0.3,
      });

      const response = completion.choices[0]?.message?.content || '{}';
      return JSON.parse(response);
    } catch (error) {
      console.error('OpenAI API error:', error);
      return {
        clarity: 7,
        impact: 7,
        feasibility: 7,
        suggestions: ['Consider adding more specific details', 'Include a clear timeline'],
      };
    }
  }
}

export default AIService;

