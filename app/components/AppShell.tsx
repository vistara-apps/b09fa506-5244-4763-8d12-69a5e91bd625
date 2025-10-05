'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { Sparkles, Vote, Plus, User, LogIn } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth';
import { AICreditManager } from '@/lib/ai-credits';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        const userCredits = await AICreditManager.getUserCredits(currentUser.userId);
        setCredits(userCredits);
      }
    };

    checkAuth();
  }, []);

  const handleAuthClick = () => {
    if (user) {
      router.push('/profile');
    } else {
      router.push('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="glass-card border-b border-gray-700">
        <div className="max-w-screen-sm mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">ProposalFlow AI</h1>
                <p className="text-xs text-gray-400">Community Governance</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user && (
                <div className="text-right">
                  <p className="text-xs text-gray-400">Credits</p>
                  <p className="text-sm font-semibold text-accent">{credits}</p>
                </div>
              )}
              <Link href="/create">
                <button className="btn-primary flex items-center gap-2 text-sm">
                  <Plus className="w-4 h-4" />
                  Create
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-sm mx-auto px-4 py-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-gray-700">
        <div className="max-w-screen-sm mx-auto px-4 py-3">
          <div className="flex items-center justify-around">
            <Link href="/" className={`flex flex-col items-center gap-1 ${pathname === '/' ? 'text-accent' : 'text-gray-400'}`}>
              <Vote className="w-6 h-6" />
              <span className="text-xs font-medium">Proposals</span>
            </Link>
            <Link href="/create" className={`flex flex-col items-center gap-1 ${pathname === '/create' ? 'text-accent' : 'text-gray-400'}`}>
              <Plus className="w-6 h-6" />
              <span className="text-xs font-medium">Create</span>
            </Link>
            <button
              onClick={handleAuthClick}
              className={`flex flex-col items-center gap-1 ${pathname === '/auth' || pathname === '/profile' ? 'text-accent' : 'text-gray-400'}`}
            >
              {user ? <User className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
              <span className="text-xs font-medium">{user ? 'Profile' : 'Auth'}</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
