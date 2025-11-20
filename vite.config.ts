import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Cast process to any to avoid TS error: Property 'cwd' does not exist on type 'Process'
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    // Base './' ensures assets are linked relatively, fixing 404s on GitHub Pages sub-paths
    base: './',
    define: {
      // polyfill process.env for the app
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY),
      // Prevent crash if libs check process.env
      'process.env': {},
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    }
  };
});