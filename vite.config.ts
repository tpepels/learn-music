import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/learn-music/" : "/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "audio-vendor": ["tone"],
          "music-vendor": ["tonal"],
          "state-vendor": ["zustand"],
          "validation-vendor": ["zod"],
        },
      },
    },
  },
}));
