export function useAnalytics() {
  const trackEvent = (eventName: string, properties?: any) => {
    console.log('Event:', eventName, properties);
  };

  return { trackEvent };
}
