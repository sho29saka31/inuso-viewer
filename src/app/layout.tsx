import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HamburgerMenu from "@/components/HamburgerMenu";
import InitFlow from "@/components/InitFlow";
import FcmInit from "@/components/FcmInit";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { getViewerFeatures } from "@/lib/feature-flags";

const mPlusRounded = localFont({
  src: [
    { path: "../../node_modules/@fontsource/m-plus-rounded-1c/files/m-plus-rounded-1c-japanese-400-normal.woff2", weight: "400" },
    { path: "../../node_modules/@fontsource/m-plus-rounded-1c/files/m-plus-rounded-1c-japanese-500-normal.woff2", weight: "500" },
    { path: "../../node_modules/@fontsource/m-plus-rounded-1c/files/m-plus-rounded-1c-japanese-700-normal.woff2", weight: "700" },
    { path: "../../node_modules/@fontsource/m-plus-rounded-1c/files/m-plus-rounded-1c-japanese-800-normal.woff2", weight: "800" },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ISF — 犬山総合高等学校 文化祭アプリ",
    template: "%s | ISF",
  },
  description: "犬山総合高等学校 文化祭向け情報共有PWAアプリ",
  icons: { icon: "/logo.png", apple: "/logo.png" },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ISF",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1EA78C",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const features = await getViewerFeatures();

  if (features.service === false) {
    return (
      <html lang="ja">
        <body className={mPlusRounded.className}>
          <div className="flex flex-col items-center justify-center min-h-dvh gap-4 px-6 text-center">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ color: "#9CA3AF" }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
            <h1 style={{ fontSize: "1.125rem", fontWeight: "700" }}>サービスは現在停止中です</h1>
            <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>しばらくお待ちください。</p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="ja">
      <body className={mPlusRounded.className}>
        <AppProvider features={features}>
          <GoogleAnalytics />
          <InitFlow />
          <FcmInit />
          <Header />
          <main className="min-h-[calc(100dvh-3.5rem-4rem)] pb-16">
            {children}
          </main>
          <Footer />
          <HamburgerMenu />
        </AppProvider>
      </body>
    </html>
  );
}
