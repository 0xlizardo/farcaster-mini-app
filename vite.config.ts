import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      /* your existing aliases… */
    }
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      external: ["@farcaster/frame-sdk"]
    }
  },
  server: {
    port: 3000
  }
});
