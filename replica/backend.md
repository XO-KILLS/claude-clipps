# Backend Implementation Checklist: AI Video Clipper

## Core AI Pipeline
- [ ] **Transcription (Faster-Whisper)**
  - [ ] Audio extraction from video via FFmpeg
  - [ ] Transcription with timestamps
  - [ ] JSON output of segments
- [ ] **Intelligence (Gemini 1.5 Flash)**
  - [ ] Prompt engineering for viral hook detection
  - [ ] Virality scoring logic (0-100)
  - [ ] Timestamp extraction for start/end
- [ ] **Video Engine (FFmpeg)**
  - [ ] Clip cutting based on timestamps
  - [ ] 9:16 Center-crop (Auto-reframe mock)
  - [ ] Caption burning (ASS/SRT overlay)
- [ ] **Async Orchestration**
  - [ ] FastAPI BackgroundTasks implementation
  - [ ] Project status updates (processing -> completed)

## Security & Infrastructure
- [ ] Secrets stored in env vars
- [ ] Input validation for URLs and file paths
- [ ] Rate limiting for Gemini API calls
- [ ] Cleanup job for temporary video files

## Integrations
- [ ] Google Gemini API (Official SDK)
- [ ] FFmpeg (System Binary)
- [ ] Faster-Whisper (Local Model)
