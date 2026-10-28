import React from 'react';
import { Button } from './Primitives';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-text font-sans">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg shadow-[0_0_15px_#8B5CF6]" />
          <span>ClipMagic AI</span>
        </div>
        <Button variant="ghost">Login</Button>
      </nav>

      <main className="max-w-4xl mx-auto text-center pt-24 px-6">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Turn long videos into <span className="text-accent">viral clips</span> in seconds.
        </h1>
        <p className="text-text-muted text-xl mb-10 max-w-2xl mx-auto">
          Our AI identifies the most engaging moments, adds neon captions, and reframes your content for TikTok, Reels, and Shorts.
        </p>
        <div className="flex justify-center gap-4">
          <a href="/dashboard">
            <Button size="lg">Start Clipping for Free</Button>
          </a>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {['AI Hook Detection', 'Auto-Captions', 'Smart Reframing'].map(feat => (
            <div key={feat} className="p-6 bg-surface border border-border rounded-xl hover:border-accent transition-colors">
              <div className="w-12 h-12 bg-accent/20 rounded-lg mb-4 flex items-center justify-center text-accent font-bold">✓</div>
              <h3 className="text-lg font-bold mb-2">{feat}</h3>
              <p className="text-text-muted text-sm">Professional grade AI that does the boring work for you.</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
