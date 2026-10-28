# Components Spec: AI Video Clipper

## Button
- **variants**: primary (accent), secondary (surface-raised), ghost (transparent), danger (danger)
- **sizes**: sm (32px), md (40px), lg (48px)
- **states**: default, hover (brightness 110%), active (scale 0.98), focus (2px ring accent), disabled (opacity 50%), loading (spinner)
- **tokens**: bg: accent, text: on-accent, radius: md, font: sm/600
- **a11y**: standard `<button>`, focus visible, aria-live for loading state
- **used on**: S01, S02, S03, S05, S06, S07

## UploadZone (Glassmorphism)
- **variants**: default, dragging
- **states**: empty, uploading, success, error
- **tokens**: bg: surface (opacity 0.5), border: accent (glow effect), text: text-muted, radius: lg
- **behavior**: Dashed border becomes solid neon purple on drag-over. Pulse animation during upload.
- **used on**: S03

## VideoPlayer
- **variants**: main, thumbnail
- **states**: playing, paused, buffering, seeking
- **tokens**: bg: black, border: border, radius: md
- **behavior**: Custom controls (Play, Scrub, Volume, Export). Supports overlaying dynamic captions.
- **used on**: S05, S06

## CaptionEditor
- **variants**: active-segment, inactive-segment
- **states**: hover, focused, saved
- **tokens**: bg: surface, active-bg: surface-raised, text: text, active-text: accent, radius: sm
- **behavior**: Clicking a text block jumps the VideoPlayer to that timestamp. Editing text updates the caption in real-time.
- **used on**: S06

## ScoreBadge (Glowing Pill)
- **variants**: 
  - Fair: bg: warning, text: on-gold
  - Good: bg: accent-secondary, text: on-accent-secondary
  - Excellent: bg: gold, text: on-gold
- **states**: default, glow (pulsing shadow of the same color)
- **tokens**: radius: full, font: xs/bold, padding: 2px 8px
- **used on**: S05

## ProcessingState (Magic Loader)
- **variants**: analysis, rendering, finalize
- **states**: progress (0-100%)
- **tokens**: bg: bg, accent: accent (shimmer gradient)
- **behavior**: A linear progress bar with a shimmering neon gradient moving left-to-right. Pulsing "AI Brain" icon.
- **used on**: S04
