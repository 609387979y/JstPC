import { join } from 'path'
import { builtinModules } from 'module'
import { defineConfig } from 'vite'
import { resolve } from "path";

export default defineConfig({
  mode: process.env.NODE_ENV,
  root: join(__dirname, '../src/main'),
  envDir:resolve(__dirname, './'),
  build: {
    outDir: '../../dist/main',
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
        'ws'
      ],
      output: {
        entryFileNames: '[name].cjs',
      },
      
    },
    
  },
  resolve: {
    alias: {
      "@main": resolve(__dirname, "../src/main"),
      "@share": resolve(__dirname, "../src/share"),
    },
  },
  
})
