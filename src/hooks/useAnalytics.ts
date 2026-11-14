"use client";

import { useCallback } from "react";
import type { AmplitudeEvent } from "@/lib/analytics";

export function useAnalytics() {
  const trackEvent = useCallback(
    async (
      eventName: AmplitudeEvent,
      eventProperties?: Record<string, any>
    ) => {
      if (!process.env.NEXT_PUBLIC_AMPLITUDE_KEY) {
        console.warn("Amplitude key not configured");
        return;
      }

      try {
        const response = await fetch("/api/analytics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventName,
            eventProperties,
          }),
        });

        if (!response.ok) {
          console.error("Failed to track event");
        }
      } catch (error) {
        console.error("Error tracking event:", error);
      }
    },
    []
  );

  return { trackEvent };
}
