import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    
    // Build optimizations
    build: {
      target: 'es2015',
      minify: 'esbuild',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['framer-motion', 'lucide-react'],
            forms: ['react-hook-form', '@hookform/resolvers'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    
    // Optimization
    optimizeDeps: {
      exclude: ['lucide-react'],
      include: ['react', 'react-dom', 'axios'],
    },
    
    // Path resolution
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@services': resolve(__dirname, 'src/services'),
        '@config': resolve(__dirname, 'src/config'),
        '@pages': resolve(__dirname, 'src/pages'),
        '@contexts': resolve(__dirname, 'src/contexts'),
      },
    },
    
    // Development server
    server: {
      port: 5173,
      host: true,
      open: true,
      cors: true,
    },
    
    // Preview server (for testing production build)
    preview: {
      port: 3000,
      host: true,
      cors: true,
    },
    
    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    
    // PWA configuration (future enhancement)
    // You can add PWA plugin here if needed
  };
});
