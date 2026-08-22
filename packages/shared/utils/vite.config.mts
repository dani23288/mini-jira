/// <reference types='vitest' />
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../../node_modules/.vite/packages/shared/utils',
  test: {
    name: '@org/utils',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['test/**/*.spec.ts'],
    reporters: ['default'],
  },
}));
