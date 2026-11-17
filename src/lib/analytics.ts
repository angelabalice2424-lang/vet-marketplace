let amplitudeClient: any = null;

// Amplitude is optional - will be initialized at runtime if key is provided
const initAmplitude = () => {
  if (amplitudeClient || typeof window === "undefined") return;

  if (process.env.NEXT_PUBLIC_AMPLITUDE_KEY) {
    try {
      // Dynamic import at runtime only
      const amplitude = require("amplitude");
      amplitudeClient = new amplitude.Amplitude(process.env.NEXT_PUBLIC_AMPLITUDE_KEY);
    } catch (error) {
      console.warn("Amplitude initialization failed:", error);
    }
  }
};

export type AmplitudeEvent =
  | "search_clinics"
  | "booking_step_1_viewed"
  | "booking_step_2_viewed"
  | "booking_step_3_viewed"
  | "appointment_created"
  | "appointment_failed"
  | "feedback_submitted"
  | "pet_created";

export function trackEvent(
  eventName: AmplitudeEvent,
  userId?: string,
  eventProperties?: Record<string, any>
) {
  initAmplitude();
  if (!amplitudeClient) {
    return;
  }

  try {
    amplitudeClient.track({
      event_type: eventName,
      user_id: userId || "anonymous",
      event_properties: eventProperties || {},
      time: Date.now(),
    });
  } catch (error) {
    console.error("Error tracking event:", error);
  }
}

export function setUserProperties(
  userId: string,
  properties: Record<string, any>
) {
  initAmplitude();
  if (!amplitudeClient) {
    return;
  }

  try {
    amplitudeClient.setUserProperties(userId, properties);
  } catch (error) {
    console.error("Error setting user properties:", error);
  }
}
