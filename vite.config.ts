import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env": JSON.stringify({}),
    "process.browser": JSON.stringify(true),
    "process.version": JSON.stringify("16.14.0"),
    "process.nextTick": "(function(cb) { return setTimeout(cb, 0); })",
    global: "(typeof window !== 'undefined' ? window : global)",
    "global.URLSearchParams":
      "(typeof window !== 'undefined' && window.URLSearchParams) || URLSearchParams",
    URLSearchParams:
      "(typeof window !== 'undefined' && window.URLSearchParams) || URLSearchParams",
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      external: ["yahoo-finance2"],
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
}));
