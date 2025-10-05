'use client';

import { AppShell } from '@/app/components/AppShell';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar, Identity } from '@coinbase/onchainkit/identity';
import { Sparkles, Award, TrendingUp } from 'lucide-react';

export default function ProfilePage() {
  return (
    <AppShell>
      <div className="space-y-6 pb-24">
        <div>
          <h1 className="text-2xl font-bold mb-2">Your Profile</h1>
          <p className="text-gray-400">Manage your account and AI credits</p>
        </div>

        {/* Wallet Connection */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Base Wallet</h3>
          <Wallet>
            <ConnectWallet>
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12" />
                <div>
                  <Name className="font-semibold" />
                  <div className="text-sm text-gray-400">Connected</div>
                </div>
              </div>
            </ConnectWallet>
          </Wallet>
        </div>

        {/* AI Credits */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">AI Credits</h3>
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          
          <div className="text-center py-6">
            <div className="text-4xl font-bold text-accent mb-2">15</div>
            <div className="text-sm text-gray-400">Credits Remaining</div>
          </div>

          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex justify-between">
              <span>Free tier limit:</span>
              <span className="font-medium">20 credits/month</span>
            </div>
            <div className="flex justify-between">
              <span>Used this month:</span>
              <span className="font-medium">5 credits</span>
            </div>
          </div>

          <button className="w-full btn-primary mt-4">
            Upgrade to Premium
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-4 text-center">
            <Award className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">3</div>
            <div className="text-xs text-gray-400">Proposals Created</div>
          </div>

          <div className="glass-card p-4 text-center">
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs text-gray-400">Votes Cast</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <div>
                <div className="text-sm font-medium">Voted on Community Garden</div>
                <div className="text-xs text-gray-400">2 hours ago</div>
              </div>
              <span className="text-xs px-2 py-1 bg-green-600 text-white rounded-full">Yes</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <div>
                <div className="text-sm font-medium">Created Monthly Events proposal</div>
                <div className="text-xs text-gray-400">1 day ago</div>
              </div>
              <span className="text-xs px-2 py-1 bg-accent text-white rounded-full">Created</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium">Voted on Library Expansion</div>
                <div className="text-xs text-gray-400">3 days ago</div>
              </div>
              <span className="text-xs px-2 py-1 bg-green-600 text-white rounded-full">Yes</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
