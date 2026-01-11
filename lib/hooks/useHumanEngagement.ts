// lib/hooks/useHumanEngagement.ts

import { useEffect } from 'react';
import { event as trackEvent } from '@/lib/analytics';

const ENGAGEMENT_EVENT_NAME = 'real_user_engaged';
const SESSION_STORAGE_KEY = 'has_user_engaged';

// List of interaction events that signal human engagement.
const INTERACTION_EVENTS: (keyof DocumentEventMap)[] = ['scroll', 'keydown', 'click'];

/**
 * A hook to detect and report genuine human engagement once per session.
 *
 * This hook implements a lightweight and performance-first strategy to distinguish
 * real users from bots or passive scrapers. It fires a single 'real_user_engaged'
 * event per browser session based on a set of common user interactions.
 *
 * Why this event is important:
 * - Data Quality: It provides a strong, high-fidelity signal that a real human is
 *   interacting with the page, helping to filter out bot traffic from analytics.
 * - Key Metric: In GA4, 'real_user_engaged' can be configured as a key event to
 *   measure the quality of traffic sources and user acquisition channels.
 *
 * How it works:
 * 1. It checks session storage to ensure the event is fired only once per session.
 * 2. It sets up listeners for scroll, keyboard, and click events.
 * 3. It also sets a 5-second timer. If the user stays on the page for 5 seconds,
 *    it's considered a meaningful engagement.
 * 4. Once any of these conditions are met, it fires the GA4 event and immediately
 *    cleans up all listeners to minimize performance overhead.
 * 5. The hook runs exclusively on the client-side.
 */
export const useHumanEngagement = (): void => {
  useEffect(() => {
    // This hook should only run in the browser.
    if (typeof window === 'undefined') {
      return;
    }

    // Check if the user has already been marked as engaged during this session.
    if (sessionStorage.getItem(SESSION_STORAGE_KEY)) {
      return;
    }

    let hasEngaged = false;

    // The function that handles the engagement event.
    const handleEngagement = () => {
      // Prevent this from running more than once.
      if (hasEngaged) {
        return;
      }
      hasEngaged = true;

      // Mark the user as engaged for the current session.
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');

      // Fire the GA4 event.
      trackEvent(ENGAGEMENT_EVENT_NAME);

      // Clean up all listeners immediately after firing the event.
      INTERACTION_EVENTS.forEach(eventName => {
        document.removeEventListener(eventName, handleEngagement);
      });
      // No need to clear the timeout here as it will be cleared in the cleanup function.
    };

    // Set a timer to fire the event after 5 seconds of dwell time.
    const dwellTimer = setTimeout(handleEngagement, 5000);

    // Add event listeners for direct user interactions.
    INTERACTION_EVENTS.forEach(eventName => {
      document.addEventListener(eventName, handleEngagement, { passive: true });
    });

    // The cleanup function is critical for performance and to prevent memory leaks.
    // It runs when the component unmounts.
    return () => {
      clearTimeout(dwellTimer);
      // Ensure all listeners are removed, even if the engagement event was not fired.
      if (!hasEngaged) {
        INTERACTION_EVENTS.forEach(eventName => {
          document.removeEventListener(eventName, handleEngagement);
        });
      }
    };
  }, []); // The empty dependency array ensures this effect runs only once on mount.
};
