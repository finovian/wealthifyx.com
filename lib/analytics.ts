// lib/analytics.ts

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

// Safe gtag caller — no-ops if GA hasn't loaded yet
function gtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  }
}

// Track SPA page navigation on the client
export function analyticsTracker(url: string) {
  gtag('event', 'page_view', {
    page_location: url,
    page_path: url,
  });
}

// ── Calculator events ──

// Fired when user changes any input field in a calculator
export function trackCalculatorInput(params: {
  calculator_name: string;  // e.g. "compound_interest"
  field_name: string;       // e.g. "principal", "rate", "years"
  value?: number;           // optional — pass for numeric fields
}) {
  gtag('event', 'calculator_input_changed', {
    event_category: 'Calculator',
    calculator_name: params.calculator_name,
    field_name: params.field_name,
    value: params.value,
  });
}

// Fired when calculator produces a result (debounced — see usage below)
export function trackCalculatorResult(params: {
  calculator_name: string;
  final_balance?: number;   // round to nearest dollar before passing
  years?: number;
  rate?: number;
  has_contributions: boolean;
}) {
  gtag('event', 'calculator_result_generated', {
    event_category: 'Calculator',
    calculator_name: params.calculator_name,
    final_balance: params.final_balance,
    years: params.years,
    rate: params.rate,
    has_contributions: params.has_contributions,
  });
}

// Fired when user changes compounding frequency toggle
export function trackFrequencyChange(params: {
  calculator_name: string;
  frequency: 'daily' | 'monthly' | 'quarterly' | 'annually' | string;
}) {
  gtag('event', 'compounding_frequency_changed', {
    event_category: 'Calculator',
    calculator_name: params.calculator_name,
    frequency: params.frequency,
  });
}

// Fired when user clicks "View all calculators" or any related tool link
export function trackRelatedToolClick(params: {
  from_calculator: string;  // e.g. "compound_interest"
  to_calculator: string;    // e.g. "roth_ira"
  href: string;
}) {
  gtag('event', 'related_tool_clicked', {
    event_category: 'Navigation',
    from_calculator: params.from_calculator,
    to_calculator: params.to_calculator,
    href: params.href,
  });
}

// Fired when user clicks CTA buttons (Explore All Tools, etc.)
export function trackCTAClick(params: {
  cta_label: string;       // e.g. "Explore All Tools"
  cta_location: string;    // e.g. "hero", "tools_directory", "footer"
  href: string;
}) {
  gtag('event', 'cta_clicked', {
    event_category: 'Engagement',
    cta_label: params.cta_label,
    cta_location: params.cta_location,
    href: params.href,
  });
}

// Fired when user submits email capture form
export function trackEmailSignup(params: {
  location: string;  // e.g. "homepage_email_capture", "tool_page"
}) {
  gtag('event', 'email_signup', {
    event_category: 'Conversion',
    location: params.location,
  });
}

// Fired when user clicks any tool card (homepage or /tools page)
export function trackToolCardClick(params: {
  tool_name: string;   // e.g. "compound_interest_calculator"
  from_page: string;   // e.g. "homepage", "tools_directory"
}) {
  gtag('event', 'tool_card_clicked', {
    event_category: 'Navigation',
    tool_name: params.tool_name,
    from_page: params.from_page,
  });
}

// Utility for debouncing events
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
