import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy:
      mode === "development"
        ? {
            "/api/v1": {
              target: "http://localhost:8080",
              changeOrigin: true,
            },
          }
        : undefined,
  },
}));
