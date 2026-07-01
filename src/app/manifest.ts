import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ISF — 犬山総合高等学校 文化祭アプリ",
    short_name: "ISF",
    description: "犬山総合高等学校 文化祭向け情報共有PWAアプリ",
    start_url: "/top",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1EA78C",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
