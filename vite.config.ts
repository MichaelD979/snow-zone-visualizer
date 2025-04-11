import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
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
    // Add URLSearchParams polyfill
    "global.URLSearchParams": "window.URLSearchParams",
    URLSearchParams: "window.URLSearchParams",
    URLSearchParams2: "window.URLSearchParams",
    global: "window",
  },
}));
