/// <reference types='vitest' />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/api',
  resolve: {
    alias: {
      '@org/utils': resolve(import.meta.dirname, '../../packages/shared/utils/src/index.ts'),
    },
  },
  test: {
    name: '@org/api',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
    reporters: ['default'],
  },
}));
