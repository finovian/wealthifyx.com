# WealthifyX

## Project Context

Build the complete homepage for **WealthifyX** (wealthifyx.com) — a free finance calculator and tools site targeting US investors and personal finance beginners. The site's core promise: the most beautifully designed, premium-feeling finance tools on the internet. Every competitor is ugly and utilitarian. WealthifyX wins on design, UX, and visual quality.

---

## Tech Stack

- **Framework:** Next.js (App Router or Pages Router)
- **Styling:** Tailwind CSS + raw CSS-in-JSX for advanced effects
- **Components:** Shadcn/ui for base primitives
- **Charts:** Recharts for any data visualization
- **Animations:** Framer Motion for entrance animations and micro-interactions
- **Fonts:** Google Fonts — Playfair Display (display/headings) + DM Sans (body) + DM Mono (numbers, labels, code-like elements)

---

## Design System

### Color Palette
```
Background primary:     #060d1a  (near black navy)
Background secondary:   #0a1628  (slightly lighter navy)
Background card:        rgba(255,255,255,0.025)
Border default:         rgba(255,255,255,0.06)
Border accent:          rgba(212,175,55,0.2)

Gold accent:            #d4af37  (primary brand color)
Gold light:             #f0d060  (gradient end)
Gold glow:              rgba(212,175,55,0.15)

Text primary:           #f1f5f9
Text secondary:         #94a3b8
Text muted:             #475569
Text disabled:          #334155

Positive (green):       #48bb78
Negative (red):         #fc8181

White alpha 4%:         rgba(255,255,255,0.04)
White alpha 6%:         rgba(255,255,255,0.06)
White alpha 10%:        rgba(255,255,255,0.10)
```

### Typography Scale
```
Display heading:   Playfair Display, 700-800 weight, -1.5px letter spacing
Section heading:   Playfair Display, 700 weight, -1px letter spacing
Body large:        DM Sans, 16px, 400 weight, 1.65 line height
Body default:      DM Sans, 14px, 400 weight
Body small:        DM Sans, 13px, 400 weight
Label/tag:         DM Mono, 10-11px, 500 weight, 1.5-2px letter spacing, UPPERCASE
Numbers/data:      DM Mono, variable size, 500 weight
```

### Global Background Effects
- Full page background: `linear-gradient(135deg, #060d1a 0%, #0a1628 50%, #06111f 100%)`
- Grain texture overlay: Fixed position, full viewport, opacity 0.035, SVG fractalNoise filter, pointer-events none, z-index 0
- Ambient orb 1: Fixed top-right, 600px diameter, `radial-gradient(circle, rgba(212,175,55,0.06), transparent 70%)`, filter blur(100px)
- Ambient orb 2: Fixed bottom-left, 500px diameter, `radial-gradient(circle, rgba(72,187,120,0.04), transparent 70%)`, filter blur(80px)
- Ambient orb 3: Fixed center, 800px diameter, `radial-gradient(circle, rgba(10,20,50,0.3), transparent 70%)`, filter blur(120px)

### Card Style
```
background: rgba(255,255,255,0.025)
border: 1px solid rgba(255,255,255,0.06)
border-radius: 20px
padding: 32-40px
backdrop-filter: blur(12px)
```

### Hover States
- Cards: border-color transitions to rgba(212,175,55,0.2), subtle translateY(-2px), box-shadow: 0 16px 48px rgba(0,0,0,0.3)
- Buttons: translateY(-1px), gold glow shadow
- All transitions: 0.2-0.3s ease

---

## Page Structure — Section by Section

---

### SECTION 1: Navigation Bar

**Layout:** Full width, fixed or sticky, height ~68px
**Background:** rgba(6,13,26,0.85) with backdrop-filter: blur(20px)
**Border bottom:** 1px solid rgba(255,255,255,0.05)
**Z-index:** 100
**Padding:** 0 48px (desktop), 0 20px (mobile)

**Left side — Logo:**
- Text: "WealthifyX"
- Font: Playfair Display, 22px, 800 weight
- Color: Gradient linear-gradient(135deg, #d4af37, #f0d060) via -webkit-background-clip: text
- No icon, pure text logo

**Center — Navigation links (desktop only, hidden on mobile):**
- Links: "Calculators", "Learn", "Compare Brokers"
- Font: DM Sans, 13px, 500 weight, 0.5px letter spacing
- Color: #64748b default, #d4af37 on hover
- Transition: color 0.2s ease
- No underlines

**Right side:**
- Small label: "Free. Always."
- Font: DM Mono, 11px, #475569
- On mobile: hamburger icon (simple 3-line, gold color)

---

### SECTION 2: Hero Section

**Layout:** Full width, min-height 90vh, centered content with flex column
**Padding:** 100px 48px 80px (desktop), 80px 20px 60px (mobile)
**Position:** relative, z-index 10

**Top micro-label (above headline):**
- Pill-shaped badge
- Background: rgba(212,175,55,0.08)
- Border: 1px solid rgba(212,175,55,0.2)
- Border-radius: 100px
- Padding: 6px 16px
- Font: DM Mono, 11px, #d4af37, 1.5px letter spacing, UPPERCASE
- Text: "8 FREE PROFESSIONAL TOOLS"
- Entrance animation: fadeUp 0.4s ease, delay 0s

**Main Headline:**
- Font: Playfair Display, clamp(48px, 7vw, 88px), 800 weight, -2.5px letter spacing, line-height 1.0
- Two lines:
  - Line 1: "Precision tools for" (color: #f1f5f9)
  - Line 2: "serious investors." (gold gradient via background-clip)
- Max-width: 800px, centered
- Entrance animation: fadeUp 0.5s ease, delay 0.1s

**Subheadline:**
- Font: DM Sans, 18px, 400 weight, #64748b, 1.7 line height
- Text: "Free, beautifully designed finance calculators built for clarity and precision. No accounts. No cookies. No noise."
- Max-width: 520px, centered
- Entrance animation: fadeUp 0.5s ease, delay 0.2s

**CTA Button row:**
- Two buttons, horizontal, gap 12px, centered
- Button 1 (Primary): "Explore All Tools →"
  - Background: linear-gradient(135deg, #d4af37, #b8962e)
  - Color: #060d1a (dark text on gold)
  - Font: DM Sans, 15px, 700 weight
  - Padding: 14px 32px, border-radius: 12px
  - Hover: translateY(-2px), box-shadow 0 12px 40px rgba(212,175,55,0.35)
- Button 2 (Ghost): "See How It Works"
  - Background: transparent
  - Border: 1px solid rgba(255,255,255,0.1)
  - Color: #94a3b8
  - Hover: border-color rgba(212,175,55,0.3), color #d4af37
- Entrance animation: fadeUp 0.5s ease, delay 0.3s

**Trust badges row (below buttons, margin-top 40px):**
- Horizontal flex, gap 32px, centered
- 3 badges: icon + text
  - "No Accounts Required" icon: lock
  - "No Data Stored" icon: shield
  - "100% Client-Side Math" icon: lightning
- Font: DM Sans, 12px, #475569
- Icon color: #d4af37
- Vertical line separator rgba(255,255,255,0.06) between badges
- Entrance animation: fadeUp 0.5s ease, delay 0.4s

**Hero bottom — Animated stats strip (margin-top 60px):**
- 3 stat cards side by side
- Each card:
  - Background: rgba(255,255,255,0.03)
  - Border: 1px solid rgba(255,255,255,0.06)
  - Border-radius: 16px, Padding: 24px 32px
  - Label: DM Mono, 10px, #475569, UPPERCASE, 1.5px letter spacing
  - Value: DM Mono, 32px, 500 weight, animated count-up on load
- Card 1: "Avg S&P 500 CAGR (10Y)" → "10.7%" (green #48bb78)
- Card 2: "Inflation Rate (Current)" → "3.2%" (red #fc8181) — update via FRED API
- Card 3: "Tools Available" → "8+" (#d4af37)
- Entrance animation: fadeUp 0.6s ease, delay 0.5s

---

### SECTION 3: Social Proof / Trust Bar

**Layout:** Full width strip
**Background:** rgba(255,255,255,0.02)
**Border top and bottom:** 1px solid rgba(255,255,255,0.04)
**Padding:** 20px 48px

**Content:**
- Left: DM Mono, 11px, #334155: "TRUSTED BY INVESTORS IN"
- Right: "US · Germany · United Kingdom · India · France"
- Font: DM Sans, 13px, #475569
- Note: Based on real Google Analytics data

---

### SECTION 4: Tools Directory Section

**Layout:** Max-width 1100px, centered, padding 80px 48px

**Section header:**
- Eyebrow: DM Mono, 10px, #d4af37, UPPERCASE, "// TOOL DIRECTORY"
- Heading: Playfair Display, 42px, 700, #f1f5f9, "Every tool you need."
- Subtext: DM Sans, 15px, #64748b, "Built for precision. Designed for clarity. Free forever."
- margin-bottom: 48px

**Tools grid:**
- CSS Grid: 2 columns desktop, 1 column mobile
- Gap: 16px

**Each tool card:**
- Background: rgba(255,255,255,0.025)
- Border: 1px solid rgba(255,255,255,0.06)
- Border-radius: 16px, Padding: 28px 32px
- Display: flex, align-items center, justify-content space-between
- Hover: border-color rgba(212,175,55,0.25), translateY(-2px), box-shadow 0 12px 40px rgba(0,0,0,0.25)
- Transition: all 0.25s ease, cursor pointer

**Tool card left:**
- Icon container: 44x44px, background rgba(212,175,55,0.08), border rgba(212,175,55,0.15), border-radius 12px
- Tool name: DM Sans, 16px, 600, #f1f5f9, margin-left 16px
- Description: DM Sans, 13px, #64748b, margin-top 4px

**Tool card right:**
- "Open Tool →" DM Mono, 11px, #d4af37
- Arrow animates translateX(4px) on hover

**All 8 tools:**
1. Stock CAGR — "Annualized growth rate of individual stock positions"
2. Portfolio CAGR — "Total performance across multi-asset portfolios"
3. CAGR with Contributions — "Track returns with periodic capital injections"
4. Step-up SIP — "Model exponential growth of increasing investments"
5. Inflation Adjusted Return — "Real purchasing power of investments over time"
6. Portfolio Allocation — "Asset distribution across sectors and risk profiles"
7. Real Return — "Net returns after taxes, inflation, and fees"
8. Investment Growth Simulator — "Long-term wealth building projections"

**Below grid:**
- Centered: "More tools shipping monthly." DM Sans, 14px, #334155

---

### SECTION 5: Feature Differentiator Section

**Layout:** Max-width 1100px, centered, padding 80px 48px

**Section header:**
- Eyebrow: DM Mono, 10px, #d4af37, "// WHY WEALTHIFYX"
- Heading: Playfair Display, 42px, "Built different."
- Subtext: "Most finance calculators were designed for accountants. We designed ours for investors."

**3-column feature grid, gap 24px:**

Each feature card:
- Background: rgba(255,255,255,0.02)
- Border: 1px solid rgba(255,255,255,0.05)
- Border-radius: 16px, Padding: 32px
- Icon box: 48x48px, rgba(212,175,55,0.08) bg, border-radius 14px

Feature 1 — "Visual Results, Not Just Numbers"
- Body: "Every calculation renders a chart. See your money's growth trajectory, not just a final figure."

Feature 2 — "Zero Data Collection"
- Body: "All calculations happen in your browser. We store nothing. Track nothing. No accounts, no cookies."

Feature 3 — "Precision-Grade Algorithms"
- Body: "No rounding shortcuts. No simplified formulas. Every tool uses professional-grade mathematical standards."

---

### SECTION 6: Live Demo / Interactive Preview Section

**Layout:** Full width, padding 80px 48px
**Background:** rgba(255,255,255,0.015), border top and bottom 1px solid rgba(255,255,255,0.04)

**Two column layout (50/50):**

Left side:
- Eyebrow: DM Mono, 10px, #d4af37, "// TRY IT NOW"
- Heading: Playfair Display, 36px, "See the difference instantly."
- Body: DM Sans, 15px, #64748b — "Try our CAGR calculator right here. No redirect. Results in real time."
- CTA button: "Open Full Calculator →" ghost style, gold border

Right side:
- Fully functional inline mini CAGR calculator
- 3 inputs: Start Value, End Value, Years (same dark input style)
- Gold "Calculate" button
- Result: Large animated CAGR % in DM Mono, 48px, green/red color
- Recharts area chart, 180px height, same dark styling

---

### SECTION 7: Email Capture Section

**Layout:** Max-width 640px, centered, padding 80px 48px

**Card:**
- Background: rgba(212,175,55,0.04)
- Border: 1px solid rgba(212,175,55,0.12)
- Border-radius: 20px, Padding: 48px
- Text align: center

**Content:**
- Eyebrow: DM Mono, 10px, #d4af37, "// STAY SHARP"
- Heading: Playfair Display, 32px, "Get smarter about your money."
- Body: "Join investors who get monthly tool updates, new calculator alerts, and bite-sized finance insights. No spam."
- Input + Button row:
  - Email input: dark style, placeholder "your@email.com"
  - Button: Gold primary "Subscribe Free →"
- Below: DM Mono, 11px, #334155 — "No spam. No selling your data. Ever."

---

### SECTION 8: FAQ Section

**Layout:** Max-width 760px, centered, padding 80px 48px

**Section header:**
- Eyebrow: DM Mono, 10px, #d4af37, "// FAQ"
- Heading: Playfair Display, 36px, "Common questions."

**Accordion style:**
- Each item: border-bottom 1px solid rgba(255,255,255,0.05)
- Question: DM Sans, 15px, 600, #f1f5f9
- Answer: DM Sans, 14px, #64748b, smooth height animation on toggle
- Toggle: + / - in gold (#d4af37)

**5 FAQ items:**
1. "Are these calculators really free?" — Yes. Always. Funded by contextual ads and affiliate partnerships, never by charging users.
2. "How accurate are the calculations?" — Standard financial mathematics, no intermediate rounding, identical to professional tools.
3. "Do you store my financial data?" — No. 100% client-side JavaScript. No server calls. No user accounts.
4. "How often are new tools added?" — 1-2 new tools monthly. Subscribe to get notified.
5. "Can I use these tools on mobile?" — Yes. Fully responsive, optimized for mobile.

---

### SECTION 9: Footer

**Layout:** Full width, padding 48px 48px 32px
**Background:** rgba(255,255,255,0.01)
**Border top:** 1px solid rgba(255,255,255,0.04)

**Top row — 4 columns:**

Column 1 — Brand:
- Logo: Playfair Display, gold gradient, 20px
- Tagline: DM Sans, 13px, #475569 — "Precision-engineered financial instruments for the modern investor."

Column 2 — Calculators:
- Heading: DM Mono, 10px, #334155, "CALCULATORS"
- All 8 tool names as links, DM Sans, 13px, #475569, hover #d4af37

Column 3 — Company:
- Heading: DM Mono, 10px, #334155, "COMPANY"
- Links: About, Contact, Methodology

Column 4 — Legal:
- Heading: DM Mono, 10px, #334155, "LEGAL"
- Links: Privacy Policy, Terms of Service, Disclaimer

**Bottom row:**
- Left: DM Mono, 11px, #334155 — "2024 WEALTHIFYX. ALL RIGHTS RESERVED."
- Right: "Privacy by Design" + "No Data Persistence" — DM Mono, 11px, #334155

---

## Animation System

**Page load staggered fadeUp:**
```
fadeUp: opacity 0→1, translateY 16px→0, duration 0.5s ease

Nav:            delay 0s
Hero badge:     delay 0.1s
Hero headline:  delay 0.2s
Hero sub:       delay 0.3s
Hero CTAs:      delay 0.4s
Trust badges:   delay 0.5s
Stats strip:    delay 0.6s
```

**Scroll animations (Framer Motion):**
- Each section: initial opacity 0, y 24 → animate opacity 1, y 0
- Duration: 0.5s, easing: easeOut
- Tool cards: stagger 0.08s between each

**Counter animations:**
- Stats numbers count up from 0 on load
- Duration: 1.2s, cubic-ease-out, requestAnimationFrame

**Hover micro-interactions:**
- Tool cards: translateY(-2px) + border glow
- Buttons: translateY(-1px) + shadow
- Nav links: color only, no movement

---

## SEO Requirements

- title: "Free Finance Calculators for Investors | WealthifyX"
- meta description: "Free, beautifully designed finance calculators. CAGR, SIP, Portfolio, Inflation-adjusted returns and more. No accounts. No data stored. 100% free."
- og:title, og:description, og:image
- Structured data: WebSite schema with SearchAction
- Canonical URL
- All images: descriptive alt text
- Single H1 on page
- Semantic HTML: nav, main, section, footer, article

---

## Responsiveness Breakpoints

```
Mobile:  < 768px    — single column, reduced padding, hidden nav links
Tablet:  768-1024px — 2 col tools grid, adjusted font sizes
Desktop: > 1024px   — full layout as described
```

Mobile-specific:
- Nav: hide links, show hamburger
- Hero: stack buttons vertically
- Stats strip: horizontal scroll or single column stack
- Tools grid: 1 column
- Feature grid: 1 column
- Footer: stack all columns vertically

---

## Final Feeling

When someone lands on WealthifyX they must feel:
- "This looks more premium than any calculator site I've used"
- "This is clearly built by someone serious about finance"
- "I trust this site"
- "I want to explore every tool here"

It must NOT feel like:
- A generic Tailwind template
- A basic utility site
- Any competitor (CalculatorSoup, Calculator.net, Bankrate, NerdWallet)

The dark luxury aesthetic, gold accents, Playfair Display typography, and animated data visualizations are NON-NEGOTIABLE. This is the single biggest differentiator WealthifyX has.

