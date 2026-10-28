# Test Plan: AI Video Clipper (Vertical Slice)

## Flow F01: The Core Loop (URL to Clip)

### Happy Path (F01-H1)
1. **Action:** Enter valid YouTube URL in S03 $\rightarrow$ Click "Generate Clips".
2. **Expectation:** Immediate redirect to S04.
3. **Action:** Wait for S04 progress bar to reach 100%.
4. **Expectation:** Automatic redirect to S05.
5. **Action:** Review Clip List in S05.
6. **Expectation:** Clips are present with valid start/end times and virality scores (0-100).

### Edge Cases
- **F01-E1 (Slow AI):** Gemini API takes >10s to respond.
  - *Expectation:* S04 continues to show loading state without timing out.
- **F01-E2 (Empty Input):** Click "Generate" with no URL.
  - *Expectation:* Input field highlights red; no API call made.
- **F01-E3 (Invalid URL):** Enter "not-a-url".
  - *Expectation:* Backend returns 400; S03 shows "Invalid URL" toast.
- **F01-E4 (Refresh Mid-Process):** Refresh browser during S04.
  - *Expectation:* App remembers Project ID from URL and resumes loading state.

### Negative Cases
- **F01-N1 (Project Not Found):** Manually enter a fake ID in `/editor/fake-id`.
  - *Expectation:* S05 shows "Project not found" empty state.
- **F01-N2 (API Failure):** Gemini API returns a 500 error.
  - *Expectation:* S04 transitions to a "Failed" state with a "Try Again" button.

## AI & Engine Verification
- **AI-V1 (JSON Schema):** Verify Gemini response strictly follows `[{start, end, score, reason}]`.
- **AI-V2 (Score Range):** Verify no scores are $<0$ or $>100$.
- **ENG-V1 (FFmpeg Crop):** Verify output video resolution is exactly 9:16 ratio (e.g., 1080x1920).
