import type {Content, Tool} from '@google/genai';

export interface Dataset {
    system_instruction: Content;
    contents: Content[];
    tools: Tool[];
}