import type { Dataset, DatasetExport } from '@/types/dataset';
import type {Content, Tool} from '@google/genai';

export const importJsonlFile = async (file: File): Promise<DatasetExport[]> => {
    try {
        const text = await file.text();
        const lines = text.trim().split('\n');

        return lines.map((line, index) => {
            try {
                const data = JSON.parse(line);
                const dataset: DatasetExport = {
                    system_instruction: data.system_instruction as Content,
                    contents: (data.contents || []) as Content[],
                    tools: (data.tools || []) as Tool[]
                };
                return dataset;
            } catch (error) {
                console.error(`Error parsing line ${index + 1}:`, error);
                return null;
            }
        }).filter((dataset): dataset is DatasetExport => dataset !== null);
    } catch (error) {
        console.error('Error reading file:', error);
        throw new Error('Error reading file');
    }
};

export const convertRawDatasets = (datasetExports: DatasetExport[]): Dataset[] => {
    return datasetExports.map((datasetExport, index) => ({
        id: `${index}`,
        contents: datasetExport.contents || []
    }));
};