import type { Dataset } from '@/types/dataset';

export const importJsonlFile = async (file: File): Promise<Dataset[]> => {
    try {
        const text = await file.text();
        const lines = text.trim().split('\n');

        return lines.map((line, index) => {
            try {
                const data = JSON.parse(line);
                return {
                    id: `${index}`,
                    contents: data.contents || []
                };
            } catch (error) {
                console.error(`Error parsing line ${index + 1}:`, error);
                return null;
            }
        }).filter((dataset): dataset is Dataset => dataset !== null);
    } catch (error) {
        console.error('Error reading file:', error);
        throw new Error('Error reading file');
    }
};