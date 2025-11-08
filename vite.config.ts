import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss()],
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      global: "globalThis",
    },
  },
});
