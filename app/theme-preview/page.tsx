'use client';

import { useTheme } from '@/app/components/ThemeProvider';
import { AppShell } from '@/app/components/AppShell';

export default function ThemePreviewPage() {
  const { theme, setTheme } = useTheme();

  const themes: Array<'default' | 'celo' | 'solana' | 'base' | 'coinbase'> = [
    'default',
    'celo',
    'solana',
    'base',
    'coinbase',
  ];

  return (
    <AppShell>
      <div className="space-y-6 pb-24">
        <div>
          <h1 className="text-2xl font-bold mb-2">Theme Preview</h1>
          <p className="text-gray-400">Switch between different blockchain themes</p>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Current Theme: {theme}</h3>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  theme === t
                    ? 'border-accent bg-accent bg-opacity-20'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="font-medium capitalize">{t}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Color Palette</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="w-full h-16 bg-bg rounded-lg mb-2"></div>
              <div className="text-sm">Background</div>
            </div>
            <div>
              <div className="w-full h-16 bg-surface rounded-lg mb-2"></div>
              <div className="text-sm">Surface</div>
            </div>
            <div>
              <div className="w-full h-16 bg-accent rounded-lg mb-2"></div>
              <div className="text-sm">Accent</div>
            </div>
            <div>
              <div className="w-full h-16 bg-primary rounded-lg mb-2"></div>
              <div className="text-sm">Primary</div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
