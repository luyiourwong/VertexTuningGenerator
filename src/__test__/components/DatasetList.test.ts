import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DatasetList from '@/components/DatasetList.vue'
import type { Dataset } from '@/types/dataset'

describe('DatasetList', () => {
    const testDataset: Dataset = {
        id: '1',
        contents: [{ role: 'user', parts: [{ text: 'test content' }] }]
    };

    it('應該測試所有主要功能', async () => {
        const wrapper = mount(DatasetList, {
            props: {
                modelValue: [testDataset],
                'onUpdate:modelValue': (e: Dataset[]) => wrapper.setProps({ modelValue: e })
            }
        });

        // 測試渲染
        expect(wrapper.find('span.text-gray-600').text()).toBe('(Size: 1)');

        // 測試新建數據集
        await wrapper.find('button').trigger('click');

        // 測試複製數據集
        await wrapper.find('button.bg-blue-500').trigger('click');

        // 測試刪除數據集
        await wrapper.find('button.bg-red-500').trigger('click');

        // 測試選擇數據集
        await wrapper.find('li').trigger('click');

        // 確認事件觸發
        expect(wrapper.emitted('update')).toBeTruthy();
        expect(wrapper.emitted('delete')).toBeTruthy();
    });
});