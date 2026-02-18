import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        assetsInlineLimit: 0,
        rollupOptions: {
            output: {
                manualChunks: undefined,
                assetFileNames: function (assetInfo) {
                    if (assetInfo.name === 'main') {
                        return "assets/[name].[hash][extname]";
                    }
                    return "assets/[name].[extname]";
                }
            }
        }
    },
    base: './',
});
