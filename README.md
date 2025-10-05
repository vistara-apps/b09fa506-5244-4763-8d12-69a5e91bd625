# ProposalFlow AI

Streamline community decisions with AI-powered proposals and instant Telegram voting.

## Features

- 🤖 **AI-Assisted Proposal Drafting**: Generate well-structured proposals from simple prompts
- 💡 **AI-Powered Suggestions**: Get real-time suggestions to improve proposal clarity and impact
- 🗳️ **Automated Telegram Voting**: Secure, transparent voting on Base blockchain
- 📊 **Proposal Dashboard**: Track all active and completed proposals in one place
- 🎨 **Multi-Theme Support**: Switch between blockchain themes (Default, CELO, Solana, Base, Coinbase)

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (via OnchainKit)
- **Styling**: Tailwind CSS with custom design system
- **AI**: OpenAI API (configurable)
- **Wallet**: Base Wallet integration

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` with your API keys.

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── components/          # Reusable UI components
│   ├── AppShell.tsx    # Main layout wrapper
│   ├── ProposalCard.tsx
│   ├── VotingButtons.tsx
│   ├── AIResponse.tsx
│   └── DashboardSummary.tsx
├── proposal/[id]/      # Proposal detail pages
├── create/             # Create proposal page
├── profile/            # User profile page
├── theme-preview/      # Theme switcher demo
└── page.tsx            # Home page (proposal list)

lib/
├── types.ts            # TypeScript interfaces
└── mockData.ts         # Sample data

```

## Design System

The app uses a warm social theme with:
- **Background**: Dark teal (`hsl(185, 35%, 12%)`)
- **Accent**: Coral (`#ff6b6b`)
- **Borders**: Soft rounded (`10-16px`)
- **Motion**: Smooth transitions (`cubic-bezier(0.22,0.61,0.36,1)`)

## API Integration

### Required APIs:
1. **Base RPC**: For blockchain transactions
2. **OpenAI API**: For AI proposal generation
3. **Telegram Bot API**: For notifications

### Optional APIs:
- Upstash Redis: For caching and rate limiting

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/proposalflow-ai)

## License

MIT
