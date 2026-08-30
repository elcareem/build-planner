import type { Plan } from './plan.schema';

/**
 * Stable sample Plan object for local testing.
 * Used by apps/web (plan preview) and apps/backend (PDF service — issue #6).
 * Do NOT modify the shape — tests and preview components depend on it.
 */
export const samplePlan: Plan = {
  businessName: 'GreenBox Lagos',
  tagline: 'Farm-fresh groceries delivered to your door in 60 minutes.',
  generatedAt: '2026-08-30T12:00:00.000Z',
  sections: {
    executiveSummary: {
      title: 'Executive Summary',
      content: `**GreenBox Lagos** is an on-demand grocery delivery service focused on fresh, locally sourced produce in the Lagos metropolitan area. We connect urban households directly with verified smallholder farms, cutting out intermediaries and ensuring produce reaches customers within hours of harvest.

Our initial target market is Lagos Island and Lekki Phase 1 — approximately 180,000 households with above-average disposable income and a demonstrated preference for quality over price. We project ₦42 million in revenue in year one, growing to ₦190 million by year three as we expand into Ikoyi, Victoria Island, and Abuja.

The business is registered and currently trading at early scale. This plan is prepared for investor review in support of a Series A funding round.`,
    },
    companyDescription: {
      title: 'Company Description',
      content: `GreenBox Lagos Limited was incorporated in Lagos State in January 2025 under the Companies and Allied Matters Act (CAMA). Our registered office is at 14 Admiralty Way, Lekki Phase 1.

**Mission:** To make fresh, nutritious food accessible and affordable for every Lagos household.

**Vision:** To become the most trusted grocery delivery brand in West Africa by 2030.

We operate a hub-and-spoke distribution model: a central cold-storage hub in Ajah processes incoming farm deliveries each morning, and a fleet of refrigerated motorcycles handles last-mile delivery within a guaranteed 60-minute window.`,
    },
    productsServices: {
      title: 'Products & Services',
      content: `We offer three core service tiers:

**1. GreenBox Express** — On-demand delivery of pre-packed fresh produce boxes (small, medium, large) within 60 minutes. Boxes are curated weekly based on seasonal availability.

**2. GreenBox Subscribe** — Weekly or bi-weekly subscription boxes with a 12% discount. Subscribers lock in a time slot and receive the same curated selection with first priority on limited items.

**3. GreenBox Custom** — Build-your-own order from the full catalogue. Higher minimum order (₦8,000). Delivery within 90 minutes.

All orders include a freshness guarantee: if any item fails to meet our quality standard on arrival, we replace it within 4 hours or refund.`,
    },
    marketAnalysis: {
      title: 'Market Analysis',
      content: `**Market size:** Nigeria's grocery retail market is valued at approximately $26 billion (2025), with e-commerce penetration below 3% — leaving enormous headroom for digital-first players.

**Lagos opportunity:** Lagos alone accounts for roughly 30% of Nigeria's consumer spending. The Lekki–Victoria Island–Ikoyi corridor — our initial focus — has a combined population of approximately 600,000, median household income above ₦4.5 million per year, and high smartphone penetration (>78%).

**Key trends driving demand:**
- Rising urban middle class with less time for market visits
- Increasing health-consciousness and preference for organic/traceable produce
- Growing distrust of supermarket freshness and cold-chain integrity
- Expansion of fintech-enabled payments (Opay, Moniepoint) lowering checkout friction

**Competitive gap:** No existing player combines same-day delivery, farm-direct sourcing, and a subscription model with reliable cold-chain logistics in this corridor.`,
    },
    competitiveLandscape: {
      title: 'Competitive Landscape',
      content: `The Lagos fresh grocery delivery space has a small number of active players but none with the full combination of speed, quality assurance, and subscription infrastructure we offer.`,
      competitors: [
        {
          name: 'Market Square',
          strengths: 'Strong brand recognition; wide SKU range; multiple physical stores',
          weaknesses: 'Delivery times often exceed 3 hours; no farm-direct sourcing; cold chain inconsistent',
        },
        {
          name: 'FreshDirect NG',
          strengths: 'Established customer base in Ikoyi; reasonable pricing',
          weaknesses: 'No subscription product; poor mobile app UX; limited to premium cuts only',
        },
        {
          name: 'Jumia Food (grocery vertical)',
          strengths: 'Massive distribution network; trusted brand; marketing spend',
          weaknesses: 'Not fresh-produce focused; quality complaints common; no farm traceability',
        },
        {
          name: 'Local market vendors',
          strengths: 'Price competitive; high trust in neighbourhoods',
          weaknesses: 'No delivery; inconsistent quality; cash-only; hygiene concerns',
        },
      ],
    },
    marketingStrategy: {
      title: 'Marketing Strategy',
      content: `**Acquisition channels:**

1. **Instagram & TikTok content** — Short-form video showing farm sourcing, packing, and delivery. Authentic storytelling builds trust faster than paid ads in this category.

2. **WhatsApp community selling** — Curated neighbourhood WhatsApp groups managed by local "GreenBox Ambassadors" (micro-influencers paid on commission per activation).

3. **Referral programme** — Existing subscribers earn a ₦1,500 credit for every verified new subscriber they refer. Target CAC: ₦2,200.

4. **Corporate partnerships** — Quarterly contracts with firms in the Lekki–VI corridor for weekly office fruit baskets and staff subscription boxes.

**Retention:**
- Personalised weekly box curation based on order history
- Loyalty points redeemable against orders (1 point per ₦100 spent)
- Proactive freshness guarantee enforcement — no friction on replacements`,
    },
    operationsPlan: {
      title: 'Operations Plan',
      content: `**Supply chain:** We source from 14 verified farms within a 200 km radius of Lagos — primarily Ogun State (leafy vegetables, tomatoes), Plateau State (potatoes, carrots), and Delta State (plantain, yam). Farm partners sign a quality agreement and submit weekly availability forecasts by Thursday for the following week.

**Fulfilment hub:** Our 450 m² Ajah facility operates 5:00 AM–2:00 PM daily. Produce arrives between 5:00–7:00 AM, is graded, cold-stored, and packed into orders from 7:00 AM onward. First dispatch batch leaves at 8:30 AM.

**Delivery fleet:** 18 refrigerated motorcycles (owned); 6 backup riders (contract). GPS-tracked via a custom dispatch dashboard. Average delivery time: 47 minutes from dispatch.

**Technology stack:** Customer-facing mobile app (iOS/Android) built on React Native; order management dashboard (internal); farm portal for availability submissions. All built in-house.

**Team:** 32 full-time staff (12 logistics, 8 operations/packing, 6 tech, 4 sales, 2 finance/admin). Headcount grows to 65 by end of year two.`,
    },
    managementTeam: {
      title: 'Management Team',
      content: `**Adaeze Okonkwo — CEO & Co-founder**
Former supply chain manager at Dangote Industries for 7 years. Led cold-chain optimisation projects across 6 states. MBA from Lagos Business School (2021).

**Emeka Eze — CTO & Co-founder**
Full-stack engineer; previously engineering lead at Flutterwave (2019–2023). Built the initial GreenBox platform from scratch.

**Fatima Bello — Head of Operations**
8 years in FMCG logistics at Unilever Nigeria. Expert in last-mile delivery optimisation in high-density urban environments.

**Chidi Nwachukwu — Head of Partnerships**
Agribusiness background; spent 5 years at the Bank of Agriculture managing smallholder farm financing programmes. Manages all farm-side relationships.`,
    },
    swot: {
      title: 'SWOT Analysis',
      strengths: [
        'Direct farm relationships ensure freshness and cost advantage',
        'Subscription model creates predictable, recurring revenue',
        '60-minute delivery commitment differentiates strongly in market',
        'Experienced founding team with relevant domain expertise',
        'Proprietary dispatch and farm-portal technology',
      ],
      weaknesses: [
        'Operations currently limited to two LGAs — limited market coverage',
        'Cold-chain infrastructure is capital-intensive to scale',
        'Heavy dependency on motorcycle logistics (fuel price sensitivity)',
        'Brand awareness low outside early-adopter segment',
      ],
      opportunities: [
        'Lagos grocery e-commerce penetration below 3% — large untapped addressable market',
        'Growing middle class increasingly willing to pay premium for convenience',
        'Government agric subsidies create farm-side margin opportunities',
        'Potential to expand into Abuja and Port Harcourt in year two',
        'Corporate catering vertical largely unserved by fresh delivery players',
      ],
      threats: [
        'Well-capitalised international players (e.g. Jumia, Glovo) could enter segment',
        'Fuel and logistics cost volatility in Nigerian operating environment',
        'Regulatory uncertainty around food handling and delivery licensing',
        'Seasonality and climate risk affecting farm supply consistency',
      ],
    },
    financialPlanPlaceholder: {
      title: 'Financial Plan',
      content:
        'Detailed financial projections — including P&L, cash flow forecast, and funding allocation — will be provided as a supplementary Excel model. Contact the team to request access.',
    },
  },
};
