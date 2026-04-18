// Vercel deployment config — disables Cloudflare adapter, uses Vercel/Nitro preset
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Disable the built-in Cloudflare Workers plugin so Vercel can handle SSR
  cloudflare: false,
  tanstackStart: {
    // Use the Vercel server preset via Nitro
    server: {
      preset: "vercel",
    },
  },
  vite: {
    build: {
      // Raise chunk size warning threshold to suppress large bundle warnings
      chunkSizeWarningLimit: 600,
    },
  },
});
