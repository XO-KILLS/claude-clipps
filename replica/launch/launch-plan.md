# Launch Plan: ProfitLens

## 1. Pre-Launch (The Beta Phase)
- **The "Founder's 50":** Reach out to 50 Shopify store owners on Twitter/X and Reddit (r/shopify, r/dropshipping).
- **Offer:** Free "Agency Tier" for 3 months in exchange for video testimonials of their ROAS improvement.
- **Tracking:** Implement PostHog for event tracking and Sentry for error monitoring.

## 2. Distribution Channels
- **The "Compare" Hook:** Post a side-by-side video on TikTok/Reels: "Luma vs Runway vs ProfitLens (Multiplexer)." Show how ProfitLens finds the winner faster.
- **Product Hunt:** Launch with a "Founder's Deal" for the first 100 users.
- **Direct Outreach:** Target agencies that specialize in "UGC Ads" and offer them the Agency Tier to scale their output.

## 3. Deployment Roadmap
### Phase 1: Backend (The Engine)
1. Deploy Next.js API to Vercel.
2. Configure Supabase Project (Auth, DB, Storage).
3. Set up Inngest for polling workers.
4. Connect Replicate/Luma/Runway API keys.

### Phase 2: Frontend (The Interface)
1. Build Android APK via Expo EAS.
2. Internal Beta Test (TestFlight/Google Play Beta).
3. Final UI Polish (ProfitLens Brand Colors).

### Phase 3: The Public Launch
1. Set up Landing Page (Vercel).
2. Open Stripe Checkout for Growth/Agency tiers.
3. Submit to Google Play Store.

## 4. Day 1 Metrics
- **Conversion Rate:** % of landing page visitors who sign up for the Free tier.
- **Retention:** % of users who generate more than 3 videos in their first week.
- **Multiplexing Rate:** % of users who use more than one model per prompt.
