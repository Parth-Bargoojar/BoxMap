import type { Config } from "tailwindcss";

/**
 * Tailwind v4 does NOT auto-load this file — it resolves the theme from the
 * `@theme` block in `app/globals.css` (verified: tokens defined only here
 * produce no CSS). Design tokens, colours, radii, fonts and the glass
 * utilities all live in `app/globals.css`.
 *
 * This file is kept only so tooling that expects a Tailwind config to exist
 * (editor plugins, prettier-plugin-tailwindcss) can resolve one. Adding
 * tokens here has no effect on the build.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
