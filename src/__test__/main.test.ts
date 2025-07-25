import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createApp, defineComponent } from 'vue'

// Mock Vue
vi.mock('vue', async () => {
    const actual = await vi.importActual('vue')
    return {
        ...actual,
        createApp: vi.fn(() => ({
            mount: vi.fn()
        })),
        defineComponent: vi.fn((comp) => comp),
        ref: vi.fn((x) => ({ value: x })),
        computed: vi.fn(),
        watch: vi.fn(),
        nextTick: vi.fn(),
        defineEmits: vi.fn(),
        defineProps: vi.fn()
    }
})

// Mock CSS
vi.mock('@/assets/main.css', () => ({}))

// Mock App
vi.mock('@/App.vue', () => ({
    default: defineComponent({
        name: 'App',
        template: '<div>App Component</div>'
    })
}))

describe('main.ts', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        document.body.innerHTML = '<div id="app"></div>'
    })

    it('init', async () => {
        await import('@/main.js')
        expect(createApp).toHaveBeenCalledWith(expect.any(Object))
        const mockApp = (createApp as unknown as ReturnType<typeof vi.fn>).mock.results[0].value
        expect(mockApp.mount).toHaveBeenCalledWith('#app')
    })

    it('loaded', async () => {
        const appElement = document.querySelector('#app')
        expect(appElement).not.toBeNull()
    })
})