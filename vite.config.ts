import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      // resolves import WeightForm from "@components/WeightForm"
      "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
      // resolves import logo from "@assets/logo.png"
      "@assets":     fileURLToPath(new URL("./src/assets", import.meta.url)),
      // resolves any types from "@types/..."
      "@types":      fileURLToPath(new URL("./src/types", import.meta.url))
    }
  },

  server: {
    port: 3000
  },

  build: {
    outDir: "dist"
  }
});
