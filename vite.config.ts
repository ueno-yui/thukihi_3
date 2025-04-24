// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/tsukihi/', // リポジトリ名に合わせて設定
  plugins: [react()],
});