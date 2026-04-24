# WealthifyX

**Free financial calculators built for US investors — no fluff, just numbers.**

[wealthifyx.com](https://wealthifyx.com) · Built with Next.js · Deployed on Vercel

---

## What It Is

WealthifyX is a collection of 8 fast, accurate financial calculators designed for everyday US investors. No signup. No paywalls. No ads cluttering the results. Just clean inputs, instant outputs, and the math explained.

---

## Calculators

| Calculator | What It Does |
|---|---|
| Compound Interest | Project investment growth over time with reinvestment |
| SIP Calculator | Systematic Investment Plan returns with monthly contributions |
| FD Calculator | Fixed Deposit maturity value and interest breakdown |
| EMI Calculator | Loan EMI with amortization schedule |
| Retirement Calculator | Corpus needed to retire at your target age |
| Net Worth Calculator | Assets vs liabilities snapshot |
| Tax Calculator | US income tax estimate by bracket |
| Dividend Yield | Yield and annual income from dividend stocks |

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS |
| State | React Hooks |
| API / Cache | Upstash Redis (edge-compatible) |
| Deployment | Vercel |

**Why Upstash Redis?** Migrated from MongoDB Data API after hitting Cloudflare Pages' 3MB edge worker size limit. Upstash provides a serverless, edge-compatible key-value store with zero cold-start overhead — fits perfectly with Vercel's edge runtime.

---

## Local Development

```bash
# Clone the repo
git clone https://github.com/finovian/wealthifyx
cd wealthifyx

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN

# Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

```env
UPSTASH_REDIS_REST_URL=your_url_here
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

---

## Project Structure

```
wealthifyx/
├── app/
│   ├── page.tsx              # Homepage
│   ├── calculators/
│   │   ├── compound-interest/
│   │   ├── sip/
│   │   ├── emi/
│   │   └── ...
│   └── api/
│       └── ...               # Edge API routes
├── components/
│   ├── Calculator/           # Shared calculator UI components
│   └── Layout/
├── lib/
│   └── redis.ts              # Upstash client
└── public/
```

---

## Roadmap

- [ ] Stock screener integration
- [ ] Portfolio tracker (US stocks + ETFs)
- [ ] Inflation-adjusted projections
- [ ] PDF export for calculator results
- [ ] Dark mode

---

## Related Projects

**[Finovian](https://finovian.com)** — Semiconductor and tech stock analysis with a public, falsifiable Track Record. Built on Astro.

---

## License

MIT
