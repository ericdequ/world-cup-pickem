import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export so the app can be wrapped natively with Capacitor (iOS/Android).
  // Keeps everything client-side — no server runtime needed.
  output: "export",
  images: { unoptimized: true },
  // Helps static hosting + the Capacitor WebView resolve routes as directories.
  trailingSlash: true,
};

export default nextConfig;
