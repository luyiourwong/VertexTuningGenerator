import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ToolEditor from '@/components/ToolEditor.vue'
import type { Tool } from "@google/genai"

describe('ToolEditor.vue', () => {
    it('初始渲染測試', () => {
        const wrapper = mount(ToolEditor, {
            props: {
                modelValue: []
            }
        })
        expect(wrapper.exists()).toBe(true)
        expect(wrapper.find('button').text()).toContain('Switch to Raw mode')
    });

    it('添加工具按鈕功能測試', async () => {
        const wrapper = mount(ToolEditor, {
            props: {
                'modelValue': [],
                'onUpdate:modelValue': (e: Tool[]) => wrapper.setProps({ modelValue: e })
            }
        })

        const addButton = wrapper.find('button.bg-emerald-600')
        await addButton.trigger('click')

        const tools = wrapper.props('modelValue') as Tool[]
        expect(tools).toHaveLength(1)
    });

    it('切換視圖模式測試', async () => {
        const wrapper = mount(ToolEditor, {
            props: {
                modelValue: []
            }
        })

        const switchButton = wrapper.find('button')
        await switchButton.trigger('click')
        expect(wrapper.find('textarea').exists()).toBe(true)

        await switchButton.trigger('click')
        expect(wrapper.find('textarea').exists()).toBe(false)
    });
})