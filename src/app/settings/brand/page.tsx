"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '../components/Primitives';
import { useRouter } from 'next/navigation';

export default function BrandKit() {
  const router = useRouter();
  const [brand, setBrand] = useState({
    name: 'My Brand',
    primaryColor: '#8B5CF6',
    secondaryColor: '#3B82F6',
    fontFamily: 'Archivo Black',
    logoUrl: '',
    ctaText: 'Follow for more!'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/brand')
      .then(res => res.json())
      .then(data => {
        if (data) setBrand(data);
      })
      .catch(() => console.log("Using default brand kit"));
  }, []);

  const saveBrand = async () => {
    setIsSaving(true);
    await fetch('http://localhost:8000/api/brand', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(brand),
    });
    setIsSaving(false);
    alert("Brand Kit updated!");
  };

  const handleLogoUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBrand({ ...brand, logoUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-surface">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/dashboard')}>← Dashboard</Button>
          <h1 className="text-lg font-bold">Brand Identity</h1>
        </div>
        <Button onClick={saveBrand} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Brand Kit'}
        </Button>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Settings Panel */}
        <div className="w-full md:w-1/2 p-8 overflow-y-auto border-r border-border bg-surface/50">
          <div className="max-w-lg mx-auto space-y-10">

            {/* Basic Info */}
            <section>
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs mb-2 opacity-70">Brand Name</label>
                  <input
                    className="w-full bg-bg border border-border-input rounded-md px-4 py-2 focus:outline-none focus:border-accent transition-colors"
                    value={brand.name}
                    onChange={(e) => setBrand({ ...brand, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-2 opacity-70">Custom CTA Text</label>
                  <input
                    className="w-full bg-bg border border-border-input rounded-md px-4 py-2 focus:outline-none focus:border-accent transition-colors"
                    value={brand.ctaText}
                    onChange={(e) => setBrand({ ...brand, ctaText: e.target.value })}
                  />
                </div>
              </div>
            </section>

            {/* Visual Identity */}
            <section>
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Visual Identity</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs mb-2 opacity-70">Primary Accent</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      className="w-10 h-10 bg-transparent cursor-pointer"
                      value={brand.primaryColor}
                      onChange={(e) => setBrand({ ...brand, primaryColor: e.target.value })}
                    />
                    <input
                      className="flex-1 bg-bg border border-border-input rounded-md px-3 py-1 text-sm"
                      value={brand.primaryColor}
                      onChange={(e) => setBrand({ ...brand, primaryColor: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs mb-2 opacity-70">Secondary Accent</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      className="w-10 h-10 bg-transparent cursor-pointer"
                      value={brand.secondaryColor}
                      onChange={(e) => setBrand({ ...brand, secondaryColor: e.target.value })}
                    />
                    <input
                      className="flex-1 bg-bg border border-border-input rounded-md px-3 py-1 text-sm"
                      value={brand.secondaryColor}
                      onChange={(e) => setBrand({ ...brand, secondaryColor: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Typography & Assets */}
            <section>
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Typography & Assets</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs mb-2 opacity-70">Caption Font</label>
                  <select
                    className="w-full bg-bg border border-border-input rounded-md px-4 py-2 focus:outline-none focus:border-accent transition-colors"
                    value={brand.fontFamily}
                    onChange={(e) => setBrand({ ...brand, fontFamily: e.target.value })}
                  >
                    <option value="Inter">Inter (Clean)</option>
                    <option value="Geist">Geist (Modern)</option>
                    <option value="Archivo Black">Archivo Black (Bold)</option>
                    <option value="Impact">Impact (Classic)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs mb-2 opacity-70">Brand Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-bg border-2 border-dashed border-border rounded-lg flex items-center justify-center overflow-hidden">
                      {brand.logoUrl ? (
                        <img src={brand.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-xl opacity-30">🖼️</span>
                      )}
                    </div>
                    <input
                      type="file"
                      className="text-xs text-text-muted"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="flex-1 bg-bg flex flex-col items-center justify-center p-12 relative">
          <div className="text-center mb-8">
            <h3 className="text-lg font-bold mb-1">Live Preview</h3>
            <p className="text-text-muted text-sm">See your brand kit in action</p>
          </div>

          <div className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-3xl shadow-2xl border-8 border-surface overflow-hidden">
            {/* Mock Video Content */}
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
              <span className="text-white/10 text-6xl">🎬</span>
            </div>

            {/* Brand Logo Overlay */}
            {brand.logoUrl && (
              <img
                src={brand.logoUrl}
                alt="Logo"
                className="absolute top-6 right-6 w-10 h-10 object-contain opacity-80"
              />
            )}

            {/* Dynamic Caption Overlay */}
            <div className="absolute bottom-24 left-0 right-0 text-center px-6 pointer-events-none">
              <span
                className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                style={{
                  color: brand.primaryColor,
                  fontFamily: brand.fontFamily,
                  textShadow: `0 0 10px ${brand.primaryColor}66`
                }}
              >
                THE SECRET TO VIRAL GROWTH
              </span>
            </div>

            {/* CTA Overlay */}
            <div className="absolute bottom-12 left-0 right-0 text-center px-6">
              <div
                className="inline-block px-4 py-2 rounded-full text-xs font-bold text-white transition-all"
                style={{ backgroundColor: brand.secondaryColor }}
              >
                {brand.ctaText}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
