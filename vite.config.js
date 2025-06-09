import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  server: {
    // 添加靜態文件處理
    watch: {
      usePolling: true
    },
    port: 3000 // 預設 port 改為 3000
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  // 確保 public 目錄正確配置
  publicDir: "public",
  base: "/compTIA2025/"
});
