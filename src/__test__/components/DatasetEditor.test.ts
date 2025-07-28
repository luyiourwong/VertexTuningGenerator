import {describe, expect, it} from 'vitest'
import {mount} from '@vue/test-utils'
import DatasetEditor from '@/components/DatasetEditor.vue'
import type {Dataset} from '@/types/dataset'
import {Tool, Type} from "@google/genai"

describe('DatasetEditor.vue', () => {
    it('初始渲染測試', () => {
        const mockDataset: Dataset = {
            id: '1',
            contents: [
                {
                    role: 'user',
                    parts: [
                        {
                            text: 'test content'
                        }
                    ]
                },
                {
                    role: 'model',
                    parts: [
                        {
                            functionCall: {
                                name: 'test',
                                args: {
                                    property1: '12333',
                                    property2: '12331'
                                }
                            }
                        }
                    ]
                },
                {
                    parts: [
                        {
                            functionResponse: {
                                name: 'test',
                                response: {
                                    output: '44444'
                                }
                            }
                        }
                    ]
                }
            ]
        }
        const mockTools: Tool[] = [
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

        const wrapper = mount(DatasetEditor, {
            props: {
                dataset: mockDataset,
                tools: mockTools,
                'onUpdate:dataset': (e: Dataset) => wrapper.setProps({ dataset: e })
            }
        })

        expect(wrapper.exists()).toBe(true)
        expect(wrapper.text()).toContain('ID: 1')
    })

    it('新增消息測試', async () => {
        const mockDataset: Dataset = {
            id: '1',
            contents: []
        }

        const wrapper = mount(DatasetEditor, {
            props: {
                dataset: mockDataset,
                'onUpdate:dataset': (e: Dataset) => wrapper.setProps({ dataset: e })
            }
        })

        const addButton = wrapper.find('button.bg-emerald-600')
        await addButton.trigger('click')

        const dataset = wrapper.props('dataset') as Dataset
        expect(dataset.contents).toHaveLength(1)
    })
})