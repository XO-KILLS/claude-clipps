"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button, Badge } from '../components/Primitives';

export default function ReviewPage() {
  const { id } = useParams();
  const [clips, setClips] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/projects/${id}/clips`)
      .then(res => res.json())
      .then(data => setClips(data));
  }, [id]);

  return (
    <div className="min-h-screen bg-bg text-text flex h-screen overflow-hidden">
      {/* Left: Clip List */}
      <div className="w-full md:w-96 border-r border-border bg-surface overflow-y-auto p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          AI Suggested Clips <span className="text-xs bg-accent px-2 py-1 rounded-full">{clips.length}</span>
        </h2>
        <div className="space-y-4">
          {clips.map((clip, idx) => (
            <div key={clip.id} className="p-4 bg-bg border border-border rounded-xl hover:border-accent cursor-pointer transition-all group">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-text-muted font-mono">Clip #{idx + 1}</span>
                <Badge score={clip.virality_score} />
              </div>
              <p className="text-sm line-clamp-2 mb-3">{clip.transcript}</p>
              <div className="flex justify-between items-center text-xs text-text-muted">
                <span>{clip.start_time}s → {clip.end_time}s</span>
                <Button size="sm" variant="ghost" className="text-accent">Edit</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Preview */}
      <div className="flex-1 bg-bg flex flex-col p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Video Preview</h1>
          <Button size="lg">Export All Clips</Button>
        </div>

        <div className="flex-1 bg-black rounded-2xl border border-border relative overflow-hidden flex items-center justify-center">
          <div className="text-text-muted text-center">
            <div className="text-6xl mb-4">🎬</div>
            <p>Select a clip to preview</p>
          </div>

          {/* Mock Overlay Caption */}
          <div className="absolute bottom-20 left-0 right-0 text-center px-10">
            <span className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" style={{ fontFamily: 'Archivo Black, Impact' }}>
              THE SECRET TO <span className="text-accent">VIRAL GROWTH</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
