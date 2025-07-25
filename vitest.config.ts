import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import {loadEnv} from "vite";
import {fileURLToPath, URL} from "node:url";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());
    return {
        plugins: [
            vue()
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        base: env.VITE_ROOT_PATH || '/',
        test: {
            globals: true,
            environment: 'jsdom',
            coverage: {
                provider: 'v8',
                reporter: ['text', 'json', 'html', 'lcov'],
                reportsDirectory: './coverage',
                exclude: [
                    'node_modules/',
                    'dist/',
                    '**/*.d.ts',
                    '**/*.test.ts',
                    '**/*.config.ts',
                    'coverage/**',
                    '**/env.*'
                ]
            }
        }
    };
});