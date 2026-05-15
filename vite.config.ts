// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    // Only use our custom server entry for Cloudflare builds.
    // Vercel and other platforms will use the default entry.
    server: process.env.VERCEL ? undefined : { entry: "server" },
    // Explicitly set the Nitro preset for Vercel
    nitro: {
      preset: process.env.VERCEL ? "vercel" : undefined,
    },
  },
  // Disable the built-in Cloudflare plugin when building for Vercel
  cloudflare: process.env.VERCEL ? false : undefined,
});
