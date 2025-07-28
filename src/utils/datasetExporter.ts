import type { Dataset, DatasetExport } from '@/types/dataset';
import type { Tool } from '@google/genai';

export const exportToJsonl = (
    datasets: Dataset[],
    systemInstruction: string | null,
    tools: Tool[]
): string => {
    const exportData: DatasetExport[] = datasets.map(dataset => ({
        system_instruction: systemInstruction?.trim()
            ? {
                parts: [{text: systemInstruction}]
            }
            : undefined,
        contents: dataset.contents,
        tools: tools.length > 0 ? tools : undefined
    }));

    return exportData
        .map(data => JSON.stringify(data))
        .join('\n');
};

export const downloadJsonl = (
    datasets: Dataset[],
    systemInstruction: string | null,
    tools: Tool[]
): void => {
    const jsonlContent = exportToJsonl(datasets, systemInstruction, tools);
    const blob = new Blob([jsonlContent], { type: 'application/x-jsonlines' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'dataset.jsonl';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};