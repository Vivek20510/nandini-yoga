// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/nandini-yoga/', // 👈 Set to your GitHub repo name
  plugins: [react()],
});
