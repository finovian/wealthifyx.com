// lib/hooks/useToolAnalytics.ts

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { event as trackEvent } from '@/lib/analytics';

const TOOL_NAME = 'sip_calculator';

// A record to keep track of which one-time events have been fired.
const firedEvents = new Set<string>();

/**
 * A specialized hook for tracking user interactions within a specific tool.
 *
 * This hook encapsulates all the analytics logic for the SIP Calculator, providing
 * a clean and declarative API for the component to use. It handles the user's
 * journey through the tool, from exploration to completion.
 *
 * Why this is important:
 * - Funnel Analysis: It creates a clear event funnel (explore -> start -> complete -> result)
 *   that can be used in GA4 to analyze user drop-off and conversion rates.
 * - Component-Specific Logic: By isolating the analytics logic here, the main
 *   React component remains clean and focused on its primary responsibility: rendering UI.
 * - Scalability: This pattern can be easily adapted for other tools on the site.
 *
 * @returns A set of memoized callback functions to track different stages of tool interaction.
 */
export const useToolAnalytics = () => {
  const pathname = usePathname();
  const inputStartedFired = useRef(false);

  // Base parameters included with every event for this tool.
  const baseEventParams = {
    tool_name: TOOL_NAME,
    route: pathname,
  };

  /**
   * Fires when the user first lands on the tool page.
   * This is the entry point of the user's journey with the tool.
   *
   * GA4 Key Event: Yes. This signals the start of a user journey with a core product feature.
   */
  useEffect(() => {
    trackEvent('tool_explore', baseEventParams);
  }, [pathname]); // Fires once when the page loads or pathname changes.

  /**
   * Fires exactly once when a user focuses on any required input field.
   * This indicates the user has started to engage with the tool's core function.
   *
   * GA4 Key Event: Yes. It's a high-intent signal that the user is beginning to use the tool.
   */
  const trackInputStart = useCallback(() => {
    if (!inputStartedFired.current) {
      trackEvent('input_started', baseEventParams);
      inputStartedFired.current = true;
    }
  }, [baseEventParams]);

  /**
   * Fires when all required input fields are filled for the first time.
   * This signals the user is ready to see a result.
   *
   * GA4 Key Event: Yes. This is a critical milestone before calculation.
   */
  const trackInputCompleted = useCallback(() => {
    if (!firedEvents.has('input_completed')) {
      trackEvent('input_completed', baseEventParams);
      firedEvents.add('input_completed');
    }
  }, [baseEventParams]);

  /**
   * Fires when the "Calculate" button is clicked.
   * This is the primary conversion action of the tool.
   *
   * GA4 Key Event: Yes, absolutely. This is the single most important action.
   */
  const trackCalculate = useCallback(() => {
    trackEvent('tool_calculate', baseEventParams);
  }, [baseEventParams]);

  /**
   * Fires when the results section becomes visible to the user.
   * Uses IntersectionObserver for performance.
   *
   * GA4 Key Event: Yes. It confirms the user has seen the value they were looking for.
   */
  const trackResultViewed = useCallback(() => {
    if (!firedEvents.has('tool_result_viewed')) {
      trackEvent('tool_result_viewed', baseEventParams);
      firedEvents.add('tool_result_viewed');
    }
  }, [baseEventParams]);

  /**
   * Fires when the user meaningfully interacts with the results.
   * This could be scrolling the results, clicking a CTA, or dwelling.
   *
   * GA4 Key Event: Yes. This signals the user is engaging with the output, completing the loop.
   */
  const trackToolCompleted = useCallback(() => {
    if (!firedEvents.has('tool_completed')) {
      trackEvent('tool_completed', baseEventParams);
      firedEvents.add('tool_completed');
    }
  }, [baseEventParams]);

  /**
   * Tracks high-intent primary CTA clicks (e.g., Download, Compare).
   */
  const trackCtaClickPrimary = useCallback((cta_name: string) => {
    trackEvent('cta_click_primary', { ...baseEventParams, cta_name });
  }, [baseEventParams]);

  /**
   * Tracks secondary CTA clicks (e.g., Explore another tool).
   */
  const trackCtaClickSecondary = useCallback((cta_name: string) => {
    trackEvent('cta_click_secondary', { ...baseEventParams, cta_name });
  }, [baseEventParams]);

  return {
    trackInputStart,
    trackInputCompleted,
    trackCalculate,
    trackResultViewed,
    trackToolCompleted,
    trackCtaClickPrimary,
    trackCtaClickSecondary,
  };
};
