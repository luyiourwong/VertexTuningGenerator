import { describe, it, expect, vi } from 'vitest'
import {importJsonlFile} from "@/utils/datasetImporter";

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
            '{"contents":[{"role":"user","parts":[{"text":"any"}]}]}\n' +
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