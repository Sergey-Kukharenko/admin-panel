import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';
import svgLoader from 'vite-svg-loader';

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    svgLoader({
      defaultImport: 'url',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Настройка прокси-сервера Vite
  server: {
    proxy: {
      '/api': {
        target: 'https://mico.team',
        changeOrigin: true,
        secure: false,
        // ХАК ДЛЯ СЕССИОННЫХ КУК: заставляем Vite переписывать домен куки на localhost
        cookieDomainRewrite: 'localhost',
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            // Если бэк присылает куку с флагом Secure, удаляем его, иначе http://localhost её заблокирует
            const setCookie = proxyRes.headers['set-cookie'];
            if (setCookie) {
              proxyRes.headers['set-cookie'] = setCookie.map((cookie) =>
                cookie.replace(/;\s*Secure/gi, ''),
              );
            }
          });
        },
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
