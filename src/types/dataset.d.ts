import type {Content, Tool} from '@google/genai';

export interface Dataset {
    id: string;
    contents: Content[];
}

export interface DatasetExport {
    system_instruction?: Content;
    contents?: Content[];
    tools?: Tool[];
}