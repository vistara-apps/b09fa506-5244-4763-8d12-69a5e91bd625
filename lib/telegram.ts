import type { User } from './types';

export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
}

export interface TelegramMessage {
  chat: {
    id: number;
  };
  text?: string;
  from?: TelegramUser;
}

export class TelegramService {
  private static readonly BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  private static readonly BASE_URL = 'https://api.telegram.org/bot';

  static async sendMessage(chatId: number | string, text: string): Promise<boolean> {
    if (!this.BOT_TOKEN) {
      console.warn('Telegram bot token not configured');
      return false;
    }

    try {
      const response = await fetch(`${this.BASE_URL}${this.BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'Markdown',
        }),
      });

      const data = await response.json();
      return data.ok;
    } catch (error) {
      console.error('Telegram send message error:', error);
      return false;
    }
  }

  static async sendProposalNotification(
    chatId: number | string,
    proposalTitle: string,
    proposalId: string,
    appUrl: string
  ): Promise<boolean> {
    const message = `*New Proposal Created!*\n\n📝 *${proposalTitle}*\n\nVote now: ${appUrl}/proposal/${proposalId}`;

    return await this.sendMessage(chatId, message);
  }

  static async sendVotingReminder(
    chatId: number | string,
    proposalTitle: string,
    hoursLeft: number,
    appUrl: string
  ): Promise<boolean> {
    const message = `⏰ *Voting Reminder*\n\nProposal: *${proposalTitle}*\nTime left: ${hoursLeft} hours\n\nVote now: ${appUrl}`;

    return await this.sendMessage(chatId, message);
  }

  static async sendProposalResult(
    chatId: number | string,
    proposalTitle: string,
    result: 'passed' | 'failed' | 'tie',
    yesVotes: number,
    noVotes: number
  ): Promise<boolean> {
    const emoji = result === 'passed' ? '✅' : result === 'failed' ? '❌' : '🤝';
    const message = `${emoji} *Proposal Result*\n\n*${proposalTitle}*\n\nResult: ${result.toUpperCase()}\n✅ Yes: ${yesVotes}\n❌ No: ${noVotes}`;

    return await this.sendMessage(chatId, message);
  }

  static async setWebhook(url: string): Promise<boolean> {
    if (!this.BOT_TOKEN) {
      console.warn('Telegram bot token not configured');
      return false;
    }

    try {
      const response = await fetch(`${this.BASE_URL}${this.BOT_TOKEN}/setWebhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          allowed_updates: ['message', 'callback_query'],
        }),
      });

      const data = await response.json();
      return data.ok;
    } catch (error) {
      console.error('Telegram set webhook error:', error);
      return false;
    }
  }

  static async getBotInfo() {
    if (!this.BOT_TOKEN) {
      return null;
    }

    try {
      const response = await fetch(`${this.BASE_URL}${this.BOT_TOKEN}/getMe`);
      const data = await response.json();
      return data.ok ? data.result : null;
    } catch (error) {
      console.error('Telegram get bot info error:', error);
      return null;
    }
  }

  // Mini App specific functions
  static getMiniAppUrl(botUsername?: string): string {
    const username = botUsername || process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
    return `https://t.me/${username}`;
  }

  static generateMiniAppLink(proposalId?: string): string {
    const baseUrl = this.getMiniAppUrl();
    if (proposalId) {
      return `${baseUrl}?startapp=proposal_${proposalId}`;
    }
    return baseUrl;
  }
}

// Telegram Web App utilities
export class TelegramWebApp {
  static isAvailable(): boolean {
    return typeof window !== 'undefined' && 'Telegram' in window && 'WebApp' in (window as any).Telegram;
  }

  static getUser(): TelegramUser | null {
    if (!this.isAvailable()) return null;

    const webApp = (window as any).Telegram.WebApp;
    return webApp.initDataUnsafe?.user || null;
  }

  static getChatId(): number | null {
    const user = this.getUser();
    return user?.id || null;
  }

  static closeApp(): void {
    if (this.isAvailable()) {
      (window as any).Telegram.WebApp.close();
    }
  }

  static showAlert(message: string): void {
    if (this.isAvailable()) {
      (window as any).Telegram.WebApp.showAlert(message);
    } else {
      alert(message);
    }
  }

  static expandApp(): void {
    if (this.isAvailable()) {
      (window as any).Telegram.WebApp.expand();
    }
  }
}

