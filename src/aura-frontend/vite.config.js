import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';

// --- PERBAIKAN DIMULAI DI SINI ---
// Mendefinisikan __dirname secara manual untuk lingkungan ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- PERBAIKAN SELESAI ---

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Sekarang, __dirname sudah memiliki nilai yang benar
      // dan alias ini akan berfungsi dengan sempurna.
      "declarations": path.resolve(__dirname, "..", "..", "declarations"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
  },
});