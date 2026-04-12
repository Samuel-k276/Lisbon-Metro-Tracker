import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    open: true,
  },
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
  build: {
    target: "es2022",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react-router') || id.includes('node_modules/react/')) {
            return 'react';
          }
          if (id.includes('node_modules/konva') || id.includes('node_modules/react-konva')) {
            return 'konva';
          }
        },
      },
    },
  },
});
