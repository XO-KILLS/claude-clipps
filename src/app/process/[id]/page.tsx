"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '../components/Primitives';

export default function ProcessingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const checkStatus = setInterval(async () => {
      const res = await fetch(`http://localhost:8000/api/projects/${id}`);
      const data = await res.json();
      if (data.status === 'completed') {
        clearInterval(checkStatus);
        router.push(`/editor/${id}`);
      }
    }, 2000);

    // Fake progress bar animation
    const timer = setInterval(() => {
      setProgress(p => (p < 95 ? p + 1 : p));
    }, 100);

    return () => { clearInterval(checkStatus); clearInterval(timer); };
  }, [id, router]);

  return (
    <div className="min-h-screen bg-bg text-text flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-3xl">✨</div>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">AI is Analyzing...</h1>
        <p className="text-text-muted mb-8">Scanning for viral hooks and generating captions.</p>

        <div className="h-3 w-full bg-surface rounded-full overflow-hidden border border-border">
          <div
            className="h-full bg-gradient-to-r from-accent via-accent-secondary to-accent transition-all duration-300 animate-pulse"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 flex justify-between text-sm font-mono text-accent">
          <span>PROGRESS</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}
