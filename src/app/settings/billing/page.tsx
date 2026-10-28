"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '../components/Primitives';
import { useRouter } from 'next/navigation';

export default function BillingPage() {
  const router = useRouter();
  const [billing, setBilling] = useState({
    creditsUsed: 12,
    creditsTotal: 60,
    plan: 'Free Forever',
    resetDate: 'Nov 15, 2026',
    usageLog: [
      { id: 1, name: 'Podcast Episode 1', cost: 15, date: '2026-10-20' },
      { id: 2, name: 'Product Demo', cost: 5, date: '2026-10-22' },
      { id: 3, name: 'Interview Clip', cost: -8, date: '2026-10-25' }, // Negative for correction/refund
    ]
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/billing')
      .then(res => res.json())
      .then(data => {
        if (data) setBilling(data);
      })
      .catch(() => console.log("Using default billing data"));
  }, []);

  const handleUpgrade = async () => {
    await fetch('http://localhost:8000/api/billing/upgrade', { method: 'POST' });
    alert("Redirecting to secure payment gateway...");
  };

  return (
    <div className="min-h-screen bg-bg text-text p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Billing & Credits</h1>
            <p className="text-text-muted">Manage your AI processing power</p>
          </div>
          <Button variant="ghost" onClick={() => router.push('/dashboard')}>← Back to Studio</Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Credit Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-surface border border-border p-6 rounded-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-sm font-semibold text-text-muted uppercase mb-4">Available Credits</h3>
                <div className="text-5xl font-black mb-2">
                  {billing.creditsTotal - billing.creditsUsed} <span className="text-lg text-text-muted font-normal">/ {billing.creditsTotal} mins</span>
                </div>
                <p className="text-xs text-accent font-medium mb-6">✨ Credits reset on {billing.resetDate}</p>

                <div className="h-2 w-full bg-bg rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-500"
                    style={{ width: `${((billing.creditsTotal - billing.creditsUsed) / billing.creditsTotal) * 100}%` }}
                  />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 text-accent/10 text-9xl font-black pointer-events-none">
                ⚡
              </div>
            </div>

            <div className="bg-surface border border-border p-6 rounded-2xl">
              <h3 className="text-sm font-semibold text-text-muted uppercase mb-4">Usage History</h3>
              <div className="space-y-3">
                {billing.usageLog.map(log => (
                  <div key={log.id} className="flex justify-between items-center p-3 bg-bg rounded-lg border border-border">
                    <div>
                      <div className="text-sm font-medium">{log.name}</div>
                      <div className="text-[10px] text-text-muted">{log.date}</div>
                    </div>
                    <span className={`text-sm font-bold ${log.cost > 0 ? 'text-text' : 'text-success'}`}>
                      {log.cost > 0 ? `-${log.cost}m` : `+${Math.abs(log.cost)}m`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Pricing Table */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <div className="bg-surface border-2 border-accent p-8 rounded-3xl relative shadow-[0_0_30px_rgba(139,92,246,0.2)]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-on-accent text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">Free Forever</h3>
              <div className="text-4xl font-black mb-4">$0<span className="text-lg text-text-muted font-normal">/mo</span></div>
              <p className="text-text-muted text-sm mb-8">Perfect for new creators testing the waters.</p>

              <ul className="space-y-4 mb-8">
                {['60 mins/mo free', 'Powered by Gemini Free Tier', 'AI-generated captions', 'Standard processing speed'].map(feat => (
                  <li key={feat} className="flex items-center gap-3 text-sm">
                    <span className="text-success">✓</span> {feat}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" className="w-full" disabled>Current Plan</Button>
            </div>

            {/* Pro Plan */}
            <div className="bg-surface border border-border p-8 rounded-3xl flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Pro Creator</h3>
              <div className="text-4xl font-black mb-4">$29<span className="text-lg text-text-muted font-normal">/mo</span></div>
              <p className="text-text-muted text-sm mb-8">For those scaling their social presence.</p>

              <ul className="space-y-4 mb-8 flex-1">
                {['300 mins/mo', 'No watermarks', 'Priority rendering queue', 'XML export for Premiere', 'Advanced Brand Kits'].map(feat => (
                  <li key={feat} className="flex items-center gap-3 text-sm">
                    <span className="text-accent">✓</span> {feat}
                  </li>
                ))}
              </ul>
              <Button onClick={handleUpgrade} className="w-full">Upgrade to Pro</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
