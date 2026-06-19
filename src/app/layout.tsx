import type { Metadata, Viewport } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HamburgerMenu from "@/components/HamburgerMenu";
import InitFlow from "@/components/InitFlow";
import FcmInit from "@/components/FcmInit";

const mPlusRounded = M_PLUS_Rounded_1c({
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
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
  themeColor: "#3B82F6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={mPlusRounded.className}>
        <AppProvider>
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
