import { describe, it, expect, vi } from 'vitest'
import {convertRawDatasets, importJsonlFile} from "@/utils/datasetImporter";

// 模擬 File 類
class MockFile {
    private readonly content: string;

    constructor(content: string) {
        this.content = content;
    }

    async text() {
        return this.content;
    }
}

describe('importJsonlFile', () => {
    it('應該返回正確數量的數據集', async () => {
        const mockFileContent =
            '{"system_instruction":{"parts":[{"text":"123"}]},"contents":[{"role":"user","parts":[{"text":"new dataset"}]},{"role":"model","parts":[{"functionCall":{"name":"test","args":{"property1":"12333","property2":"12331"}}}]},{"role":"model","parts":[{"functionResponse":{"name":"","response":{"output":"44444"}}}]},{"role":"model","parts":[{"text":"hhh"}]}],"tools":[{"functionDeclarations":[{"name":"test","description":"1","parameters":{"type":"OBJECT","properties":{"property1":{"type":"STRING","description":"1"},"property2":{"type":"NUMBER","description":"2"}}}}]}]}\n' +
            '{"contents":[{"role":"model","parts":[{"text":"any"}]}]}\n' +
            '{"contents":[{"role":"user","parts":[{"text":"any"}]}]}';

        const mockFile = new MockFile(mockFileContent) as unknown as File;

        const result = await importJsonlFile(mockFile);
        expect(result).toHaveLength(3);
    });

    it('應該過濾掉無效的 JSON 行', async () => {
        const mockFileContent =
            '{"contents":[{"role":"user","parts":[{"text":"any"}]}]}\n' +
            'invalid json\n' +
            '{"contents":[{"role":"user","parts":[{"text":"any"}]}]}';

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const mockFile = new MockFile(mockFileContent) as unknown as File;

        const result = await importJsonlFile(mockFile);
        expect(result).toHaveLength(2);

        consoleSpy.mockRestore();
    });

    it('當文件為空時應返回空數組', async () => {
        const mockFile = new MockFile('') as unknown as File;

        const result = await importJsonlFile(mockFile);
        expect(result).toHaveLength(0);
    });

    it('當文件讀取失敗時應拋出錯誤', async () => {
        const mockFile = new MockFile('');
        vi.spyOn(mockFile, 'text').mockRejectedValue(new Error('Mock read error'));

        await expect(importJsonlFile(mockFile as unknown as File))
            .rejects.toThrow('Error reading file');
    });
});

describe('convertRawDatasets', () => {
    it('應該正確轉換數據集並分配ID', () => {
        const mockDatasetExports = [
            {
                system_instruction: { parts: [{ text: "test" }] },
                contents: [{ role: "user", parts: [{ text: "hello" }] }],
                tools: []
            },
            {
                system_instruction: { parts: [{ text: "test2" }] },
                contents: [{ role: "model", parts: [{ text: "world" }] }],
                tools: []
            }
        ];

        const result = convertRawDatasets(mockDatasetExports);

        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({
            id: "0",
            contents: mockDatasetExports[0].contents
        });
        expect(result[1]).toEqual({
            id: "1",
            contents: mockDatasetExports[1].contents
        });
    });
});
