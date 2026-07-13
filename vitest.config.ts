import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/features/admin/hooks/*.ts',
        'src/features/cattle/hooks.ts',
        'src/features/herdbook/hooks.ts',
        'src/features/common/hooks/*.ts',
        'src/features/passport/hooks.ts',
        'src/features/dashboard/hooks/*.ts',
        'src/lib/queryKeys.ts',
      ],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.config.ts',
        '**/types/',
        'src/main.tsx',
        'src/features/admin/services/**/*.ts',
        'src/features/cattle/services/**/*.ts',
        'src/features/cattle/exportService.ts',
        'src/features/cattle/types.ts',
        'src/features/cattle/index.ts',
        'src/features/cattle/utils/**/*.ts',
        'src/features/herdbook/services/**/*.ts',
        'src/features/common/services/**/*.ts',
        'src/features/passport/services/**/*.ts',
        'src/features/dashboard/services/**/*.ts',
      ],
      thresholds: {
        statements: 75,
        branches: 0,
        functions: 75,
        lines: 75,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
