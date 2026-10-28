# Pricing Strategy: ProfitLens

## 1. Market Comparison
| Provider | Price | Model | Notes | Date |
| --- | --- | --- | --- | --- |
| RunwayML | $12-$95/mo | Tiered Credits | Heavy focus on creative pros | 2026-10-27 |
| Luma AI | Free $\rightarrow$ Paid | Credit based | High quality, slower gen | 2026-10-27 |
| Pika Art | $8-$30/mo | Subscription | Strong animation controls | 2026-10-27 |

## 2. User Pain Points
- **The "Subscription Trap":** Users hate paying $30/mo for 5 different tools.
- **The "Credit Anxiety":** Fear of wasting expensive credits on a "bad" generation.
- **The "Hidden Costs":** Surprise charges for high-res exports.

## 3. The ProfitLens Model
We solve the subscription trap by aggregating providers into a single, value-based tier.

### Tier 1: Starter (Free)
- **Who:** New store owners testing the waters.
- **Price:** $0 / mo
- **Includes:**
  - 3 Generation Credits / day.
  - Access to "Standard" (Open Source) models.
  - ProfitLens Watermark.
  - Standard Queue.

### Tier 2: Growth (Pro)
- **Who:** Scaling stores needing consistent content.
- **Price:** $29 / mo (or $290 / yr - 2 months free)
- **Includes:**
  - 100 Generation Credits / mo.
  - **Priority Routing:** Access to Luma and Runway.
  - No Watermarks.
  - 4K Export.
  - Unified Asset Library.

### Tier 3: Scale (Agency)
- **Who:** Agencies managing multiple Shopify stores.
- **Price:** $149 / mo
- **Includes:**
  - 500 Generation Credits / mo.
  - **Batch Multiplexing:** Generate 1 prompt across 5 models simultaneously.
  - API Access.
  - Priority Queue (Zero wait).
  - Dedicated Account Manager.

## 4. Stripe Product Mapping
- `price_starter_free`: $0.00 / month
- `price_growth_monthly`: $29.00 / month
- `price_growth_yearly`: $290.00 / year
- `price_scale_monthly`: $149.00 / month
