import { describe, it, expect } from 'vitest'
import {mount} from '@vue/test-utils'
import App from '@/App.vue'

describe('App', () => {
    it('Should mount all', () => {
        const wrapper = mount(App)

        expect(wrapper.find('div')).toBeTruthy()
    })
})