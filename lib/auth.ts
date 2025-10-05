import { Database } from './database';
import { TelegramWebApp, TelegramService } from './telegram';
import type { User } from './types';

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export class AuthService {
  static async authenticateUser(): Promise<AuthResult> {
    try {
      // Try Telegram Web App first
      if (TelegramWebApp.isAvailable()) {
        const telegramUser = TelegramWebApp.getUser();
        if (telegramUser) {
          return await this.authenticateWithTelegram(telegramUser);
        }
      }

      // Fallback: check for stored user session
      const storedUserId = this.getStoredUserId();
      if (storedUserId) {
        const user = await Database.getUser(storedUserId);
        if (user) {
          return { success: true, user };
        }
      }

      return { success: false, error: 'No authentication method available' };
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  static async authenticateWithTelegram(telegramUser: any): Promise<AuthResult> {
    try {
      const userId = telegramUser.id.toString();
      let user = await Database.getUser(userId);

      if (!user) {
        // Create new user
        const newUser: Omit<User, 'userId'> = {
          telegramHandle: telegramUser.username || `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(),
          baseWalletAddress: '', // Will be set when wallet is connected
        };

        user = await Database.createUser(newUser);
      }

      // Store user ID in session
      this.storeUserId(user.userId);

      return { success: true, user };
    } catch (error) {
      console.error('Telegram authentication error:', error);
      return { success: false, error: 'Failed to authenticate with Telegram' };
    }
  }

  static async connectWallet(userId: string, walletAddress: string): Promise<AuthResult> {
    try {
      const user = await Database.getUser(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // Update user with wallet address
      const updatedUser = await Database.updateUser(userId, {
        baseWalletAddress: walletAddress,
      });

      if (!updatedUser) {
        return { success: false, error: 'Failed to update user wallet' };
      }

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Wallet connection error:', error);
      return { success: false, error: 'Failed to connect wallet' };
    }
  }

  static async logout(): Promise<void> {
    this.clearStoredUserId();
  }

  static getStoredUserId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('userId');
  }

  static storeUserId(userId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('userId', userId);
  }

  static clearStoredUserId(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('userId');
  }

  static isAuthenticated(): boolean {
    return this.getStoredUserId() !== null;
  }

  static async getCurrentUser(): Promise<User | null> {
    const userId = this.getStoredUserId();
    if (!userId) return null;

    return await Database.getUser(userId);
  }

  static async requireAuth(): Promise<User> {
    const result = await this.authenticateUser();
    if (!result.success || !result.user) {
      throw new Error(result.error || 'Authentication required');
    }
    return result.user;
  }
}

// Farcaster authentication (for future expansion)
export class FarcasterAuth {
  static isAvailable(): boolean {
    return typeof window !== 'undefined' && 'farcaster' in window;
  }

  static async authenticate(): Promise<AuthResult> {
    // Placeholder for Farcaster authentication
    return { success: false, error: 'Farcaster authentication not implemented' };
  }
}

