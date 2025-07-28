import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DatasetEditor from '@/components/DatasetEditor.vue'
import type { Dataset } from '@/types/dataset'

describe('DatasetEditor.vue', () => {
    it('初始渲染測試', () => {
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