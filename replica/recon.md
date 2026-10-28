# Recon Map: AI Video Clipper (OpusClip/Munch Style)

## 1. Scope
- **App:** AI Video Clipping SaaS.
- **Platform:** Web (Responsive).
- **Slice:** The core loop: Import long-form video $\rightarrow$ AI Analysis $\rightarrow$ Clip Review/Edit $\rightarrow$ Export.
- **Purpose:** An open-source, local-first alternative for creators to generate viral short-form content.

## 2. Sources
| source | what it gives you |
| --- | --- |
| [OpusClip Help Center](https://help.opus.pro) | Feature list, credit system, and editor logic. |
| [Munch Studio Features](https://munch.video/features) | Coherence scoring, brand kits, and social planning. |
| [OpusClip Pricing](https://www.opus.pro/es-es/pricing) | Feature gating (e.g., XML export for Pro). |
| [Munch Studio Help](https://help.munchstudio.com) | App navigation and workflow patterns. |

## 3. Screen Inventory
| ID | screen | route | purpose | key components | states |
| --- | --- | --- | --- | --- | --- |
| S01 | Landing Page | `/` | Conversion | Hero with viral hook, Feature Grid, Pricing Table, CTA | Desktop, Mobile |
| S02 | Auth / Sign Up | `/signup` | Onboarding | Email/Password form, Google OAuth, Terms checkbox | Loading, Error |
| S03 | Dashboard | `/dashboard` | Project Mgmt | Upload Zone (Drag & Drop), URL Input, Project Grid | Empty, Loading, Filled |
| S04 | Processing | `/process/:id` | Waiting | Progress bar, "AI is thinking" animation, Estimated time | Loading, Success, Fail |
| S05 | Clip Review | `/editor/:id` | Selection | Clip List, Virality Score, Preview Player, "Export" button | Empty, Processing |
| S06 | AI Editor | `/editor/:id/edit` | Refinement | Video Preview, Text-based Transcript Editor, Caption Styler | Editing, Saving |
| S07 | Brand Kit | `/settings/brand` | Customization | Logo upload, Color picker, Font selector, CTA presets | Default, Custom |
| S08 | Account/Billing | `/settings/billing` | Credits | Credit balance, Plan toggle, Payment method | Free, Pro |

## 4. User Flows
**F01: The Core Loop (URL to Clip)**
`S03 (Input URL) -> S04 (Processing) -> S05 (Review Clips) -> S06 (Edit Captions) -> Export`
*Edge cases: Invalid URL, Video too long for free tier, AI fails to find clips.*

**F02: Brand Customization**
`S07 (Upload Logo/Pick Colors) -> S06 (Apply to Clip) -> Export`

**F03: Project Management**
`S03 (View Grid) -> S05 (Re-open old project) -> S06 (Refine)`

## 5. Components
| component | variants | states | screens |
| --- | --- | --- | --- |
| `Button` | Primary, Secondary, Ghost | Default, Hover, Loading, Disabled | All |
| `Input` | Text, URL, File-Drop | Focused, Error, Filled | S02, S03 |
| `VideoPlayer` | Main Preview, Mini-Thumb | Playing, Paused, Buffering | S05, S06 |
| `CaptionEditor` | Text-only, Stylized | Active, Hover, Saved | S06 |
| `ProjectCard` | Pending, Completed | Hover, Selected | S03 |
| `ProgressBar` | Linear, Circular | 0% $\rightarrow$ 100% | S04 |
| `ScoreBadge` | Fair, Good, Excellent | Color-coded (Yellow, Green, Blue) | S05 |

## 6. Inferred Data Model
- **User** `id, email, plan_type, credits_remaining, brand_id` (Confidence: High)
- **Project** `id, user_id, source_url, source_file_path, status (processing|completed|failed), created_at` (Confidence: High)
- **Clip** `id, project_id, start_time, end_time, virality_score, transcript_json, status` (Confidence: High)
- **BrandKit** `id, user_id, logo_url, primary_color, font_family, caption_style` (Confidence: Medium)

## 7. What Cannot Be Cloned
- **Proprietary AI Models:** We cannot copy OpusClip's specific "virality" algorithm; we will use open-source alternatives (Gemini/Ollama).
- **Existing User Base:** We start from zero users.
- **Social Media APIs:** Direct posting to TikTok/IG requires official App Review/Partnerships.

## 8. Sizing
- **Size:** M (Medium)
- **Hard Parts:** 
  1. Real-time video processing/cutting (FFmpeg integration).
  2. Synchronizing AI-generated timestamps with a text editor.
  3. Handling large video file uploads/storage.
