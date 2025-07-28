import { describe, it, expect, vi, beforeEach } from 'vitest'
import { exportToJsonl, downloadJsonl } from '@/utils/datasetExporter'
import type { Dataset } from '@/types/dataset'

describe('exportToJsonl', () => {
    it('應該正確導出不帶 system_instruction 和 tools 的數據', () => {
        const datasets: Dataset[] = [
            {
                id: '1',
                contents: [{ role: 'user', parts: [{ text: 'hello' }] }]
            }
        ];

        const result = exportToJsonl(datasets, null, []);
        const expectedOutput = JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: 'hello' }] }]
        });

        expect(result).toBe(expectedOutput);
    });

    it('應該正確處理多個數據集', () => {
        const datasets: Dataset[] = [
            {
                id: '1',
                contents: [{ role: 'user', parts: [{ text: 'hello' }] }]
            },
            {
                id: '2',
                contents: [{ role: 'user', parts: [{ text: 'world' }] }]
            }
        ];

        const result = exportToJsonl(datasets, null, []);
        const expected = [
            JSON.stringify({ contents: datasets[0].contents }),
            JSON.stringify({ contents: datasets[1].contents })
        ].join('\n');

        expect(result).toBe(expected);
    });
});

describe('downloadJsonl', () => {
    let mockURL: { createObjectURL: any, revokeObjectURL: any };
    let mockLink: { href: string, download: string, click: any };

    beforeEach(() => {
        // 模擬 URL API
        mockURL = {
            createObjectURL: vi.fn().mockReturnValue('blob:test'),
            revokeObjectURL: vi.fn()
        };
        global.URL = mockURL as any;

        // 模擬 link 元素
        mockLink = {
            href: '',
            download: '',
            click: vi.fn()
        };

        // 模擬 document API
        vi.spyOn(document, 'createElement').mockImplementation(() => mockLink as any);
        vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
        vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node);
    });

    it('應該正確創建和下載文件', () => {
        const datasets: Dataset[] = [{
            id: '1',
            contents: [{ role: 'user', parts: [{ text: 'test' }] }]
        }];

        downloadJsonl(datasets, null, []);

        // 驗證是否創建了正確的 Blob
        expect(mockURL.createObjectURL).toHaveBeenCalled();

        // 驗證下載行為
        expect(mockLink.download).toBe('dataset.jsonl');
        expect(mockLink.click).toHaveBeenCalled();

        // 驗證清理行為
        expect(document.body.removeChild).toHaveBeenCalled();
        expect(mockURL.revokeObjectURL).toHaveBeenCalledWith('blob:test');
    });
});