/** @type {import('vite').UserConfig} */
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5000,
    host: "0.0.0.0",
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
