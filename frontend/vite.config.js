import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_TARGET || "http://127.0.0.1:8080";

  return {
    plugins: [react(), tailwindcss()],
    server: {
      watch: {
        usePolling: true,
      },
      proxy: {
        "/oauth2": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        "/login": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        "/logout": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.js"],
      globals: true,
      css: true,
    },
  };
});
