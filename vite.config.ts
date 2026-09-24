import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/learn-music/" : "/",
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "audio-vendor",
              test: /node_modules[\\/]tone[\\/]/,
              priority: 30,
            },
            {
              name: "react-vendor",
              test: /node_modules[\\/](react|react-dom)[\\/]/,
              priority: 30,
            },
            {
              name: "validation-vendor",
              test: /node_modules[\\/]zod[\\/]/,
              priority: 30,
            },
            {
              name: "music-vendor",
              test: /node_modules[\\/]tonal[\\/]/,
              priority: 30,
            },
            {
              name: "state-vendor",
              test: /node_modules[\\/]zustand[\\/]/,
              priority: 30,
            },
            {
              name: "curriculum",
              test: /src[\\/]lessons[\\/]/,
              priority: 20,
            },
            {
              name: "learning",
              test: /src[\\/]learning[\\/]/,
              priority: 20,
            },
            {
              name: "workspaces",
              test: /src[\\/]components[\\/]/,
              priority: 20,
            },
            {
              name: "audio-app",
              test: /src[\\/]audio[\\/]/,
              priority: 20,
            },
            {
              name: "state-app",
              test: /src[\\/]state[\\/]/,
              priority: 20,
            },
            {
              name: "vendor",
              test: /node_modules/,
              maxSize: 350_000,
              priority: 10,
            },
          ],
        },
      },
    },
  },
}));
