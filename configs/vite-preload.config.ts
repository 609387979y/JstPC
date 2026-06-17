import { join } from 'path'
import { builtinModules } from 'module'
import { defineConfig } from 'vite'
import { resolve } from "path";

export default defineConfig({
  mode: process.env.NODE_ENV,
  root: join(__dirname, '../src/preload'),
  envDir:resolve(__dirname, './'),
  build: {
    outDir: '../../dist/preload',
    lib: {
      entry: 'index.ts',
      formats: ['cjs'],
    },
    sourcemap: false,
    minify: false,
    emptyOutDir: true,
    rollupOptions: {
      external: [
        ...builtinModules,
        'electron',
        "@electron/remote"
      ],
      output: {
        entryFileNames: '[name].cjs',
      },
    },
  },
  resolve: {
    alias: {
      // preload 作为中间层 可以访问多个环境
      "@main": resolve(__dirname, '../src/main'),
      "@pre": resolve(__dirname, "../src/preload"),
      "@share": resolve(__dirname, "../src/share"),
    },
  },
})
