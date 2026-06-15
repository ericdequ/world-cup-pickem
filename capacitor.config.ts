import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor wraps the static export (`out/`) into native iOS/Android apps.
 *
 * First-time native setup (run locally, needs Xcode / Android Studio):
 *   npm run build            # produces ./out
 *   npx cap add ios          # and / or
 *   npx cap add android
 *   npm run native:sync      # build + copy web assets into native projects
 *   npx cap open ios         # open in Xcode / Android Studio to run
 */
const config: CapacitorConfig = {
  appId: "com.worldcuppickem.app",
  appName: "World Cup Pick-Em",
  webDir: "out",
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon",
      iconColor: "#C9A84C",
    },
  },
};

export default config;
