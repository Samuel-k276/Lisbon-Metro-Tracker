import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/spec/*.spec.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: [
        'src/features/**/*.{ts,tsx}',
        'src/layout/**/*.{ts,tsx}',
        'src/shared/utils/**/*.ts',
        'src/shared/hooks/**/*.ts',
        'src/shared/contexts/**/*.tsx',
        'src/shared/components/**/*.tsx',
      ],
      exclude: [
        'src/**/spec/**',
        'src/**/*.module.scss',
        'src/shared/data/**',
        'src/shared/api/**',
        'src/shared/types/**',
        'src/shared/routes.ts',
        'src/assets/**',
      ],
      thresholds: {
        statements: 55,
        branches: 45,
        functions: 55,
        lines: 55,
      },
    },
  },
});
