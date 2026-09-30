import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// These two headers make the page "cross-origin isolated", which enables
// SharedArrayBuffer. We need it for Python's input() and for stopping infinite loops.
const isolationHeaders = {
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
};

export default defineConfig({
  // Relative asset paths: the same build works on GitHub Pages (/codepath/), Vercel (/) or locally.
  base: "./",
  plugins: [react(), tailwindcss()],
  server: { headers: isolationHeaders },
  preview: { headers: isolationHeaders },
  worker: { format: "es" },
  optimizeDeps: { exclude: ["pyodide"] },
});
