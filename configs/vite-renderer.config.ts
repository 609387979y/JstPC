import { join } from "path";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path"

const env = loadEnv(process.env.NODE_ENV, resolve(__dirname, "./"));

// console.log('version',pkg.version)
// https://vitejs.dev/config/
export default defineConfig({
  mode: process.env.NODE_ENV,
  envDir: resolve(__dirname, "./"),
  root: join(__dirname, "../src/renderer"),
  plugins: [
    vue(),
    vueJsx()
  ],
  base: "./",
  build: {
    emptyOutDir: true,
    minify: false,
    outDir: "../../dist/renderer",

  },
  server: {
    host: env.VITE_DEV_HOST,
    port: env.VITE_DEV_PORT as unknown as number,
    proxy: {
      "/api": {
        target: env.VITE_AXIOS_HOST,
        secure: false,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "../src/renderer/src"),
      "@share": resolve(__dirname, "../src/share")
    },
  },
  css: {
    preprocessorOptions: {

    },
  },
});
