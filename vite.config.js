/**
 * vite 配置文件
 */
import { loadEnv } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import PurgeIcons from 'vite-plugin-purge-icons';
import viteCompression from 'vite-plugin-compression';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

// https://vitejs.dev/config/
export default (command, mode) => {
  const env = loadEnv(mode, __dirname, 'SHEEP_');
  
  return {
    base: './',
    envPrefix: 'SHEEP_',
    plugins: [
      vue(),
      vueJsx(),
      viteCompression({ verbose: false }),
      createSvgIconsPlugin({
        iconDirs: [resolve(__dirname, './src/assets/svg')],
        symbolId: 'sa-[dir]-[name]',
      }),
      PurgeIcons(),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {},
      },
    },
    server: {
      host: true,
      open: true,
      port: env.SHEEP_DEV_PORT,
      hmr: {
        overlay: true,
      },
    },
    build: {
      chunkSizeWarningLimit: 2000,
      sourcemap: false,
    },
    preview: {
      port: env.SHEEP_PREVIEW_PORT,
    },
  };
};
