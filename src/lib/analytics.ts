let amplitudeClient: any = null;

// Amplitude is optional for now - not installed in dependencies
try {
  const amplitude = require("amplitude");
  amplitudeClient =
    process.env.NEXT_PUBLIC_AMPLITUDE_KEY
      ? new amplitude.Amplitude(process.env.NEXT_PUBLIC_AMPLITUDE_KEY)
      : null;
} catch (error) {
  // Amplitude not available, tracking will be no-op
}

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
  if (!amplitudeClient) {
    console.warn("Amplitude not configured");
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
  if (!amplitudeClient) {
    console.warn("Amplitude not configured");
    return;
  }

  try {
    amplitudeClient.setUserProperties(userId, properties);
  } catch (error) {
    console.error("Error setting user properties:", error);
  }
}
