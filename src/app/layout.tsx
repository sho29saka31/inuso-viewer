import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import Header from "@/components/Header";
import HeaderGuideBar from "@/components/HeaderGuideBar";
import Footer from "@/components/Footer";
import HamburgerMenu from "@/components/HamburgerMenu";
import InitFlow from "@/components/InitFlow";
import FcmInit from "@/components/FcmInit";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { getViewerFeatures } from "@/lib/feature-flags";
import MaintenancePage from "@/app/MaintenancePage";
import RouteRefresh from "@/components/RouteRefresh";

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
  maximumScale: 5,
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
          <MaintenancePage />
        </body>
      </html>
    );
  }

  return (
    <html lang="ja">
      <body className={mPlusRounded.className}>
        {/* beforeinstallprompt はハイドレーション前に発火し得るため、最速で捕捉して退避する */}
        <Script id="pwa-install-capture" strategy="beforeInteractive">
          {
            "window.__pwaInstallPrompt=null;" +
            "window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__pwaInstallPrompt=e;});" +
            "window.addEventListener('appinstalled',function(){window.__pwaInstallPrompt=null;});"
          }
        </Script>
        <AppProvider features={features}>
          <RouteRefresh />
          <GoogleAnalytics />
          <InitFlow />
          <FcmInit />
          <Header />
          <HeaderGuideBar />
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
