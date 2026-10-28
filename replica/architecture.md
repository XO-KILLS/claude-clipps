# Architecture: AI Video Clipper

## 1. The Stack
| layer | choice | why |
| --- | --- | --- |
| **Web App** | Next.js (App Router) + TS | Fast routing, SEO for landing page, and strong TS support for the editor. |
| **Styling** | Tailwind CSS | Rapid UI iteration for the "Neon SaaS" aesthetic. |
| **Backend** | FastAPI (Python) | Best-in-class for AI/ML integration and asynchronous task handling. |
| **Database** | Postgres (via Supabase/Neon) | Relational integrity for Projects $\rightarrow$ Clips $\rightarrow$ BrandKits. |
| **ORM** | Prisma | Type-safe queries between Next.js and the Postgres DB. |
| **Auth** | Supabase Auth | Quick setup for email/Google OAuth. |
| **Files** | Local Storage / S3 | High-bandwidth access needed for large video files during FFmpeg processing. |
| **AI - Transcribe**| Faster-Whisper | Industry standard for fast, local-first audio-to-text. |
| **AI - Brain** | Gemini 1.5 Flash / Ollama | Huge context window for long videos; free tier available. |
| **Video Engine** | FFmpeg | The only reliable tool for programmatic cutting and caption burning. |

## 2. The Schema
```sql
-- Enums for status tracking
create type project_status as enum ('processing', 'completed', 'failed');
create type clip_status as enum ('pending', 'processed', 'exported');

-- Users (handled by Supabase Auth, but mirrored for relations)
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  plan_type text not null default 'free' check (plan_type in ('free', 'pro', 'business')),
  credits_remaining int not null default 60,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Brand Kits for consistent styling
create table brand_kits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  name text not null default 'Default Kit',
  logo_url text,
  primary_color text not null default '#8B5CF6', -- Neon Purple
  secondary_color text not null default '#3B82F6', -- Neon Blue
  font_family text not null default 'Inter',
  caption_style text not null default 'modern',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Projects (The source video)
create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  source_url text, -- YouTube/TikTok link
  source_file_path text, -- Local path if uploaded
  status project_status not null default 'processing',
  duration_seconds int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on projects (user_id, status);

-- Clips (The AI-generated fragments)
create table clips (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  start_time float not null,
  end_time float not null,
  virality_score int check (virality_score between 0 and 100),
  transcript_json jsonb not null default '[]',
  status clip_status not null default 'pending',
  output_file_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on clips (project_id);

-- Access Rules: 
-- Row Level Security (RLS) via Supabase: 
-- users can only SELECT/UPDATE rows where user_id == auth.uid().
```

## 3. The API

### Flow: The Core Loop (URL to Clip)
| method path | what it does | who | input | output | flow |
| --- | --- | --- | --- | --- | --- |
| `POST /api/projects` | Initialize project & trigger AI | User | `{url, file}` | `ProjectID` | F01 |
| `GET /api/projects/:id` | Check processing status | User | `ProjectID` | `Status, Duration` | F01 |
| `GET /api/projects/:id/clips` | Fetch AI-suggested clips | User | `ProjectID` | `Clip[]` | F01 |
| `PATCH /api/clips/:id` | Update timestamps/text | User | `{start, end, text}` | `Clip` | F01 |
| `POST /api/clips/:id/export` | Trigger FFmpeg render | User | `ClipID, BrandID` | `ExportJobID` | F01 |

### Flow: Brand & Settings
| method path | what it does | who | input | output | flow |
| --- | --- | --- | --- | --- | --- |
| `GET /api/brand` | Get current kit | User | - | `BrandKit` | F02 |
| `PUT /api/brand` | Update colors/logo | User | `BrandKitData` | `BrandKit` | F02 |

## 4. The Parts That Bite
- **FFmpeg Performance:** Rendering captions and cropping is CPU intensive. We must use a background worker (like Celery or FastAPI BackgroundTasks) to avoid blocking the API.
- **Timestamp Drift:** Ensuring the text editor's `currentTime` perfectly matches the video player.
- **File Storage:** Raw videos are huge. We need a cleanup cron job to delete raw files after 7 days.
- **Rate Limits:** Gemini API has limits on the free tier; we must implement a request queue.

## 5. Build Order
1. **Vertical Slice (The "Ugly" Path):**
   - S03 $\rightarrow$ S04 $\rightarrow$ S05.
   - Table: `projects`, `clips`.
   - Route: `POST /projects` (basic FFmpeg cut), `GET /clips`.
2. **Must-Haves (The AI Brain):**
   - Faster-Whisper integration for transcripts.
   - Gemini integration for virality scoring.
   - Text-based editor (S06).
3. **Should-Haves (The Polish):**
   - Brand Kit (S07) $\rightarrow$ Caption styling.
   - Face-centering / Auto-crop logic.
   - Virality badge UI.
4. **Could-Haves:**
   - XML Export for Premiere.
   - Direct Social Posting.
