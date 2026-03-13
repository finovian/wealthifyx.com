export const faqs = [
  {
    q: "What is a capital gains tax calculator?",
    a: "A capital gains tax calculator estimates how much federal tax you owe on profits from selling an investment — stock, ETF, mutual fund, or other asset. You enter your purchase price, sale price, number of shares, how long you held the asset, your filing status, and your annual income. The calculator applies the correct 2024 IRS tax rate — either long-term (0%, 15%, or 20%) or short-term (ordinary income rates) — and shows your estimated tax bill, effective rate, and net profit after tax.",
  },
  {
    q: "What is the difference between short-term and long-term capital gains?",
    a: "The IRS taxes capital gains differently based on how long you held the asset. If you sell within one year of buying, the profit is a short-term capital gain — taxed at your ordinary income rate, which ranges from 10% to 37% in 2024. If you hold for more than one year, it's a long-term capital gain — taxed at 0%, 15%, or 20%, depending on your income. Holding an investment for just one day past the one-year mark can cut your tax rate in half or more.",
  },
  {
    q: "What are the 2024 long-term capital gains tax rates?",
    a: "For 2024, long-term capital gains are taxed at 0%, 15%, or 20% based on your taxable income. For single filers: 0% on income up to $47,025, 15% up to $518,900, and 20% above that. For married filing jointly: 0% up to $94,050, 15% up to $583,750, and 20% above. These thresholds apply to your total income including the gain — your ordinary income fills the brackets first, and the gain is stacked on top.",
  },
  {
    q: "What is the Net Investment Income Tax (NIIT)?",
    a: "The Net Investment Income Tax is an additional 3.8% federal tax on investment income — including capital gains — for higher-income taxpayers. It applies to the lesser of your net investment income or the amount your modified adjusted gross income (MAGI) exceeds the threshold. The thresholds for 2024 are $200,000 for single filers and $250,000 for married filing jointly. If your total income including the gain crosses these levels, a portion of your gain faces this extra 3.8% on top of the regular capital gains rate.",
  },
  {
    q: "Does this calculator include state capital gains tax?",
    a: "Yes — you can enter your state tax rate as a flat percentage and the calculator adds it to your total. State capital gains tax rates vary significantly: California taxes all gains as ordinary income (up to 13.3%), while states like Texas and Florida have no state income tax at all. Most states that do tax capital gains use your state ordinary income rate, though a few offer preferential rates. Look up your specific state rate and enter it in the state tax field for a complete picture.",
  },
  {
    q: "Can I use capital losses to offset capital gains?",
    a: "Yes — capital losses directly reduce your taxable capital gains dollar for dollar. If you have a $30,000 gain and a $10,000 loss from another sale in the same year, you only owe tax on the $20,000 net gain. If your total losses exceed your gains, you can deduct up to $3,000 of the remaining net loss against ordinary income per year, and carry forward any excess to future years. This calculator estimates tax on a single transaction — for tax-loss harvesting scenarios, consult a tax professional.",
  },
  {
    q: "What counts as the cost basis of an investment?",
    a: "Your cost basis is generally what you paid for the investment, including any commissions or fees paid at purchase. For stocks received as gifts or inheritance, the basis calculation is different. For stocks split or acquired through a dividend reinvestment plan (DRIP), each purchase lot has its own basis and purchase date. This calculator assumes a simple purchase at a single price — for complex basis situations involving multiple lots, use a tax professional or your broker's cost basis tools.",
  },
];

export const relatedTools = [
  {
    name: "Investment Calculator",
    desc: "Project long-term portfolio growth with custom return rates",
    href: "/tools/investment-calculator",
  },
  {
    name: "Options Profit Calculator",
    desc: "Calculate profit, loss, and max risk on options trades",
    href: "/tools/options-profit-calculator",
  },
  {
    name: "Dividend Calculator",
    desc: "Estimate dividend income and DRIP growth from any portfolio",
    href: "/tools/dividend-calculator",
  },
  {
    name: "Roth IRA Calculator",
    desc: "Project tax-free retirement growth with IRS contribution limits",
    href: "/tools/roth-ira-calculator",
  },
];