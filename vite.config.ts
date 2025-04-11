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
      "/yahoo-finance": {
        target: "https://finance.yahoo.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/yahoo-finance/, ""),
        secure: false,
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
    // Improved Polyfills for Node.js process global
    "process.env": JSON.stringify({}),
    "process.browser": true,
    "process.version": JSON.stringify("16.14.0"),
    // Properly define process.nextTick as a function (not wrapped in JSON.stringify)
    "process.nextTick": "function(cb) { return setTimeout(cb, 0); }",
    // Add URLSearchParams polyfill - properly defined as constructor functions
    "global.URLSearchParams":
      "(typeof window !== 'undefined' && window.URLSearchParams) || URLSearchParams",
    URLSearchParams:
      "(typeof window !== 'undefined' && window.URLSearchParams) || URLSearchParams",
    URLSearchParams2:
      "(typeof window !== 'undefined' && window.URLSearchParams) || URLSearchParams",
    global: "(typeof window !== 'undefined' ? window : global)",
  },
}));
