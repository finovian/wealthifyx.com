// lib/analytics.ts

/**
 * Represents the standard parameters that can be sent with a GA4 event.
 * For a full list of reserved event names and parameters, see:
 * https://developers.google.com/analytics/devguides/collection/ga4/reference/events
 */
interface GtagEventParams {
  category?: string;
  label?: string;
  value?: number;
  non_interaction?: boolean;
  [key: string]: any;
}

/**
 * A type-safe wrapper for the Google Analytics (GA4) `gtag` function.
 *
 * This function sends a custom event to GA4. It checks for the existence of `window.gtag`
 * to prevent runtime errors in environments where the GA4 script might not be loaded,
 * such as during server-side rendering or if the script is blocked.
 *
 * @param eventName - The name of the event to track (e.g., 'cta_click').
 * @param params - An object of key-value pairs to send as event parameters.
 */
export const event = (eventName: string, params: GtagEventParams = {}): void => {
  // Only execute in the browser where the window object is available.
  if (typeof window === 'undefined') {
    return;
  }

  // Check if the gtag function is available on the window object.
  // This is crucial for preventing errors if the GA4 script is not loaded.
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  } else {
    // In a development environment, it's helpful to log a warning if gtag is not found.
    // This helps catch integration issues early.
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `GA4 event "${eventName}" was not sent because window.gtag is not defined.`,
        params
      );
    }
  }
};
