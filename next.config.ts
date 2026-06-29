import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  serverExternalPackages: ["firebase-admin", "@google-cloud/firestore"],
  async redirects() {
    return [
      {
        source: "/",
        destination: "/top",
        permanent: false,
      },
    ];
  },
};

// 本番デプロイ時のみSentryソースマップをアップロード（プレビューはスキップして高速化）
const isProduction = process.env.VERCEL_ENV === "production";

export default withSentryConfig(nextConfig, {
  org: "isf-webapp",
  project: "viewer",
  silent: !process.env.CI,
  widenClientFileUpload: false,
  // プレビュー・開発時はソースマップアップロードをスキップ
  sourcemaps: { disable: !isProduction },

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
