# GA4 Key Event Recommendations

This document outlines the recommended GA4 events to be marked as "Key Events" (formerly "Conversions"). Marking an event as a key event allows it to be used for attribution modeling and bidding optimization in Google Ads, and it signals that the event represents a significant action or milestone in the user journey.

The strategy here is to focus on high-signal events that represent true product usage and value delivery, rather than vanity metrics.

---

### Recommended Key Events for the SIP Calculator

The following events from the `useToolAnalytics` hook should be configured as Key Events in your Google Analytics 4 property.

1.  **`real_user_engaged`**
    *   **Why:** This is the foundational event for data quality. It provides a high-fidelity signal that the user is a real human, not a bot or a passive scraper. By using this as a key event, you can measure the quality of your traffic sources based on their ability to attract genuine users who interact meaningfully with your site. It answers the question: "Are we attracting real people?"

2.  **`tool_explore`**
    *   **Why:** This event marks the beginning of a user's journey with a specific tool. It's the top of the funnel for product engagement. Marking it as a key event helps you understand which marketing channels are most effective at driving users to your core product offerings.

3.  **`input_started`**
    *   **Why:** This event signifies that a user has moved from passive viewing to active engagement. They are showing clear intent to use the calculator. It's a critical early indicator of engagement and a good predictor of whether a user will complete the funnel.

4.  **`input_completed`**
    *   **Why:** This is a major milestone. The user has provided all the necessary information to get value from the tool. It demonstrates a high level of commitment and is a strong signal that they are about to perform the primary action (calculation).

5.  **`tool_calculate`**
    *   **Why:** **This is the most important key event in the tool's funnel.** It represents the "conversion" moment where the user successfully uses the tool to get the answer they were looking for. All optimization efforts should ultimately be aimed at increasing the volume and rate of this event.

6.  **`tool_result_viewed`**
    *   **Why:** This event closes the loop. It confirms that the value promised by the calculator was delivered and actually seen by the user. Without this, you can't be sure if the user saw the result of their calculation. It validates the successful completion of the user's primary goal.

7.  **`tool_completed`**
    *   **Why:** This event represents a "power user" signal. The user not only calculated and viewed the result but also engaged with it further (e.g., by scrolling to analyze the details). This indicates a high level of satisfaction and interest, making it a valuable signal for identifying your most engaged user segment.

### Events to NOT Mark as Key Events

*   **`cta_click_primary` / `cta_click_secondary`**: While these are important interaction events, they are downstream from the core `tool_calculate` event. Marking them as key events could lead to double-counting conversions or diluting the importance of the main `tool_calculate` action. They are better analyzed as secondary metrics in custom reports to understand post-calculation behavior.

By focusing on this curated set of key events, you can build a robust analytics framework that measures true product engagement, enables powerful funnel analysis, and provides clear signals for optimizing user acquisition and on-site experience.
