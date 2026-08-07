import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss()
  ],
  base: '/project_NN_Lab/',
  build: {
    rollupOptions: {
      input: {
        main: `${projectRoot}index.html`,
        fileManager: `${projectRoot}fileManager.html`,
      },
    },
  },
})
