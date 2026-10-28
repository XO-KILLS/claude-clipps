"use client";
import React, { useState } from 'react';
import { Button } from '../components/Primitives';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [url, setUrl] = useState('');
  const router = useRouter();

  const handleUpload = async () => {
    const res = await fetch('http://localhost:8000/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    router.push(`/process/${data.id}`);
  };

  return (
    <div className="min-h-screen bg-bg text-text p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-bold mb-2">Your Studio</h1>
          <p className="text-text-muted">Import a video to start generating clips.</p>
        </header>

        <div className="relative group p-1 rounded-2xl bg-gradient-to-r from-accent to-accent-secondary transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]">
          <div className="bg-surface p-12 rounded-xl text-center border border-white/10 backdrop-blur-sm">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent text-3xl">☁️</div>
            </div>
            <h2 className="text-xl font-bold mb-4">Import Long-form Video</h2>
            <div className="flex flex-col md:flex-row gap-3 max-w-lg mx-auto">
              <input
                className="flex-1 bg-bg border border-border-input rounded-md px-4 py-2 focus:outline-none focus:border-accent transition-colors"
                placeholder="Paste YouTube, TikTok or Vimeo URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <Button onClick={handleUpload}>Generate Clips</Button>
            </div>
            <p className="mt-4 text-xs text-text-muted">Or drag and drop your MP4 file here</p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-surface border border-border p-4 rounded-xl opacity-50">
              <div className="aspect-video bg-bg rounded-md mb-3" />
              <div className="h-4 w-1/2 bg-border rounded mb-2" />
              <div className="h-3 w-1/3 bg-border rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
