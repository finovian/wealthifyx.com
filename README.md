# WealthifyX

Free financial calculators + an AI advisor that actually runs the math.

**Live at [wealthifyx.com](https://wealthifyx.com)**

---

## What it is

Most personal finance tools tell you to "invest early" and "diversify your portfolio." That's not advice. That's a fortune cookie.

WealthifyX does the opposite. You give it your numbers, it gives you back a specific answer. The AI advisor at [wealthifyx.com/ai](https://wealthifyx.com/ai) doesn't generate generic tips it runs real calculations and tells you the actual number you need.

Ask it: "I'm 28, earn $80k, want to retire at 55."

It won't say "start a Roth IRA." It'll say: "You need $2.1M. That's $940/month SIP at 10% for 27 years. You're currently on track for $0."

---

## Calculators

Eight calculators, all free, no signup:

| Calculator | What it does |
|---|---|
| Compound Interest | Lump sum growth with optional monthly contributions |
| SIP | Monthly recurring investment returns |
| Roth IRA | Tax-free retirement projections |
| 401k | Employer match + balance at retirement |
| Savings Goal | How long to reach a target, or how much to save monthly |
| Options Profit | P&L, breakeven, max profit/loss for calls and puts |
| Capital Gains Tax | Federal + state tax on stock sales |
| Dividend Calculator | Income, DRIP growth, yield on cost over time |

---

## AI Advisor

Live at [wealthifyx.com/ai](https://wealthifyx.com/ai)

The agent picks the right calculator based on your question, runs it, and explains what the number means. Session memory keeps your details across the conversation so you don't repeat yourself.

This is V1. It works. It also has rough edges — if you find one, open an issue or just tell me.

---

## Tech stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand |
| AI agent | OpenAI API + function calling |
| Package manager | pnpm |
| Deployment | Vercel |

---

## Local setup

```bash
git clone https://github.com/finovian/wealthifyx.com
cd wealthifyx.com
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [localhost:3000](http://localhost:3000)

---

## Project structure

```
wealthifyx.com/
├── app/
│   ├── page.tsx                  # Homepage
│   ├── ai/
│   │   └── page.tsx              # AI advisor chat
│   ├── api/
│   │   └── agent/
│   │       └── route.ts          # Agent API endpoint
│   └── tools/                    # Individual calculator pages
├── agent/
│   ├── agent.ts                  # Claude loop + tool execution
│   └── tools.ts                  # Calculator math + tool definitions
├── components/
│   ├── tools/                    # Calculator UI components
│   └── chat/                     # Chat interface components
├── constants/                    # Calculator formulas (pure functions)
└── lib/
    └── analytics.ts
```

---

## Status

V1 — live and working. Actively improving.

Things that work: all 8 calculators, AI advisor, session memory, mobile layout.

Things still rough: the agent sometimes asks too many follow-up questions before calculating. Working on it.

---

## Related

[Finovian](https://finovian.com) — semiconductor and AI infrastructure analysis with a public track record. Built on Astro.

---

## License

MIT
