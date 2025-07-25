import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import {fileURLToPath, URL} from "node:url";

export default defineConfig((_) => {
    return {
        plugins: [
            vue()
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
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
                    'coverage/**'
                ]
            }
        }
    };
});