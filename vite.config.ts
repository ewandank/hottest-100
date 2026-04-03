import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import solidPlugin from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({ target: "solid", autoCodeSplitting: true }),
    solidPlugin(),
    tailwindcss(),
  ],
  server: {
    // Spotify api no longer allows localhost for some reason.
    host: "127.0.0.1",
  },
});
