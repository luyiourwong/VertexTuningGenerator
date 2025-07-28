import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ToolEditor from '@/components/ToolEditor.vue'
import {Tool, Type} from "@google/genai"

describe('ToolEditor.vue', () => {
    it('初始渲染測試', () => {
        const wrapper = mount(ToolEditor, {
            props: {
                modelValue: [
                    {
                        functionDeclarations: [
                            {
                                name: "test",
                                description: "test",
                                parameters: {
                                    type: Type.OBJECT,
                                    properties: {
                                        property1: {
                                            type: Type.STRING,
                                            description: "test"
                                        },
                                        property2: {
                                            type: Type.STRING,
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
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

    it('删除工具测试', async () => {
        const wrapper = mount(ToolEditor, {
            props: {
                modelValue: [{
                    functionDeclarations: [{
                        name: "test",
                        description: "test",
                        parameters: {
                            type: Type.OBJECT,
                            properties: {}
                        }
                    }]
                }],
                'onUpdate:modelValue': (e: Tool[]) => wrapper.setProps({ modelValue: e })
            }
        })

        const deleteButton = wrapper.find('button.text-red-600')
        await deleteButton.trigger('click')

        const tools = wrapper.props('modelValue') as Tool[]
        expect(tools).toHaveLength(0)
    })

    it('添加属性测试', async () => {
        const wrapper = mount(ToolEditor, {
            props: {
                modelValue: [{
                    functionDeclarations: [{
                        name: "test",
                        description: "test",
                        parameters: {
                            type: Type.OBJECT,
                            properties: {}
                        }
                    }]
                }],
                'onUpdate:modelValue': (e: Tool[]) => wrapper.setProps({ modelValue: e })
            }
        })

        const addPropertyButton = wrapper.find('button.bg-green-600')
        await addPropertyButton.trigger('click')

        const tools = wrapper.props('modelValue') as Tool[]
        expect(tools).toHaveLength(1)
    })

    it('删除属性测试', async () => {
        const wrapper = mount(ToolEditor, {
            props: {
                modelValue: [{
                    functionDeclarations: [{
                        name: "test",
                        description: "test",
                        parameters: {
                            type: Type.OBJECT,
                            properties: {
                                property1: {
                                    type: Type.STRING,
                                    description: "test"
                                }
                            }
                        }
                    }]
                }],
                'onUpdate:modelValue': (e: Tool[]) => wrapper.setProps({ modelValue: e })
            }
        })

        const deletePropertyButton = wrapper.find('.text-red-700')
        await deletePropertyButton.trigger('click')

        const tools = wrapper.props('modelValue') as Tool[]
        expect(tools).toHaveLength(1)
    })

    it('更新属性名称测试', async () => {
        const wrapper = mount(ToolEditor, {
            props: {
                modelValue: [{
                    functionDeclarations: [{
                        name: "test",
                        description: "test",
                        parameters: {
                            type: Type.OBJECT,
                            properties: {
                                property1: {
                                    type: Type.STRING,
                                    description: "test"
                                }
                            }
                        }
                    }]
                }],
                'onUpdate:modelValue': (e: Tool[]) => wrapper.setProps({ modelValue: e })
            }
        })

        const propertyNameInput = wrapper.find('input[placeholder="Property name"]')
        await propertyNameInput.setValue('newPropertyName')

        const tools = wrapper.props('modelValue') as Tool[]
        expect(tools).toHaveLength(1)
    })
})