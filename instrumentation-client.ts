import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.2,
  integrations: [
    Sentry.browserTracingIntegration(),
  ],
  enabled: process.env.NODE_ENV === "production",
});

export function onRouterTransitionStart(url: string) {
  Sentry.addBreadcrumb({
    category: "navigation",
    message: `Navigated to ${url}`,
    level: "info",
  });
}