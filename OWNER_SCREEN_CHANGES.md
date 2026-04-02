# Owner Dashboard - Screen Modification Spec

> **Goal:** The owner cares about 3 things: **Reviews, Revenue, and Complaints.**
> Q100 improves room quality → better guest experience → better reviews → more bookings → more revenue.
> Every screen must tell THIS story. No inspection jargon. No pass/fail. No soap counts.

---

## Navigation (6 screens — Expansion Simulator REMOVED)

1. Portfolio Dashboard (`/owner`)
2. Hotel Performance (`/owner/comparison`) — renamed from "Property Benchmarking"
3. Room Quality Overview (`/owner/brand-standards`) — renamed from "Brand Standards Heatmap"
4. Revenue Impact (`/owner/roi`) — renamed from "Financial ROI"
5. Staff Analytics (`/owner/staff`)
6. Report Generator (`/owner/reports`)

**REMOVED:** Expansion Simulator (`/owner/simulator`) — delete this screen and sidebar link

---

## 1. Portfolio Dashboard (`/owner/page.tsx`)

**Title:** "Portfolio Command Centre"

### KPI Banner — 4 Cards

| Card | What to Show |
|------|-------------|
| Card 1 | **My Hotels:** 5 Hotels, 612 Rooms (hotel icon + room icon side by side) |
| Card 2 | **Customer Reviews:** 4.2 → 4.6 stars (+0.4 since Q100) — show star icons, Google/OTA logo |
| Card 3 | **Complaints Reduced:** 70% fewer complaints this month — downward red arrow, very prominent |
| Card 4 | **Revenue Growth:** +₹18.4L/month additional revenue from increased bookings — green upward arrow |

> **Why Revenue Growth?** Better reviews → higher OTA ranking → more bookings → more revenue.
> This is what the owner actually earns because of Q100.

### Regional Distribution Map — REMOVE entirely
- Owner knows where his hotels are. Waste of space.

### Brand Standardisation Index — REMOVE entirely
- Too technical. Owner doesn't care about "brand index scores."

### Property Leaderboard Table — FULL WIDTH (12 cols)

| Column | Description |
|--------|-------------|
| Hotel Name | e.g. "JW Marriott Grand, Pune" |
| Rooms | Total room count |
| Google Rating | ⭐ 4.6 (show actual stars) |
| OTA Score | MakeMyTrip/Booking.com rating |
| Total Reviews | Number of reviews this month (higher = green, lower = amber) |
| Bookings This Month | Customer count — shows which hotel gets most/least customers |
| Complaints | Number with red/green color (lower = green) |
| Revenue | ₹XX.XL |
| Trend | Sparkline showing last 6 months revenue trend |

- **Sort by default:** Highest reviews first (best hotel on top, worst at bottom)
- Owner instantly sees: which hotel has most reviews/customers vs which has least

- Green row tint for best performer, red tint for worst
- Clickable rows → navigate to that hotel's detail view

### Hotel Comparison Cards — NEW SECTION (below leaderboard, full width)
Two side-by-side highlight cards:

**🟢 Best Performing Hotel:**
- "JW Marriott Grand, Pune" — 4.8 ⭐ Google Rating, 2,340 bookings this month, only 4 complaints
- _"Highest reviews, most customers"_

**🔴 Needs Attention:**
- "JW Marriott Central, Nagpur" — 3.8 ⭐ Google Rating, 890 bookings this month, 28 complaints
- _"Lowest reviews, fewest customers — review drop costing ~₹3.2L/month in lost bookings"_

This instantly tells the owner: _"Where am I winning? Where am I losing?"_

### Financial Impact Section — SIMPLIFY
- One big number: **₹18.4L additional revenue this month**
- Below: 4 simple horizontal bars showing where revenue comes from:
  - Increased Bookings (from better reviews): ₹8.2L
  - Repeat Guests (from better experience): ₹4.1L
  - Reduced Refunds/Complaints: ₹2.45L
  - Higher Room Rates (premium from rating): ₹3.65L
- Bottom line: _"₹X per room per month additional revenue"_

---

## 2. Hotel Performance (`/owner/comparison/page.tsx`)

**Rename from:** "Property Benchmarking"
**New Title:** "Hotel Performance"
**Subtitle:** "How are your hotels performing — and how has Q100 changed things?"

### Radar Chart — MODIFY axes
Remove pass rate, resolution speed, etc. Replace with what owner cares about:

| Axis | What it measures |
|------|-----------------|
| Customer Reviews | Google/OTA rating |
| Complaint Rate | Lower = better (inverted scale) |
| Revenue per Room | Monthly RevPAR |
| Guest Retention | % repeat guests |
| Staff Efficiency | Rooms handled per shift |
| Occupancy Rate | % rooms occupied |

- Add **"Industry Average"** dashed line (4-star hotel benchmark)
- Remove individual property toggles — show all by default (it's only 5)

### Before & After Q100 — NEW HERO SECTION
This is the most important chart on this screen:

- **Full-width line chart** — 12 months (6 before Q100 + 6 after)
- **Vertical dashed line** at deployment date labeled "Q100 Deployed"
- **Two lines:**
  - Customer Review Score (left Y-axis)
  - Monthly Complaints (right Y-axis, inverted — going down is good)
- Owner instantly sees the inflection point where Q100 made things better
- Below chart, summary: _"Since Q100: Reviews up +0.4 stars, Complaints down 70%, Revenue up ₹18.4L/month"_

### What's Working — TOP 3 cards
- Show 3 best performing areas across all hotels
- e.g. _"Pune: Guest review score hit 4.8 — highest in portfolio"_
- Each with: Hotel name, metric, "Roll out to all" button

### Needs Attention — TOP 3 cards
- Show 3 problem areas
- e.g. _"Nagpur: Reviews dropped 0.2 stars — 12 complaints about room cleanliness this week"_
- Each with: Hotel name, issue, revenue impact estimate, "Notify Manager" button

---

## 3. Room Quality Overview (`/owner/brand-standards/page.tsx`)

**Rename from:** "Brand Standards Heatmap"
**New Title:** "Room Quality Overview"
**Subtitle:** "Quality scores by room type across your hotels"

### Heatmap Grid — COMPLETELY REWORK

**OLD:** Categories were Bed, Bathroom, Minibar, Towels, Curtains, Desk, Entrance, Welcome
**NEW:** Categories are ROOM TYPES — this is what owner understands

| | Standard | Executive | Suite | VIP Suite | Penthouse |
|---|---|---|---|---|---|
| JW Marriott Grand, Pune | 92% | 88% | 95% | 90% | — |
| JW Marriott Palace, Mumbai | 85% | 82% | 88% | 86% | 91% |
| JW Marriott Heritage, Nashik | 78% | 75% | 80% | — | — |
| JW Marriott Gateway, Aurangabad | 74% | 70% | 76% | — | — |
| JW Marriott Central, Nagpur | 68% | 65% | 72% | — | — |

- Percentage = overall room quality score (computed from all checkpoints internally, but owner just sees one number)
- Color coding: Green (85%+), Yellow (70-84%), Red (<70%)
- "—" for room types that don't exist at that property

### Click on any cell → Drill down shows:
- **Total rooms of this type:** e.g. "24 Standard rooms"
- **Rooms with issues this month:** e.g. "3 rooms had complaints"
- **Top complaint reasons:** _"AC not working (2), Room not clean (1)"_
- **Guest review excerpts** for this room type (pulled from Google/OTA)
- **"Notify Manager"** button

### Right Panel — "Action Required"
- Priority-ordered list of issues
- Each item: Hotel name, Room type, Issue, Days since flagged, "Assign to Manager" button
- If no issues: show green **"All Clear — All Hotels Meeting Standards"** card

---

## 4. Revenue Impact (`/owner/roi/page.tsx`)

**Rename from:** "Financial ROI Dashboard"
**New Title:** "Revenue Impact"
**Subtitle:** "How Q100 is growing your revenue"

> **KEY SHIFT:** Frame everything as EARNING MORE, not SAVING money.
> Owner mindset: _"I'm not saving ₹10L, I'm earning ₹10L more because my hotels are better."_

### Hero Banner — Full width
- Big number: **₹18.4L/month additional revenue**
- Subtitle: _"Your hotels earn ₹18.4L more every month since deploying Q100"_
- Below: **"Since Deployment: ₹1.10 Cr total additional revenue"** (cumulative, impressive number)
- Two columns:
  - **Q100 Subscription:** ₹3.5L/month
  - **Additional Revenue:** ₹18.4L/month
  - **Net Gain:** ₹14.9L/month (big green number)

### How Revenue Increased — Waterfall Chart
Show the chain reaction:

```
Q100 Deployed → Room Quality Up → Reviews Improved → OTA Ranking Up → More Bookings → More Revenue
```

Waterfall bars:
- Better Reviews → +₹4.85L (higher OTA ranking, more visibility)
- More Repeat Guests → +₹4.1L (guests come back due to better experience)
- Fewer Refunds/Comps → +₹2.45L (complaints that used to cost money)
- Higher Room Rates → +₹3.65L (better rating = can charge more)
- Reduced Rework → +₹3.35L (staff efficiency, fewer re-cleans)
- **Total: +₹18.4L/month**

### KPI Cards — 4 cards

| Card | Content |
|------|---------|
| Payback Period | **38 Days** — _"Q100 paid for itself in 38 days"_ |
| Complaint Reduction | **70% fewer** — _"From 120/month to 36/month across all hotels"_ |
| Review Improvement | **+0.4 stars** — _"4.2 → 4.6 average across Google & OTAs"_ |
| Annual Revenue Projection | **₹2.2 Cr** — _"Projected additional revenue by Q1 2027"_ (biggest card, bold green) |

> **REMOVED:** Labour Saved card — owner doesn't care about staff hours

### Revenue Growth Chart — Full width
- **12-month chart** (not 60 days)
- X-axis: Months, Y-axis: Revenue
- Two lines:
  - **"Without Q100"** (projected flat/declining revenue — dashed gray)
  - **"With Q100"** (actual growing revenue — solid green)
- The gap between lines = revenue gained because of Q100
- Milestone markers: _"Break-even"_, _"₹50L earned"_, _"₹1Cr earned"_

### Per-Hotel Revenue Breakdown — Table

| Hotel | Monthly Revenue Before | Monthly Revenue After | Revenue Gain | Review Score |
|-------|----------------------|----------------------|-------------|-------------|
| JW Marriott Grand, Pune | ₹45L | ₹52L | +₹7L | 4.8 ⭐ |
| JW Marriott Palace, Mumbai | ₹62L | ₹68L | +₹6L | 4.6 ⭐ |
| ... | ... | ... | ... | ... |

---

## 5. Staff Analytics (`/owner/staff/page.tsx`)

**Title:** "Staff Analytics" (keep as is)

### KPI Cards — 4 cards

| Card | Content |
|------|---------|
| Total Staff | **84 Housekeepers** across 5 hotels |
| Avg Rooms/Shift | **14.6** — _"Industry avg: 12"_ (shows your team is efficient) |
| Rooms Verified/Hour | **4.2** (simplified name, no jargon) |
| Faster Onboarding | **40% faster** — _"New staff reach quality targets in 3.2 weeks vs 5.4 weeks before Q100"_ |

### Workforce Table — MODIFY

| Column | Description |
|--------|-------------|
| Hotel | Property name |
| Staff Count | Headcount |
| Vacancy | % (red if >15%) |
| Training Status | Certified ✅ / In Training 🟡 / Needs Retraining 🔴 |
| Avg Rooms/Shift | Per-person productivity |
| Top Issue | Most common problem for that hotel's staff |

- Color code rows: Green (all good), Yellow (some issues), Red (needs attention)
- Expandable rows → shows individual staff members with their stats

### Risk Alerts — Show for ALL hotels with issues
- Not just Nagpur — any hotel with problems gets a card
- Each card shows:
  - Hotel name + what's wrong
  - Revenue impact: _"Estimated ₹X lost this month due to this"_
  - Recommended fix + timeline
  - **"Assign to Manager"** button
- If all hotels are fine: show green **"All Teams Performing Well"** card

### Staff Leaderboard — MODIFY
- Keep top 10 performers list
- **ADD:** "Most Improved" section — staff who grew the most (motivates improvement)
- **ADD:** "Recognition" button — owner can send appreciation/badge to a staff member
  - e.g. _"Great work Meena!"_ → notification sent to the staff member
  - Makes owner feel connected to ground-level team

### NEW: Training Impact Chart
- X-axis: Training hours via Q100, Y-axis: Quality improvement
- Shows direct correlation: more training → better quality → fewer complaints
- _"Every 1 hour of Q100 training = 2.3% quality improvement"_

---

## 6. Report Generator (`/owner/reports/page.tsx`)

**Title:** "Report Generator"

### Report Configuration — SIMPLIFY

**Property Selection:**
- Dropdown: "All Hotels" / Individual hotel selection
- Owner can generate report for a single hotel or entire portfolio

**Report Types (pick one):**

| Report Type | What's Inside |
|-------------|--------------|
| **Monthly Hotel Report** | Customer reviews, revenue, complaints, staff performance, manager performance — for one specific hotel |
| **Portfolio Summary** | All hotels overview — reviews, revenue, complaints compared side by side |
| **Quarterly Board Report** | Detailed: revenue impact, review trends, staff analytics, growth trajectory |
| **Manager Performance Report** | Per-hotel manager: how their hotel is performing under them, staff they manage, issues resolved |

**Key Metrics Included in Every Report:**
- Customer Reviews (Google + OTA scores, trend, sample reviews)
- Revenue / Sales (monthly, trend, per-room)
- Total Staff + Staff Performance (top performers, issues)
- Manager Performance (response time, issues resolved, hotel improvement under them)
- Complaint Summary (count, types, resolution rate)

### Live Preview — ENHANCE
- Show actual report with real data (not placeholder boxes)
- Professional PDF look with:
  - Q100 branding + Owner's hotel group branding
  - AI-generated executive summary paragraph at top
  - Charts and tables with actual numbers
- **Download as PDF** button
- **Email Report** button — send directly to anyone

### Report Templates — Bottom section
- Thumbnail preview of each template
- "Last Generated" date shown on each
- **"Schedule Auto-Send"** — _"Send Monthly Hotel Report every 1st of month to owner@hotel.com"_

---

## Global Changes (All Owner Screens)

### 1. Language — NO JARGON
| Don't Say | Say Instead |
|-----------|------------|
| Pass Rate | Room Quality Score |
| GSI | Guest Rating |
| Brand Standardisation Index | (Remove entirely) |
| Resolution Speed | Issue Fix Time |
| Quality Velocity | Rooms Verified/Hour |
| Fail / Pass | Issue Found / All Good |
| Checkpoint | (Don't mention to owner at all) |

### 2. "Last Updated" Timestamp
- Every screen: _"Data as of: 1 Apr 2026, 9:42 AM"_
- Builds trust that data is live

### 3. Quick Action Floating Button (bottom-right, all screens)
- "Call Property Manager"
- "Generate Report"
- "Flag for Review"

### 4. Smart Notifications (bell icon in header)
- _"Nagpur reviews dropped to 3.8 stars — 5 complaints this week"_
- _"Pune hit 4.8 stars — new all-time high!"_
- _"Monthly report ready for download"_

### 5. Mobile Responsive
- Tables collapse into swipeable cards on mobile
- Charts are touch-friendly and swipeable
- Owner checks from phone often — must work perfectly

### 6. Color Coding (consistent everywhere)
- 🟢 Green = Good / Revenue Up / Reviews Up
- 🔴 Red = Needs Attention / Complaints / Revenue Down
- 🔵 Blue = Informational / Neutral
- 🟡 Amber = Warning / Trending Down

### 7. Every Metric → Connect to Revenue or Reviews
- If a number doesn't relate to revenue or customer reviews, either remove it or reframe it
- e.g. Instead of "480 labour hours saved" → "Staff now focused on deep cleaning → better reviews"

---

## Sidebar Navigation Update

| Current | Change To | Icon |
|---------|-----------|------|
| Portfolio Dashboard | Portfolio Dashboard | LayoutDashboard |
| Property Benchmarking | Hotel Performance | BarChart3 |
| Brand Heatmap | Room Quality | BedDouble |
| Financial ROI | Revenue Impact | TrendingUp |
| Staff Analytics | Staff Analytics | Users |
| Report Generator | Reports | FileText |
| Expansion Simulator | **DELETE** | — |

---

## Priority Order

| Priority | Screen | Why |
|----------|--------|-----|
| P0 | Portfolio Dashboard | First thing owner sees — must impress in 5 seconds |
| P0 | Revenue Impact | This is what sells Q100 — _"You're earning ₹18.4L more because of us"_ |
| P1 | Hotel Performance | Before/After Q100 chart is the killer proof |
| P1 | Room Quality Overview | Simple room-type view replaces confusing heatmap |
| P2 | Reports | Owner needs this to show his board/investors |
| P2 | Staff Analytics | Important but secondary to revenue story |

---

## The Story Every Screen Tells

```
Q100 inspects rooms with AI
        ↓
Room quality improves
        ↓
Fewer guest complaints
        ↓
Better Google & OTA reviews
        ↓
Higher search ranking on booking platforms
        ↓
More bookings
        ↓
MORE REVENUE
```

**Every screen must reinforce this chain. The owner should feel:**
_"Q100 is not a cost. Q100 is a revenue engine."_
