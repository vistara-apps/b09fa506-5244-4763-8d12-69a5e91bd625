# ProposalFlow AI

Streamline community decisions with AI-powered proposals and instant Telegram voting.

## Features

- 🤖 **AI-Assisted Proposal Drafting**: Generate well-structured proposals from simple prompts
- 💡 **AI-Powered Suggestions**: Get real-time suggestions to improve proposal clarity and impact
- 🗳️ **Automated Telegram Voting**: Secure, transparent voting on Base blockchain
- 📊 **Proposal Dashboard**: Track all active and completed proposals in one place
- 🎨 **Multi-Theme Support**: Switch between blockchain themes (Default, CELO, Solana, Base, Coinbase)
- 🔐 **Telegram Authentication**: Seamless authentication via Telegram Mini Apps
- 💰 **AI Credit System**: Micro-transaction based AI usage with rewards for participation

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (via OnchainKit)
- **Database**: Upstash Redis
- **Styling**: Tailwind CSS with custom design system
- **AI**: OpenAI API (configurable)
- **Wallet**: Base Wallet integration
- **Authentication**: Telegram Web Apps

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))
- OpenAI API Key
- Upstash Redis account (optional, falls back to mock data)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vistara-apps/b09fa506-5244-4763-8d12-69a5e91bd625.git
   cd b09fa506-5244-4763-8d12-69a5e91bd625
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` with your API keys:
   ```env
   # OnchainKit API Key (get from https://portal.cdp.coinbase.com/)
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_cdp_api_key

   # OpenAI API Key (for AI features)
   OPENAI_API_KEY=your_openai_api_key

   # Base RPC Endpoint
   NEXT_PUBLIC_BASE_RPC_URL=https://developer-rpc.base.org/

   # Telegram Bot Token (for notifications)
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token

   # Upstash Redis (for data storage)
   UPSTASH_REDIS_REST_URL=your_upstash_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

   # Telegram Mini App Configuration
   NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username

   # Application Configuration
   NEXT_PUBLIC_APP_URL=https://your-app-domain.com
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── api/                 # API routes
│   ├── ai/             # AI generation endpoints
│   ├── proposals/      # Proposal CRUD operations
│   └── votes/          # Voting operations
├── components/          # Reusable UI components
│   ├── AppShell.tsx    # Main layout wrapper
│   ├── ProposalCard.tsx
│   ├── VotingButtons.tsx
│   ├── AIResponse.tsx
│   └── DashboardSummary.tsx
├── auth/               # Authentication page
├── create/             # Create proposal page
├── profile/            # User profile page
├── proposal/[id]/      # Proposal detail pages
└── page.tsx            # Home page (proposal list)

lib/
├── auth.ts             # Authentication utilities
├── database.ts         # Database abstraction layer
├── openai.ts           # OpenAI API integration
├── telegram.ts         # Telegram bot integration
├── voting.ts           # Blockchain voting logic
├── ai-credits.ts       # AI credit management
├── redis.ts            # Redis database operations
└── types.ts            # TypeScript interfaces
```

## API Documentation

### Proposals API

#### GET `/api/proposals`
Get all proposals or filter by status.

**Query Parameters:**
- `status`: `active`, `closed`, or omit for all
- `userId`: Filter by creator user ID

**Response:**
```json
[
  {
    "proposalId": "string",
    "title": "string",
    "description": "string",
    "createdByUserId": "string",
    "createdAt": "string",
    "status": "active|closed",
    "votingDeadline": "string",
    "yesVotes": 10,
    "noVotes": 5,
    "abstainVotes": 2
  }
]
```

#### POST `/api/proposals`
Create a new proposal.

**Request Body:**
```json
{
  "title": "Community Garden Funding",
  "description": "Detailed proposal description...",
  "votingDeadline": "2024-01-22T23:59:59Z"
}
```

### Votes API

#### POST `/api/votes`
Submit a vote on a proposal.

**Request Body:**
```json
{
  "proposalId": "proposal_123",
  "choice": "yes|no|abstain"
}
```

#### GET `/api/votes`
Get vote counts for a proposal.

**Query Parameters:**
- `proposalId`: Required proposal ID

**Response:**
```json
{
  "yes": 10,
  "no": 5,
  "abstain": 2
}
```

### AI API

#### POST `/api/ai`
Generate AI content.

**Request Body:**
```json
{
  "action": "generate_draft|generate_suggestions|analyze_proposal",
  "prompt": "Community garden funding",
  "text": "Proposal text to analyze",
  "context": "title|description"
}
```

## Design System

The app uses a warm social theme with:
- **Background**: Dark teal (`hsl(185, 35%, 12%)`)
- **Accent**: Coral (`#ff6b6b`)
- **Borders**: Soft rounded (`10-16px`)
- **Motion**: Smooth transitions (`cubic-bezier(0.22,0.61,0.36,1)`)

### Theme Variants
- **Default**: Warm social theme
- **Base**: Blue blockchain theme
- **CELO**: Yellow/green theme
- **Solana**: Purple theme
- **Coinbase**: Blue theme

## Business Model

- **Free Tier**: 100 AI credits per month
- **AI Credit Costs**:
  - Proposal Draft: 2 credits
  - AI Suggestions: 1 credit
  - Proposal Analysis: 1 credit
- **Rewards**:
  - Creating proposal: +3 credits
  - Voting: +1 credit
- **Premium**: Unlimited credits ($9.99/month)

## Deployment

### Vercel (Recommended)

1. **Connect GitHub repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy**: Automatic deployments on push to main

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Telegram Mini App Setup

1. **Create Bot** with [@BotFather](https://t.me/botfather)
2. **Configure Mini App** in Bot Settings
3. **Set Webhook URL** to your deployed app
4. **Test** in Telegram

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with proper TypeScript types
4. Test thoroughly
5. Submit a pull request

## License

MIT

## Support

For support, please create an issue on GitHub or contact the development team.
