'use client';

import { AppShell } from '@/app/components/AppShell';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar, Identity } from '@coinbase/onchainkit/identity';
import { Sparkles, Award, TrendingUp, LogOut, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth';
import { AICreditManager } from '@/lib/ai-credits';
import { Database } from '@/lib/database';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(0);
  const [stats, setStats] = useState({ proposalsCreated: 0, votesCast: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (!currentUser) {
          router.push('/auth');
          return;
        }

        setUser(currentUser);

        // Get credits
        const userCredits = await AICreditManager.getUserCredits(currentUser.userId);
        setCredits(userCredits);

        // Get stats
        const userProposals = await Database.getAllProposals();
        const proposalsCreated = userProposals.filter(p => p.createdByUserId === currentUser.userId).length;

        // Get votes cast (this would need to be implemented in Database)
        const votesCast = 0; // Placeholder

        setStats({ proposalsCreated, votesCast });
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleLogout = async () => {
    await AuthService.logout();
    router.push('/auth');
  };

  if (loading) {
    return (
      <AppShell>
        <div className="space-y-6 pb-24">
          <div className="animate-pulse">
            <div className="h-8 bg-surface rounded-lg mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-surface rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell>
        <div className="space-y-6 pb-24">
          <div className="glass-card p-6 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">Please authenticate to view your profile</p>
            <button
              onClick={() => router.push('/auth')}
              className="btn-primary"
            >
              Go to Authentication
            </button>
          </div>
        </div>
      </AppShell>
    );
  }
  return (
    <AppShell>
      <div className="space-y-6 pb-24">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Your Profile</h1>
            <p className="text-gray-400">Manage your account and AI credits</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* User Info */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Account Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-400">Telegram Handle</label>
              <p className="font-medium">{user.telegramHandle || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">User ID</label>
              <p className="font-mono text-xs">{user.userId}</p>
            </div>
          </div>
        </div>

        {/* Wallet Connection */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Base Wallet</h3>
          {user.baseWalletAddress ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold font-mono text-sm">
                  {user.baseWalletAddress.slice(0, 6)}...{user.baseWalletAddress.slice(-4)}
                </p>
                <div className="text-sm text-green-400">Connected</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400 mb-4">No wallet connected</p>
              <Wallet>
                <ConnectWallet>
                  <button className="btn-primary">
                    Connect Base Wallet
                  </button>
                </ConnectWallet>
              </Wallet>
            </div>
          )}
        </div>

        {/* AI Credits */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">AI Credits</h3>
            <Sparkles className="w-6 h-6 text-accent" />
          </div>

          <div className="text-center py-6">
            <div className="text-4xl font-bold text-accent mb-2">{credits}</div>
            <div className="text-sm text-gray-400">Credits Remaining</div>
          </div>

          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex justify-between">
              <span>Free tier limit:</span>
              <span className="font-medium">100 credits/month</span>
            </div>
            <div className="flex justify-between">
              <span>Cost per draft:</span>
              <span className="font-medium">2 credits</span>
            </div>
            <div className="flex justify-between">
              <span>Cost per suggestion:</span>
              <span className="font-medium">1 credit</span>
            </div>
          </div>

          <button className="w-full btn-primary mt-4 opacity-50 cursor-not-allowed">
            Premium Upgrade (Coming Soon)
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-4 text-center">
            <Award className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.proposalsCreated}</div>
            <div className="text-xs text-gray-400">Proposals Created</div>
          </div>

          <div className="glass-card p-4 text-center">
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.votesCast}</div>
            <div className="text-xs text-gray-400">Votes Cast</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="text-center py-8 text-gray-400">
            <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Activity tracking coming soon</p>
            <p className="text-sm">Your proposal and voting history will appear here</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
